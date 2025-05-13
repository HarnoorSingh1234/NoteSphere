'use client';

import StyledAdminCard from "./StyledAdminCard";
import { BookOpen } from "lucide-react";
import styled from "styled-components";

export default function PopularSubjects() {
  const subjects = ["Computer Science", "Biology", "Economics", "Physics", "Mathematics"];

  return (
    <StyledAdminCard 
      title="Popular Subjects" 
      description="Most active subject areas"
      icon={<BookOpen size={20} />}
      accentColor="#4d61ff"
      secondaryColor="#E99F4C"
    >
      <SubjectsList>
        {subjects.map((subject, i) => (
          <SubjectItem key={subject}>
            <div className="subject-ranking">
              <div className="rank-number">{i + 1}</div>
              <span className="subject-name">{subject}</span>
            </div>
            <span className="subject-count">
              {Math.floor(Math.random() * 100) + 20} notes
            </span>
          </SubjectItem>
        ))}
      </SubjectsList>
    </StyledAdminCard>
  );
}

const SubjectsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const SubjectItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem;
  border-radius: 0.5rem;
  transition: all 0.2s ease;
  background-color: rgba(0, 0, 0, 0.02);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  
  &:hover {
    transform: translateX(0.25rem);
    background-color: rgba(0, 0, 0, 0.04);
  }
  
  .subject-ranking {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }
  
  .rank-number {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.75rem;
    height: 1.75rem;
    border-radius: 50%;
    background-color: var(--accent-color);
    color: white;
    font-weight: 700;
    font-size: 0.875rem;
  }
  
  .subject-name {
    font-weight: 600;
    font-size: 0.875rem;
    color: var(--text-color);
  }
  
  .subject-count {
    font-size: 0.75rem;
    color: var(--text-color);
    opacity: 0.7;
    background-color: rgba(0, 0, 0, 0.05);
    padding: 0.25rem 0.5rem;
    border-radius: 1rem;
  }
  
  /* Dark mode */
  .dark & {
    background-color: rgba(255, 255, 255, 0.03);
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    
    &:hover {
      background-color: rgba(255, 255, 255, 0.05);
    }
    
    .subject-count {
      background-color: rgba(255, 255, 255, 0.1);
    }
  }
`;
