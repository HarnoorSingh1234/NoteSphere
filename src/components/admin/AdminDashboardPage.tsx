'use client';

import { useEffect } from "react";
import PopularSubjects from "./popularsubjects";
import QuickActions from "./quickactions";
import RecentActivity from "./recentactivity";
import StatsGrid from "./statsgrid";
import styled from "styled-components";
import { renderCanvas } from "@/components/ui/canvas";

export default function DashboardPage() {
  useEffect(() => {
    // Initialize the background canvas animation, just like in academic pages
    renderCanvas();
  }, []);

  return (
    <DashboardContainer>
      <canvas
        className="canvas-background"
        id="canvas"
      ></canvas>

      <main className="dashboard-main">
        <div className="dashboard-content">
          <div className="welcome-section">
            <h2 className="welcome-title">Welcome back, John!</h2>
            <p className="welcome-subtitle">Here's an overview of your activity and popular notes</p>
          </div>
          
          <StatsGrid />
          
          <div className="dashboard-widgets">
            <div className="widget-main">
              <RecentActivity />
            </div>
            <div className="widget-side">
              <PopularSubjects />
            </div>
          </div>
          
          <div className="dashboard-actions">
            <QuickActions />
          </div>
        </div>
      </main>
    </DashboardContainer>
  );
}

const DashboardContainer = styled.div`
  position: relative;
  min-height: 100vh;
  width: 100%;
  
  .canvas-background {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
    pointer-events: none;
    opacity: 0.8;
  }
  
  .dashboard-main {
    position: relative;
    z-index: 1;
    padding: 1.5rem;
    
    @media (min-width: 768px) {
      padding: 2rem;
    }
  }
  
  .dashboard-content {
    max-width: 1400px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }
  
  .welcome-section {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .welcome-title {
    font-size: 1.75rem;
    font-weight: 700;
    position: relative;
    display: inline-block;
    
    &::after {
      content: "";
      position: absolute;
      bottom: -0.5rem;
      left: 0;
      width: 3rem;
      height: 0.2rem;
      background: linear-gradient(90deg, #DE5499, #E99F4C);
      border-radius: 1rem;
    }
  }
  
  .welcome-subtitle {
    color: var(--text-color, #6b7280);
    opacity: 0.8;
  }
  
  .dashboard-widgets {
    display: grid;
    gap: 1.5rem;
    grid-template-columns: 1fr;
    
    @media (min-width: 768px) {
      grid-template-columns: 2fr 1fr;
    }
  }
  
  .dashboard-actions {
    margin-top: 1rem;
  }
`;
