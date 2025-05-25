'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import NoticeForm from './NoticeForm';
import NoticeCard from './NoticeCard';
import { toast } from 'sonner';

interface Notice {
  id: string;
  title: string;
  description: string;
  driveLink: string;
  driveFileId?: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  author: {
    firstName: string;
    lastName: string;
    email: string;
  };
  _count: {
    likes: number;
    comments: number;
  };
}

interface NoticeListProps {
  notices: Notice[];
  onRefresh: () => Promise<void>;
}

const NoticeList: React.FC<NoticeListProps> = ({ notices, onRefresh }) => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false);
  const [editingNotice, setEditingNotice] = React.useState<Notice | null>(null);

  // Helper function to format dates
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: '2-digit' 
    });
  };

  const handleEdit = (notice: Notice) => {
    setEditingNotice(notice);
    setIsCreateDialogOpen(true);
  };

  const handleDelete = async (noticeId: string) => {
    if (!confirm('Are you sure you want to delete this notice?')) return;

    try {
      const response = await fetch(`/api/admin/notices/${noticeId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete notice');

      toast.success('Notice deleted successfully');
      onRefresh();
    } catch (error) {
      toast.error('Failed to delete notice');
      console.error(error);
    }
  };

  const togglePublishStatus = async (notice: Notice) => {
    try {
      const response = await fetch(`/api/admin/notices/${notice.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isPublished: !notice.isPublished }),
      });

      if (!response.ok) throw new Error('Failed to update notice');

      toast.success(`Notice ${notice.isPublished ? 'unpublished' : 'published'} successfully`);
      onRefresh();
    } catch (error) {
      toast.error('Failed to update notice');
      console.error(error);
    }
  };
  
  const closeDialog = () => {
    setIsCreateDialogOpen(false);
    setEditingNotice(null);
  };
    return (
    <>      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-xl font-semibold text-[#050505]">Notice List</h2>
          <p className="text-[#050505]/70">Manage all published and unpublished notices</p>
        </div>
        
        <Dialog 
          open={isCreateDialogOpen} 
          onOpenChange={(open) => {
            setIsCreateDialogOpen(open);
            if (!open) setEditingNotice(null);
          }}
        >          <DialogTrigger asChild>
            <Button size="lg" className="bg-[#4d61ff] hover:bg-[#3a4cd1] text-white font-medium px-6 py-2 shadow-sm">
              <Plus className="h-5 w-5 mr-2" />
              Create Notice
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-gray-900">
                {editingNotice ? 'Edit Notice' : 'Create New Notice'}
              </DialogTitle>
            </DialogHeader>
            <NoticeForm 
              editingNotice={editingNotice}
              onClose={closeDialog}
              onSuccess={onRefresh}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">        {notices.length === 0 ? (
          <Card className="border border-gray-200 shadow-sm">
            <CardContent className="flex flex-col items-center justify-center h-40 p-6">
              <p className="text-gray-500 text-center mb-4">No notices created yet. Click on 'Create Notice' to add one.</p>
              <DialogTrigger asChild>
                <Button className="bg-[#4d61ff] hover:bg-[#3a4cd1] text-white font-medium">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Notice
                </Button>
              </DialogTrigger>
            </CardContent>
          </Card>
        ) : (
          notices.map((notice) => (
            <NoticeCard
              key={notice.id}
              notice={notice}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onTogglePublish={togglePublishStatus}
              formatDate={formatDate}
            />
          ))
        )}
      </div>
    </>
  );
};

export default NoticeList;
