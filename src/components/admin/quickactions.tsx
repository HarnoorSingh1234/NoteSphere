import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function QuickActions() {
  return (
    <div className="flex flex-wrap gap-4">
      <Button asChild>
        <Link href="/upload">Upload New Note</Link>
      </Button>
      <Button asChild variant="outline">
        <Link href="/notes">Browse Notes</Link>
      </Button>
      <Button asChild variant="outline">
        <Link href="/subjects">Explore Subjects</Link>
      </Button>
    </div>
  )
}
