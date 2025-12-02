import { Product } from '@/types/product';

const API_BASE = 'https://fakestoreapi.com';

export async function getProducts(limit?: number): Promise<Product[]> {
  const url = limit ? `${API_BASE}/products?limit=${limit}` : `${API_BASE}/products`;
  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
}

export async function getProduct(id: string): Promise<Product> {
  const res = await fetch(`${API_BASE}/products/${id}`, { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error('Failed to fetch product');
  return res.json();
}

export async function getCategories(): Promise<string[]> {
  const res = await fetch(`${API_BASE}/products/categories`, { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error('Failed to fetch categories');
  return res.json();
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  const res = await fetch(`${API_BASE}/products/category/${category}`, { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
}
