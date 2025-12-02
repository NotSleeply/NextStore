'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Product } from '@/types/product';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { ShoppingCartIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ProductDetailClientProps {
  productId: string;
}

export default function ProductDetailClient({ productId }: ProductDetailClientProps) {
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
        const res = await fetch(`https://fakestoreapi.com/products/${productId}`);
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

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

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
        <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8" style={{ marginLeft: 'auto', marginRight: 'auto' }}>
          <div className="h-10 w-20 mb-6 bg-gray-200 animate-pulse rounded" />
          <Card className="border-gray-200">
            <div className="grid md:grid-cols-2 gap-8 p-6 md:p-10">
              <div className="h-96 w-full rounded-lg bg-gray-200 animate-pulse" />
              <div className="space-y-4">
                <div className="h-6 w-32 bg-gray-200 animate-pulse rounded" />
                <div className="h-8 w-full bg-gray-200 animate-pulse rounded" />
                <div className="h-6 w-40 bg-gray-200 animate-pulse rounded" />
                <div className="h-16 w-full bg-gray-200 animate-pulse rounded" />
                <div className="h-24 w-full bg-gray-200 animate-pulse rounded" />
                <div className="h-12 w-full bg-gray-200 animate-pulse rounded" />
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
        <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8" style={{ marginLeft: 'auto', marginRight: 'auto' }}>
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
    <div className="min-h-screen bg-white py-8">
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8" style={{ marginLeft: 'auto', marginRight: 'auto' }}>
        {/* 返回按钮 */}
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6 gap-1 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          返回
        </Button>

        {/* 消息提示 */}
        {showMessage && (
          <div className="fixed top-20 right-4 bg-gray-900 text-white px-6 py-3 rounded-lg shadow-lg z-50">
            {showMessage}
          </div>
        )}

        <Card className="border-gray-200">
          <div className="grid md:grid-cols-2 gap-8 p-6 md:p-10">
            {/* 商品图片 - 懒加载 */}
            <div className="flex items-center justify-center">
              <div className="relative w-full h-96 bg-gray-50 rounded-lg overflow-hidden border border-gray-200 flex items-center justify-center">
                {!imageLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-2 border-gray-900 border-t-transparent"></div>
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
            <div className="flex flex-col justify-center">
              <Badge className="mb-4 w-fit capitalize bg-gray-100 text-gray-900">
                {product.category}
              </Badge>

              <h1 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900">
                {product.title}
              </h1>

              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-1 text-sm">
                  <span className="text-gray-900">★ {product.rating.rate}</span>
                  <span className="text-gray-500">({product.rating.count} 评价)</span>
                </div>
              </div>

              <div className="mb-6">
                <div className="text-3xl font-bold text-gray-900">
                  ¥{product.price.toFixed(2)}
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-base font-semibold mb-3 text-gray-900">
                  商品描述
                </h2>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {product.description}
                </p>
              </div>

              <div className="flex gap-6 mx-auto justify-center items-center w-full max-w-3xl">
                <Button
                  onClick={handleAddToCart}
                  size="lg"
                  variant="outline"
                  className="flex-none w-full max-w-[300px] gap-2 border-gray-900 text-gray-900 hover:bg-gray-100 min-w-[180px]"
                >
                  <ShoppingCartIcon className="h-5 w-5" />
                  加入购物车
                </Button>
                <Button
                  onClick={() => {
                    if (!isAuthenticated) {
                      setShowMessage('请先登录');
                      setTimeout(() => {
                        router.push('/login');
                      }, 1000);
                      return;
                    }
                    if (product) {
                      addItem(product);
                      router.push('/cart');
                    }
                  }}
                  size="lg"
                  className="flex-none w-full max-w-[300px] gap-2 bg-gray-900 hover:bg-gray-800 min-w-[180px]"
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
