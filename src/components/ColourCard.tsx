import React from 'react';

const Card = () => {
  return (
    <div className="relative">
      <div className="card relative w-80 bg-white border-[0.35em] border-[#050505] rounded-[0.6em] shadow-[0.7em_0.7em_0_#000000,inset_0_0_0_0.15em_rgba(0,0,0,0.05)] transition-all duration-400 ease-[cubic-bezier(0.23,1,0.32,1)] overflow-hidden font-sans origin-center
                      hover:translate-x-[-0.4em] hover:translate-y-[-0.4em] hover:scale-[1.02] hover:shadow-[1em_1em_0_#000000] 
                      active:translate-x-[0.1em] active:translate-y-[0.1em] active:scale-[0.98] active:shadow-[0.5em_0.5em_0_#000000]">
        
        {/* Card pattern grid */}
        <div className="card-pattern-grid absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.05)_1px,transparent_1px)] bg-[length:0.5em_0.5em] pointer-events-none opacity-50 transition-opacity duration-400 z-10 group-hover:opacity-100"></div>
        
        {/* Card overlay dots */}
        <div className="card-overlay-dots absolute inset-0 bg-[radial-gradient(#cfcfcf_1px,transparent_1px)] bg-[length:1em_1em] bg-[-0.5em_-0.5em] pointer-events-none opacity-0 transition-opacity duration-400 z-10 group-hover:opacity-100"></div>
        
        {/* Bold pattern */}
        <div className="bold-pattern absolute top-0 right-0 w-24 h-24 opacity-15 pointer-events-none z-10">
          <svg viewBox="0 0 100 100">
            <path strokeDasharray="15 10" strokeWidth={10} stroke="#000" fill="none" d="M0,0 L100,0 L100,100 L0,100 Z" />
          </svg>
        </div>
        
        {/* Card title area */}
        <div className="card-title-area relative p-[1.4em] bg-[#ff3e00] text-white font-extrabold text-[1.2em] flex justify-between items-center border-b-[0.35em] border-b-[#050505] uppercase tracking-[0.05em] z-20 overflow-hidden
                       before:content-[''] before:absolute before:top-0 before:left-0 before:w-full before:h-full before:bg-[repeating-linear-gradient(45deg,rgba(0,0,0,0.1),rgba(0,0,0,0.1)_0.5em,transparent_0.5em,transparent_1em)] before:pointer-events-none before:opacity-30">
          <span>Creative Studio</span>
          <span className="card-tag bg-white text-[#050505] text-[0.6em] font-extrabold py-[0.4em] px-[0.8em] border-[0.15em] border-[#050505] rounded-[0.3em] shadow-[0.2em_0.2em_0_#000000] uppercase tracking-[0.1em] rotate-3 transition-all duration-300
                         group-hover:rotate-[-2deg] group-hover:scale-110 group-hover:shadow-[0.25em_0.25em_0_#000000]">
            Premium
          </span>
        </div>
        
        {/* Card body */}
        <div className="card-body relative p-6 z-20">
          <div className="card-description mb-6 text-[#050505] text-[0.95em] leading-[1.4] font-medium">
            Award-winning design studio crafting bold brands and cutting-edge digital
            experiences for forward-thinking companies.
          </div>
          
          {/* Feature grid */}
          <div className="feature-grid grid grid-cols-2 gap-4 mb-6">
            {/* Feature item 1 */}
            <div className="feature-item flex items-center gap-[0.6em] transition-transform duration-200 hover:translate-x-[0.3em]">
              <div className="feature-icon w-[1.4em] h-[1.4em] flex items-center justify-center bg-[#4d61ff] border-[0.12em] border-[#050505] rounded-[0.3em] shadow-[0.2em_0.2em_0_rgba(0,0,0,0.2)] transition-all duration-200
                             group-hover:bg-[#5e70ff] group-hover:rotate-[-5deg]">
                <svg className="w-[0.9em] h-[0.9em] fill-white" viewBox="0 0 24 24">
                  <path d="M20,4C21.1,4 22,4.9 22,6V18C22,19.1 21.1,20 20,20H4C2.9,20 2,19.1 2,18V6C2,4.9 2.9,4 4,4H20M4,6V18H20V6H4M6,9H18V11H6V9M6,13H16V15H6V13Z" />
                </svg>
              </div>
              <span className="feature-text text-[0.85em] font-semibold text-[#050505]">UI/UX Design</span>
            </div>
            
            {/* Feature item 2 */}
            <div className="feature-item flex items-center gap-[0.6em] transition-transform duration-200 hover:translate-x-[0.3em]">
              <div className="feature-icon w-[1.4em] h-[1.4em] flex items-center justify-center bg-[#4d61ff] border-[0.12em] border-[#050505] rounded-[0.3em] shadow-[0.2em_0.2em_0_rgba(0,0,0,0.2)] transition-all duration-200
                             group-hover:bg-[#5e70ff] group-hover:rotate-[-5deg]">
                <svg className="w-[0.9em] h-[0.9em] fill-white" viewBox="0 0 24 24">
                  <path d="M12,17.56L16.07,16.43L16.62,10.33H9.38L9.2,8.3H16.8L17,6.31H7L7.56,12.32H14.45L14.22,14.9L12,15.5L9.78,14.9L9.64,13.24H7.64L7.93,16.43L12,17.56M4.07,3H19.93L18.5,19.2L12,21L5.5,19.2L4.07,3Z" />
                </svg>
              </div>
              <span className="feature-text text-[0.85em] font-semibold text-[#050505]">Development</span>
            </div>
            
            {/* Feature item 3 */}
            <div className="feature-item flex items-center gap-[0.6em] transition-transform duration-200 hover:translate-x-[0.3em]">
              <div className="feature-icon w-[1.4em] h-[1.4em] flex items-center justify-center bg-[#4d61ff] border-[0.12em] border-[#050505] rounded-[0.3em] shadow-[0.2em_0.2em_0_rgba(0,0,0,0.2)] transition-all duration-200
                             group-hover:bg-[#5e70ff] group-hover:rotate-[-5deg]">
                <svg className="w-[0.9em] h-[0.9em] fill-white" viewBox="0 0 24 24">
                  <path d="M18.5,4L19.66,8.35L18.7,8.61C18.25,7.74 17.79,6.87 17.26,6.43C16.73,6 16.11,6 15.5,6H13V16.5C13,17 13,17.5 13.33,17.75C13.67,18 14.33,18 15,18V19H9V18C9.67,18 10.33,18 10.67,17.75C11,17.5 11,17 11,16.5V6H8.5C7.89,6 7.27,6 6.74,6.43C6.21,6.87 5.75,7.74 5.3,8.61L4.34,8.35L5.5,4H18.5Z" />
                </svg>
              </div>
              <span className="feature-text text-[0.85em] font-semibold text-[#050505]">Brand Identity</span>
            </div>
            
            {/* Feature item 4 */}
            <div className="feature-item flex items-center gap-[0.6em] transition-transform duration-200 hover:translate-x-[0.3em]">
              <div className="feature-icon w-[1.4em] h-[1.4em] flex items-center justify-center bg-[#4d61ff] border-[0.12em] border-[#050505] rounded-[0.3em] shadow-[0.2em_0.2em_0_rgba(0,0,0,0.2)] transition-all duration-200
                             group-hover:bg-[#5e70ff] group-hover:rotate-[-5deg]">
                <svg className="w-[0.9em] h-[0.9em] fill-white" viewBox="0 0 24 24">
                  <path d="M9.19,6.35C8.41,7.13 7.75,8.05 7.25,9H5V11H7.12C7.05,11.32 7,11.66 7,12C7,12.34 7.05,12.68 7.12,13H5V15H7.25C7.75,15.95 8.41,16.87 9.19,17.65L7.77,19.07L9.88,21.18L11.3,19.77C11.85,20.03 12.41,20.2 13,20.31V23H15V20.31C15.59,20.2 16.15,20.03 16.7,19.77L18.12,21.18L20.23,19.07L18.81,17.65C19.59,16.87 20.25,15.95 20.75,15H23V13H20.88C20.95,12.68 21,12.34 21,12C21,11.66 20.95,11.32 20.88,11H23V9H20.75C20.25,8.05 19.59,7.13 18.81,6.35L20.23,4.93L18.12,2.82L16.7,4.23C16.15,3.97 15.59,3.8 15,3.69V1H13V3.69C12.41,3.8 11.85,3.97 11.3,4.23L9.88,2.82L7.77,4.93L9.19,6.35M13,17A5,5 0 0,1 8,12A5,5 0 0,1 13,7A5,5 0 0,1 18,12A5,5 0 0,1 13,17Z" />
                </svg>
              </div>
              <span className="feature-text text-[0.85em] font-semibold text-[#050505]">Marketing</span>
            </div>
          </div>
          
          {/* Card actions */}
          <div className="card-actions flex justify-between items-center mt-6 pt-[1.2em] border-t-[0.15em] border-t-dashed border-t-[rgba(0,0,0,0.15)] relative
                         before:content-['✂'] before:absolute before:top-[-0.8em] before:left-1/2 before:transform before:-translate-x-1/2 before:rotate-90 before:bg-white before:px-[0.5em] before:text-base before:text-[rgba(0,0,0,0.4)]">
            <div className="price relative text-[1.8em] font-extrabold text-[#050505] bg-white
                           before:content-[''] before:absolute before:bottom-[0.15em] before:left-0 before:w-full before:h-[0.2em] before:bg-[#00e0b0] before:z-[-1] before:opacity-50">
              <span className="price-currency text-[0.6em] font-bold align-top mr-[0.1em]">$</span>899
              <span className="price-period block text-[0.4em] font-semibold text-[rgba(0,0,0,0.6)] mt-[0.2em]">per project</span>
            </div>
            
            <button className="card-button relative bg-[#4d61ff] text-white text-[0.9em] font-bold py-[0.7em] px-[1.2em] border-[0.2em] border-[#050505] rounded-[0.4em] shadow-[0.3em_0.3em_0_#000000] cursor-pointer transition-all duration-200 overflow-hidden uppercase tracking-[0.05em]
                             before:content-[''] before:absolute before:top-0 before:left-[-100%] before:w-full before:h-full before:bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.2)_50%,transparent_100%)] before:transition-[left] before:duration-600 before:ease-in-out
                             hover:bg-[#5e70ff] hover:translate-x-[-0.1em] hover:translate-y-[-0.1em] hover:shadow-[0.4em_0.4em_0_#000000] hover:before:left-[100%]
                             active:translate-x-[0.1em] active:translate-y-[0.1em] active:shadow-[0.15em_0.15em_0_#000000]">
              Get Started
            </button>
          </div>
        </div>
        
        {/* Dots pattern */}
        <div className="dots-pattern absolute bottom-8 left-[-2em] w-32 h-16 opacity-30 rotate-[-10deg] pointer-events-none z-10">
          <svg viewBox="0 0 80 40">
            <circle fill="#000" r={3} cy={10} cx={10} />
            <circle fill="#000" r={3} cy={10} cx={30} />
            <circle fill="#000" r={3} cy={10} cx={50} />
            <circle fill="#000" r={3} cy={10} cx={70} />
            <circle fill="#000" r={3} cy={20} cx={20} />
            <circle fill="#000" r={3} cy={20} cx={40} />
            <circle fill="#000" r={3} cy={20} cx={60} />
            <circle fill="#000" r={3} cy={30} cx={10} />
            <circle fill="#000" r={3} cy={30} cx={30} />
            <circle fill="#000" r={3} cy={30} cx={50} />
            <circle fill="#000" r={3} cy={30} cx={70} />
          </svg>
        </div>
        
        {/* Accent shape */}
        <div className="accent-shape absolute w-10 h-10 bg-[#4d61ff] border-[0.15em] border-[#050505] rounded-[0.3em] rotate-45 bottom-[-1.2em] right-8 z-0 transition-transform duration-300 
                       group-hover:rotate-[55deg] group-hover:scale-110"></div>
        
        {/* Corner slice */}
        <div className="corner-slice absolute bottom-0 left-0 w-6 h-6 bg-white border-r-[0.25em] border-r-[#050505] border-t-[0.25em] border-t-[#050505] rounded-tr-[0.5em] z-10"></div>
        
        {/* Stamp */}
        <div className="stamp absolute bottom-6 left-6 w-16 h-16 flex items-center justify-center border-[0.15em] border-[rgba(0,0,0,0.3)] rounded-full rotate-[-15deg] opacity-20 z-10">
          <span className="stamp-text text-[0.6em] font-extrabold uppercase tracking-[0.05em]">Approved</span>
        </div>
        
        {/* Pseudo-elements handled with additional divs */}
        <div className="absolute top-[-1em] right-[-1em] w-16 h-16 bg-[#00e0b0] rotate-45 z-[1]"></div>
        <div className="absolute top-[0.4em] right-[0.4em] text-[#050505] text-[1.2em] font-bold z-[2] content-['★']">★</div>
      </div>
    </div>
  );
};

export default Card;