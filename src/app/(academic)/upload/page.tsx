'use client'

import React, { useState } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/navigation';
import { renderCanvas } from '@/components/ui/canvas';
import { useEffect } from 'react';

// Sample data - in a real app, these would come from a database
const years = [
  { id: '1', name: 'First Year' },
  { id: '2', name: 'Second Year' },
  { id: '3', name: 'Third Year' },
  { id: '4', name: 'Fourth Year' }
];

const semesters = [
  { id: '1', yearId: '1', number: 1 },
  { id: '2', yearId: '1', number: 2 },
  { id: '3', yearId: '2', number: 3 },
  { id: '4', yearId: '2', number: 4 },
  { id: '5', yearId: '3', number: 5 },
  { id: '6', yearId: '3', number: 6 },
  { id: '7', yearId: '4', number: 7 },
  { id: '8', yearId: '4', number: 8 },
];

const subjects = [
  { id: '1', semesterId: '1', name: 'Mathematics', code: 'MATH101' },
  { id: '2', semesterId: '1', name: 'Physics', code: 'PHY101' },
  { id: '3', semesterId: '2', name: 'Chemistry', code: 'CHEM101' },
  { id: '4', semesterId: '2', name: 'Biology', code: 'BIO101' },
  { id: '5', semesterId: '3', name: 'Computer Science', code: 'CS201' },
  { id: '6', semesterId: '3', name: 'Mechanics', code: 'MECH201' },
  { id: '7', semesterId: '4', name: 'Electronics', code: 'ELEC201' },
  { id: '8', semesterId: '4', name: 'Statistics', code: 'STAT201' },
];

const sections = [
  { id: 'AId', name: 'A' },
  { id: 'BId', name: 'B' },
  { id: 'CId', name: 'C' },
  { id: 'DId', name: 'D' }
];

const noteTypes = [
  'LECTURE',
  'HANDWRITTEN',
  'PPT',
  'PDF',
  'ASSIGNMENT',
  'QUESTION_PAPER',
  'SOLUTION'
];

