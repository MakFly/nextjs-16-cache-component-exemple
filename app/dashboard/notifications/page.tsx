import { connection } from "next/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { delay } from "@/lib/api"
import { Bell, MessageCircle, UserPlus, Heart } from "lucide-react"

const iconMap = {
  mention: MessageCircle,
  follow: UserPlus,
  like: Heart,
  system: Bell,
}

export default async function NotificationsPage() {
  await connection()
  await delay(800)

  const notifications = [
    { id: 1, type: "mention", title: "New mention", body: "Alice mentioned you in a comment", time: "2m ago", unread: true },
    { id: 2, type: "follow", title: "New follower", body: "Bob started following you", time: "15m ago", unread: true },
    { id: 3, type: "like", title: "Post liked", body: "Charlie liked your post", time: "1h ago", unread: false },
    { id: 4, type: "system", title: "System update", body: "New features available", time: "2h ago", unread: false },
    { id: 5, type: "mention", title: "New mention", body: "Diana replied to your thread", time: "3h ago", unread: false },
  ]

  return (
    <div>
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Notifications</h1>
        <p className="text-muted-foreground">
          Real-time notifications - dynamic rendering
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

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent</CardTitle>
            <Badge variant="secondary">
              {notifications.filter(n => n.unread).length} unread
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {notifications.map((notification) => {
              const Icon = iconMap[notification.type as keyof typeof iconMap]
              return (
                <div
                  key={notification.id}
                  className={`flex items-start gap-4 p-3 rounded-lg transition-colors ${
                    notification.unread ? "bg-muted/50" : ""
                  }`}
                >
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{notification.title}</p>
                      {notification.unread && (
                        <span className="h-2 w-2 rounded-full bg-primary" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{notification.body}</p>
                    <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
