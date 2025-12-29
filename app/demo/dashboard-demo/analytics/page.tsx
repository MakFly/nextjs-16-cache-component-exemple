import { connection } from "next/server"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { delay } from "@/lib/api"

export default async function AnalyticsPage() {
  await connection()
  await delay(1000)

  const metrics = [
    { label: "Page Views", value: "125,847", change: "+12.5%" },
    { label: "Unique Visitors", value: "45,293", change: "+8.3%" },
    { label: "Bounce Rate", value: "32.4%", change: "-2.1%" },
    { label: "Avg. Session", value: "4m 32s", change: "+0.8%" },
  ]

  return (
    <div>
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-muted-foreground">
          Real-time analytics - dynamic rendering
        </p>
        <div className="flex gap-2 mt-2">
          <Badge variant="outline" className="text-orange-600 border-orange-600">
            dynamic page
          </Badge>
          <Badge variant="outline" className="font-mono">
            {new Date().toLocaleTimeString()}
          </Badge>
        </div>
      </header>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <Card key={metric.label}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {metric.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <p className={`text-xs ${metric.change.startsWith("+") ? "text-green-600" : "text-red-600"}`}>
                {metric.change} from last week
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Traffic Overview</CardTitle>
          <CardDescription>Last 7 days</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-48 bg-muted rounded-lg flex items-center justify-center text-muted-foreground">
            Chart placeholder - would render real chart here
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
