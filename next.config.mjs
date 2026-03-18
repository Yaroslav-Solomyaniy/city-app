/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["pg", "bcrypt", "@prisma/client"],
  allowedDevOrigins: ["192.168.88.46"],
  images: {
    qualities: [100, 90, 75],
  },
}

export default nextConfig
