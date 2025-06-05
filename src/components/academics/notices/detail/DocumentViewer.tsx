import { File } from 'lucide-react';
import { extractFileIdFromDriveLink } from '@/lib/notices/utils';

interface DocumentPreviewProps {
  driveLink: string;
  driveFileId: string | null;
}

export default function DocumentPreview({ driveLink, driveFileId }: DocumentPreviewProps) {
  // Extract file ID from Drive link if driveFileId is not provided
  const fileId = driveFileId || extractFileIdFromDriveLink(driveLink);
  
  return (
    <div className="mb-8 overflow-hidden border-[0.2em] border-[#264143] rounded-[0.4em] shadow-[0.2em_0.2em_0_#E99F4C]">
      <div className="bg-[#EDDCD9]/30 py-3 px-4 border-b-[0.15em] border-[#264143]/20">
        <div className="flex items-center">
          <File className="mr-2 h-5 w-5 text-[#264143]/70" />
          <h3 className="font-medium text-[#264143]">Attached Document</h3>
        </div>
      </div>
        {fileId ? (
        <div className="w-full bg-white" style={{ height: 'min(80vh, 800px)' }}>
          <iframe 
            src={`https://drive.google.com/file/d/${fileId}/preview`}
            className="w-full h-full border-0"
            allow="autoplay"
            title="Document Preview"
          ></iframe>
        </div>
      ) : (
        <div className="p-8 text-center text-[#264143]/70 bg-white">
          <p>
            Preview not available. <a href={driveLink} target="_blank" rel="noopener noreferrer" className="text-[#7BB4B1] hover:underline font-medium">Open document in Google Drive</a>
          </p>
        </div>
      )}
    </div>
  );
}