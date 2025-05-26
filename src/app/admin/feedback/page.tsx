'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/use-toast';
import { formatTimeAgo } from '@/components/admin/utils';
import { CheckCircle, XCircle, RefreshCw, Filter, MessageSquare, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type Feedback = {
  id: string;
  content: string;
  createdAt: string;
  viewed: boolean;
  author?: {
    firstName: string;
    lastName: string;
    email: string;
  } | null;
};

export default function FeedbackManagement() {
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  const fetchFeedback = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/feedback', {
        method: 'GET',
      });
      
      const data = await response.json();
      
      if (data.success) {
        setFeedback(data.feedback);
      } else {
        toast({
          title: 'Error',
          description: data.message || 'Failed to fetch feedback',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error fetching feedback:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedback();
  }, []);

  const toggleViewedStatus = async (feedbackId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/feedback/${feedbackId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ viewed: !currentStatus }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Update the local state to reflect the change
        setFeedback(prevFeedback => 
          prevFeedback.map(item => 
            item.id === feedbackId ? { ...item, viewed: !currentStatus } : item
          )
        );
        
        toast({
          title: 'Success',
          description: data.message,
        });
      } else {
        toast({
          title: 'Error',
          description: data.message || 'Failed to update status',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error toggling feedback status:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
    }
  };

  // Filter feedback based on active tab
  const filteredFeedback = feedback.filter(item => {
    if (activeTab === "all") return true;
    if (activeTab === "read") return item.viewed;
    if (activeTab === "unread") return !item.viewed;
    return true;
  });
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.06
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 20 }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9F5F2] to-[#EDDCD9]/30 pt-8 md:pt-10 pb-12 md:pb-16 px-4 md:px-6 relative">
      {/* Background patterns */}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(235,225,220,0.4)_1px,transparent_1px),linear-gradient(rgba(235,225,220,0.4)_1px,transparent_1px)] bg-[length:18px_18px] md:bg-[length:24px_24px] pointer-events-none"></div>
      
      {/* Decorative blobs */}
      <div className="absolute top-[10%] right-[5%] w-[15vw] max-w-[8rem] aspect-square bg-[#DE5499]/10 rounded-full blur-xl pointer-events-none"></div>
      <div className="absolute bottom-[20%] left-[8%] w-[18vw] max-w-[10rem] aspect-square bg-[#7BB4B1]/10 rounded-full blur-xl pointer-events-none"></div>
      
      <div className="container mx-auto max-w-6xl relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-3">
            <div className="flex items-center justify-center w-14 h-14 bg-[#7BB4B1]/20 border-[0.2em] border-[#264143] rounded-[0.5em] shadow-[0.2em_0.2em_0_#E99F4C] transition-all duration-200 hover:rotate-[-5deg] hover:scale-105">
              <MessageSquare className="w-7 h-7 text-[#264143]" />
            </div>
            <h1 className="text-3xl font-bold text-[#264143]">User Feedback</h1>
          </div>
          <p className="text-[#264143]/70 text-lg ml-1">Manage and respond to user feedback submissions</p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="p-6 bg-white border-[0.25em] border-[#264143] rounded-[0.6em] shadow-[0.3em_0.3em_0_#7BB4B1] mb-8 relative"
        >
          {/* Corner slice */}
          <div className="absolute bottom-0 left-0 w-[1.2em] h-[1.2em] bg-white border-r-[0.25em] border-t-[0.25em] border-[#264143] rounded-tr-[0.5em] z-10"></div>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
              <TabsList className="bg-[#EDDCD9] border-[0.15em] border-[#264143] p-1 rounded-[0.4em]">
                <TabsTrigger 
                  value="all" 
                  className="rounded-[0.3em] data-[state=active]:bg-white data-[state=active]:text-[#264143] data-[state=active]:border-[0.15em] data-[state=active]:border-[#264143] data-[state=active]:shadow-[0.1em_0.1em_0_#E99F4C] text-[#264143]/70 px-6"
                >
                  All
                </TabsTrigger>
                <TabsTrigger 
                  value="unread" 
                  className="rounded-[0.3em] data-[state=active]:bg-white data-[state=active]:text-[#264143] data-[state=active]:border-[0.15em] data-[state=active]:border-[#264143] data-[state=active]:shadow-[0.1em_0.1em_0_#E99F4C] text-[#264143]/70 px-6"
                >
                  Unread
                </TabsTrigger>
                <TabsTrigger 
                  value="read" 
                  className="rounded-[0.3em] data-[state=active]:bg-white data-[state=active]:text-[#264143] data-[state=active]:border-[0.15em] data-[state=active]:border-[#264143] data-[state=active]:shadow-[0.1em_0.1em_0_#E99F4C] text-[#264143]/70 px-6"
                >
                  Read
                </TabsTrigger>
              </TabsList>
            </Tabs>
            
            <Button 
              onClick={fetchFeedback}
              className="bg-white border-[0.2em] border-[#264143] rounded-[0.4em] shadow-[0.2em_0.2em_0_#DE5499] text-[#264143] hover:translate-y-[-0.1em] hover:shadow-[0.25em_0.25em_0_#DE5499] transition-all duration-200 px-6"
            >
              <RefreshCw size={16} className="mr-2" />
              Refresh
            </Button>
          </div>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-16 h-16 border-[0.25em] border-t-[#7BB4B1] border-r-[#EDDCD9] border-b-[#E99F4C] border-l-[#DE5499] rounded-full animate-spin"></div>
          </div>
        ) : filteredFeedback.length > 0 ? (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {filteredFeedback.map((item) => (
              <motion.div
                key={item.id}
                variants={itemVariants}
              >
                <Card 
                  className={`border-[0.25em] border-[#264143] rounded-[0.6em] ${
                    item.viewed ? 'shadow-[0.3em_0.3em_0_#7BB4B1]' : 'shadow-[0.3em_0.3em_0_#E99F4C]'
                  } hover:translate-y-[-0.2em] hover:shadow-[0.4em_0.4em_0_${
                    item.viewed ? '#7BB4B1' : '#E99F4C'
                  }] transition-all duration-300 relative overflow-hidden`}
                >
                  {/* Corner slice */}
                  <div className="absolute bottom-0 left-0 w-[1em] h-[1em] bg-white border-r-[0.25em] border-t-[0.25em] border-[#264143] rounded-tr-[0.4em] z-10"></div>
                  
                  {/* Decorative element */}
                  <div className="absolute top-0 right-0 w-12 h-12 bg-[#EDDCD9] transform rotate-45 translate-x-6 -translate-y-6"></div>

                  <CardHeader className="pb-2 relative z-[1]">
                    <div className="flex justify-between items-start">
                      <div className="flex items-start gap-3">
                        <div className="flex items-center justify-center w-10 h-10 bg-[#EDDCD9] border-[0.15em] border-[#264143] rounded-full shadow-[0.1em_0.1em_0_#E99F4C] flex-shrink-0">
                          <User className="w-5 h-5 text-[#264143]" />
                        </div>
                        <div>
                          <CardTitle className="text-[#264143] font-bold">
                            {item.author ? `${item.author.firstName} ${item.author.lastName}` : 'Anonymous User'}
                          </CardTitle>
                          <p className="text-sm text-[#264143]/70 mt-0.5">
                            {item.author?.email ? item.author.email : 'No email provided'}
                          </p>
                        </div>
                      </div>
                      
                      <Badge className={`${
                        item.viewed 
                          ? 'bg-[#7BB4B1]/20 text-[#7BB4B1] border-[0.1em] border-[#7BB4B1] hover:bg-[#7BB4B1]/30' 
                          : 'bg-[#E99F4C]/20 text-[#E99F4C] border-[0.1em] border-[#E99F4C] hover:bg-[#E99F4C]/30'
                      } font-medium px-3 py-1 rounded-full`}>
                        {item.viewed ? 'Viewed' : 'New'}
                      </Badge>
                    </div>
                    <p className="text-xs text-[#264143]/60 mt-2 ml-[3.25rem]">
                      Submitted {formatTimeAgo(item.createdAt)}
                    </p>
                  </CardHeader>
                  <CardContent className="relative z-[1]">
                    <div className="bg-[#EDDCD9]/30 p-4 rounded-[0.3em] border-[0.1em] border-[#264143]/20 mb-4 max-h-32 overflow-y-auto">
                      <p className="whitespace-pre-wrap text-[#264143]">{item.content}</p>
                    </div>
                    <div className="flex justify-end">
                      <Button
                        onClick={() => toggleViewedStatus(item.id, item.viewed)}
                        className={`flex items-center gap-1.5 transition-all duration-200 ${
                          item.viewed 
                            ? 'bg-white border-[0.15em] border-[#264143] shadow-[0.1em_0.1em_0_#7BB4B1] text-[#264143] hover:shadow-[0.2em_0.2em_0_#7BB4B1] hover:translate-y-[-0.1em]' 
                            : 'bg-[#264143] text-white border-[0.15em] border-[#264143] shadow-[0.1em_0.1em_0_#E99F4C] hover:shadow-[0.2em_0.2em_0_#E99F4C] hover:translate-y-[-0.1em]'
                        }`}
                        size="sm"
                      >
                        {item.viewed ? (
                          <>
                            <XCircle size={14} />
                            Mark as unread
                          </>
                        ) : (
                          <>
                            <CheckCircle size={14} />
                            Mark as read
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative"
          >
            <div className="p-10 bg-white border-[0.25em] border-dashed border-[#264143] rounded-[0.6em] shadow-[0.3em_0.3em_0_#DE5499] relative overflow-hidden">
              {/* Corner slice */}
              <div className="absolute bottom-0 left-0 w-[1.5em] h-[1.5em] bg-white border-r-[0.25em] border-t-[0.25em] border-dashed border-[#264143] rounded-tr-[0.5em] z-10"></div>
              
              {/* Pattern background */}
              <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(235,225,220,0.4)_25%,transparent_25%,transparent_50%,rgba(235,225,220,0.4)_50%,rgba(235,225,220,0.4)_75%,transparent_75%,transparent)] bg-[length:1rem_1rem] pointer-events-none opacity-30"></div>
              
              <div className="text-center relative z-[1]">
                <div className="w-20 h-20 mx-auto flex items-center justify-center bg-[#EDDCD9] border-[0.2em] border-[#264143] rounded-[0.4em] shadow-[0.2em_0.2em_0_#E99F4C] mb-4 transform rotate-[-5deg] hover:rotate-[5deg] transition-all duration-300">
                  <MessageSquare className="w-10 h-10 text-[#264143]" />
                </div>
                <h3 className="text-2xl font-bold text-[#264143] mb-2">
                  {activeTab === "all" ? "No feedback yet" : (activeTab === "read" ? "No read feedback" : "No unread feedback")}
                </h3>
                <p className="text-[#264143]/70 max-w-lg mx-auto">
                  {activeTab === "all" 
                    ? "When users submit feedback, it will appear here. Check back soon or encourage users to share their thoughts!" 
                    : `Switch to a different tab to view ${activeTab === "read" ? "unread" : "read"} feedback.`
                  }
                </p>
                
                {activeTab !== "all" && (
                  <button
                    onClick={() => setActiveTab("all")}
                    className="mt-6 px-5 py-2.5 bg-[#7BB4B1] text-white border-[0.2em] border-[#264143] rounded-[0.4em] shadow-[0.2em_0.2em_0_#E99F4C] font-bold hover:translate-y-[-0.1em] hover:shadow-[0.25em_0.25em_0_#E99F4C] transition-all duration-200"
                  >
                    Show All Feedback
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}