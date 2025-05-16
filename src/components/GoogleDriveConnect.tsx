'use client';

import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { Shield, Check, AlertCircle } from 'lucide-react';

interface GoogleDriveConnectProps {
  onConnected?: () => void;
}

const GoogleDriveConnect = ({ onConnected }: GoogleDriveConnectProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [authUrl, setAuthUrl] = useState<string | null>(null);

  // Check connection status on component mount
  useEffect(() => {
    const checkGoogleConnection = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/google-auth/status');
        const data = await response.json();

        if (data.connected) {
          setIsConnected(true);
          onConnected?.();
        } else if (data.authUrl) {
          setAuthUrl(data.authUrl);
        }
      } catch (err) {
        console.error('Error checking Google connection:', err);
        setError('Unable to check Google Drive connection status');
      } finally {
        setLoading(false);
      }
    };

    checkGoogleConnection();
  }, [onConnected]);

  // Handle connect button click
  const handleConnect = () => {
    if (authUrl) {
      window.location.href = authUrl;
    } else {
      // If we don't have an authUrl yet, fetch it
      getAuthUrl();
    }
  };

  // Fetch auth URL if not already available
  const getAuthUrl = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/google-auth');
      const data = await response.json();

      if (data.authUrl) {
        setAuthUrl(data.authUrl);
        window.location.href = data.authUrl;
      } else {
        throw new Error('No auth URL returned');
      }
    } catch (err) {
      console.error('Error getting auth URL:', err);
      setError('Failed to generate Google authentication URL');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="border-[0.15em] border-[#264143] shadow-[0.3em_0.3em_0_#7BB4B1]">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Google Drive Connection
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-6">
            <div className="w-8 h-8 border-4 border-[#7BB4B1] border-t-transparent rounded-full animate-spin"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isConnected) {
    return (
      <Card className="border-[0.15em] border-[#264143] shadow-[0.3em_0.3em_0_#7BB4B1]">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Google Drive Connection
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-full bg-green-100">
                <Check className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="font-medium">Connected to Google Drive</p>
                <p className="text-sm text-gray-500">Your files will be stored securely</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-[0.15em] border-[#264143] shadow-[0.3em_0.3em_0_#7BB4B1]">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Connect to Google Drive
        </CardTitle>
        <CardDescription>Store your files securely in Google Drive</CardDescription>
      </CardHeader>
      <Separator />
      <CardContent className="pt-6">
        <div className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 rounded-lg border border-red-200 flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <div className="space-y-2">
            <h3 className="font-medium">Why connect?</h3>
            <ul className="space-y-1 ml-5 list-disc text-sm text-gray-600">
              <li>Securely store your academic files</li>
              <li>Access your notes from any device</li>
              <li>Share notes with classmates</li>
              <li>Maintain ownership of your files</li>
            </ul>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleConnect} 
          className="w-full bg-[#4285F4] hover:bg-[#3367d6] text-white"
        >
          Connect to Google Drive
        </Button>
      </CardFooter>
    </Card>
  );
};

export default GoogleDriveConnect;
