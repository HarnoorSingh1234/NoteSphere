'use client';

import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

export default function MakeAdminPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleMakeAdmin = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/make-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to grant admin privileges');
      }

      const data = await response.json();
      setSuccess(true);
      toast({
        title: "Success!",
        description: `${data.user.firstName} ${data.user.lastName} is now an admin`,
        variant: "default",
      });
    } catch (error) {
      console.error('Error making admin:', error);
      toast({
        title: "Error",
        description: "Failed to grant admin privileges. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container max-w-4xl py-8">
      <Button 
        variant="ghost" 
        className="mb-6 p-0 h-auto text-[#264143]/70 hover:text-[#264143] hover:bg-transparent"
        onClick={() => router.push('/admin/dashboard')}
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
      </Button>
      
      <div className="grid gap-6">
        <h1 className="text-3xl font-bold text-[#264143]">Make Admin</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Grant Admin Privileges</CardTitle>
            <CardDescription>
              This will grant admin privileges to your account in the database. This action should only 
              be performed if you already have admin role assigned in Clerk.
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <p className="text-sm text-[#264143]/70 mb-4">
              When you click the button below, your account will be granted admin privileges in the database. 
              This allows you to access all admin features and manage the application.
            </p>
            
            {success ? (
              <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-md">
                <p className="font-medium">Success!</p>
                <p className="text-sm">Your account now has admin privileges. You can now fully access all admin features.</p>
              </div>
            ) : null}
          </CardContent>
          
          <CardFooter>
            <Button 
              onClick={handleMakeAdmin} 
              disabled={isLoading || success}
              className="bg-[#264143] hover:bg-[#264143]/90"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                  Processing...
                </>
              ) : success ? (
                "Admin Privileges Granted"
              ) : (
                "Grant Admin Privileges"
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
