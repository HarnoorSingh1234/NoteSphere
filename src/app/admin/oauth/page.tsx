'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function OAuthManagementPage() {
  const [loading, setLoading] = useState(false);
  const [oauthStatus, setOauthStatus] = useState<{
    connected: boolean;
    message: string;
  }>({ connected: false, message: "Checking status..." });
  const router = useRouter();

  // Check the OAuth connection status
  useEffect(() => {
    async function checkConnectionStatus() {
      try {
        const response = await fetch('/api/google-auth/status');
        const data = await response.json();
        setOauthStatus(data);
      } catch (error) {
        console.error("Error checking OAuth status:", error);
        setOauthStatus({
          connected: false,
          message: "Error checking OAuth status"
        });
      }
    }

    checkConnectionStatus();
  }, []);

  // Start OAuth flow
  const startOAuthFlow = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/google-auth');
      const data = await response.json();
      
      if (data.authUrl) {
        // Redirect to Google's OAuth page
        window.location.href = data.authUrl;
      }
    } catch (error) {
      console.error("Error starting OAuth flow:", error);
      setLoading(false);
    }
  };

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">OAuth Management</h1>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Google Drive OAuth Status</CardTitle>
            <CardDescription>
              Check and manage the OAuth connection to Google Drive
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${oauthStatus.connected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="font-medium">
                  {oauthStatus.connected ? 'Connected' : 'Not Connected'}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">{oauthStatus.message}</p>
            </div>
            
            <Button
              onClick={startOAuthFlow}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {loading ? (
                <>
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-white"></span>
                  Connecting...
                </>
              ) : (
                'Connect to Google Drive'
              )}
            </Button>
          </CardContent>
        </Card>

        {oauthStatus.connected && (
          <Card>
            <CardHeader>
              <CardTitle>OAuth Token Management</CardTitle>
              <CardDescription>
                Manage your OAuth tokens
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Your application is successfully connected to Google Drive. 
                The OAuth tokens are stored in your environment variables.
              </p>
              
              <Button 
                variant="outline" 
                onClick={() => router.push('/api/google-auth/revoke')}
                className="bg-red-100 text-red-600 hover:bg-red-200 hover:text-red-700 border-red-200"
              >
                Revoke Tokens
              </Button>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>OAuth Setup Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal ml-5 space-y-2">
              <li>Click the "Connect to Google Drive" button above</li>
              <li>Sign in with your Google account and grant the requested permissions</li>
              <li>After authorization, you'll be redirected to a page showing the OAuth tokens</li>
              <li>Copy these tokens and add them to your .env file</li>
              <li>Restart your application for the changes to take effect</li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
