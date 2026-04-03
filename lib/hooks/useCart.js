'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

// ── helpers ──────────────────────────────────────────────────────────────────

function generateOrderNumber() {
  return `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

// Find existing pending order for user, or create one
async function getOrCreatePendingOrder(user) {
  // Try to find existing pending order
  const { data: existing } = await supabase
    .from('orders')
    .select('id, subtotal, total_amount')
    .eq('user_id', user.id)
    .eq('status', 'pending')
    .eq('payment_status', 'unpaid')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (existing) return existing;

  // Create new pending order
  const { data: newOrder, error } = await supabase
    .from('orders')
    .insert({
      user_id: user.id,
      email: user.email,
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

  if (error) throw error;
  return newOrder;
}

// Recalculate and update order totals
async function recalcOrderTotals(orderId) {
  const { data: items } = await supabase
    .from('order_items')
    .select('line_total')
    .eq('order_id', orderId);

  const subtotal = (items || []).reduce((sum, i) => sum + (i.line_total || 0), 0);

  await supabase
    .from('orders')
    .update({
      subtotal,
      total_amount: subtotal,
      updated_at: new Date().toISOString(),
    })
    .eq('id', orderId);
}

// ── hook ─────────────────────────────────────────────────────────────────────

export function useCart() {
  const [cart, setCart] = useState([]);        // order_items rows
  const [order, setOrder] = useState(null);    // the pending order
  const [total, setTotal] = useState(0);
  const [itemCount, setItemCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadCart = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setCart([]);
        setOrder(null);
        setTotal(0);
        setItemCount(0);
        return;
      }

      // Find pending order
      const { data: pendingOrder } = await supabase
        .from('orders')
        .select('id, subtotal, total_amount, currency')
        .eq('user_id', user.id)
        .eq('status', 'pending')
        .eq('payment_status', 'unpaid')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

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
        .select(`
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
        `)
        .eq('order_id', pendingOrder.id)
        .order('created_at', { ascending: true });

      if (itemsError) throw itemsError;

      const rows = items || [];
      const calculatedTotal = rows.reduce((sum, i) => sum + (i.line_total || 0), 0) ;
      const count = rows.reduce((sum, i) => sum + (i.quantity || 0), 0);

      setCart(rows);
      setTotal(calculatedTotal);
      setItemCount(count);
    } catch (err) {
      console.error('Cart load error:', err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  // ── add ────────────────────────────────────────────────────────────────────
  const add = useCallback(async (product, quantity = 1, variantId = null, variantLabel = null) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Please log in to add items to cart');

    const pendingOrder = await getOrCreatePendingOrder(user);
    const unitPrice = product.price || 0;
    const lineTotal = unitPrice * quantity;

    // Check if same product+variant already in this order
    const { data: existing } = await supabase
      .from('order_items')
      .select('id, quantity, line_total')
      .eq('order_id', pendingOrder.id)
      .eq('product_id', product.id)
      .eq('variant_id', variantId ?? null)
      .maybeSingle();

    if (existing) {
      const newQty = existing.quantity + quantity;
      const { error } = await supabase
        .from('order_items')
        .update({
          quantity: newQty,
          line_total: unitPrice * newQty,
        })
        .eq('id', existing.id);
      if (error) throw error;
    } else {
      const { error } = await supabase
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
      if (error) throw error;
    }

    await recalcOrderTotals(pendingOrder.id);
    await loadCart();
  }, [loadCart]);

  // ── remove ─────────────────────────────────────────────────────────────────
  const remove = useCallback(async (orderItemId) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Get the order_id before deleting
    const { data: item } = await supabase
      .from('order_items')
      .select('order_id')
      .eq('id', orderItemId)
      .single();

    const { error } = await supabase
      .from('order_items')
      .delete()
      .eq('id', orderItemId);

    if (error) throw error;

    if (item?.order_id) await recalcOrderTotals(item.order_id);
    await loadCart();
  }, [loadCart]);

  // ── updateQuantity ─────────────────────────────────────────────────────────
  const updateQuantity = useCallback(async (orderItemId, quantity) => {
    if (quantity < 1) return;

    const { data: item } = await supabase
      .from('order_items')
      .select('order_id, unit_price')
      .eq('id', orderItemId)
      .single();

    if (!item) return;

    const { error } = await supabase
      .from('order_items')
      .update({
        quantity,
        line_total: item.unit_price * quantity,
      })
      .eq('id', orderItemId);

    if (error) throw error;

    await recalcOrderTotals(item.order_id);
    await loadCart();
  }, [loadCart]);

  // ── clear ──────────────────────────────────────────────────────────────────
  const clear = useCallback(async () => {
    if (!order) return;

    const { error } = await supabase
      .from('order_items')
      .delete()
      .eq('order_id', order.id);

    if (error) throw error;

    await recalcOrderTotals(order.id);
    await loadCart();
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