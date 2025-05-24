'use client';

import React, { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { Send, Check } from 'lucide-react';

export default function FeedbackPage() {
  const { user, isLoaded } = useUser();
  const [feedbackContent, setFeedbackContent] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackContent.trim()) {
      setError('Please enter your feedback');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Determine if we should send the user's clerkId
      const clerkId = isAnonymous ? null : user?.id;

      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: feedbackContent,
          authorClerkId: clerkId,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Something went wrong');
      }

      setSubmitted(true);
      setFeedbackContent('');
      
      // Reset the success state after a few seconds
      setTimeout(() => {
        setSubmitted(false);
      }, 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit feedback');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F8F5F2] to-[#F0EBE8] py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-[#264143] mb-6">
              We Value Your <span className="text-[#DE5499]">Feedback</span>
            </h1>
            <p className="text-lg text-[#264143]/70">
              Help us improve NoteSphere by sharing your thoughts, suggestions, or reporting issues.
            </p>
          </div>
          
          {/* Feedback Form */}
          <div className="bg-white border-[0.15em] border-[#264143] rounded-[0.6em] shadow-[0.3em_0.3em_0_#4d61ff] p-6 md:p-8">
            {submitted ? (
              <div className="text-center py-10">
                <div className="w-16 h-16 bg-[#4CAF50]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-[#4CAF50]" />
                </div>
                <h3 className="text-2xl font-bold text-[#264143] mb-2">Thank You!</h3>
                <p className="text-[#264143]/70">
                  Your feedback has been submitted successfully. We appreciate your input!
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="mb-6 text-black">
                  <label htmlFor="feedback" className="block text-[#264143] font-medium mb-2">
                    Your Feedback
                  </label>
                  <textarea
                    id="feedback"
                    value={feedbackContent}
                    onChange={(e) => setFeedbackContent(e.target.value)}
                    placeholder="Share your thoughts, suggestions, or report an issue..."
                    className="w-full p-4 border-[0.15em] text-black border-[#264143] rounded-[0.4em] min-h-[200px] focus:outline-none focus:ring-2 focus:ring-[#DE5499]"
                    disabled={isSubmitting}
                  />
                </div>
                
                {isLoaded && user && (
                  <div className="mb-6">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={isAnonymous}
                        onChange={() => setIsAnonymous(!isAnonymous)}
                        className="w-5 h-5 rounded text-black border-[#264143]"
                      />
                      <span className="ml-2 text-[#264143]">
                        Submit anonymously (your name will not be attached)
                      </span>
                    </label>
                  </div>
                )}
                
                {error && (
                  <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded">
                    <p className="text-red-800">{error}</p>
                  </div>
                )}
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-[#DE5499] text-white font-medium rounded-[0.4em] border-[0.15em] border-[#264143] shadow-[0.2em_0.2em_0_#264143] hover:translate-y-[-0.1em] hover:shadow-[0.3em_0.3em_0_#264143] transition-all flex items-center justify-center w-full"
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting...
                    </span>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Submit Feedback
                    </>
                  )}
                </button>
                
                <p className="mt-4 text-sm text-[#264143]/60 text-center">
                  {user 
                    ? isAnonymous 
                      ? "Your feedback will be submitted anonymously." 
                      : "Your feedback will include your name and email." 
                    : "You're submitting anonymously as you're not signed in."}
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}