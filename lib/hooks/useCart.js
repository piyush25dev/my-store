'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

// ── helpers ──────────────────────────────────────────────────────────────────

function generateOrderNumber() {
  return `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

// Find existing pending order for user, or create one
async function getOrCreatePendingOrder(user) {
  if (!user?.id) {
    throw new Error('User not authenticated');
  }

  try {
    // Try to find existing pending order
    const { data: existing, error: findError } = await supabase
      .from('orders')
      .select('id, subtotal, total_amount')
      .eq('user_id', user.id)
      .eq('status', 'pending')
      .eq('payment_status', 'unpaid')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (findError && findError.code !== 'PGRST116') {
      throw findError;
    }

    if (existing) {
      return existing;
    }

    // Create new pending order
    const { data: newOrder, error: createError } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        email: user.email || '',
        customer_name: user.user_metadata?.full_name || '',
        order_number: generateOrderNumber(),
        status: 'pending',
        payment_status: 'unpaid',
        shipping_status: 'pending',
        currency: 'INR',
        subtotal: 0,
        total_amount: 0,
        tax_amount: 0,
        shipping_amount: 0,
        discount_amount: 0,
      })
      .select('id, subtotal, total_amount')
      .single();

    if (createError) {
      throw createError;
    }

    return newOrder;
  } catch (error) {
    console.error('Error in getOrCreatePendingOrder:', error);
    throw error;
  }
}

// Recalculate and update order totals
async function recalcOrderTotals(orderId) {
  try {
    const { data: items, error: itemsError } = await supabase
      .from('order_items')
      .select('line_total')
      .eq('order_id', orderId);

    if (itemsError) {
      throw itemsError;
    }

    const subtotal = (items || []).reduce((sum, i) => sum + (i.line_total || 0), 0);
    const tax = subtotal * 0.18;
    const total = subtotal + tax;

    const { error: updateError } = await supabase
      .from('orders')
      .update({
        subtotal,
        tax_amount: tax,
        total_amount: total,
        updated_at: new Date().toISOString(),
      })
      .eq('id', orderId);

    if (updateError) {
      throw updateError;
    }
  } catch (error) {
    console.error('Error in recalcOrderTotals:', error);
    throw error;
  }
}

// ── hook ─────────────────────────────────────────────────────────────────────

export function useCart() {
  const [cart, setCart] = useState([]);
  const [order, setOrder] = useState(null);
  const [total, setTotal] = useState(0);
  const [itemCount, setItemCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadCart = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        setCart([]);
        setOrder(null);
        setTotal(0);
        setItemCount(0);
        return;
      }

      // Find pending order
      const { data: pendingOrder, error: orderError } = await supabase
        .from('orders')
        .select('id, subtotal, total_amount, tax_amount, currency')
        .eq('user_id', user.id)
        .eq('status', 'pending')
        .eq('payment_status', 'unpaid')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (orderError && orderError.code !== 'PGRST116') {
        throw orderError;
      }

      if (!pendingOrder) {
        setCart([]);
        setOrder(null);
        setTotal(0);
        setItemCount(0);
        return;
      }

      setOrder(pendingOrder);

      // Fetch order items with product details
      const { data: items, error: itemsError } = await supabase
        .from('order_items')
        .select(
          `
          id,
          order_id,
          product_id,
          variant_id,
          product_name,
          variant_label,
          unit_price,
          quantity,
          line_total,
          discount_amount,
          products (
            id,
            name,
            slug,
            type,
            price,
            product_images (
              image_url,
              alt_text,
              is_primary,
              display_order
            )
          )
        `
        )
        .eq('order_id', pendingOrder.id)
        .order('created_at', { ascending: true });

      if (itemsError) {
        throw itemsError;
      }

      const rows = items || [];
      const calculatedTotal = rows.reduce((sum, i) => sum + (i.line_total || 0), 0);
      const count = rows.reduce((sum, i) => sum + (i.quantity || 0), 0);

      setCart(rows);
      setTotal(calculatedTotal);
      setItemCount(count);
    } catch (err) {
      console.error('Cart load error:', err.message);
      setError(err.message || 'Failed to load cart');
      setCart([]);
      setTotal(0);
      setItemCount(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  // ── add ────────────────────────────────────────────────────────────────────
  const add = useCallback(
    async (product, quantity = 1, variantId = null, variantLabel = null) => {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user) {
          throw new Error('Please log in to add items to cart');
        }

        const pendingOrder = await getOrCreatePendingOrder(user);
        const unitPrice = product.price || 0;
        const lineTotal = unitPrice * quantity;

        // Check if same product+variant already in this order
        const { data: existing, error: existingError } = await supabase
          .from('order_items')
          .select('id, quantity, line_total')
          .eq('order_id', pendingOrder.id)
          .eq('product_id', product.id)
          .eq('variant_id', variantId ?? null)
          .maybeSingle();

        if (existingError && existingError.code !== 'PGRST116') {
          throw existingError;
        }

        if (existing) {
          const newQty = existing.quantity + quantity;
          const { error: updateError } = await supabase
            .from('order_items')
            .update({
              quantity: newQty,
              line_total: unitPrice * newQty,
            })
            .eq('id', existing.id);
          
          if (updateError) throw updateError;
        } else {
          const { error: insertError } = await supabase
            .from('order_items')
            .insert({
              order_id: pendingOrder.id,
              product_id: product.id,
              variant_id: variantId,
              product_name: product.name,
              variant_label: variantLabel,
              unit_price: unitPrice,
              quantity,
              line_total: lineTotal,
              discount_amount: 0,
              tax_amount: 0,
            });
          
          if (insertError) throw insertError;
        }

        await recalcOrderTotals(pendingOrder.id);
        await loadCart();
      } catch (err) {
        console.error('Add to cart error:', err);
        setError(err.message || 'Failed to add item');
        throw err;
      }
    },
    [loadCart]
  );

  // ── remove ─────────────────────────────────────────────────────────────────
  const remove = useCallback(
    async (orderItemId) => {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user) {
          throw new Error('Not authenticated');
        }

        // Get the order_id before deleting
        const { data: item, error: getError } = await supabase
          .from('order_items')
          .select('order_id')
          .eq('id', orderItemId)
          .single();

        if (getError) throw getError;

        const { error: deleteError } = await supabase
          .from('order_items')
          .delete()
          .eq('id', orderItemId);

        if (deleteError) throw deleteError;

        if (item?.order_id) {
          await recalcOrderTotals(item.order_id);
        }
        
        await loadCart();
      } catch (err) {
        console.error('Remove from cart error:', err);
        setError(err.message || 'Failed to remove item');
        throw err;
      }
    },
    [loadCart]
  );

  // ── updateQuantity ─────────────────────────────────────────────────────────
  const updateQuantity = useCallback(
    async (orderItemId, quantity) => {
      try {
        if (quantity < 1) {
          throw new Error('Quantity must be at least 1');
        }

        const { data: item, error: getError } = await supabase
          .from('order_items')
          .select('order_id, unit_price')
          .eq('id', orderItemId)
          .single();

        if (getError) throw getError;
        if (!item) throw new Error('Item not found');

        const { error: updateError } = await supabase
          .from('order_items')
          .update({
            quantity,
            line_total: item.unit_price * quantity,
          })
          .eq('id', orderItemId);

        if (updateError) throw updateError;

        await recalcOrderTotals(item.order_id);
        await loadCart();
      } catch (err) {
        console.error('Update quantity error:', err);
        setError(err.message || 'Failed to update quantity');
        throw err;
      }
    },
    [loadCart]
  );

  // ── clear ──────────────────────────────────────────────────────────────────
  const clear = useCallback(async () => {
    try {
      if (!order?.id) {
        throw new Error('No order to clear');
      }

      const { error: deleteError } = await supabase
        .from('order_items')
        .delete()
        .eq('order_id', order.id);

      if (deleteError) throw deleteError;

      await recalcOrderTotals(order.id);
      await loadCart();
    } catch (err) {
      console.error('Clear cart error:', err);
      setError(err.message || 'Failed to clear cart');
      throw err;
    }
  }, [order, loadCart]);

  return {
    cart,
    order,
    total,
    itemCount,
    loading,
    error,
    add,
    remove,
    updateQuantity,
    clear,
    reload: loadCart,
  };
}