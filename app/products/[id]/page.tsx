'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Product } from '@/types/product';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { ShoppingCartIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProductDetail() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showMessage, setShowMessage] = useState('');

  const addItem = useCartStore((state) => state.addItem);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);
        const res = await fetch(`https://fakestoreapi.com/products/${params.id}`);
        const data = await res.json();
        setProduct(data);

        // 动态设置 meta 标签
        if (data) {
          document.title = `${data.title} - NextStore`;
          const metaDescription = document.querySelector('meta[name="description"]');
          if (metaDescription) {
            metaDescription.setAttribute('content', data.description.substring(0, 160));
          }
        }
      } catch (error) {
        console.error('Failed to fetch product:', error);
      } finally {
        setLoading(false);
      }
    }

    if (params.id) {
      fetchProduct();
    }
  }, [params.id]);

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      setShowMessage('请先登录');
      setTimeout(() => {
        router.push('/login');
      }, 1000);
      return;
    }

    if (product) {
      addItem(product);
      setShowMessage('已添加到购物车');
      setTimeout(() => setShowMessage(''), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white py-8">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8" style={{ marginLeft: 'auto', marginRight: 'auto' }}>
          <Skeleton className="h-10 w-20 mb-6" />
          <Card className="border-gray-200">
            <div className="grid md:grid-cols-2 gap-8 p-6 md:p-10">
              <Skeleton className="h-96 w-full rounded-lg" />
              <div className="space-y-4">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white py-8">
        <div className=" mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="p-8 border-gray-200">
            <div className="text-center">
              <p className="text-gray-600 mb-4">商品不存在</p>
              <Button onClick={() => router.push('/')} className="bg-gray-900 hover:bg-gray-800">
                返回首页
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-[1500px]">
        {/* 返回按钮 */}
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6 gap-1 hover:bg-white animate-in fade-in slide-in-from-left-4"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          返回
        </Button>

        {/* 消息提示 */}
        {showMessage && (
          <div className="fixed top-20 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-xl z-50 animate-in slide-in-from-top-2 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {showMessage}
          </div>
        )}

        <Card className="bg-white animate-in fade-in slide-in-from-bottom-4">
          <div className="grid md:grid-cols-2 gap-8 p-6 md:p-10">
            {/* 商品图片 - 懒加载 */}
            <div className="relative">
              <div className="relative h-96 bg-white rounded-lg overflow-hidden border sticky top-24">
                {!imageLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
                  </div>
                )}
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className={`object-contain p-8 transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'
                    }`}
                  onLoad={() => setImageLoaded(true)}
                  loading="lazy"
                  priority={false}
                />
              </div>
            </div>

            {/* 商品信息 */}
            <div className="flex flex-col">
              <Badge className="mb-4 w-fit capitalize bg-gray-100 text-gray-900 hover:bg-gray-200">
                {product.category}
              </Badge>

              <h1 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900">
                {product.title}
              </h1>

              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={`text-xl ${i < Math.round(product.rating.rate) ? 'text-yellow-400' : 'text-gray-300'}`}>
                      ★
                    </span>
                  ))}
                  <span className="ml-2 text-gray-900 font-medium">
                    {product.rating.rate}
                  </span>
                </div>
                <span className="text-gray-600 text-sm">
                  ({product.rating.count} 评价)
                </span>
              </div>

              <div className="mb-8 p-4 bg-gray-50 rounded-lg border">
                <div className="flex items-baseline gap-1">
                  <span className="text-sm text-gray-600">¥</span>
                  <span className="text-4xl font-bold text-red-600">
                    {product.price.toFixed(2)}
                  </span>
                </div>
                <p className="text-sm text-green-600 mt-2">✓ 免运费</p>
              </div>

              <div className="mb-8">
                <h2 className="text-lg font-semibold mb-3 text-gray-900">
                  商品描述
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  {product.description}
                </p>
              </div>

              <div className="mt-auto space-y-3">
                <Button
                  onClick={handleAddToCart}
                  size="lg"
                  className="w-full h-12 text-lg gap-2 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-gray-900 font-semibold shadow-md hover:shadow-lg transition-all"
                >
                  <ShoppingCartIcon className="h-5 w-5" />
                  加入购物车
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full h-12 text-lg border-orange-500 text-orange-600 hover:bg-orange-50"
                  onClick={() => {
                    handleAddToCart();
                    setTimeout(() => router.push('/cart'), 500);
                  }}
                >
                  立即购买
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
