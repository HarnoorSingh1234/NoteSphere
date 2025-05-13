import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function UploadNotesPage() {
  const [year, setYear] = useState('');
  const [semester, setSemester] = useState('');
  const [subject, setSubject] = useState('');
  const [section, setSection] = useState('');

  const handleUpload = () => {
    // Logic to upload notes and associate them with the selected fields
    alert('Notes uploaded successfully!');
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Upload Notes</h1>
      <form className="space-y-6">
        <div>
          <label>Year</label>
          <Select onValueChange={setYear}>
            <SelectTrigger>
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Year 1</SelectItem>
              <SelectItem value="2">Year 2</SelectItem>
              <SelectItem value="3">Year 3</SelectItem>
              <SelectItem value="4">Year 4</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label>Semester</label>
          <Select onValueChange={setSemester}>
            <SelectTrigger>
              <SelectValue placeholder="Select semester" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Semester 1</SelectItem>
              <SelectItem value="2">Semester 2</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label>Subject</label>
          <Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Enter subject" />
        </div>

        <div>
          <label>Section</label>
          <Input value={section} onChange={(e) => setSection(e.target.value)} placeholder="Enter section" />
        </div>

        <div>
          <label>Upload File</label>
          <Input type="file" />
        </div>

        <Button type="button" onClick={handleUpload} className="w-full">
          OK
        </Button>
      </form>
    </div>
  );
}
