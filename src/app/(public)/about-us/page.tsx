"use client"
import React from 'react'
import { Github, Linkedin, Twitter, Mail, BookOpen, GraduationCap, Code, Figma, Coffee } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image';

function AboutUsPage() {
  const teamMembers = [
    {
      name: "Harnoor Singh Arora",
      role: "Full Stack Developer",
      education: "BTech CSE Sem 4 Sec A",
      bio: "Passionate about building robust applications from frontend to backend. I love transforming ideas into functional digital solutions.",
      socials: [
        { icon: <Github className="w-5 h-5" />, url: "https://github.com/HarnoorSingh1234" },
        { icon: <Linkedin className="w-5 h-5" />, url: "https://linkedin.com/in/harnoorsingharora" },
        { icon: <Mail className="w-5 h-5" />, url: "mailto:harnoor@example.com" },
      ],
      skills: ["React", "Next.js", "TailwindCSS"],
      image: "/images/team/harnoor.jpg"
    },

    {
      name: "Tushar Dhingra",
      role: "UI/UX Frontend Developer",
      education: "BTech CSE Sem 4 Sec C",
      bio: "Design enthusiast focused on creating beautiful, intuitive interfaces. I believe great design can transform user experiences and solve complex problems.",
      socials: [
        { icon: <Github className="w-5 h-5" />, url: "https://github.com/tushardhingra" },
        { icon: <Figma className="w-5 h-5" />, url: "https://figma.com/@tushardhingra" },
        { icon: <Mail className="w-5 h-5" />, url: "mailto:tushar@example.com" },
      ],
      skills: ["UI/UX Design", "React", "TailwindCSS", "Next.js"],
      // Image path would be replaced with actual photo when available
      image: "/images/team/tushar.jpg"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F8F5F2] to-[#F0EBE8]">
      {/* Team Section with animated cards */}
      <section className="py-16 md:py-24 container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {teamMembers.map((member, index) => (
            <div 
              key={index}
              className="group bg-white border-[0.15em] border-[#264143] rounded-[0.6em] overflow-hidden shadow-[0.3em_0.3em_0_#4d61ff] transform transition-all duration-300 hover:-translate-y-2 hover:shadow-[0.4em_0.4em_0_#4d61ff]"
            >
              <div className="aspect-video bg-gradient-to-br from-[#EDDCD9] to-[#f8e7e3] p-8 relative overflow-hidden">
                {/* Fixed position skill bubbles */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  {member.skills.map((skill, idx) => {
                    // Calculate fixed positions based on index
                    const positions = [
                      { top: '15%', left: '20%' },
                      { top: '25%', left: '65%' },
                      { top: '60%', left: '15%' },
                      { top: '50%', left: '70%' },
                      { top: '75%', left: '45%' }
                    ];
                    const pos = positions[idx % positions.length];
                    
                    return (
                      <div 
                        key={idx} 
                        className="absolute p-2 rounded-full bg-pink-400  text-xs text-black font-medium animate-float"
                        style={{
                          top: pos.top,
                          left: pos.left,
                          animationDelay: `${idx * 0.3}s`
                        }}
                      >
                        {skill}
                      </div>
                    );
                  })}
                </div>                  
                {/* Team member photo */}
                <div className="relative z-10 flex items-center justify-center h-full">
                  <div className="w-40 h-40 rounded-full border-[0.15em] border-[#264143] overflow-hidden shadow-[0_0_30px_rgba(77,97,255,0.5)] transform transition-transform duration-300 group-hover:scale-110">
                    {/* Use Next.js Image component for optimized images */}
                    <Image
                      src={member.image || `/images/team/placeholder.jpg`} 
                      alt={member.name} 
                      className="w-full h-full object-cover"
                      style={{ objectPosition: 'center top' }}
                      loading="lazy"
                      width={160}
                      height={160}
                    />
                  </div>
                </div>
              </div>
              
              <div className="p-8">
                <h3 className="text-3xl font-bold text-[#264143] mb-2">{member.name}</h3>
                <div className="flex items-center gap-3 mb-6">
                  <div className="px-4 py-1.5 bg-[#DE5499]/10 rounded-full border border-[#DE5499]/20">
                    <span className="text-[#DE5499] font-medium">{member.role}</span>
                  </div>
                  <div className="flex items-center px-4 py-1.5 bg-[#264143]/10 rounded-full border border-[#264143]/20">
                    <GraduationCap className="w-4 h-4 text-[#264143] mr-2" />
                    <span className="text-sm text-[#264143] font-medium">{member.education}</span>
                  </div>
                </div>
                  <p className="text-[#264143]/80 text-lg mb-8">
                  {member.bio}
                </p>
                
                <div className="flex items-center gap-4">
                  {member.socials.map((social, idx) => (
                    <Link 
                      key={idx} 
                      href={social.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-12 h-12 rounded-full bg-[#264143]/5 text-[#264143] flex items-center justify-center hover:bg-[#DE5499] hover:text-white transition-all duration-200 transform hover:scale-110 border border-[#264143]/20"
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