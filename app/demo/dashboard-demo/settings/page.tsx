import { cacheLife } from "next/cache"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { delay } from "@/lib/api"

export default async function SettingsPage() {
  "use cache"
  cacheLife("days")

  await delay(500)

  return (
    <div>
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Static settings page - cached for days
        </p>
        <div className="flex gap-2 mt-2">
          <Badge variant="outline" className="text-green-600 border-green-600">
            cached (days)
          </Badge>
          <Badge variant="outline" className="font-mono">
            {new Date().toLocaleTimeString()}
          </Badge>
        </div>
      </header>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Profile Settings</CardTitle>
            <CardDescription>Manage your public profile</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b">
              <div>
                <p className="font-medium">Display Name</p>
                <p className="text-sm text-muted-foreground">Your public display name</p>
              </div>
              <Badge variant="secondary">John Doe</Badge>
            </div>
            <div className="flex items-center justify-between py-2 border-b">
              <div>
                <p className="font-medium">Email</p>
                <p className="text-sm text-muted-foreground">Your account email</p>
              </div>
              <Badge variant="secondary">john@example.com</Badge>
            </div>
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium">Timezone</p>
                <p className="text-sm text-muted-foreground">Your local timezone</p>
              </div>
              <Badge variant="secondary">UTC+1</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notification Preferences</CardTitle>
            <CardDescription>Control how you receive notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b">
              <div>
                <p className="font-medium">Email Notifications</p>
                <p className="text-sm text-muted-foreground">Receive updates via email</p>
              </div>
              <Badge variant="outline" className="text-green-600">Enabled</Badge>
            </div>
            <div className="flex items-center justify-between py-2 border-b">
              <div>
                <p className="font-medium">Push Notifications</p>
                <p className="text-sm text-muted-foreground">Browser push notifications</p>
              </div>
              <Badge variant="outline" className="text-green-600">Enabled</Badge>
            </div>
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium">Marketing Emails</p>
                <p className="text-sm text-muted-foreground">Product updates and news</p>
              </div>
              <Badge variant="outline" className="text-red-600">Disabled</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
