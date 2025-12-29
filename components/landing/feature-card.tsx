import { type LucideIcon } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface FeatureCardProps {
  icon: LucideIcon
  title: string
  description: string
  iconColor?: string
}

export function FeatureCard({ icon: Icon, title, description, iconColor = "text-primary" }: FeatureCardProps) {
  return (
    <Card className="h-full transition-all duration-300 hover:shadow-lg hover:scale-[1.02] hover:border-primary/50">
      <CardHeader>
        <div className={`mb-4 inline-flex p-3 rounded-lg bg-muted ${iconColor}`}>
          <Icon className="h-6 w-6" />
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription className="mt-2">{description}</CardDescription>
      </CardHeader>
      <CardContent />
    </Card>
  )
}

