'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { CheckCircle, XCircle, RefreshCw, Filter } from 'lucide-react';

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
  };  // Filter feedback based on active tab
  const filteredFeedback = feedback.filter(item => {
    if (activeTab === "all") return true;
    if (activeTab === "read") return item.viewed;
    if (activeTab === "unread") return !item.viewed;
    return true;
  });

  return (
    <div className="container mx-auto p-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#264143] mb-2">User Feedback</h1>
        <p className="text-[#264143]/70">Manage and respond to user feedback submissions</p>
      </div>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
          <TabsList className="bg-[#EDDCD9]">
            <TabsTrigger 
              value="all" 
              className="data-[state=active]:bg-white data-[state=active]:text-[#264143] text-[#264143]/70"
            >
              All
            </TabsTrigger>
            <TabsTrigger 
              value="unread" 
              className="data-[state=active]:bg-white data-[state=active]:text-[#264143] text-[#264143]/70"
            >
              Unread
            </TabsTrigger>
            <TabsTrigger 
              value="read" 
              className="data-[state=active]:bg-white data-[state=active]:text-[#264143] text-[#264143]/70"
            >
              Read
            </TabsTrigger>
          </TabsList>
        </Tabs>
        
        <Button 
          onClick={fetchFeedback}
          variant="outline"
          className="flex items-center gap-2 border-[#264143] text-[#264143] hover:bg-[#264143]/10"
        >
          <RefreshCw size={16} />
          Refresh
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#DE5499]"></div>
        </div>
      ) : filteredFeedback.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredFeedback.map((item) => (
            <Card 
              key={item.id} 
              className={`border-[0.2em] border-[#264143] rounded-[0.6em] shadow-[0.2em_0.2em_0_${item.viewed ? '#4CAF50' : '#E99F4C'}] hover:translate-y-[-0.1em] hover:shadow-[0.3em_0.3em_0_${item.viewed ? '#4CAF50' : '#E99F4C'}] transition-all duration-200`}
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-[#264143] font-bold">
                      {item.author ? `${item.author.firstName} ${item.author.lastName}` : 'Anonymous User'}
                    </CardTitle>
                    <p className="text-sm text-[#264143]/70">
                      {item.author?.email ? item.author.email : 'No email provided'}
                    </p>
                  </div>
                  <Badge className={item.viewed ? 'bg-[#4CAF50]/20 text-[#4CAF50] hover:bg-[#4CAF50]/30' : 'bg-[#E99F4C]/20 text-[#E99F4C] hover:bg-[#E99F4C]/30'}>
                    {item.viewed ? 'Viewed' : 'New'}
                  </Badge>
                </div>
                <p className="text-xs text-[#264143]/60 mt-1">
                  Submitted {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                </p>
              </CardHeader>
              <CardContent>
                <div className="bg-[#EDDCD9]/30 p-3 rounded-md mb-4 max-h-32 overflow-y-auto">
                  <p className="whitespace-pre-wrap text-[#264143]">{item.content}</p>
                </div>
                <div className="flex justify-end">
                  <Button
                    onClick={() => toggleViewedStatus(item.id, item.viewed)}
                    className={`flex items-center gap-1.5 ${item.viewed ? 'bg-white text-[#264143] border border-[#264143] hover:bg-[#EDDCD9]/50' : 'bg-[#264143] text-white hover:bg-[#264143]/90'}`}
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
          ))}
        </div>
      ) : (
        <div className="text-center p-12 bg-[#EDDCD9]/20 rounded-lg border-2 border-dashed border-[#EDDCD9]">
          <h3 className="text-xl font-medium text-[#264143] mb-2">
            {activeTab === "all" ? "No feedback yet" : (activeTab === "read" ? "No read feedback" : "No unread feedback")}
          </h3>
          <p className="text-[#264143]/70">
            {activeTab === "all" 
              ? "When users submit feedback, it will appear here." 
              : `Switch to a different tab to view ${activeTab === "read" ? "unread" : "read"} feedback.`
            }
          </p>
        </div>
      )}
    </div>
  );
}
