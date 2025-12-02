export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="text-center">
          <p className="text-sm">
            &copy; 2024 NextStore. All rights reserved.
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Data provided by <a href="https://fakestoreapi.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-white">FakeStore API</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
