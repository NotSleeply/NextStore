import { Product } from '@/types/product';
import ProductDetailClient from './ProductDetailClient';

// 生成静态参数用于静态导出
export async function generateStaticParams() {
  try {
    const res = await fetch('https://fakestoreapi.com/products');
    const products: Product[] = await res.json();

    return products.map((product) => ({
      id: product.id.toString(),
    }));
  } catch (error) {
    console.error('Failed to fetch products for static generation:', error);
    return [];
  }
}

export default function ProductDetail({ params }: { params: { id: string } }) {
  return <ProductDetailClient productId={params.id} />;
}
