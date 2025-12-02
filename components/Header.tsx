'use client';

import Link from 'next/link';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { ShoppingCartIcon, UserIcon } from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function Header() {
  const items = useCartStore((state) => state.items);
  const { isAuthenticated, user, logout } = useAuthStore();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-4" style={{ marginLeft: 'auto', marginRight: 'auto' }}>
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-xl font-bold text-gray-900 hover:text-gray-700 transition-colors">
            NextStore
          </Link>

          {/* 右侧导航 */}
          <nav className="flex items-center gap-4">
            <Button variant="ghost" asChild className="hidden sm:flex text-gray-700 hover:text-gray-900">
              <Link href="/">商品列表</Link>
            </Button>

            <Button variant="ghost" size="icon" asChild className="relative text-gray-700 hover:text-gray-900">
              <Link href="/cart">
                <ShoppingCartIcon className="h-5 w-5" />
                {totalItems > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-gray-900 text-white">
                    {totalItems}
                  </Badge>
                )}
              </Link>
            </Button>

            <div className="relative">
              <Button
                variant="ghost"
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="gap-2 text-gray-700 hover:text-gray-900"
              >
                <UserIcon className="h-5 w-5" />
                {isAuthenticated && user && (
                  <span className="text-sm hidden sm:inline">{user.username}</span>
                )}
              </Button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50">
                  {isAuthenticated ? (
                    <Button
                      variant="ghost"
                      onClick={() => {
                        logout();
                        setShowUserMenu(false);
                      }}
                      className="w-full justify-start text-gray-700 hover:bg-gray-100"
                    >
                      退出登录
                    </Button>
                  ) : (
                    <Button variant="ghost" asChild className="w-full justify-start text-gray-700 hover:bg-gray-100">
                      <Link
                        href="/login"
                        onClick={() => setShowUserMenu(false)}
                      >
                        登录
                      </Link>
                    </Button>
                  )}
                </div>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
