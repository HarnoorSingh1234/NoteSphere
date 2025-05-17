'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Check, CloudOff } from 'lucide-react';

interface GoogleDriveConnectProps {
  onConnected?: () => void;
}

/**
 * Simplified version of GoogleDriveConnect component
 * This component checks if OAuth tokens are available
 */
const GoogleDriveConnect = ({ onConnected }: GoogleDriveConnectProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);

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
        }
      } catch (err) {
        console.error('Error checking Google connection:', err);
      } finally {
        setLoading(false);
      }
    };

    checkGoogleConnection();
  }, [onConnected]);

  if (loading) {
    return (
      <Card className="border-[0.15em] border-[#264143] shadow-[0.3em_0.3em_0_#7BB4B1]">
        <CardHeader>
          <CardTitle className="text-xl">
            Cloud Storage
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

  return (
    <Card className="border-[0.15em] border-[#264143] shadow-[0.3em_0.3em_0_#7BB4B1]">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          {isConnected ? <Check className="w-5 h-5" /> : <CloudOff className="w-5 h-5" />}
          Cloud Storage {isConnected ? 'Ready' : 'Not Available'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-full ${isConnected ? 'bg-green-100' : 'bg-red-100'}`}>
              {isConnected ? (
                <Check className="w-4 h-4 text-green-600" />
              ) : (
                <CloudOff className="w-4 h-4 text-red-600" />
              )}
            </div>
            <div>
              {isConnected ? (
                <>
                  <p className="font-medium">File Storage Ready</p>
                  <p className="text-sm text-gray-500">Your files will be stored securely</p>
                </>
              ) : (
                <>
                  <p className="font-medium">Storage Not Available</p>
                  <p className="text-sm text-gray-500">Please check server configuration</p>
                </>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GoogleDriveConnect;