import type { MetadataRoute } from "next";

const baseUrl = "https://portfolio-website-sigma-ashen-90.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
