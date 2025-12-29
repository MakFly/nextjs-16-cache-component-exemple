"use client"

import { use, createContext, useContext, useState, type ReactNode } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

// Context avec valeur optionnelle
const ThemeContext = createContext<{ theme: "light" | "dark" } | null>(null)

function ThemeProvider({ children, theme }: { children: ReactNode; theme: "light" | "dark" }) {
  return <ThemeContext.Provider value={{ theme }}>{children}</ThemeContext.Provider>
}

// Composant qui lit le context avec use()
function ThemedButton() {
  // use() permet de lire un context de manière conditionnelle
  // Si le context est null, React throw une erreur qui peut être catchée
  const theme = use(ThemeContext)

  return (
    <Button variant={theme?.theme === "dark" ? "default" : "outline"}>
      Theme: {theme?.theme}
    </Button>
  )
}

// Composant qui utilise useContext (ancienne méthode)
function ThemedButtonOld() {
  const theme = useContext(ThemeContext)

  if (!theme) {
    return <Button disabled>No theme</Button>
  }

  return (
    <Button variant={theme.theme === "dark" ? "default" : "outline"}>
      Theme: {theme.theme}
    </Button>
  )
}

export function ContextReadDemo() {
  const [theme, setTheme] = useState<"light" | "dark">("light")

  return (
    <Card>
      <CardHeader>
        <CardTitle>use(context) - Conditional Context Reading</CardTitle>
        <CardDescription>
          Lecture conditionnelle de context avec gestion d'erreur intégrée
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setTheme("light")} disabled={theme === "light"}>
            Light
          </Button>
          <Button variant="outline" onClick={() => setTheme("dark")} disabled={theme === "dark"}>
            Dark
          </Button>
        </div>

        <div className="space-y-2">
          <div>
            <Badge variant="outline" className="mb-2">Avec use()</Badge>
            <ThemeProvider theme={theme}>
              <ThemedButton />
            </ThemeProvider>
          </div>

          <div>
            <Badge variant="outline" className="mb-2">Avec useContext (ancien)</Badge>
            <ThemeProvider theme={theme}>
              <ThemedButtonOld />
            </ThemeProvider>
          </div>
        </div>

        <div className="pt-4 border-t">
          <p className="text-xs text-muted-foreground">
            <code>use(context)</code> throw une erreur si le context est null, ce qui permet une
            gestion d'erreur plus propre avec Error Boundaries.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

