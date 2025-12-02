'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { TrashIcon, MinusIcon, PlusIcon } from '@heroicons/react/24/outline';

export default function CartPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const { items, updateQuantity, removeItem, getTotalPrice, clearCart } = useCartStore();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    // 延迟设置 mounted 状态以避免 hydration 问题
    const timer = setTimeout(() => setMounted(true), 0);

    // 检查登录状态
    if (!isAuthenticated) {
      router.push('/login');
    }

    return () => clearTimeout(timer);
  }, [isAuthenticated, router]);

  if (!mounted) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">购物车是空的</h1>
          <p className="text-gray-600 mb-8">快去挑选您喜欢的商品吧！</p>
          <Link
            href="/"
            className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            继续购物
          </Link>
        </div>
      </div>
    );
  }

  const totalPrice = getTotalPrice();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">购物车</h1>
        <button
          onClick={() => {
            if (confirm('确定要清空购物车吗？')) {
              clearCart();
            }
          }}
          className="text-red-600 hover:text-red-700 text-sm"
        >
          清空购物车
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* 商品列表 */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg shadow-md p-6 flex gap-6"
            >
              {/* 商品图片 */}
              <Link href={`/products/${item.id}`} className="shrink-0">
                <div className="relative w-24 h-24 bg-gray-100 rounded-lg overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="96px"
                    className="object-contain p-2"
                  />
                </div>
              </Link>

              {/* 商品信息 */}
              <div className="flex-1 flex flex-col">
                <Link
                  href={`/products/${item.id}`}
                  className="text-lg font-semibold text-gray-800 hover:text-blue-600 mb-2 line-clamp-2"
                >
                  {item.title}
                </Link>
                <p className="text-sm text-gray-500 capitalize mb-2">
                  {item.category}
                </p>
                <div className="mt-auto">
                  <span className="text-xl font-bold text-blue-600">
                    ${item.price.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* 数量控制 */}
              <div className="flex flex-col items-end justify-between">
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-red-600 hover:text-red-700 p-2"
                  title="删除"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-8 h-8 flex items-center justify-center border rounded-lg hover:bg-gray-100 transition"
                    disabled={item.quantity <= 1}
                  >
                    <MinusIcon className="h-4 w-4" />
                  </button>
                  <span className="w-12 text-center font-semibold">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-8 h-8 flex items-center justify-center border rounded-lg hover:bg-gray-100 transition"
                  >
                    <PlusIcon className="h-4 w-4" />
                  </button>
                </div>

                <div className="text-right">
                  <span className="text-sm text-gray-500">小计：</span>
                  <span className="font-bold text-gray-800 ml-1">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 订单汇总 */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
            <h2 className="text-xl font-bold text-gray-800 mb-6">订单汇总</h2>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>商品件数：</span>
                <span className="font-semibold">
                  {items.reduce((sum, item) => sum + item.quantity, 0)} 件
                </span>
              </div>

              <div className="flex justify-between text-gray-600">
                <span>商品总价：</span>
                <span className="font-semibold">${totalPrice.toFixed(2)}</span>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between text-lg font-bold text-gray-800">
                  <span>应付金额：</span>
                  <span className="text-blue-600 text-2xl">
                    ${totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                alert('结算功能演示：订单已提交！');
                clearCart();
                router.push('/');
              }}
              className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              去结算
            </button>

            <Link
              href="/"
              className="block text-center text-blue-600 hover:text-blue-700 mt-4"
            >
              继续购物
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
