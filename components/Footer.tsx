import { Separator } from '@/components/ui/separator';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-auto">
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8" style={{ marginLeft: 'auto', marginRight: 'auto' }}>
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
          <div className="text-center md:text-left">
            <p>&copy; 2024 NextStore. All rights reserved.</p>
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">关于我们</a>
            <a href="#" className="hover:text-white transition-colors">联系方式</a>
            <a href="#" className="hover:text-white transition-colors">隐私政策</a>
          </div>
        </div>
        <Separator className="my-4 bg-gray-800" />
        <div className="text-center text-xs">
          <p>
            Data provided by{' '}
            <a
              href="https://fakestoreapi.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-white transition-colors underline"
            >
              FakeStore API
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
