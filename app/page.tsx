'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types/product';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

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
      <div className="min-h-screen bg-white">
        <div className="w-full  mx-auto px-4 sm:px-6 lg:px-8 py-8" style={{ marginLeft: 'auto', marginRight: 'auto' }}>
          <div className="mb-8">
            <div className="flex flex-wrap gap-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-10 w-24 rounded-full" />
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="border-gray-200">
                <CardContent className="p-4">
                  <Skeleton className="h-48 w-full mb-4 rounded-lg" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-6 w-20" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-8" style={{ marginLeft: 'auto', marginRight: 'auto' }}>
        {/* 分类筛选 */}
        <div className="mb-8 py-4">
          <div className="flex flex-wrap gap-4 justify-center">
            <Button
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              onClick={() => setSelectedCategory('all')}
              className="rounded-full min-w-[160px] px-6 py-2"
            >
              全部
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(category)}
                className="capitalize rounded-full min-w-[160px] px-6 py-2"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* 商品网格 */}
        <div className="py-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {displayedProducts.map((product, index) => (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              className="animate-in fade-in slide-in-from-bottom-4"
              style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'both' }}
            >
              <Card className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group cursor-pointer bg-white">
                <CardContent className="p-0">
                  <div className="relative h-48 bg-white overflow-hidden">
                    <Image
                      src={product.image}
                      alt={product.title}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                      className="object-contain p-4 group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col items-start gap-2 p-3">
                  <h2 className="text-sm font-medium line-clamp-2 w-full group-hover:text-orange-600 transition-colors">
                    {product.title}
                  </h2>
                  <div className="flex items-center gap-1 text-xs">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={i < Math.round(product.rating.rate) ? 'text-yellow-400' : 'text-gray-300'}>
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="text-gray-600">({product.rating.count})</span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xs text-gray-600">￥</span>
                    <span className="text-2xl font-bold text-red-600">
                      {product.price.toFixed(2)}
                    </span>
                  </div>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>

        {/* 加载更多触发器 */}
        {displayCount < filteredProducts.length && (
          <div ref={loadMoreRef} className="py-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-gray-900 border-t-transparent"></div>
          </div>
        )}

        {/* 显示已加载全部 */}
        {displayCount >= filteredProducts.length && filteredProducts.length > 0 && (
          <div className="py-8 text-center text-sm text-gray-500">
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
    </div>
  );
}
