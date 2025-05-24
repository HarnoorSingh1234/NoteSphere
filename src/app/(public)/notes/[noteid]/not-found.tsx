import Link from 'next/link';

export default function NoteNotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8F5F2]">
      <h2 className="text-2xl font-bold text-[#264143]">Note not found</h2>
      <p className="text-[#264143]/70">The note you're looking for doesn't exist or has been removed.</p>
      <Link 
        href="/"
        className="mt-4 px-4 py-2 bg-[#264143] text-white rounded-md hover:bg-[#264143]/90"
      >
        Return Home
      </Link>
    </div>
  );
}
