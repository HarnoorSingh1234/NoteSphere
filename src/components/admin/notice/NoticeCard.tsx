'use client';

import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Edit3, 
  Trash2, 
  ExternalLink, 
  Heart, 
  MessageCircle,
  Eye,
  EyeOff 
} from 'lucide-react';

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

interface NoticeCardProps {
  notice: Notice;
  onEdit: (notice: Notice) => void;
  onDelete: (id: string) => void;
  onTogglePublish: (notice: Notice) => void;
  formatDate: (date: string) => string;
}

const NoticeCard: React.FC<NoticeCardProps> = ({ 
  notice, 
  onEdit, 
  onDelete, 
  onTogglePublish,
  formatDate 
}) => {
  return (
    <Card className="overflow-hidden border border-gray-200 hover:border-gray-300 transition-all duration-200 shadow-sm">
      <CardHeader className="pb-3 bg-gray-50">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold text-gray-900">
                {notice.title}
              </h3>
              <Badge 
                variant={notice.isPublished ? "default" : "secondary"}
                className={notice.isPublished 
                  ? "bg-green-100 text-green-800 border border-green-200" 
                  : "bg-gray-100 text-gray-700 border border-gray-200"
                }
              >
                {notice.isPublished ? 'Published' : 'Draft'}
              </Badge>
            </div>
            <p className="text-sm text-gray-600 mb-1">
              By {notice.author.firstName} {notice.author.lastName}
            </p>
            <p className="text-xs text-gray-500">
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
              onClick={() => onTogglePublish(notice)}
              className="text-gray-700 border-gray-300 hover:bg-gray-100"
              title={notice.isPublished ? "Unpublish" : "Publish"}
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
              onClick={() => onEdit(notice)}
              className="text-blue-600 border-gray-300 hover:bg-blue-50"
              title="Edit Notice"
            >
              <Edit3 className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(notice.id)}
              className="text-red-600 border-gray-300 hover:bg-red-50"
              title="Delete Notice"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-4">
        <p className="text-gray-700 mb-4 text-sm">{notice.description}</p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1" title="Likes">
              <Heart className="h-4 w-4 text-gray-400" />
              {notice._count.likes}
            </span>
            <span className="flex items-center gap-1" title="Comments">
              <MessageCircle className="h-4 w-4 text-gray-400" />
              {notice._count.comments}
            </span>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(notice.driveLink, '_blank')}
            className="text-blue-600 border-gray-300 hover:bg-blue-50"
          >
            <ExternalLink className="h-4 w-4 mr-1" />
            View File
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default NoticeCard;
