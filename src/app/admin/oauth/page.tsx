'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { KeyRound, CheckCircle, XCircle, ArrowRight, Lock, Shield, RefreshCw } from "lucide-react";

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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 25 }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9F5F2] to-[#EDDCD9]/30 pt-8 md:pt-10 pb-12 md:pb-16 px-4 md:px-6 relative">
      {/* Background patterns */}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(235,225,220,0.4)_1px,transparent_1px),linear-gradient(rgba(235,225,220,0.4)_1px,transparent_1px)] bg-[length:18px_18px] md:bg-[length:24px_24px] pointer-events-none"></div>
      
      {/* Decorative blobs */}
      <div className="absolute top-[10%] right-[5%] w-[15vw] max-w-[8rem] aspect-square bg-[#DE5499]/10 rounded-full blur-xl pointer-events-none"></div>
      <div className="absolute bottom-[20%] left-[8%] w-[18vw] max-w-[10rem] aspect-square bg-[#7BB4B1]/10 rounded-full blur-xl pointer-events-none"></div>
      
      <div className="container mx-auto max-w-4xl relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-3">
            <div className="flex items-center justify-center w-14 h-14 bg-[#7BB4B1]/20 border-[0.2em] border-[#264143] rounded-[0.5em] shadow-[0.2em_0.2em_0_#E99F4C] transition-all duration-200 hover:rotate-[-5deg] hover:scale-105">
              <KeyRound className="w-7 h-7 text-[#264143]" />
            </div>
            <h1 className="text-3xl font-bold text-[#264143]">OAuth Management</h1>
          </div>
          <p className="text-[#264143]/70 text-lg ml-1">Connect and manage your Google Drive OAuth credentials</p>
        </motion.div>
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-6"
        >
          {/* OAuth Status Card */}
          <motion.div variants={itemVariants}>
            <Card className="border-[0.25em] border-[#264143] rounded-[0.6em] shadow-[0.3em_0.3em_0_#7BB4B1] overflow-hidden relative">
              {/* Corner slice */}
              <div className="absolute bottom-0 left-0 w-[1.5em] h-[1.5em] bg-white border-r-[0.25em] border-t-[0.25em] border-[#264143] rounded-tr-[0.5em] z-10"></div>
              
              {/* Decorative element */}
              <div className="absolute top-0 right-0 w-16 h-16 bg-[#EDDCD9] transform rotate-45 translate-x-8 -translate-y-8"></div>
              
              <CardHeader className="border-b-[0.15em] border-[#264143]/20 bg-[#F9F5F2]/30">
                <CardTitle className="text-[#264143] text-xl flex items-center gap-2">
                  <Shield className="w-5 h-5 text-[#7BB4B1]" />
                  Google Drive OAuth Status
                </CardTitle>
                <CardDescription className="text-[#264143]/70">
                  Check and manage the OAuth connection to Google Drive
                </CardDescription>
              </CardHeader>
              
              <CardContent className="pt-6 pb-6">
                <div className="bg-[#EDDCD9]/30 p-5 rounded-[0.4em] border-[0.15em] border-[#264143]/20 mb-6">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-[0.3em] border-[0.15em] flex items-center justify-center ${
                      oauthStatus.connected 
                        ? 'border-[#7BB4B1] bg-[#7BB4B1]/10' 
                        : 'border-[#DE5499] bg-[#DE5499]/10'
                    }`}>
                      {oauthStatus.connected ? (
                        <CheckCircle className="w-5 h-5 text-[#7BB4B1]" />
                      ) : (
                        <XCircle className="w-5 h-5 text-[#DE5499]" />
                      )}
                    </div>
                    <div>
                      <div className="font-bold text-[#264143]">
                        {oauthStatus.connected ? 'Connected' : 'Not Connected'}
                      </div>
                      <p className="text-sm text-[#264143]/70">{oauthStatus.message}</p>
                    </div>
                  </div>
                </div>
                
                <Button
                  onClick={startOAuthFlow}
                  disabled={loading}
                  className={`bg-[#7BB4B1] text-white border-[0.2em] border-[#264143] rounded-[0.4em] shadow-[0.2em_0.2em_0_#E99F4C] hover:translate-y-[-0.1em] hover:shadow-[0.3em_0.3em_0_#E99F4C] active:translate-y-[0.05em] active:shadow-[0.1em_0.1em_0_#E99F4C] transition-all duration-200 px-6 py-6 h-auto font-bold ${
                    loading ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {loading ? (
                    <>
                      <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <Lock className="mr-2 h-5 w-5" />
                      Connect to Google Drive
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Token Management Card */}
          {oauthStatus.connected && (
            <motion.div variants={itemVariants}>
              <Card className="border-[0.25em] border-[#264143] rounded-[0.6em] shadow-[0.3em_0.3em_0_#DE5499] overflow-hidden relative">
                {/* Corner slice */}
                <div className="absolute bottom-0 left-0 w-[1.5em] h-[1.5em] bg-white border-r-[0.25em] border-t-[0.25em] border-[#264143] rounded-tr-[0.5em] z-10"></div>
                
                <CardHeader className="border-b-[0.15em] border-[#264143]/20 bg-[#F9F5F2]/30">
                  <CardTitle className="text-[#264143] text-xl flex items-center gap-2">
                    <KeyRound className="w-5 h-5 text-[#DE5499]" />
                    OAuth Token Management
                  </CardTitle>
                  <CardDescription className="text-[#264143]/70">
                    Manage your OAuth tokens
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="pt-6 pb-6">
                  <div className="bg-[#7BB4B1]/10 p-5 rounded-[0.4em] border-[0.15em] border-[#7BB4B1]/30 mb-6">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-[#7BB4B1] mt-1" />
                      <p className="text-[#264143]">
                        Your application is successfully connected to Google Drive. 
                        The OAuth tokens are stored in your environment variables.
                      </p>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={() => router.push('/api/google-auth/revoke')}
                    className="bg-white text-[#DE5499] border-[0.2em] border-[#DE5499] rounded-[0.4em] shadow-[0.2em_0.2em_0_#264143] hover:translate-y-[-0.1em] hover:shadow-[0.3em_0.3em_0_#264143] active:translate-y-[0.05em] active:shadow-[0.1em_0.1em_0_#264143] transition-all duration-200 font-bold"
                  >
                    Revoke Tokens
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Setup Instructions Card */}
          <motion.div variants={itemVariants}>
            <Card className="border-[0.25em] border-[#264143] rounded-[0.6em] shadow-[0.3em_0.3em_0_#E99F4C] overflow-hidden relative">
              {/* Corner slice */}
              <div className="absolute bottom-0 left-0 w-[1.5em] h-[1.5em] bg-white border-r-[0.25em] border-t-[0.25em] border-[#264143] rounded-tr-[0.5em] z-10"></div>
              
              <CardHeader className="border-b-[0.15em] border-[#264143]/20 bg-[#F9F5F2]/30">
                <CardTitle className="text-[#264143] text-xl">
                  OAuth Setup Instructions
                </CardTitle>
              </CardHeader>
              
              <CardContent className="pt-6 pb-6">                <ol className="space-y-3">
                  {[
                    "Click the \"Connect to Google Drive\" button above",
                    "Sign in with your Google account and grant the requested permissions",
                    "After authorization, you'll be redirected to a page showing the OAuth tokens",
                    "Copy these tokens and add them to your .env file",
                    "Restart your application for the changes to take effect"
                  ].map((step, index) => (
                    <li key={index} className="flex gap-3 items-start">
                      <div className="w-7 h-7 rounded-full bg-[#EDDCD9] border-[0.15em] border-[#264143] flex items-center justify-center text-[#264143] font-bold flex-shrink-0">
                        {index + 1}
                      </div>
                      <span className="text-[#264143]">{step}</span>
                    </li>
                  ))}
                </ol>
                
                {/* Additional setup help section */}
                <div className="mt-6 p-5 bg-[#EDDCD9]/30 rounded-[0.4em] border-[0.15em] border-[#264143]/20">
                  <h4 className="font-bold text-[#264143] mb-2 flex items-center">
                    <ArrowRight className="w-4 h-4 mr-2 text-[#E99F4C]" />
                    Need help setting up Google OAuth?
                  </h4>
                  <p className="text-[#264143]/80 text-sm">
                    Refer to the Google OAuth setup documentation for detailed instructions on creating OAuth credentials in the Google Cloud Console.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}