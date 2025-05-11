import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

export default function PopularSubjects() {
  const subjects = ["Computer Science", "Biology", "Economics", "Physics", "Mathematics"]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Popular Subjects</CardTitle>
        <CardDescription>Most active subject areas</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {subjects.map((subject, i) => (
            <div key={subject} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 text-xs font-bold dark:bg-zinc-800">
                  {i + 1}
                </div>
                <span className="text-sm font-medium">{subject}</span>
              </div>
              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                {Math.floor(Math.random() * 100) + 20} notes
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
