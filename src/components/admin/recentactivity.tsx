'use client';

import StyledAdminCard from "./StyledAdminCard";
import { FileText, Clock } from "lucide-react";
import styled from "styled-components";

export default function RecentActivity() {
  return (
    <StyledAdminCard 
      title="Recent Activity" 
      description="Your latest interactions on the platform"
      icon={<Clock size={20} />}
    >
      <ActivityList>
        {[1, 2, 3, 4, 5].map((i) => (
          <ActivityItem key={i}>
            <div className="activity-icon">
              <FileText size={18} />
            </div>
            <div className="activity-content">
              <p className="activity-title">
                {i % 2 === 0 ? "You uploaded" : "You downloaded"} a new note
              </p>
              <p className="activity-description">
                {i % 2 === 0 ? "Organic Chemistry - Lecture Notes" : "Calculus II - Exam Prep"}
              </p>
            </div>
            <div className="activity-time">
              {i === 1 ? "Just now" : i === 2 ? "2 hours ago" : `${i} days ago`}
            </div>
          </ActivityItem>
        ))}
      </ActivityList>
    </StyledAdminCard>
  );
}

const ActivityList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const ActivityItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  border-radius: 0.5rem;
  background-color: rgba(0, 0, 0, 0.02);
  border: 1px solid rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateX(0.25rem);
    background-color: rgba(0, 0, 0, 0.04);
    box-shadow: -0.15rem 0 0 var(--accent-color);
  }
  
  .activity-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 50%;
    background-color: rgba(0, 0, 0, 0.04);
    color: var(--accent-color);
    flex-shrink: 0;
  }
  
  .activity-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }
  
  .activity-title {
    font-weight: 600;
    font-size: 0.875rem;
    color: var(--text-color);
  }
  
  .activity-description {
    font-size: 0.75rem;
    color: var(--text-color);
    opacity: 0.7;
  }
  
  .activity-time {
    font-size: 0.75rem;
    color: var(--text-color);
    opacity: 0.6;
    white-space: nowrap;
  }
  
  /* Dark mode */
  .dark & {
    background-color: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.05);
    
    &:hover {
      background-color: rgba(255, 255, 255, 0.05);
    }
  }
`;
