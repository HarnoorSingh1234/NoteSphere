'use client'

import { useUser } from '@clerk/nextjs'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import NoteCard from '@/components/user/NoteCard'
import { prisma } from '@/lib/prisma'

export default function ProfilePage() {
  const { user } = useUser()
  const [notes, setNotes] = useState<Note[]>([])
  const [likedNotes, setLikedNotes] = useState<Note[]>([])

  useEffect(() => {
    if (user) {
      // Fetch user's notes and liked notes
      Promise.all([
        fetch(`/api/users/${user.id}/notes`).then(res => res.json()),
        fetch(`/api/users/${user.id}/likes`).then(res => res.json())
      ]).then(([userNotes, liked]) => {
        setNotes(userNotes)
        setLikedNotes(liked)
      })
    }
  }, [user])

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p>Name: {user?.fullName}</p>
              <p>Email: {user?.primaryEmailAddress?.emailAddress}</p>
              <p>Member since: {user?.createdAt?.toLocaleDateString()}</p>
            </div>
          </CardContent>
        </Card>

        <h2 className="text-2xl font-bold mb-4">Your Uploads ({notes.length})</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {notes.map(note => (
            <NoteCard key={note.id} note={note} />
          ))}
        </div>

        <h2 className="text-2xl font-bold mt-8 mb-4">Liked Notes ({likedNotes.length})</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {likedNotes.map(note => (
            <NoteCard key={note.id} note={note} />
          ))}
        </div>
      </div>
    </div>
  )
}