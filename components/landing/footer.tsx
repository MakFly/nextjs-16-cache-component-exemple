import Link from "next/link"
import { Github, BookOpen, Code2 } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t bg-muted/30 mt-20">
      <div className="container mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Links */}
          <div>
            <h3 className="font-semibold mb-4">Ressources</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="https://nextjs.org/docs" className="hover:text-foreground transition-colors flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="https://github.com/vercel/next.js" className="hover:text-foreground transition-colors flex items-center gap-2">
                  <Github className="h-4 w-4" />
                  GitHub
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-foreground transition-colors flex items-center gap-2">
                  <Code2 className="h-4 w-4" />
                  Exemples
                </Link>
              </li>
            </ul>
          </div>

          {/* Tech Stack */}
          <div>
            <h3 className="font-semibold mb-4">Tech Stack</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Next.js 16</li>
              <li>React 19</li>
              <li>Tailwind CSS 4</li>
              <li>shadcn/ui</li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h3 className="font-semibold mb-4">À propos</h3>
            <p className="text-sm text-muted-foreground">
              Démonstration des fonctionnalités Cache Components de Next.js 16.
              Explorez les différents patterns et exemples d'utilisation.
            </p>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>Built with ❤️ using Next.js 16</p>
        </div>
      </div>
    </footer>
  )
}

