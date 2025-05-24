"use client"
import React from 'react'
import { Github, Linkedin, Twitter, Mail, BookOpen, GraduationCap, Code, Figma, Coffee, Instagram } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image';
import Harnoor from "@/../public/images/team/Harnoor.jpg"
import Tushar from "@/../public/images/team/tushi.jpg"


function AboutUsPage() {
  const teamMembers = [
    {
      name: "Harnoor Singh Arora",
      role: "Full Stack Developer",
      education: "BTech CSE Sem 4 Sec A",
      bio: "Passionate about building robust applications from frontend to backend. I love transforming ideas into functional digital solutions.",
      socials: [
        { icon: <Github className="w-5 h-5" />, url: "https://github.com/HarnoorSingh1234" },
        { icon: <Linkedin className="w-5 h-5" />, url: "https://www.linkedin.com/in/harnoor-singh-arora-0b24b631b/" },
        { icon: <Mail className="w-5 h-5" />, url: "mailto:harnoorsingharora2005@gmail.com" },
        { icon: <Instagram className="w-5 h-5" />, url: "https://www.instagram.com/harnoor_singh124/" },
      ],
      skills: ["React", "Next.js", "TailwindCSS"],
      image: Harnoor
    },

    {
      name: "Tushar Dhingra",
      role: "UI/UX Frontend Developer",
      education: "BTech CSE Sem 4 Sec C",
      bio: "Design enthusiast focused on creating beautiful, intuitive interfaces. I believe great design can transform user experiences and solve complex problems.",
      socials: [
        { icon: <Github className="w-5 h-5" />, url: "https://github.com/TDHINGRA16" },
        { icon: <Linkedin className="w-5 h-5" />, url: "https://www.linkedin.com/in/tushar-dhingra-2b1975298/" },
        { icon: <Mail className="w-5 h-5" />, url: "mailto:tushadhingrar@gmail.com" },
        { icon: <Instagram className="w-5 h-5" />, url: "https://www.instagram.com/tdhingra_16/" },
      ],
      skills: ["UI/UX Design", "React", "TailwindCSS", "Next.js"],
      // Image path would be replaced with actual photo when available
      image: Tushar
    }
  ];
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F8F5F2] to-[#F0EBE8]">
      {/* Team Section with animated cards */}
      <section className="py-16 md:py-24 container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-[#264143] mb-12">Meet Our Team</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {teamMembers.map((member, index) => (
            <div 
              key={index}
              className="group bg-white border-[0.15em] border-[#264143] rounded-[0.6em] overflow-hidden shadow-[0.3em_0.3em_0_#4d61ff] transform transition-all duration-300 hover:-translate-y-2 hover:shadow-[0.4em_0.4em_0_#4d61ff]"
            >
              {/* Larger image area */}
              <div className="aspect-[3/4] relative overflow-hidden">
                {/* Team member photo with larger proportions */}
                <Image
                  src={member.image || `/images/team/placeholder.jpg`} 
                  alt={member.name} 
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  style={{ objectPosition: 'center top' }}
                  loading="lazy"
                  fill
                />
                  {/* Skill bubbles on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 p-4">
                  <div className="absolute bottom-4 left-0 right-0 flex flex-wrap justify-center gap-2">
                    {member.skills.map((skill, idx) => {
                      // Different positions based on team member index for better distribution
                      const isSecondMember = index === 1;
                      
                      // Create a layout that works well for both members
                      return (
                        <div 
                          key={idx} 
                          className="px-3 py-1 rounded-full bg-pink-400 text-xs text-black font-medium animate-float"
                          style={{
                            animationDelay: `${idx * 0.2}s`,
                            animationDuration: `${3 + (idx * 0.5)}s`
                          }}
                        >
                          {skill}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              
              {/* Compact info section */}
              <div className="p-4">
                <h3 className="text-xl font-bold text-[#264143] mb-1">{member.name}</h3>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <div className="px-2 py-1 bg-[#DE5499]/10 rounded-full border border-[#DE5499]/20">
                    <span className="text-[#DE5499] text-xs font-medium">{member.role}</span>
                  </div>
                </div>
                <div className="flex items-center text-sm text-[#264143]/80 mb-3">
                  <GraduationCap className="w-3 h-3 mr-1" />
                  <span>{member.education}</span>
                </div>
                
                <div className="flex items-center gap-2 mt-3">
                  {member.socials.map((social, idx) => (
                    <Link 
                      key={idx} 
                      href={social.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded-full bg-[#264143]/5 text-[#264143] flex items-center justify-center hover:bg-[#DE5499] hover:text-white transition-all duration-200 transform hover:scale-110 border border-[#264143]/20"
                    >
                      {social.icon}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      
      
      {/* CSS for animations */}
      <style jsx>{`
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-code-rain {
          position: absolute;
          top: -20%;
          animation: codeRain 15s linear infinite;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes codeRain {
          from { transform: translateY(-100%); }
          to { transform: translateY(1000%); }
        }
      `}</style>
    </div>
  )
}

export default AboutUsPage