import { Product } from '@/types/product';
import ProductDetailClient from './ProductDetailClient';

// 生成静态参数用于静态导出
export async function generateStaticParams() {
  // 默认回退 ID 列表
  const fallbackIds = Array.from({ length: 20 }, (_, i) => ({
    id: (i + 1).toString(),
  }));

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10秒超时

    const res = await fetch('https://fakestoreapi.com/products', {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'NextStore/1.0',
      },
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      console.error('Failed to fetch products, status:', res.status);
      return fallbackIds;
    }

    const text = await res.text();

    // 验证返回的是 JSON 而不是 HTML
    if (text.trim().startsWith('<')) {
      console.error('Received HTML instead of JSON, using fallback');
      return fallbackIds;
    }

    const products: Product[] = JSON.parse(text);

    if (!Array.isArray(products) || products.length === 0) {
      console.error('Invalid products data, using fallback');
      return fallbackIds;
    }

    return products.map((product) => ({
      id: product.id.toString(),
    }));
  } catch (error) {
    console.error('Failed to fetch products for static generation:', error);
    return fallbackIds;
  }
}

export default async function ProductDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ProductDetailClient productId={id} />;
}
