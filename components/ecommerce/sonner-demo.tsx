"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Sparkles, ChevronDown, ChevronUp } from "lucide-react"

export function SonnerDemo() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="mb-6 p-3 bg-muted/30 rounded-lg border border-dashed">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium text-muted-foreground">Toast Notifications Test</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          className="cursor-pointer h-6 px-2"
        >
          {isOpen ? (
            <ChevronUp className="h-3 w-3" />
          ) : (
            <ChevronDown className="h-3 w-3" />
          )}
        </Button>
      </div>
      {isOpen && (
        <div className="flex flex-wrap gap-2 pt-2 border-t">
          <Button
            variant="outline"
            size="sm"
            onClick={() => toast("Event has been created")}
            className="cursor-pointer text-xs"
          >
            Default
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => toast.success("Event has been created")}
            className="cursor-pointer text-xs"
          >
            Success
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => toast.info("Be at the area 10 minutes before the event time")}
            className="cursor-pointer text-xs"
          >
            Info
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => toast.warning("Event start time cannot be earlier than 8am")}
            className="cursor-pointer text-xs"
          >
            Warning
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => toast.error("Event has not been created")}
            className="cursor-pointer text-xs"
          >
            Error
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              toast.promise<{ name: string }>(
                () =>
                  new Promise((resolve) =>
                    setTimeout(() => resolve({ name: "Event" }), 2000)
                  ),
                {
                  loading: "Loading...",
                  success: (data) => `${data.name} has been created`,
                  error: "Error",
                }
              )
            }}
            className="cursor-pointer text-xs"
          >
            Promise
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              toast("Event has been created", {
                description: "Sunday, December 03, 2023 at 9:00 AM",
                action: {
                  label: "Undo",
                  onClick: () => console.log("Undo"),
                },
              })
            }
            className="cursor-pointer text-xs"
          >
            With Action
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              toast.success("Order placed!", {
                description: "Your order will be delivered in 2-3 business days",
                duration: 5000,
              })
            }
            className="cursor-pointer text-xs"
          >
            Custom Duration
          </Button>
        </div>
      )}
    </div>
  )
}

