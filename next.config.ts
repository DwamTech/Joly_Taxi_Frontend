import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    const backendBaseUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/+$/, "") ||
      "https://back.mishwar-masr.app";

    return [
      {
        source: "/api/auth/admin/:path*",
        destination: `${backendBaseUrl}/api/auth/admin/:path*`,
      },
      {
        source: "/api/admin/:path*",
        destination: `${backendBaseUrl}/api/admin/:path*`,
      },
      {
        source: "/api/vehicle-types",
        destination: `${backendBaseUrl}/api/admin/vehicle-types`,
      },
      {
        source: "/api/vehicle-types/:path*",
        destination: `${backendBaseUrl}/api/admin/vehicle-types/:path*`,
      },
    ];
  },
};

export default nextConfig;
