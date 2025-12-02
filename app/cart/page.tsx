'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { TrashIcon, MinusIcon, PlusIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

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
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const totalPrice = getTotalPrice();

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="w-full  mx-auto px-4 sm:px-6 lg:px-8" style={{ marginLeft: 'auto', marginRight: 'auto' }}>
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">
            购物车 {items.length > 0 && `(${items.length})`}
          </h1>
          {items.length > 0 && (
            <Button
              variant="ghost"
              onClick={() => {
                if (confirm('确定要清空购物车吗？')) {
                  clearCart();
                }
              }}
              className="text-gray-600 hover:text-gray-900"
            >
              清空购物车
            </Button>
          )}
        </div>

        {items.length === 0 ? (
          <Card className="text-center py-16 border-gray-200">
            <CardContent>
              <div className="flex flex-col items-center gap-4">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-lg font-medium text-gray-900 mb-2">
                    您的购物车是空的
                  </p>
                  <p className="text-sm text-gray-500 mb-6">
                    赶快去挑选心仪的商品吧！
                  </p>
                </div>
                <Button asChild size="lg" className="bg-gray-900 hover:bg-gray-800">
                  <Link href="/">开始购物</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* 商品列表 */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <Card key={item.id} className="border-gray-200 hover:shadow-md transition-shadow">
                  <CardContent className="p-6 flex gap-6">
                    {/* 商品图片 */}
                    <Link href={`/products/${item.id}`} className="shrink-0">
                      <div className="relative w-24 h-24 bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
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
                        className="text-base font-medium hover:text-gray-600 mb-2 line-clamp-2 transition-colors"
                      >
                        {item.title}
                      </Link>
                      <p className="text-sm text-gray-500 capitalize mb-2">
                        {item.category}
                      </p>
                      <div className="mt-auto text-lg font-bold text-gray-900">
                        ¥{item.price.toFixed(2)}
                      </div>
                    </div>

                    {/* 数量控制 */}
                    <div className="flex flex-col items-end justify-between">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(item.id)}
                        className="text-gray-400 hover:text-gray-600"
                        title="删除"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </Button>

                      <div className="flex items-center gap-2 border border-gray-300 rounded-lg">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-gray-100"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <MinusIcon className="h-4 w-4" />
                        </Button>
                        <span className="w-12 text-center font-semibold">
                          {item.quantity}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-gray-100"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <PlusIcon className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="text-right">
                        <span className="text-sm text-gray-500">小计：</span>
                        <div className="font-bold text-gray-900">
                          ¥{(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* 订单汇总 */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24 border-gray-200">
                <CardHeader className="bg-gray-50">
                  <CardTitle className="text-xl">订单汇总</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 p-6">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>商品件数：</span>
                    <span className="font-semibold text-gray-900">
                      {items.reduce((sum, item) => sum + item.quantity, 0)} 件
                    </span>
                  </div>

                  <div className="flex justify-between text-sm text-gray-600">
                    <span>商品总价：</span>
                    <span className="font-semibold text-gray-900">¥{totalPrice.toFixed(2)}</span>
                  </div>

                  <Separator />

                  <div className="flex justify-between text-lg font-bold">
                    <span>应付金额：</span>
                    <span className="text-gray-900">
                      ¥{totalPrice.toFixed(2)}
                    </span>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                  <Button
                    size="lg"
                    className="w-full bg-gray-900 hover:bg-gray-800"
                    onClick={() => {
                      alert('结算功能演示：订单已提交！');
                      clearCart();
                      router.push('/');
                    }}
                  >
                    去结算
                  </Button>

                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/">继续购物</Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
