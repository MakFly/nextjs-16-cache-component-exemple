import type { MetadataRoute } from "next"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fetch dynamic routes
  const postsRes = await fetch("https://jsonplaceholder.typicode.com/posts")
  const posts = await postsRes.json()

  const postUrls = posts.slice(0, 10).map((post: { id: number }) => ({
    url: `https://example.com/posts/${post.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }))

  // Static routes
  const staticRoutes = [
    {
      url: "https://example.com",
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1,
    },
    {
      url: "https://example.com/posts",
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    {
      url: "https://example.com/search",
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    },
  ]

  return [...staticRoutes, ...postUrls]
}

