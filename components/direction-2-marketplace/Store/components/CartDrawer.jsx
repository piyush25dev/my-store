"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CartIcon, XIcon, MinusIcon, PlusIcon, TrashIcon } from "./Icons";
import Image from "next/image";

function CartItem({ item, onUpdateQty, onRemove }) {
  return (
    <div className="flex gap-3">
      <Image
        src={item.image}
        alt={item.name}
        width={64}
        height={80}
        className="object-cover rounded-lg bg-stone-100"
      />

      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-stone-900 truncate leading-tight">
          {item.name}
        </p>
        <p className="text-xs text-stone-400 mt-0.5">{item.material}</p>
        <p className="text-sm font-bold text-stone-900 mt-1">
          ₹{(item.price * item.qty).toLocaleString()}
        </p>
        <div className="flex items-center gap-2 mt-2">
          <button
            onClick={() => onUpdateQty(item.id, item.qty - 1)}
            className="w-6 h-6 rounded-md border border-stone-200 flex items-center justify-center hover:bg-stone-100 transition"
          >
            <MinusIcon />
          </button>
          <span className="text-sm font-medium w-5 text-center">
            {item.qty}
          </span>
          <button
            onClick={() => onUpdateQty(item.id, item.qty + 1)}
            className="w-6 h-6 rounded-md border border-stone-200 flex items-center justify-center hover:bg-stone-100 transition"
          >
            <PlusIcon />
          </button>
          <button
            onClick={() => onRemove(item.id)}
            className="ml-auto text-stone-300 hover:text-red-400 transition"
          >
            <TrashIcon />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CartDrawer({ cart, onClose, onUpdateQty, onRemove }) {
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-sm bg-white h-full flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100">
          <div>
            <h2 className="text-base font-semibold text-stone-900">
              Your Cart
            </h2>
            <p className="text-xs text-stone-400">{cart.length} items</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <XIcon />
          </Button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-stone-400">
              <CartIcon />
              <p className="text-sm">Your cart is empty</p>
            </div>
          ) : (
            cart.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onUpdateQty={onUpdateQty}
                onRemove={onRemove}
              />
            ))
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="px-5 py-4 border-t border-stone-100 space-y-3">
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-sm text-stone-500">Subtotal</span>
              <span className="text-base font-bold text-stone-900">
                ₹{total.toLocaleString()}
              </span>
            </div>
            <p className="text-[11px] text-stone-400">
              Shipping calculated at checkout
            </p>
            <Button className="w-full" size="lg">
              Proceed to Checkout
            </Button>
            <Button
              variant="outline"
              className="w-full"
              size="sm"
              onClick={onClose}
            >
              Continue Shopping
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
