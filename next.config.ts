import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production';
// 只在 GitHub Pages 部署时使用 basePath（通过环境变量判断）
const isGitHubPages = process.env.DEPLOY_TARGET === 'github-pages';
const repoName = 'NextStore';

const nextConfig: NextConfig = {
  /* config options here */
  output: 'export',
  basePath: isProd && isGitHubPages ? `/${repoName}` : '',
  assetPrefix: isProd && isGitHubPages ? `/${repoName}/` : '',
  reactCompiler: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'fakestoreapi.com',
        port: '',
        pathname: '/img/**',
      },
    ],
  },
};

export default nextConfig;
