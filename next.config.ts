import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: { bodySizeLimit: "5mb" }, // cv-uploads tot 4 MB (serverfuncties aanvaarden max. 6 MB)
  },
};

export default nextConfig;