export default function UploadPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    year: '',
    semester: '',
    subject: '',
    section: '',
    type: '',
    tags: '',
    customYear: '',
    customSemester: '',
    customSubject: '',
    customSection: '',
    customType: '',
    file: null
  });
  
  const [usingCustom, setUsingCustom] = useState({
    year: false,
    semester: false,
    subject: false,
    section: false,
    type: false
  });
  
  // Filter options based on selections
  const [filteredSemesters, setFilteredSemesters] = useState(semesters);
  const [filteredSubjects, setFilteredSubjects] = useState(subjects);
  
  useEffect(() => {
    renderCanvas();
  }, []);
  
  useEffect(() => {
    if (formData.year) {
      setFilteredSemesters(semesters.filter(s => s.yearId === formData.year));
    } else {
      setFilteredSemesters(semesters);
    }
  }, [formData.year]);
  
  useEffect(() => {
    if (formData.semester) {
      setFilteredSubjects(subjects.filter(s => s.semesterId === formData.semester));
    } else {
      setFilteredSubjects(subjects);
    }
  }, [formData.semester]);
  
  const handleCustomToggle = (field) => {
    setUsingCustom({
      ...usingCustom,
      [field]: !usingCustom[field]
    });
    
    // Clear the related field when toggling
    if (!usingCustom[field]) {
      setFormData({
        ...formData,
        [field]: ''
      });
    } else {
      setFormData({
        ...formData,
        [`custom${field.charAt(0).toUpperCase() + field.slice(1)}`]: ''
      });
    }
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({
        ...formData,
        file
      });
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // In a real app, you would upload the file and submit the form data
    alert('Note uploaded successfully!');
    // Redirect back to academics page
    router.push('/academics');
  };
  
  return (
    <main className="flex-1 p-4 md:p-6 relative">
      <canvas
        className="bg-skin-base pointer-events-none absolute inset-0 mx-auto"
        id="canvas"
      ></canvas>
      
      <StyledWrapper>
        <div className="container">
          <div className="form_area">
            <p className="title">UPLOAD NOTE</p>
            <form onSubmit={handleSubmit}>
              {/* Title and Description Fields */}
              <div className="form_row">
                <div className="form_group">
                  <label className="sub_title" htmlFor="title">Title</label>
                  <input 
                    placeholder="Enter note title" 
                    className="form_style" 
                    type="text" 
                    name="title" 
                    value={formData.title} 
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="form_group">
                  <label className="sub_title" htmlFor="description">Description</label>
                  <input 
                    placeholder="Enter note description" 
                    className="form_style" 
                    type="text" 
                    name="description" 
                    value={formData.description} 
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              
              {/* Year and Semester Fields */}
              <div className="form_row">
                <div className="form_group">
                  <div className="field_with_toggle">
                    <label className="sub_title" htmlFor="year">Year</label>
                    <button 
                      type="button" 
                      className="toggle_btn" 
                      onClick={() => handleCustomToggle('year')}
                    >
                      {usingCustom.year ? 'Use Selection' : 'Custom'}
                    </button>
                  </div>
                  
                  {usingCustom.year ? (
                    <input 
                      placeholder="Enter custom year" 
                      className="form_style" 
                      type="text" 
                      name="customYear" 
                      value={formData.customYear} 
                      onChange={handleInputChange}
                      required
                    />
                  ) : (
                    <select 
                      className="form_style" 
                      name="year" 
                      value={formData.year} 
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Year</option>
                      {years.map(year => (
                        <option key={year.id} value={year.id}>
                          {year.name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
                
                <div className="form_group">
                  <div className="field_with_toggle">
                    <label className="sub_title" htmlFor="semester">Semester</label>
                    <button 
                      type="button" 
                      className="toggle_btn" 
                      onClick={() => handleCustomToggle('semester')}
                    >
                      {usingCustom.semester ? 'Use Selection' : 'Custom'}
                    </button>
                  </div>
                  
                  {usingCustom.semester ? (
                    <input 
                      placeholder="Enter custom semester" 
                      className="form_style" 
                      type="text" 
                      name="customSemester" 
                      value={formData.customSemester} 
                      onChange={handleInputChange}
                      required
                    />
                  ) : (
                    <select 
                      className="form_style" 
                      name="semester" 
                      value={formData.semester} 
                      onChange={handleInputChange}
                      required
                      disabled={!formData.year && !usingCustom.year}
                    >
                      <option value="">Select Semester</option>
                      {filteredSemesters.map(semester => (
                        <option key={semester.id} value={semester.id}>
                          Semester {semester.number}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>
              
              {/* Subject and Section Fields */}
              <div className="form_row">
                <div className="form_group">
                  <div className="field_with_toggle">
                    <label className="sub_title" htmlFor="subject">Subject</label>
                    <button 
                      type="button" 
                      className="toggle_btn" 
                      onClick={() => handleCustomToggle('subject')}
                    >
                      {usingCustom.subject ? 'Use Selection' : 'Custom'}
                    </button>
                  </div>
                  
                  {usingCustom.subject ? (
                    <input 
                      placeholder="Enter custom subject" 
                      className="form_style" 
                      type="text" 
                      name="customSubject" 
                      value={formData.customSubject} 
                      onChange={handleInputChange}
                      required
                    />
                  ) : (
                    <select 
                      className="form_style" 
                      name="subject" 
                      value={formData.subject} 
                      onChange={handleInputChange}
                      required
                      disabled={!formData.semester && !usingCustom.semester}
                    >
                      <option value="">Select Subject</option>
                      {filteredSubjects.map(subject => (
                        <option key={subject.id} value={subject.id}>
                          {subject.name} ({subject.code})
                        </option>
                      ))}
                    </select>
                  )}
                </div>
                
                <div className="form_group">
                  <div className="field_with_toggle">
                    <label className="sub_title" htmlFor="section">Section</label>
                    <button 
                      type="button" 
                      className="toggle_btn" 
                      onClick={() => handleCustomToggle('section')}
                    >
                      {usingCustom.section ? 'Use Selection' : 'Custom'}
                    </button>
                  </div>
                  
                  {usingCustom.section ? (
                    <input 
                      placeholder="Enter custom section" 
                      className="form_style" 
                      type="text" 
                      name="customSection" 
                      value={formData.customSection} 
                      onChange={handleInputChange}
                      required
                    />
                  ) : (
                    <select 
                      className="form_style" 
                      name="section" 
                      value={formData.section} 
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Section</option>
                      {sections.map(section => (
                        <option key={section.id} value={section.id}>
                          Section {section.name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>
              
              {/* Note Type and Tags Fields */}
              <div className="form_row">
                <div className="form_group">
                  <div className="field_with_toggle">
                    <label className="sub_title" htmlFor="type">Note Type</label>
                    <button 
                      type="button" 
                      className="toggle_btn" 
                      onClick={() => handleCustomToggle('type')}
                    >
                      {usingCustom.type ? 'Use Selection' : 'Custom'}
                    </button>
                  </div>
                  
                  {usingCustom.type ? (
                    <input 
                      placeholder="Enter custom note type" 
                      className="form_style" 
                      type="text" 
                      name="customType" 
                      value={formData.customType} 
                      onChange={handleInputChange}
                      required
                    />
                  ) : (
                    <select 
                      className="form_style" 
                      name="type" 
                      value={formData.type} 
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Note Type</option>
                      {noteTypes.map(type => (
                        <option key={type} value={type}>
                          {type.replace('_', ' ')}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
                
                <div className="form_group">
                  <label className="sub_title" htmlFor="tags">Tags</label>
                  <input 
                    placeholder="Enter tags (comma separated)" 
                    className="form_style" 
                    type="text" 
                    name="tags" 
                    value={formData.tags} 
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              {/* File Upload Field */}
              <div className="form_group">
                <label className="sub_title" htmlFor="file">Upload File</label>
                <input 
                  className="form_style file_input" 
                  type="file" 
                  name="file" 
                  onChange={handleFileChange}
                  required
                />
              </div>
              
              <div className="form_actions">
                <button className="btn" type="submit">UPLOAD NOTE</button>
                <p className="form_footer_text">Want to explore notes instead? <a className="link" href="/academics">Browse Notes</a></p>
              </div>
            </form>
          </div>
        </div>
      </StyledWrapper>
    </main>
  );
}

const StyledWrapper = styled.div`
  .container {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    text-align: center;
    padding: 10px;
    height: 100%;
  }

  .form_area {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    background-color: var(--bg-skin-card, #EDDCD9);
    height: auto;
    width: 100%;
    max-width: 800px;
    border: 2px solid #264143;
    border-radius: 20px;
    box-shadow: 3px 4px 0px 1px #E99F4C;
    padding: 15px;
    position: relative;
    z-index: 10;
  }

  .title {
    color: #264143;
    font-weight: 900;
    font-size: 1.5em;
    margin: 10px 0;
  }

  .sub_title {
    font-weight: 600;
    margin: 3px 0;
    display: block;
    text-align: left;
    color: #264143;
    font-size: 0.85rem;
  }

  .form_row {
    display: flex;
    gap: 15px;
    width: 100%;
  }

  .form_group {
    display: flex;
    flex-direction: column;
    align-items: baseline;
    margin: 5px 0;
    width: 100%;
    flex: 1;
  }

  .field_with_toggle {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }

  .toggle_btn {
    background: #264143;
    color: white;
    border: none;
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 0.7rem;
    cursor: pointer;
  }

  .toggle_btn:hover {
    background: #385c5e;
  }

  .form_style {
    outline: none;
    border: 2px solid #264143;
    box-shadow: 2px 3px 0px 1px #E99F4C;
    width: 100%;
    padding: 8px 10px;
    border-radius: 4px;
    font-size: 0.9rem;
    background-color: white;
    min-height: 36px;
    color: #264143;
  }

  .form_style::placeholder {
    color: rgba(0, 0, 0, 0.6) !important;
    opacity: 1;
  }

  /* For Firefox */
  .form_style::-moz-placeholder {
    color: rgba(0, 0, 0, 0.6) !important;
    opacity: 1;
  }

  /* For Microsoft Edge */
  .form_style::-ms-input-placeholder {
    color: rgba(0, 0, 0, 0.6) !important;
    opacity: 1;
  }

  /* For Chrome, Safari, and Opera */
  .form_style::-webkit-input-placeholder {
    color: rgba(0, 0, 0, 0.6) !important;
    opacity: 1;
  }

  .form_style:focus, .btn:focus {
    transform: translateY(2px);
    box-shadow: 1px 1px 0px 0px #E99F4C;
  }

  select.form_style {
    appearance: auto;
    color: #264143;
  }

  select.form_style:disabled {
    background-color: #e9e9e9;
    cursor: not-allowed;
  }

  .file_input {
    padding: 5px;
  }

  .form_actions {
    margin-top: 10px;
  }

  .form_footer_text {
    color: #264143 !important;
    font-weight: 600;
    margin: 5px 0;
  }

  .btn {
    padding: 10px;
    margin: 10px 0;
    width: 100%;
    font-size: 0.9rem;
    background: #DE5499;
    border: 2px solid #264143;
    border-radius: 10px;
    font-weight: 800;
    box-shadow: 2px 2px 0px 0px #E99F4C;
    color: white;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .btn:hover {
    opacity: .9;
    transform: translateY(2px);
    box-shadow: 1px 1px 0px 0px #E99F4C;
  }

  .link {
    font-weight: 800;
    color: #264143;
    padding: 2px;
    text-decoration: underline;
    font-size: 0.8rem;
  }

  @media (max-width: 768px) {
    .form_area {
      width: 95%;
      padding: 10px;
    }
    
    .form_row {
      flex-direction: column;
      gap: 5px;
    }
  }
`;