/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["pg", "bcrypt", "@prisma/client"],
  allowedDevOrigins: ["192.168.88.46"],
  images: {
    qualities: [100, 90, 75],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.ufs.sh",
      },
      {
        protocol: "https",
        hostname: "utfs.io",
      },
    ],
  },
}

export default nextConfig
