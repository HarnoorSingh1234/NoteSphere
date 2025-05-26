'use client';

import { useUser } from '@clerk/nextjs';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function MakeAdminPage() {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);

  const handleMakeAdmin = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/admin/make-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          clerkId: user.id
        })
      });

      if (!response.ok) {
        throw new Error('Failed to make user admin');
      }

      toast.success('Successfully made admin!');
    } catch (error) {
      console.error(error);
      toast.error('Failed to make user admin');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Make Admin</h1>
      <Button 
        onClick={handleMakeAdmin} 
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 text-white"
      >
        {loading ? 'Processing...' : 'Make Me Admin'}
      </Button>
    </div>
  );
}