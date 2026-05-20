import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import '@google/model-viewer';
import { X, ChevronRight, ChevronLeft } from 'lucide-react';

const steps = [
  {
    id: 'welcome',
    text: "Hi, I'm Beej! Welcome to BloomSense. Let me show you around our agricultural platform!",
    path: '/',
    targetId: null,
    position: { bottom: '20px', right: '20px' }
  },
  {
    id: 'scanner',
    text: "This is the Amania AI Scanner. Scan your crop leaves here to detect diseases instantly.",
    path: '/',
    targetId: 'home',
    position: { top: '50%', left: '50%', x: '-50%', y: '-50%' }
  },
  {
    id: 'archive',
    text: "Explore our Botanical Archive to find natural cures and medicinal plants.",
    path: '/',
    targetId: 'flora',
    position: { top: '20%', right: '10%' }
  },
  {
    id: 'map',
    text: "The Predictive Disease Spread Map shows you real-time outbreak warnings in your area.",
    path: '/',
    targetId: 'network',
    position: { bottom: '20%', left: '20%' }
  },
  {
    id: 'community',
    text: "Join the Krishi Chaupal Community to share knowledge and trade equipment with other farmers!",
    path: '/community',
    targetId: null,
    position: { top: '20%', right: '20%' }
  },
  {
    id: 'calendar',
    text: "Check the Crop Calendar to plan your planting and harvesting seasons optimally.",
    path: '/calendar',
    targetId: null,
    position: { top: '30%', left: '10%' }
  },
  {
    id: 'technology',
    text: "Up there is the Technology section! Click it to learn more about the advanced hardware powering BloomSense.",
    path: '/',
    targetId: null,
    position: { top: '100px', right: '20%' }
  }
];

export default function RobotGuide() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    const step = steps[currentStep];
    
    // Scroll to the target element if specified
    if (step.targetId && location.pathname === step.path) {
      setTimeout(() => {
        const el = document.getElementById(step.targetId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 500); // Wait for potential page transition
    }
  }, [currentStep, isVisible, location.pathname]);

  if (!isVisible) {
    return (
      <button 
        onClick={() => setIsVisible(true)}
        className="fixed bottom-6 right-6 z-[100] w-14 h-14 bg-emerald-600 rounded-full flex items-center justify-center shadow-[0_4px_20px_rgba(5,150,105,0.4)] hover:bg-emerald-700 hover:scale-110 transition-all duration-300 border-2 border-emerald-100 group"
      >
        <span className="font-heading italic text-white text-2xl group-hover:rotate-12 transition-transform">B</span>
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 rounded-full animate-ping"></div>
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 rounded-full"></div>
      </button>
    );
  }

  const step = steps[currentStep];

  return (
    <AnimatePresence>
      <motion.div
        key="robot-guide"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ 
          opacity: 1, 
          scale: 1,
          ...(isMobile 
            ? { bottom: '20px', left: '50%', x: '-50%', top: 'auto', right: 'auto', y: 0 } 
            : {
                bottom: step.position.bottom || 'auto',
                right: step.position.right || 'auto',
                top: step.position.top || 'auto',
                left: step.position.left || 'auto',
                x: step.position.x || 0,
                y: step.position.y || 0
              }
          )
        }}
        transition={{ type: "spring", stiffness: 80, damping: 20 }}
        className="fixed z-[100] pointer-events-none flex flex-col items-center w-[90vw] sm:w-[300px]"
      >
        {/* Chat Bubble */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          key={`bubble-${step.id}`}
          className="pointer-events-auto bg-white/95 backdrop-blur-xl border border-emerald-200/60 p-5 rounded-[2rem] shadow-2xl mb-4 w-full relative"
        >
          {/* Bubble Tail */}
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-white/95 border-b border-r border-emerald-200/60 transform rotate-45 backdrop-blur-xl"></div>

          <button 
            onClick={() => setIsVisible(false)}
            className="absolute 3 -top-3 -right-3 bg-white border border-rose-100 text-rose-500 rounded-full p-1.5 hover:bg-rose-50 hover:text-rose-600 transition-colors shadow-sm"
          >
            <X size={14} strokeWidth={3} />
          </button>
          
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-400 to-emerald-600 flex items-center justify-center shadow-inner">
              <span className="text-white font-heading italic text-sm">B</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-emerald-600/80 uppercase tracking-[0.2em] block leading-none mb-1">Guide</span>
              <span className="text-sm font-bold text-emerald-950 leading-none">Beej</span>
            </div>
          </div>
          
          <p className="text-sm text-emerald-900 font-medium leading-relaxed mb-5">
            {step.text}
          </p>
          
          <div className="flex justify-between items-center pt-3 border-t border-emerald-100/50">
            <span className="text-[10px] text-emerald-600/50 font-bold tracking-widest">{currentStep + 1} / {steps.length}</span>
            <div className="flex gap-2">
              <button 
                onClick={() => {
                  const prevStep = Math.max(0, currentStep - 1);
                  setCurrentStep(prevStep);
                  if (location.pathname !== steps[prevStep].path) {
                    navigate(steps[prevStep].path);
                  }
                }}
                disabled={currentStep === 0}
                className="p-2 rounded-full bg-emerald-50 text-emerald-700 hover:bg-emerald-100 disabled:opacity-30 disabled:hover:bg-emerald-50 transition-colors"
              >
                <ChevronLeft size={16} strokeWidth={3} />
              </button>
              <button 
                onClick={() => {
                  if (currentStep < steps.length - 1) {
                    const nextStep = currentStep + 1;
                    setCurrentStep(nextStep);
                    if (location.pathname !== steps[nextStep].path) {
                      navigate(steps[nextStep].path);
                    }
                  } else {
                    setIsVisible(false);
                    setCurrentStep(0);
                  }
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors shadow-md shadow-emerald-600/20"
              >
                {currentStep === steps.length - 1 ? "Finish" : "Next"} <ChevronRight size={14} strokeWidth={3} />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Floating 3D Robot */}
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          className="w-[160px] h-[160px] sm:w-[220px] sm:h-[220px] pointer-events-auto relative"
        >
          {/* Shadow underneath */}
          <motion.div 
            animate={{ scale: [1, 0.8, 1], opacity: [0.3, 0.1, 0.3] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-32 h-6 bg-emerald-900/40 rounded-[100%] blur-md"
          />
          
          <model-viewer
            src="/utility_robot.glb"
            auto-rotate="true"
            camera-controls="false"
            disable-zoom="true"
            disable-pan="true"
            shadow-intensity="0"
            environment-image="neutral"
            exposure="1.2"
            style={{ width: '100%', height: '100%', backgroundColor: 'transparent' }}
          ></model-viewer>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
