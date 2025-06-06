'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import AdminNoteControls from './AdminNoteControls';
import { Loader2 } from 'lucide-react';

interface AdminControlsWrapperProps {
  noteId: string;
}

export default function AdminControlsWrapper({ noteId }: AdminControlsWrapperProps) {
  const { user, isLoaded } = useUser();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (!isLoaded) return;

    const checkAdminStatus = () => {
      const role = user?.publicMetadata?.role;
      setIsAdmin(role === 'admin');
      setIsChecking(false);
    };

    checkAdminStatus();
  }, [user, isLoaded]);

  if (isChecking) {
    return (
      <div className="mt-6 flex justify-center">
        <div className="flex items-center gap-2 text-[#264143]/60">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-sm">Checking permissions...</span>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return <AdminNoteControls noteId={noteId} />;
}
