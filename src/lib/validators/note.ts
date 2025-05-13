import { z } from 'zod'

export const noteSchema = z.object({
  title: z.string().min(3).max(100),
  content: z.string().min(10),
  type: z.enum(['PPT', 'LECTURE', 'HANDWRITTEN', 'PDF']),
  subjectId: z.string(),
  tags: z.array(z.string()).optional(),
  fileUrl: z.string().url()
})

export type NoteSchema = z.infer<typeof noteSchema>