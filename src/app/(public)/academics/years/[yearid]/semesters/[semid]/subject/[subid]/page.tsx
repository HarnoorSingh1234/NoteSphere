'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Book, 
  FileText, 
  Download, 
  ArrowLeft, 
  Upload, 
  ThumbsUp,
  MessageCircle,
  Clock,
  Tag,
  User,
  Eye,
  FileSymlink
} from 'lucide-react';
import GoogleDriveConnect from '@/components/GoogleDriveConnect';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { uploadFileToDrive } from '@/lib/uploadtoDrive';
import { NoteType } from '@prisma/client';

interface Note {
  id: string;
  title: string;
  content: string;
  type: NoteType;
  fileUrl: string;
  isPublic: boolean;
  downloadCount: number;
  createdAt: string;
  updatedAt: string;
  authorClerkId: string;
  subjectId: string;
  likes: {
    userId: string;
  }[];
  comments: {
    id: string;
  }[];
  author: {
    firstName: string;
    lastName: string;
  };
}

interface Subject {
  id: string;
  name: string;
  code: string;
  semesterId: string;
  notes: Note[];
}

function SubjectIDPage() {
  const params = useParams();
  const router = useRouter();
  const [subject, setSubject] = useState<Subject | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [googleAuthUrl, setGoogleAuthUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteType, setNoteType] = useState<NoteType>(NoteType.PDF);
  
  // Get year and semester info from params
  const { yearid, semid, subid } = params;
  
  // Fetch subject and its notes
  useEffect(() => {
    const fetchSubject = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/subjects/${subid}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch subject: ${response.statusText}`);
        }
        
        const data = await response.json();
        setSubject(data.subject);
      } catch (err) {
        console.error('Error fetching subject:', err);
        setError(err instanceof Error ? err.message : 'Failed to load subject');
      } finally {
        setLoading(false);
      }
    };
    
    if (subid) {
      fetchSubject();
    }
  }, [subid]);
  
  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };
  
  // Handle upload button click
  const handleUploadClick = async () => {
    if (!selectedFile || !noteTitle) {
      return;
    }
    
    try {
      setUploadingFile(true);
      setUploadProgress(10);
      
      // Step 1: Request upload URL from our backend
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: selectedFile.name,
          mimeType: selectedFile.type
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        if (data.needsAuth && data.authUrl) {
          // Store the Google Auth URL for the user to connect their account
          setGoogleAuthUrl(data.authUrl);
          setUploadingFile(false);
          return;
        }
        throw new Error(data.error || 'Failed to initialize upload');
      }
      
      setUploadProgress(30);
      
      // Step 2: Upload file using the URL
      const { uploadUrl } = data;
      const uploadSuccess = await uploadFileToDrive(selectedFile, uploadUrl);
      
      if (!uploadSuccess) {
        throw new Error('File upload to Google Drive failed');
      }
      
      setUploadProgress(70);
      
      // Step 3: Create note record in our database
      const noteResponse = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: noteTitle,
          content: '',
          type: noteType,
          fileUrl: uploadUrl, // We store the file URL
          subjectId: subid,
          isPublic: true
        })
      });
      
      if (!noteResponse.ok) {
        throw new Error('Failed to create note record');
      }
      
      setUploadProgress(100);
      
      // Refresh the page to show the new note
      setTimeout(() => {
        router.refresh();
        setSelectedFile(null);
        setNoteTitle('');
        setUploadingFile(false);
      }, 1000);
      
    } catch (err) {
      console.error('Upload error:', err);
      setError(err instanceof Error ? err.message : 'Upload failed');
      setUploadingFile(false);
    }
  };
  
  // Connect to Google account when user clicks the connect button
  const connectGoogleAccount = () => {
    if (googleAuthUrl) {
      window.location.href = googleAuthUrl;
    }
  };
  
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-[#DE5499] border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-lg text-gray-600">Loading subject details...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="p-8 bg-red-100 rounded-lg border border-red-300">
          <h2 className="text-2xl font-bold text-red-700 mb-2">Error</h2>
          <p className="text-red-600">{error}</p>
          <Button 
            onClick={() => router.back()}
            className="mt-4 bg-red-600 hover:bg-red-700"
          >
            <ArrowLeft className="mr-2 w-4 h-4" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }
  
  if (!subject) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="p-8 bg-yellow-100 rounded-lg border border-yellow-300">
          <h2 className="text-2xl font-bold text-yellow-700 mb-2">Subject Not Found</h2>
          <p className="text-yellow-600">We couldn't find the subject you're looking for.</p>
          <Button 
            onClick={() => router.back()}
            className="mt-4 bg-yellow-600 hover:bg-yellow-700"
          >
            <ArrowLeft className="mr-2 w-4 h-4" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9F5F2] to-[#EDDCD9]/30 py-8 px-4 relative">
      {/* Background patterns and decorations */}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(235,225,220,0.4)_1px,transparent_1px),linear-gradient(rgba(235,225,220,0.4)_1px,transparent_1px)] bg-[length:24px_24px] pointer-events-none"></div>
      <div className="absolute top-[10%] right-[5%] w-[8rem] aspect-square bg-[#DE5499]/10 rounded-full blur-xl pointer-events-none"></div>
      <div className="absolute bottom-[15%] left-[10%] w-[12rem] aspect-square bg-[#7BB4B1]/10 rounded-full blur-xl pointer-events-none"></div>
      
      <div className="container mx-auto relative z-10 max-w-6xl">
        {/* Breadcrumb navigation */}
        <div className="flex items-center mb-6">
          <Link 
            href={`/academics/years/${yearid}/semester/${semid}/subject`}
            className="flex items-center text-[#264143] hover:text-[#DE5499] transition-colors"
          >
            <ArrowLeft className="mr-2 w-4 h-4" />
            <span>Back to Subjects</span>
          </Link>
        </div>
        
        {/* Subject header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center justify-center w-12 h-12 bg-white border-[0.15em] border-[#264143] rounded-full shadow-[0.2em_0.2em_0_#DE5499]">
              <Book className="w-6 h-6 text-[#264143]" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#264143]">{subject.name}</h1>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-[#DE5499] border-[#DE5499]">
                  {subject.code}
                </Badge>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Notes listing (2/3 of the grid) */}
          <div className="lg:col-span-2">
            <Card className="border-[0.15em] border-[#264143] shadow-[0.3em_0.3em_0_#E99F4C]">
              <CardHeader>
                <CardTitle className="text-2xl">Study Materials</CardTitle>
                <CardDescription>Notes, lectures, and resources for {subject.name}</CardDescription>
              </CardHeader>
              <Separator />
              <CardContent className="pt-6">
                <Tabs defaultValue="all" className="w-full">
                  <TabsList className="grid grid-cols-4 mb-6">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="pdf">PDF</TabsTrigger>
                    <TabsTrigger value="lecture">Lecture</TabsTrigger>
                    <TabsTrigger value="handwritten">Handwritten</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="all" className="space-y-4">
                    {subject.notes && subject.notes.length > 0 ? (
                      subject.notes.map((note) => (
                        <NoteCard key={note.id} note={note} />
                      ))
                    ) : (
                      <div className="text-center py-12 border border-dashed border-gray-300 rounded-lg">
                        <FileText className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                        <h3 className="text-lg font-medium text-gray-600">No notes available yet</h3>
                        <p className="text-gray-500">Be the first to upload study materials for this subject!</p>
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="pdf" className="space-y-4">
                    {subject.notes && subject.notes.filter(note => note.type === 'PDF').length > 0 ? (
                      subject.notes
                        .filter(note => note.type === 'PDF')
                        .map((note) => (
                          <NoteCard key={note.id} note={note} />
                        ))
                    ) : (
                      <div className="text-center py-12 border border-dashed border-gray-300 rounded-lg">
                        <FileText className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                        <h3 className="text-lg font-medium text-gray-600">No PDF notes available</h3>
                        <p className="text-gray-500">Upload PDF notes to help your peers!</p>
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="lecture" className="space-y-4">
                    {subject.notes && subject.notes.filter(note => note.type === 'LECTURE').length > 0 ? (
                      subject.notes
                        .filter(note => note.type === 'LECTURE')
                        .map((note) => (
                          <NoteCard key={note.id} note={note} />
                        ))
                    ) : (
                      <div className="text-center py-12 border border-dashed border-gray-300 rounded-lg">
                        <FileText className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                        <h3 className="text-lg font-medium text-gray-600">No lecture notes available</h3>
                        <p className="text-gray-500">Share your lecture notes with the community!</p>
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="handwritten" className="space-y-4">
                    {subject.notes && subject.notes.filter(note => note.type === 'HANDWRITTEN').length > 0 ? (
                      subject.notes
                        .filter(note => note.type === 'HANDWRITTEN')
                        .map((note) => (
                          <NoteCard key={note.id} note={note} />
                        ))
                    ) : (
                      <div className="text-center py-12 border border-dashed border-gray-300 rounded-lg">
                        <FileText className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                        <h3 className="text-lg font-medium text-gray-600">No handwritten notes available</h3>
                        <p className="text-gray-500">Upload your handwritten notes to help others!</p>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
            {/* Upload section (1/3 of the grid) */}
          <div className="space-y-6">
            {/* Google Drive connection status */}
            <GoogleDriveConnect onConnected={() => setGoogleAuthUrl(null)} />
            
            {/* Upload notes form */}
            <Card className="border-[0.15em] border-[#264143] shadow-[0.3em_0.3em_0_#7BB4B1]">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  Upload Notes
                </CardTitle>
                <CardDescription>Share your notes with others</CardDescription>
              </CardHeader>
              <Separator />
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Title</label>
                    <input
                      type="text"
                      value={noteTitle}
                      onChange={(e) => setNoteTitle(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#DE5499]"
                      placeholder="Enter note title"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Note Type</label>
                    <select
                      value={noteType}
                      onChange={(e) => setNoteType(e.target.value as NoteType)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#DE5499]"
                    >
                      <option value="PDF">PDF</option>
                      <option value="LECTURE">Lecture Notes</option>
                      <option value="HANDWRITTEN">Handwritten Notes</option>
                      <option value="PPT">Presentation</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2 relative">
                    <label className="text-sm font-medium text-gray-700">File</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center relative">
                      {selectedFile ? (
                        <div>
                          <FileText className="w-8 h-8 mx-auto text-[#DE5499] mb-2" />
                          <p className="text-gray-700 font-medium">{selectedFile.name}</p>
                          <p className="text-gray-500 text-sm">
                            {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                          </p>
                        </div>
                      ) : (
                        <div>
                          <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                          <p className="text-gray-500">Click or drag file to upload</p>
                          <p className="text-gray-400 text-sm">PDF, DOCX, PPTX (Max: 50MB)</p>
                        </div>
                      )}
                      <input
                        type="file"
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                    </div>
                  </div>
                  
                  {/* Upload button */}
                  <Button
                    onClick={handleUploadClick}
                    disabled={!selectedFile || !noteTitle || uploadingFile}
                    className="w-full bg-[#DE5499] hover:bg-[#c23d80] text-white"
                  >
                    {uploadingFile ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Uploading ({uploadProgress}%)
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Notes
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

// Note card component for displaying notes
const NoteCard = ({ note }: { note: Note }) => {
  return (
    <div className="p-4 bg-white border rounded-lg hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-[#E99F4C]/10 rounded-lg">
            <FileText className="w-5 h-5 text-[#E99F4C]" />
          </div>
          <div>
            <h3 className="font-medium text-[#264143]">{note.title}</h3>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <User className="w-3 h-3" />
              <span>{note.author.firstName} {note.author.lastName}</span>
            </div>
          </div>
        </div>
        <Badge variant="outline" className="text-xs">
          {note.type}
        </Badge>
      </div>
      
      <div className="flex items-center justify-between mt-4 text-sm text-gray-500">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <ThumbsUp className="w-3 h-3" />
            <span>{note.likes.length}</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageCircle className="w-3 h-3" />
            <span>{note.comments.length}</span>
          </div>
          <div className="flex items-center gap-1">
            <Download className="w-3 h-3" />
            <span>{note.downloadCount}</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          <span>{new Date(note.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
      
      <div className="mt-4">
        <Link 
          href={`/notes/${note.id}`}
          className="flex items-center justify-center w-full p-2 bg-[#DE5499]/10 hover:bg-[#DE5499]/20 text-[#DE5499] rounded-md transition-colors"
        >
          <FileSymlink className="w-4 h-4 mr-2" />
          View Notes
        </Link>
      </div>
    </div>
  );
}

export default SubjectIDPage;