'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  ExternalLink, 
  Heart, 
  MessageCircle,
  Eye,
  EyeOff 
} from 'lucide-react';
import { toast } from 'sonner';

interface Notice {
  id: string;
  title: string;
  description: string;
  driveLink: string;
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

interface NoticeFormData {
  title: string;
  description: string;
  driveLink: string;
}

export default function AdminNoticesPage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  const [formData, setFormData] = useState<NoticeFormData>({
    title: '',
    description: '',
    driveLink: '',
  });

  // Helper function to format dates
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: '2-digit' 
    });
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      const response = await fetch('/api/admin/notices');
      if (!response.ok) throw new Error('Failed to fetch notices');
      const data = await response.json();
      setNotices(data);
    } catch (error) {
      toast.error('Failed to fetch notices');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.driveLink) {
      toast.error('All fields are required');
      return;
    }

    try {
      const url = editingNotice 
        ? `/api/admin/notices/${editingNotice.id}`
        : '/api/admin/notices';
      
      const method = editingNotice ? 'PATCH' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to save notice');

      toast.success(editingNotice ? 'Notice updated successfully' : 'Notice created successfully');
      setIsCreateDialogOpen(false);
      setEditingNotice(null);
      setFormData({ title: '', description: '', driveLink: '' });
      fetchNotices();
    } catch (error) {
      toast.error('Failed to save notice');
      console.error(error);
    }
  };

  const handleEdit = (notice: Notice) => {
    setEditingNotice(notice);
    setFormData({
      title: notice.title,
      description: notice.description,
      driveLink: notice.driveLink,
    });
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
      fetchNotices();
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
      fetchNotices();
    } catch (error) {
      toast.error('Failed to update notice');
      console.error(error);
    }
  };

  const resetForm = () => {
    setFormData({ title: '', description: '', driveLink: '' });
    setEditingNotice(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#264143]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#264143]">Manage Notices</h1>
          <p className="text-gray-600">Create and manage notices for latest releases</p>
        </div>
        
        <Dialog 
          open={isCreateDialogOpen} 
          onOpenChange={(open) => {
            setIsCreateDialogOpen(open);
            if (!open) resetForm();
          }}
        >
          <DialogTrigger asChild>
            <Button className="bg-[#DE5499] hover:bg-[#E66BA7] text-white">
              <Plus className="h-4 w-4 mr-2" />
              Create Notice
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingNotice ? 'Edit Notice' : 'Create New Notice'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter notice title"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter notice description"
                  rows={4}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Drive Link</label>
                <Input
                  value={formData.driveLink}
                  onChange={(e) => setFormData({ ...formData, driveLink: e.target.value })}
                  placeholder="https://drive.google.com/..."
                  type="url"
                  required
                />
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button type="submit" className="bg-[#DE5499] hover:bg-[#E66BA7] text-white flex-1">
                  {editingNotice ? 'Update Notice' : 'Create Notice'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsCreateDialogOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {notices.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center h-32">
              <p className="text-gray-500">No notices created yet</p>
            </CardContent>
          </Card>
        ) : (
          notices.map((notice) => (
            <Card key={notice.id} className="border-[#264143]">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="text-lg text-[#264143]">
                        {notice.title}
                      </CardTitle>
                      <Badge 
                        variant={notice.isPublished ? "default" : "secondary"}
                        className={notice.isPublished 
                          ? "bg-green-100 text-green-800" 
                          : "bg-gray-100 text-gray-800"
                        }
                      >
                        {notice.isPublished ? 'Published' : 'Draft'}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      By {notice.author.firstName} {notice.author.lastName}
                    </p>                    <p className="text-sm text-gray-500">
                      Created: {formatDate(notice.createdAt)}
                      {notice.updatedAt !== notice.createdAt && (
                        <span className="ml-2">
                          • Updated: {formatDate(notice.updatedAt)}
                        </span>
                      )}
                    </p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => togglePublishStatus(notice)}
                      className="text-[#264143]"
                    >
                      {notice.isPublished ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(notice)}
                      className="text-[#264143]"
                    >
                      <Edit3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(notice.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <p className="text-gray-700 mb-3">{notice.description}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Heart className="h-4 w-4" />
                      {notice._count.likes}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="h-4 w-4" />
                      {notice._count.comments}
                    </span>
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(notice.driveLink, '_blank')}
                    className="text-[#264143]"
                  >
                    <ExternalLink className="h-4 w-4 mr-1" />
                    View File
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
