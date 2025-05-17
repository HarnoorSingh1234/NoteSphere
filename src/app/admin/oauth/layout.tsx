import { ReactNode } from 'react';

export const metadata = {
  title: 'OAuth Management - NoteSphere Admin',
  description: 'Manage Google Drive OAuth tokens for NoteSphere'
};

export default function OAuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Google Drive OAuth Management</h1>
      </div>
      <div className="border-b pb-6">
        <p className="text-muted-foreground">
          Configure and manage Google Drive OAuth tokens for centralized file storage.
        </p>
      </div>
      
      {children}
    </div>
  );
}
