
  import { NoteType } from "@prisma/client"
  import { Input } from "@/components/ui/input"
  import { Button } from "@/components/ui/button"
  import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
  import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
  } from "@/components/ui/pagination"
  import {
    Bookmark,
    Download,
    FileText,
    Heart,
    SearchIcon,
    Upload,
  } from "lucide-react"
  import NoteCard from "@/components/user/notecard" // adjust the path if needed
  
  export default function NotesPage() {
    const notes = Array.from({ length: 12 }).map((_, i) => ({
      id: String(i + 1),
      title: `${["Lecture Notes", "Study Guide", "Exam Prep", "Lab Report", "Research Summary"][i % 5]} - ${["Biology", "Computer Science", "Economics", "Physics", "Mathematics"][i % 5]}`,
      fileUrl: `/files/sample-${i + 1}.pdf`, 
      type: [NoteType.PPT, NoteType.LECTURE, NoteType.HANDWRITTEN, NoteType.PDF][i % 4],
      subject: {
        id: String(i),
        name: ["Biology", "Computer Science", "Economics", "Physics", "Mathematics"][i % 5],
        code: `CS${100 + i}`,
        semesterId: "sem1",
        notes: [],
        semester: { id: "sem1", number: 1, subjects: [] },
      },
      tags: Array.from({ length: Math.floor(Math.random() * 3) + 1 }).map((_, j) => ({
        id: `${i}-${j}`,
        name: ["Midterm", "Final", "Chapter 1", "Important", "Advanced", "Beginner"][Math.floor(Math.random() * 6)],
        notes: [],
      })),
      likes: Array.from({ length: Math.floor(Math.random() * 20) }, (_, idx) => ({
        id: `${i}-${idx}`,
        userId: `user-${idx}`,
        noteId: String(i + 1),
        user: {
          clerkId: `user-${idx}`,
          email: `user${idx}@email.com`,
          firstName: "Test",
          lastName: "User",
          createdAt: new Date(),
          notes: [],
          comments: [],
          likes: [],
        },
        note: {} as any,
        createdAt: new Date(),
      })),
      downloadCount: Math.floor(Math.random() * 200) + 10,
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000),
      updatedAt: new Date(),
      content: "Sample note content",
      author: {
        clerkId: "user-0",
        email: "author@example.com",
        firstName: "Author",
        lastName: "User",
        createdAt: new Date(),
        notes: [],
        comments: [],
        likes: [],
      },
      authorClerkId: "user-0",
      subjectId: "subj1",
      comments: [],
    }))
  
    return (
      <div className="flex flex-col min-h-screen">
        <header className="flex items-center border-2 rounded-2xl bg-white dark:bg-black justify-between p-4 shadow-md">
          <h1 className="text-xl font-bold text-indigo-900 dark:text-indigo-100">Notes</h1>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" className="hidden md:inline-flex">
              <Upload />
            </Button>
            <Button variant="outline" size="sm" className="hidden md:inline-flex">
              <Bookmark />
            </Button>
          </div>
        </header>
  
        <main className="flex-1 p-4 md:p-6">
          <div className="grid gap-6">
            {/* Search and Filters */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex w-full max-w-sm items-center space-x-2">
                <Input type="search" placeholder="Search notes..." className="w-full" />
                <Button type="submit" className="text-indigo-100 bg-indigo-600">
                  <SearchIcon />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                <Select defaultValue="all">
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Subjects</SelectItem>
                    <SelectItem value="biology">Biology</SelectItem>
                    <SelectItem value="cs">Computer Science</SelectItem>
                    <SelectItem value="economics">Economics</SelectItem>
                    <SelectItem value="physics">Physics</SelectItem>
                    <SelectItem value="math">Mathematics</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue="all">
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="ppt">PPT</SelectItem>
                    <SelectItem value="lecture">Lecture</SelectItem>
                    <SelectItem value="handwritten">Handwritten</SelectItem>
                    <SelectItem value="pdf">PDF</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue="newest">
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Sort By" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="popular">Most Popular</SelectItem>
                    <SelectItem value="downloads">Most Downloads</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
  
            {/* Notes Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {notes.map((note) => (
                <NoteCard key={note.id} note={note} />
              ))}
            </div>
  
            {/* Pagination */}
            <Pagination className="mt-6">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#" />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" isActive>
                    1
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">2</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">3</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext href="#" />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </main>
      </div>
    )
  }
  