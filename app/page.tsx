'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types/product';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [displayCount, setDisplayCount] = useState(8);
  const [loading, setLoading] = useState(true);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // 加载商品和分类
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [productsRes, categoriesRes] = await Promise.all([
          fetch('https://fakestoreapi.com/products'),
          fetch('https://fakestoreapi.com/products/categories'),
        ]);

        const productsData = await productsRes.json();
        const categoriesData = await categoriesRes.json();

        setProducts(productsData);
        setFilteredProducts(productsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // 分类筛选
  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter(p => p.category === selectedCategory));
    }
    setDisplayCount(8); // 重置显示数量
  }, [selectedCategory, products]);

  // 滚动加载更多
  const loadMore = useCallback(() => {
    if (displayCount < filteredProducts.length) {
      setDisplayCount(prev => Math.min(prev + 8, filteredProducts.length));
    }
  }, [displayCount, filteredProducts.length]);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '100px',
      threshold: 0.1,
    };

    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && displayCount < filteredProducts.length) {
        loadMore();
      }
    }, options);

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [loadMore, displayCount, filteredProducts.length]);

  const displayedProducts = filteredProducts.slice(0, displayCount);

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

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 页面标题 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">商品列表</h1>
        <p className="text-gray-600">浏览我们精选的商品</p>
      </div>

      {/* 分类筛选 */}
      <div className="mb-8 flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 rounded-lg transition ${selectedCategory === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100 border'
            }`}
        >
          全部
        </button>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-lg transition capitalize ${selectedCategory === category
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100 border'
              }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* 商品网格 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {displayedProducts.map((product) => (
          <Link
            key={product.id}
            href={`/products/${product.id}`}
            className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden group"
          >
            <div className="relative h-64 bg-gray-100">
              <Image
                src={product.image}
                alt={product.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-contain p-4 group-hover:scale-105 transition-transform"
              />
            </div>
            <div className="p-4">
              <h2 className="text-lg font-semibold text-gray-800 line-clamp-2 mb-2">
                {product.title}
              </h2>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-blue-600">
                  ${product.price.toFixed(2)}
                </span>
                <div className="flex items-center text-sm text-gray-600">
                  <span className="text-yellow-500 mr-1">★</span>
                  {product.rating.rate}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* 加载更多触发器 */}
      {displayCount < filteredProducts.length && (
        <div ref={loadMoreRef} className="py-8 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">加载更多...</p>
        </div>
      )}

      {/* 显示已加载全部 */}
      {displayCount >= filteredProducts.length && filteredProducts.length > 0 && (
        <div className="py-8 text-center text-gray-500">
          已显示全部 {filteredProducts.length} 件商品
        </div>
      )}

      {/* 无商品提示 */}
      {filteredProducts.length === 0 && (
        <div className="py-16 text-center text-gray-500">
          该分类下暂无商品
        </div>
      )}
    </div>
  );
}
