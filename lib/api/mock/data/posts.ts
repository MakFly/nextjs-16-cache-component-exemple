import type { Post, Comment, User, Todo, Album } from "../../types"

// ============================================
// Mock Posts (compatible with JSONPlaceholder)
// ============================================

export const mockPosts: Post[] = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  userId: (i % 5) + 1,
  title: `Post ${i + 1}: ${getRandomTitle(i)}`,
  body: getRandomBody(i),
}))

// ============================================
// Mock Comments
// ============================================

export const mockComments: Comment[] = mockPosts.flatMap((post) =>
  Array.from({ length: 3 }, (_, i) => ({
    id: post.id * 10 + i,
    postId: post.id,
    name: `Comment ${i + 1} on post ${post.id}`,
    email: `commenter${i + 1}@example.com`,
    body: `This is a mock comment ${i + 1} on post "${post.title}".`,
  }))
)

// ============================================
// Mock Users (JSONPlaceholder compatible)
// ============================================

export const mockJsonUsers: Array<User & { username: string; phone: string; website: string; company: { name: string } }> = [
  {
    id: "1",
    name: "Leanne Graham",
    email: "sincere@april.biz",
    role: "user",
    createdAt: "2024-01-01T00:00:00Z",
    username: "Bret",
    phone: "1-770-736-8031",
    website: "hildegard.org",
    company: { name: "Romaguera-Crona" },
  },
  {
    id: "2",
    name: "Ervin Howell",
    email: "shanna@melissa.tv",
    role: "user",
    createdAt: "2024-01-02T00:00:00Z",
    username: "Antonette",
    phone: "010-692-6593",
    website: "anastasia.net",
    company: { name: "Deckow-Crist" },
  },
  {
    id: "3",
    name: "Clementine Bauch",
    email: "nathan@yesenia.net",
    role: "admin",
    createdAt: "2024-01-03T00:00:00Z",
    username: "Samantha",
    phone: "1-463-123-4447",
    website: "ramiro.info",
    company: { name: "Romaguera-Jacobson" },
  },
  {
    id: "4",
    name: "Patricia Lebsack",
    email: "julianne.oconner@kory.org",
    role: "user",
    createdAt: "2024-01-04T00:00:00Z",
    username: "Karianne",
    phone: "493-170-9623",
    website: "kale.biz",
    company: { name: "Robel-Corkery" },
  },
  {
    id: "5",
    name: "Chelsey Dietrich",
    email: "lucio_hettinger@annie.ca",
    role: "user",
    createdAt: "2024-01-05T00:00:00Z",
    username: "Kamren",
    phone: "(254)954-1289",
    website: "demarco.info",
    company: { name: "Keebler LLC" },
  },
]

// ============================================
// Mock Todos
// ============================================

export const mockTodos: Todo[] = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  userId: (i % 5) + 1,
  title: `Todo item ${i + 1}`,
  completed: i % 3 === 0,
}))

// ============================================
// Mock Albums
// ============================================

export const mockAlbums: Album[] = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  userId: (i % 5) + 1,
  title: `Album ${i + 1}`,
}))

// ============================================
// Helper Functions
// ============================================

function getRandomTitle(seed: number): string {
  const titles = [
    "Introduction to Next.js 16",
    "Understanding Server Components",
    "Mastering Cache Components",
    "Building Modern UIs with React",
    "TypeScript Best Practices",
    "API Design Patterns",
    "State Management in 2025",
    "Authentication Strategies",
    "Performance Optimization Tips",
    "Testing React Applications",
  ]
  return titles[seed % titles.length]
}

function getRandomBody(seed: number): string {
  const bodies = [
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.",
  ]
  return bodies[seed % bodies.length]
}
