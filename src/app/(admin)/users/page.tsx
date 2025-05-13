import { DataTable } from '@/components/admin/UsersTable'
import { columns } from '@/components/admin/UsersColumns'
import { prisma } from '@/lib/prisma'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

export default async function UsersPage() {
  const users = await prisma.user.findMany({
    include: {
      notes: true,
      likes: true
    }
  })

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Users</h1>
        <Button variant="outline">
          <Plus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>
      
      <DataTable columns={columns} data={users} />
    </div>
  )
}