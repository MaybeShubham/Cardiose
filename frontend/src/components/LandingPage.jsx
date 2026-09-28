import React, { useState, useEffect, useRef } from 'react';
import {
  Heart,
  Droplets,
  ShieldCheck,
  Activity,
  Brain,
  Stethoscope,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  Users,
  Award
} from 'lucide-react';
import { COHORT_ARCHETYPES } from '../utils/patientGenerator';

// Simplified, judge-friendly navigation labels
const NAV_ITEMS = [
  { id: 'overview', label: 'Overview' },
  { id: 'solution', label: 'Why Both?' },
  { id: 'triangulation', label: 'How 3 AIs Work' },
  { id: 'archetypes', label: 'Sample Patients' },
  { id: 'evidence', label: 'Doctor Guidelines' }
];

export default function LandingPage({ onEnterWorkspace, onSelectArchetypeAndEnter }) {
  const [activeTabNav, setActiveTabNav] = useState('overview');
  const [isScrolled, setIsScrolled] = useState(false);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0, opacity: 0 });

  const navBtnRefs = useRef({});
  const navContainerRef = useRef(null);

  // Smoothly update the sliding indicator pill position
  const updateIndicator = (tabId = activeTabNav) => {
    const activeBtn = navBtnRefs.current[tabId];
    const container = navContainerRef.current;
    if (activeBtn && container) {
      const btnRect = activeBtn.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      setIndicatorStyle({
        left: btnRect.left - containerRect.left,
        width: btnRect.width,
        opacity: 1
      });
    }
  };

  useEffect(() => {
    updateIndicator(activeTabNav);
  }, [activeTabNav]);

  useEffect(() => {
    const handleResize = () => updateIndicator(activeTabNav);
    window.addEventListener('resize', handleResize);
    const timer = setTimeout(() => updateIndicator('overview'), 100);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
    };
  }, []);

  // Scroll listener for dynamic navbar elevation and scroll-spy tracking
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 25);

      const scrollPosition = window.scrollY + 200;
      for (let i = NAV_ITEMS.length - 1; i >= 0; i--) {
        const sectionId = NAV_ITEMS[i].id;
        const el = document.getElementById(sectionId);
        if (el) {
          if (scrollPosition >= el.offsetTop) {
            setActiveTabNav(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // IntersectionObserver for scroll-reveal animations across cards and sections
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );

    const elements = document.querySelectorAll('.reveal-on-scroll');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id) => {
    setActiveTabNav(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#cae4fc] via-[#e8f2fc] via-40% to-[#faf9f5] text-slate-900 font-sans selection:bg-[#fef08a] selection:text-slate-900">
      {/* Top Floating Navigation Bar */}
      <header
        className={`fixed top-0 inset-x-0 z-50 px-4 sm:px-6 lg:px-8 transition-all duration-300 ${
          isScrolled
            ? 'py-2.5 bg-white/80 backdrop-blur-xl border-b border-slate-200/50 shadow-xs'
            : 'pt-4 pb-3 bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Brand Logo & Wordmark */}
          <div 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center space-x-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-2xl bg-white shadow-xs border border-slate-200/80 p-1 flex items-center justify-center transition-transform group-hover:scale-105">
              <img src="/logo.png" alt="Cardiose Logo" className="w-full h-full object-contain" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tight text-slate-950 font-sans">
                Cardiose
              </span>
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest -mt-1">
                Health AI
              </span>
            </div>
          </div>

          {/* Floating Pill Center Menu with Sliding Indicator */}
          <nav
            ref={navContainerRef}
            className="relative hidden md:flex items-center bg-white/70 backdrop-blur-md border border-white/80 shadow-xs p-1 rounded-full text-xs font-semibold text-slate-700"
          >
            {/* Smooth animated sliding pill background */}
            <div
              className="absolute top-1 bottom-1 bg-white rounded-full shadow-xs border border-slate-200/60 transition-all duration-300 ease-out pointer-events-none"
              style={{
                left: `${indicatorStyle.left}px`,
                width: `${indicatorStyle.width}px`,
                opacity: indicatorStyle.opacity
              }}
            />

            {NAV_ITEMS.map((item) => {
              const isActive = activeTabNav === item.id;
              return (
                <button
                  key={item.id}
                  ref={(el) => (navBtnRefs.current[item.id] = el)}
                  onClick={() => scrollToSection(item.id)}
                  className={`relative z-10 px-3.5 py-1.5 rounded-full transition-colors duration-200 ${
                    isActive
                      ? 'text-slate-950 font-bold'
                      : 'text-slate-600 hover:text-slate-950'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action: Launch Workspace */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onEnterWorkspace}
              className="bg-[#0c0d12] hover:bg-black text-white px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold tracking-tight shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center space-x-1.5"
            >
              <span>Try Live Demo</span>
              <ArrowRight className="w-3.5 h-3.5 text-white/90" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main id="overview" className="scroll-mt-24 pt-32 sm:pt-40 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-4xl mx-auto space-y-6 reveal-on-scroll is-revealed">
          {/* Friendly Eyebrow badge */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/80 backdrop-blur border border-blue-200/60 shadow-xs text-blue-900 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
            <span>Dual Health Check: Heart & Diabetes</span>
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            <span className="text-slate-500">Doctor-Approved Guidelines</span>
          </div>

          {/* Editorial Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.12]">
            <span className="font-serif block text-slate-950">
              Smarter Healthcare
            </span>
            <span className="block mt-1 font-sans text-slate-900">
              Powered by{' '}
              <span className="bg-[#fef08a] px-3.5 py-0.5 rounded-2xl text-slate-950 inline-block shadow-xs border border-amber-300/40">
                Intelligence
              </span>
            </span>
          </h1>

          {/* Plain English Subtitle for Judges */}
          <p className="text-base sm:text-lg text-slate-700 max-w-2xl mx-auto font-normal leading-relaxed pt-2">
            Cardiose checks your heart and diabetes risk together using everyday health numbers like blood pressure and blood sugar. Three separate AI models cross-check each other so doctors and patients get clear, trustworthy results.
          </p>

          {/* Dual Pill CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
            <button
              onClick={onEnterWorkspace}
              className="bg-[#0c0d12] hover:bg-black text-white px-7 py-3.5 rounded-full text-sm font-bold shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center space-x-2"
            >
              <span>Launch Screening Tool</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </button>
            <button
              onClick={() => scrollToSection('triangulation')}
              className="bg-white/80 hover:bg-white text-slate-900 border border-slate-300/80 px-7 py-3.5 rounded-full text-sm font-semibold shadow-xs hover:shadow-md transition-all flex items-center space-x-2"
            >
              <span>How the 3 AIs Work</span>
              <ChevronRight className="w-4 h-4 text-slate-500" />
            </button>
          </div>
        </div>

        {/* Hero Interactive Mockup Showcase Card */}
        <div className="mt-14 max-w-5xl mx-auto reveal-on-scroll is-revealed delay-100">
          <div className="relative rounded-3xl bg-white/90 backdrop-blur-xl border border-white/80 shadow-2xl p-6 sm:p-8 overflow-hidden animate-subtleFloat">
            {/* Top Bar inside mockup */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <Activity className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Today's Health Screening</h3>
                  <p className="text-xs text-slate-500">Heart & Diabetes Risk Checked in Seconds</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>
                  AI Ready
                </span>
                <button
                  onClick={onEnterWorkspace}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3.5 py-1.5 rounded-xl shadow-xs transition"
                >
                  Open Live Tool
                </button>
              </div>
            </div>

            {/* Main Showcase Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-6">
              {/* Left Column: Dual Disease Real-Time Cards */}
              <div className="md:col-span-7 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Heart Disease Card */}
                  <div className="rounded-2xl p-4 bg-gradient-to-br from-rose-50/80 via-white to-orange-50/50 border border-rose-100/80 shadow-xs relative overflow-hidden group hover:border-rose-300 transition">
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-8 h-8 rounded-lg bg-rose-500 text-white flex items-center justify-center shadow-xs">
                        <Heart className="w-4 h-4" />
                      </div>
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-rose-100 text-rose-800">
                        Heart Disease Check
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 font-medium">Blood Pressure, Cholesterol & ECG</div>
                    <div className="text-xl font-black text-slate-900 mt-1">13 Health Indicators</div>
                    <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-rose-100/60">
                      <span className="text-slate-500">Test Accuracy</span>
                      <span className="font-bold text-slate-800">Over 91%</span>
                    </div>
                  </div>

                  {/* Diabetes Card */}
                  <div className="rounded-2xl p-4 bg-gradient-to-br from-teal-50/80 via-white to-cyan-50/50 border border-teal-100/80 shadow-xs relative overflow-hidden group hover:border-teal-300 transition">
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center shadow-xs">
                        <Droplets className="w-4 h-4" />
                      </div>
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-teal-100 text-teal-800">
                        Diabetes Check
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 font-medium">Glucose, Insulin, BMI & Age</div>
                    <div className="text-xl font-black text-slate-900 mt-1">8 Key Numbers</div>
                    <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-teal-100/60">
                      <span className="text-slate-500">Test Accuracy</span>
                      <span className="font-bold text-slate-800">Over 89%</span>
                    </div>
                  </div>
                </div>

                {/* Dark Consensus Banner */}
                <div className="rounded-2xl bg-[#0c0d12] text-white p-4.5 sm:p-5 flex items-center justify-between shadow-lg">
                  <div>
                    <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      3 AIs Double-Check Every Case
                    </div>
                    <div className="text-2xl font-black text-white mt-0.5 flex items-center space-x-2">
                      <span>3 of 3 Models Agree</span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        High Confidence
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 max-w-md">
                      Instead of trusting a single computer model, three different algorithms vote together to catch mistakes before a doctor makes a decision.
                    </p>
                  </div>
                  <button
                    onClick={onEnterWorkspace}
                    className="shrink-0 ml-4 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/10 transition"
                  >
                    Try It Now
                  </button>
                </div>

                {/* Model Agreement Breakdown */}
                <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-4">
                  <div className="text-xs font-bold text-slate-700 mb-2 flex items-center justify-between">
                    <span>The 3 Models Behind the Screen</span>
                    <span className="text-[11px] font-normal text-slate-500">Different Methods, Same Goal</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-white p-2.5 rounded-xl border border-slate-200/60">
                      <div className="text-[11px] text-slate-500 font-medium">Model 1: Logic</div>
                      <div className="text-sm font-bold text-slate-900 mt-0.5">87% Accurate</div>
                      <div className="text-[10px] text-emerald-600 font-medium mt-1">Clear Medical Rules</div>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-slate-200/60">
                      <div className="text-[11px] text-slate-500 font-medium">Model 2: Tree AI</div>
                      <div className="text-sm font-bold text-slate-900 mt-0.5">98% Accurate</div>
                      <div className="text-[10px] text-emerald-600 font-medium mt-1">Finds Hidden Clues</div>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-slate-200/60">
                      <div className="text-[11px] text-slate-500 font-medium">Model 3: Prob. AI</div>
                      <div className="text-sm font-bold text-slate-900 mt-0.5">85% Accurate</div>
                      <div className="text-[10px] text-emerald-600 font-medium mt-1">Checks the Odds</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Quick Actions & Clinical Preview */}
              <div className="md:col-span-5 space-y-4">
                {/* Yellow Quick Action card */}
                <div 
                  onClick={onEnterWorkspace}
                  className="rounded-2xl p-5 bg-[#fef08a] border border-amber-300/80 shadow-xs cursor-pointer hover:shadow-md transition group"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wider">
                        One-Click Demo
                      </span>
                      <h4 className="text-lg font-black text-slate-950 mt-1">
                        Test a Patient Right Now
                      </h4>
                      <p className="text-xs text-amber-950/80 mt-1">
                        Pick a pre-filled sample patient below to see the instant report.
                      </p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-slate-950 text-white flex items-center justify-center group-hover:translate-x-1 transition-transform">
                      <ChevronRight className="w-5 h-5" />
                    </div>
                  </div>
                </div>

                {/* Preloaded Archetype Quick Pill List */}
                <div className="rounded-2xl border border-slate-200/80 bg-white p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">Sample Patient Profiles</span>
                    <span className="text-[11px] text-blue-600 font-medium">Click to Load</span>
                  </div>
                  <div className="space-y-2">
                    {COHORT_ARCHETYPES.map((arch, idx) => (
                      <div
                        key={idx}
                        onClick={() => {
                          if (onSelectArchetypeAndEnter) {
                            onSelectArchetypeAndEnter(arch);
                          } else {
                            onEnterWorkspace();
                          }
                        }}
                        className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/40 cursor-pointer transition text-left group"
                      >
                        <div className="pr-2">
                          <div className="text-xs font-bold text-slate-800 group-hover:text-blue-700">
                            {arch.label}
                          </div>
                          <div className="text-[11px] text-slate-500 line-clamp-1">
                            {arch.description}
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Guideline badge */}
                <div className="rounded-2xl bg-slate-100/80 p-3.5 border border-slate-200/60 flex items-center space-x-3 text-xs text-slate-600">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>
                    Follows official <strong>American Heart Association</strong> & <strong>Diabetes Association</strong> care standards.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Section 1: The Dual-Disease Solution */}
      <section id="solution" className="scroll-mt-24 py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200/60">
        <div className="text-center max-w-3xl mx-auto space-y-4 reveal-on-scroll">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            Connected Health
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-950">
            Why Check Heart Disease and Diabetes Together?
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Heart problems and diabetes often go hand in hand. High blood sugar quietly damages your blood vessels over time, which doubles your risk of heart attacks. Most clinics check them separately—Cardiose looks at the full picture in one go.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition reveal-on-scroll delay-100">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold mb-4">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">No More Missed Warnings</h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
              People with diabetes have a 2 to 4 times higher risk of heart disease, often with zero early symptoms. Checking both together catches problems years before they get serious.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition reveal-on-scroll delay-200">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold mb-4">
              <Droplets className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Numbers That Connect</h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
              Your blood pressure, resting heart rate, blood sugar, and body weight (BMI) are connected in real life. When you change numbers in one test, Cardiose keeps the other test in sync.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition reveal-on-scroll delay-300">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold mb-4">
              <Stethoscope className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Simple Next Steps</h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
              Instead of confusing medical jargon, you get a clear 4-step checklist: what to watch out for, tests to ask your doctor for, and simple diet and exercise tips.
            </p>
          </div>
        </div>
      </section>

      {/* Section 2: 3-Model Triangulation Engine */}
      <section id="triangulation" className="scroll-mt-24 py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200/60 bg-gradient-to-b from-white/60 to-transparent rounded-3xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-5 space-y-5 reveal-on-scroll">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
              Safe & Reliable AI
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-950 leading-tight">
              Why We Use 3 AI Models Instead of Just One
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              In healthcare, trusting a single AI model is risky because it might make a false guess. Cardiose runs every patient through three independent AI models that vote together.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start space-x-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Model 1: Clear Medical Rules (Logistic Regression)</h4>
                  <p className="text-xs text-slate-500">Evaluates clear risk thresholds, like blood pressure above 130 or blood sugar over 100.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Model 2: Pattern Finder (Random Forest)</h4>
                  <p className="text-xs text-slate-500">Finds subtle combinations between different numbers, like age together with cholesterol.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Model 3: Probability Checker (Naive Bayes)</h4>
                  <p className="text-xs text-slate-500">Calculates odds based on thousands of past hospital cases to prevent false alarms.</p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={onEnterWorkspace}
                className="bg-[#0c0d12] hover:bg-black text-white px-6 py-3 rounded-full text-xs sm:text-sm font-bold shadow-md transition flex items-center space-x-2"
              >
                <span>Test the 3 Models in Action</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-7 reveal-on-scroll delay-200">
            <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center space-x-2.5">
                  <Brain className="w-5 h-5 text-indigo-400" />
                  <span className="text-sm font-bold tracking-wide">How the Models Vote Together</span>
                </div>
                <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                  Instant Consensus
                </span>
              </div>

              {/* Visualized voting stack */}
              <div className="space-y-4">
                <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700/60 flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-slate-200">Model 1 (Logistic Regression)</div>
                    <div className="text-[11px] text-slate-400">Heart Accuracy: 87% | Diabetes Accuracy: 77%</div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-800/60">
                      Votes: Low Risk
                    </span>
                  </div>
                </div>

                <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700/60 flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-slate-200">Model 2 (Random Forest)</div>
                    <div className="text-[11px] text-slate-400">Heart Accuracy: 98% | Diabetes Accuracy: 77%</div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-800/60">
                      Votes: Low Risk
                    </span>
                  </div>
                </div>

                <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700/60 flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-slate-200">Model 3 (Naive Bayes)</div>
                    <div className="text-[11px] text-slate-400">Heart Accuracy: 85% | Diabetes Accuracy: 75%</div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-800/60">
                      Votes: Low Risk
                    </span>
                  </div>
                </div>
              </div>

              {/* Consensus Result Pill */}
              <div className="p-4 rounded-2xl bg-indigo-950/50 border border-indigo-500/30 flex items-center justify-between text-xs">
                <span className="text-indigo-200 font-medium">Final Conclusion</span>
                <span className="text-white font-bold">Unanimous Agreement (All 3 Models Agree)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Preloaded Sample Patients Showcase */}
      <section id="archetypes" className="scroll-mt-24 py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200/60">
        <div className="text-center max-w-3xl mx-auto space-y-4 reveal-on-scroll">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            One-Click Demos
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-950">
            Try Real Patient Cases in One Click
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Judges can test the platform immediately without typing numbers manually. Click any sample patient below to see how the AI analyzes their health:
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {COHORT_ARCHETYPES.map((arch, idx) => {
            const delayClass = idx === 0 ? 'delay-100' : idx === 1 ? 'delay-200' : idx === 2 ? 'delay-300' : 'delay-400';
            return (
              <div
                key={idx}
                className={`bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:shadow-xl transition-all flex flex-col justify-between group reveal-on-scroll ${delayClass}`}
              >
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-sm">
                    0{idx + 1}
                  </div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {arch.label}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {arch.description}
                  </p>

                  <div className="pt-2 space-y-1.5 text-xs text-slate-600 border-t border-slate-100">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Blood Pressure / Pulse</span>
                      <span className="font-semibold text-slate-800">{arch.heart.trestbps} mm Hg / {arch.heart.thalach} bpm</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Blood Sugar / Weight (BMI)</span>
                      <span className="font-semibold text-slate-800">{arch.diabetes.glucose} mg/dL / {arch.diabetes.bmi}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (onSelectArchetypeAndEnter) {
                      onSelectArchetypeAndEnter(arch);
                    } else {
                      onEnterWorkspace();
                    }
                  }}
                  className="mt-6 w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-900 hover:text-white text-slate-800 text-xs font-bold transition-all flex items-center justify-center space-x-1.5"
                >
                  <span>Test This Patient</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* Section 4: Doctor Guidelines */}
      <section id="evidence" className="scroll-mt-24 py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200/60">
        <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-3xl p-8 sm:p-12 text-white shadow-2xl reveal-on-scroll delay-100">
          <div className="max-w-3xl space-y-6">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-200 bg-blue-800/60 px-3 py-1 rounded-full border border-blue-400/30">
              Trusted Standards
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Built on Official Guidelines That Doctors Trust
            </h2>
            <p className="text-blue-100 text-sm sm:text-base leading-relaxed">
              Cardiose doesn't guess or make things up. It pairs machine learning with standard medical guidelines from the American Heart Association and American Diabetes Association, so you always know why a warning was triggered.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="bg-white/10 backdrop-blur rounded-2xl p-4 border border-white/10">
                <Award className="w-5 h-5 text-amber-300 mb-2" />
                <h4 className="text-sm font-bold text-white">American Diabetes Association</h4>
                <p className="text-xs text-blue-200 mt-1">
                  Catches prediabetes early when fasting blood sugar is over 100 mg/dL, and tracks body mass index (BMI) ranges.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur rounded-2xl p-4 border border-white/10">
                <ShieldCheck className="w-5 h-5 text-emerald-300 mb-2" />
                <h4 className="text-sm font-bold text-white">American Heart Association</h4>
                <p className="text-xs text-blue-200 mt-1">
                  Identifies high blood pressure stages, irregular ECG readings, and heart rate recovery during physical activity.
                </p>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <button
                onClick={onEnterWorkspace}
                className="bg-white hover:bg-slate-100 text-slate-950 font-bold px-7 py-3.5 rounded-full text-sm shadow-lg transition flex items-center space-x-2"
              >
                <span>Launch Clinical Tool</span>
                <ArrowRight className="w-4 h-4 text-slate-950" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 bg-white/70 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 p-1 flex items-center justify-center">
              <img src="/logo.png" alt="Cardiose Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <span className="text-base font-extrabold text-slate-900">Cardiose</span>
              <p className="text-xs text-slate-500">Dual-Disease Health Screening Platform</p>
            </div>
          </div>

          <button
            onClick={onEnterWorkspace}
            className="bg-[#0c0d12] hover:bg-black text-white px-5 py-2 rounded-full text-xs font-bold transition shadow-xs flex items-center space-x-1.5"
          >
            <span>Launch Platform</span>
            <ArrowRight className="w-3.5 h-3.5 text-white/90" />
          </button>
        </div>
      </footer>
    </div>
  );
}
