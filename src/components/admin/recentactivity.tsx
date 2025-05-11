import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { FileText } from "lucide-react"

export default function RecentActivity() {
  return (
    <Card className="md:col-span-2">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Your latest interactions on the platform</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-4 rounded-lg border border-zinc-200 p-3 dark:border-zinc-800">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
                <FileText className="h-5 w-5 text-zinc-500 dark:text-zinc-400" />
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium">
                  {i % 2 === 0 ? "You uploaded" : "You downloaded"} a new note
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  {i % 2 === 0 ? "Organic Chemistry - Lecture Notes" : "Calculus II - Exam Prep"}
                </p>
              </div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400">
                {i === 1 ? "Just now" : i === 2 ? "2 hours ago" : `${i} days ago`}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
