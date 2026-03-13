/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Игнорируем ошибки TypeScript при сборке
    ignoreBuildErrors: true,
  },
  eslint: {
    // Игнорируем ошибки линтера (правила оформления кода)
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;