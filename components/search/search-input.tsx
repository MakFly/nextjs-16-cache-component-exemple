"use client"

import { useQueryState, parseAsString } from "nuqs"
import { useState, useTransition, useEffect, useCallback } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Search, X, Loader2, Keyboard, MousePointerClick, Timer } from "lucide-react"
import { useDebounce } from "@/hooks/use-debounce"

// ============================================
// DEBOUNCED SEARCH (auto-search as you type)
// ============================================
export function DebouncedSearchInput() {
  const [isPending, startTransition] = useTransition()
  const [localValue, setLocalValue] = useState("")

  // nuqs hook - syncs with URL ?q=...
  const [query, setQuery] = useQueryState(
    "q",
    parseAsString.withDefault("").withOptions({
      shallow: false,
      startTransition,
    })
  )

  // Debounce local value
  const debouncedValue = useDebounce(localValue, 400)

  // Sync URL when debounced value changes
  useEffect(() => {
    if (debouncedValue !== query) {
      setQuery(debouncedValue || null)
    }
  }, [debouncedValue, query, setQuery])

  // Initialize local value from URL
  useEffect(() => {
    setLocalValue(query)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  function handleChange(value: string) {
    setLocalValue(value)
  }

  function handleClear() {
    setLocalValue("")
    setQuery(null)
  }

  const isSearching = isPending || localValue !== debouncedValue

  return (
    <Card className="border-blue-200 dark:border-blue-900">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <Timer className="h-4 w-4 text-blue-500" />
              Debounced Search
            </CardTitle>
            <CardDescription>
              Auto-search after 400ms of inactivity
            </CardDescription>
          </div>
          <Badge variant="outline" className="text-blue-600 border-blue-600">
            Debounce
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Type to search... (auto-updates)"
              value={localValue}
              onChange={(e) => handleChange(e.target.value)}
              className="pl-10 pr-10"
            />
            {localValue && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          {isSearching && (
            <div className="flex items-center px-3">
              <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
            </div>
          )}
        </div>

        {/* Status indicators */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <Badge variant="secondary" className="font-mono">
            Local: "{localValue || "(empty)"}"
          </Badge>
          <Badge variant="outline" className="font-mono text-purple-600 border-purple-600">
            URL ?q={query || "(empty)"}
          </Badge>
          {localValue !== debouncedValue && (
            <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
              <Timer className="h-3 w-3 mr-1" />
              Debouncing...
            </Badge>
          )}
        </div>

        {/* How it works */}
        <div className="bg-blue-50 dark:bg-blue-950/30 p-3 rounded-lg text-sm text-blue-700 dark:text-blue-300">
          <strong>How it works:</strong> As you type, we wait 400ms before updating the URL.
          This prevents excessive server requests while typing.
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================
// MANUAL SEARCH (click button to search)
// ============================================
export function ManualSearchInput() {
  const [isPending, startTransition] = useTransition()
  const [localValue, setLocalValue] = useState("")

  // nuqs hook - syncs with URL ?q=...
  const [query, setQuery] = useQueryState(
    "q",
    parseAsString.withDefault("").withOptions({
      shallow: false,
      startTransition,
    })
  )

  // Initialize local value from URL
  useEffect(() => {
    setLocalValue(query)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  function handleSearch() {
    setQuery(localValue || null)
  }

  function handleClear() {
    setLocalValue("")
    setQuery(null)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  const hasChanges = localValue !== query

  return (
    <Card className="border-green-200 dark:border-green-900">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <MousePointerClick className="h-4 w-4 text-green-500" />
              Manual Search
            </CardTitle>
            <CardDescription>
              Type and click button or press Enter
            </CardDescription>
          </div>
          <Badge variant="outline" className="text-green-600 border-green-600">
            On Submit
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Type and press Enter or click Search..."
              value={localValue}
              onChange={(e) => setLocalValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className="pl-10 pr-10"
            />
            {localValue && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <Button
            onClick={handleSearch}
            disabled={isPending || !hasChanges}
            className="shrink-0"
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Search className="h-4 w-4 mr-2" />
            )}
            Search
          </Button>
        </div>

        {/* Status indicators */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <Badge variant="secondary" className="font-mono">
            Input: "{localValue || "(empty)"}"
          </Badge>
          <Badge variant="outline" className="font-mono text-purple-600 border-purple-600">
            URL ?q={query || "(empty)"}
          </Badge>
          {hasChanges && (
            <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300">
              <Keyboard className="h-3 w-3 mr-1" />
              Press Enter or click Search
            </Badge>
          )}
        </div>

        {/* How it works */}
        <div className="bg-green-50 dark:bg-green-950/30 p-3 rounded-lg text-sm text-green-700 dark:text-green-300">
          <strong>How it works:</strong> URL only updates when you explicitly submit.
          Good for expensive queries or when you want precise control.
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================
// COMBINED TABS COMPONENT
// ============================================
export function SearchInput() {
  return (
    <Tabs defaultValue="debounced" className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-4">
        <TabsTrigger value="debounced" className="flex items-center gap-2">
          <Timer className="h-4 w-4" />
          Debounced
        </TabsTrigger>
        <TabsTrigger value="manual" className="flex items-center gap-2">
          <MousePointerClick className="h-4 w-4" />
          Manual
        </TabsTrigger>
      </TabsList>
      <TabsContent value="debounced">
        <DebouncedSearchInput />
      </TabsContent>
      <TabsContent value="manual">
        <ManualSearchInput />
      </TabsContent>
    </Tabs>
  )
}
