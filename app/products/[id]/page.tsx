'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Product } from '@/types/product';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { ShoppingCartIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

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
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-gray-600">商品不存在</p>
          <button
            onClick={() => router.push('/')}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            返回首页
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 返回按钮 */}
      <button
        onClick={() => router.back()}
        className="flex items-center text-gray-600 hover:text-blue-600 mb-6 transition"
      >
        <ArrowLeftIcon className="h-5 w-5 mr-1" />
        返回
      </button>

      {/* 消息提示 */}
      {showMessage && (
        <div className="fixed top-20 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in">
          {showMessage}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="grid md:grid-cols-2 gap-8 p-8">
          {/* 商品图片 - 懒加载 */}
          <div className="relative">
            <div className="relative h-96 bg-gray-100 rounded-lg overflow-hidden">
              {!imageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
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
            <div className="mb-4">
              <span className="inline-block px-3 py-1 bg-blue-100 text-blue-600 text-sm rounded-full capitalize">
                {product.category}
              </span>
            </div>

            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              {product.title}
            </h1>

            <div className="flex items-center mb-6">
              <div className="flex items-center text-yellow-500 mr-4">
                {'★'.repeat(Math.round(product.rating.rate))}
                {'☆'.repeat(5 - Math.round(product.rating.rate))}
                <span className="ml-2 text-gray-600">
                  {product.rating.rate}
                </span>
              </div>
              <span className="text-gray-500 text-sm">
                ({product.rating.count} 评价)
              </span>
            </div>

            <div className="mb-6">
              <span className="text-4xl font-bold text-blue-600">
                ${product.price.toFixed(2)}
              </span>
            </div>

            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                商品描述
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            <button
              onClick={handleAddToCart}
              className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2 mt-auto"
            >
              <ShoppingCartIcon className="h-6 w-6" />
              加入购物车
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
