
import React, { useEffect, useState } from 'react';
import { ShieldCheck, ChevronRight, Menu, X, CheckCircle, Volume2, Smartphone, Gamepad2, Users, ArrowRight } from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
  onEnterSandbox: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart, onEnterSandbox }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans overflow-x-hidden">
      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-500 py-4 ${isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm translate-y-0' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer group">
            <div className="bg-slate-800 p-2 rounded-xl shadow-lg transition-transform group-hover:rotate-12">
              <ShieldCheck className="text-white w-7 h-7" />
            </div>
            <span className="text-2xl font-black tracking-tight text-slate-800">Dori Shield</span>
          </div>

          <div className="hidden md:flex items-center gap-8 font-bold text-slate-700">
            <a href="#features" className="hover:text-sky-600 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-sky-600 transition-colors">How it Works</a>
            <button onClick={onStart} className="bg-slate-800 text-white px-8 py-2.5 rounded-full font-black hover:scale-105 transition-transform shadow-xl active:scale-95">
              Launch App
            </button>
          </div>

          <button className="md:hidden text-slate-800" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-white border-t p-6 space-y-4 shadow-2xl animate-in slide-in-from-top duration-300">
            <a href="#features" className="block text-lg font-bold" onClick={() => setIsMenuOpen(false)}>Features</a>
            <a href="#how-it-works" className="block text-lg font-bold" onClick={() => setIsMenuOpen(false)}>How it Works</a>
            <button onClick={() => { onStart(); setIsMenuOpen(false); }} className="w-full bg-slate-800 text-white px-6 py-4 rounded-2xl font-black">Get Started</button>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6 relative overflow-hidden">
        {/* Parallax Background Blobs */}
        <div 
          className="absolute -top-20 -left-20 w-[600px] h-[600px] bg-slate-200/50 rounded-full blur-[100px] pointer-events-none transition-transform duration-300"
          style={{ transform: `translate3d(${scrollY * 0.1}px, ${scrollY * 0.05}px, 0)` }}
        />
        <div 
          className="absolute top-1/2 -right-20 w-[400px] h-[400px] bg-sky-100/50 rounded-full blur-[100px] pointer-events-none transition-transform duration-300"
          style={{ transform: `translate3d(-${scrollY * 0.05}px, -${scrollY * 0.1}px, 0)` }}
        />

        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 relative z-10">
          <div className="flex-1 space-y-8 text-center lg:text-left animate-fade-in-up">
            <div className="inline-block bg-slate-200 text-slate-700 px-5 py-1.5 rounded-full font-black text-xs uppercase tracking-widest animate-pulse">
              ✨ Shielding 5,000+ Seniors
            </div>
            <h1 className="text-5xl lg:text-8xl font-black leading-[1.1] text-slate-800">
              Your Digital <br />
              <span className="text-sky-600">Bodyguard</span> <br />
              Is Ready.
            </h1>
            <p className="text-xl lg:text-2xl text-slate-500 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium">
              Dori Shield turns the internet from a scary place into a space of confidence. Simple, secure, and built just for you.
            </p>
            <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start pt-4">
              <button onClick={onStart} className="bg-slate-800 text-white px-12 py-5 rounded-[2rem] text-xl font-black shadow-2xl hover:bg-slate-900 transition-all flex items-center justify-center gap-3 active:scale-95 group">
                Try Dori Shield <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button onClick={onEnterSandbox} className="bg-white border-4 border-slate-800 text-slate-800 px-12 py-5 rounded-[2rem] text-xl font-black hover:bg-slate-50 transition-all flex items-center justify-center gap-3 active:scale-95">
                Enter Sandbox
              </button>
            </div>
          </div>
          
          <div className="flex-1 relative w-full max-w-xl animate-fade-in-up stagger-2">
            <div className="aspect-[4/5] bg-slate-100 rounded-[4rem] relative border-4 border-slate-200 p-8 shadow-inner">
              <div className="absolute inset-0 flex items-center justify-center animate-bounce-slow">
                {/* Phone Mockup */}
                <div className="w-72 h-[560px] bg-white rounded-[3rem] shadow-[0_40px_80px_rgba(30,41,59,0.3)] border-[10px] border-slate-900 overflow-hidden relative">
                  <div className="bg-slate-800 h-14 flex items-center justify-center border-b-4 border-black/10">
                    <ShieldCheck className="text-white w-6 h-6" />
                  </div>
                  <div className="p-6 space-y-6">
                    <div className="bg-red-50 p-4 rounded-2xl border-2 border-red-100">
                      <p className="text-[10px] font-black text-red-600 uppercase tracking-widest mb-1">Warning Found</p>
                      <p className="text-xs text-red-800 font-bold leading-tight">This message uses "Pressure Tactics" used by scams.</p>
                    </div>
                    <div className="space-y-3">
                      <div className="h-4 bg-slate-100 rounded-full w-3/4 animate-pulse"></div>
                      <div className="h-4 bg-slate-100 rounded-full w-1/2 animate-pulse"></div>
                    </div>
                    <div className="aspect-square bg-slate-50 rounded-3xl flex items-center justify-center flex-col gap-3 border-4 border-dashed border-slate-200">
                      <div className="p-3 bg-white rounded-full shadow-sm animate-float">
                        <Volume2 className="text-slate-400 w-8 h-8" />
                      </div>
                      <span className="text-[11px] text-slate-400 font-black uppercase tracking-widest text-center">Voice Analysis<br/>Active</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Badges */}
              <div 
                className="absolute -bottom-8 -left-8 bg-white p-6 rounded-[2rem] shadow-2xl flex items-center gap-4 border border-slate-50 scale-90 sm:scale-100 animate-float stagger-3"
                style={{ transform: `translateY(${scrollY * -0.02}px)` }}
              >
                <div className="bg-emerald-100 p-3 rounded-2xl text-emerald-600 shadow-inner">
                  <CheckCircle size={32} />
                </div>
                <div>
                  <p className="font-black text-lg text-slate-800">Secure</p>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Real-time AI</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-32 px-6 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-24 max-w-3xl mx-auto opacity-0 animate-fade-in-up stagger-1 [animation-fill-mode:forwards]">
            <h2 className="text-5xl font-black mb-6 text-slate-800">Built for Confidence</h2>
            <p className="text-xl font-medium text-slate-500 leading-relaxed">We focus on the tools that matter most to your safety, keeping the technology invisible and the protection clear.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
            <FeatureCard staggerClass="stagger-1" icon={<ShieldCheck size={32} />} title="AI Message Scan" desc="Upload screenshots of texts or emails. Dori explains the tricks in plain English." />
            <FeatureCard staggerClass="stagger-2" icon={<Gamepad2 size={32} />} title="The Safe Sandbox" desc="Interactive practice labs where you can click 'scam' links without any real danger." />
            <FeatureCard staggerClass="stagger-3" icon={<Volume2 size={32} />} title="Voice Assistant" desc="Don't want to read? Dori will read messages and safety tips aloud for you." />
            <FeatureCard staggerClass="stagger-4" icon={<Users size={32} />} title="Community Protection" desc="Report new scams and protect the entire community instantly." />
          </div>
        </div>
      </section>

      {/* Sandbox Preview */}
      <section id="how-it-works" className="py-24 px-6 relative overflow-hidden">
        <div 
          className="max-w-6xl mx-auto bg-slate-800 rounded-[4rem] p-10 md:p-20 text-white overflow-hidden relative shadow-[0_50px_100px_rgba(15,23,42,0.4)] transition-transform duration-500"
          style={{ transform: `translateY(${scrollY * 0.02}px)` }}
        >
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-20">
            <div className="flex-1 space-y-8">
              <div className="bg-amber-500 inline-block px-5 py-1.5 rounded-full text-xs font-black tracking-[0.2em] animate-pulse">LAB FEATURE</div>
              <h2 className="text-5xl font-black leading-tight">Safety with <br/> Training Wheels</h2>
              <p className="text-xl opacity-80 leading-relaxed font-medium">
                Experience the "Safe Sandbox." We've created a simulated internet where you can practice interacting with fake messages without any risk to your money or data.
              </p>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 font-bold text-lg group cursor-default">
                  <CheckCircle className="text-amber-500 transition-transform group-hover:scale-125" /> 
                  Practice without any risk
                </li>
                <li className="flex items-center gap-3 font-bold text-lg group cursor-default">
                  <CheckCircle className="text-amber-500 transition-transform group-hover:scale-125" /> 
                  Real-world deception examples
                </li>
                <li className="flex items-center gap-3 font-bold text-lg group cursor-default">
                  <CheckCircle className="text-amber-500 transition-transform group-hover:scale-125" /> 
                  Immediate educational feedback
                </li>
              </ul>
              <button onClick={onEnterSandbox} className="bg-white text-slate-800 px-12 py-5 rounded-[2rem] font-black text-xl hover:bg-slate-50 transition-all shadow-xl active:scale-95">
                Enter the Sandbox
              </button>
            </div>
            
            <div className="flex-1 w-full max-w-sm animate-float">
              <div className="bg-white rounded-[3rem] p-8 text-slate-800 shadow-2xl space-y-6 border-8 border-white/10 ring-1 ring-white/20">
                <div className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <Smartphone size={16} /> New Security Message
                </div>
                <div className="bg-sky-50 p-6 rounded-3xl border-2 border-sky-100 shadow-inner">
                  <p className="font-bold text-sm leading-relaxed text-sky-900">
                    BofA: Unusual activity detected! Verify your account immediately at: <span className="text-sky-600 underline">bofa-secure-portal.net/verify</span>
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-red-50 text-red-600 py-4 rounded-2xl font-black text-center text-xs border-2 border-red-200">It's a Trap!</div>
                  <div className="bg-emerald-50 text-emerald-600 py-4 rounded-2xl font-black text-center text-xs border-2 border-emerald-200">Safe to Click</div>
                </div>
                <p className="text-xs text-center font-bold italic text-slate-400">Can you spot the deception?</p>
              </div>
            </div>
          </div>
          {/* Decorative */}
          <div 
            className="absolute -right-32 -bottom-32 w-96 h-96 bg-sky-500 rounded-full opacity-10 blur-[100px] transition-transform duration-700"
            style={{ transform: `translate3d(-${scrollY * 0.05}px, -${scrollY * 0.05}px, 0)` }}
          />
        </div>
      </section>

      {/* CTA Footer */}
      <footer className="bg-slate-50 py-32 px-6 text-center border-t border-slate-200 relative overflow-hidden">
        <div 
          className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-transparent to-sky-500/5 pointer-events-none"
          style={{ opacity: isScrolled ? 1 : 0 }}
        />
        <div className="max-w-4xl mx-auto space-y-12 relative z-10">
          <div className="bg-slate-800 inline-flex p-5 rounded-[2rem] shadow-2xl ring-8 ring-slate-200 animate-bounce-slow">
            <ShieldCheck className="text-white w-14 h-14" />
          </div>
          <h2 className="text-5xl md:text-7xl font-black text-slate-800 tracking-tight">
            Digital Peace <br /> Starts Today.
          </h2>
          <p className="text-xl md:text-2xl text-slate-500 font-medium leading-relaxed">Join thousands of seniors who are reclaiming their digital freedom from scammers.</p>
          <div className="pt-6">
            <button onClick={onStart} className="bg-sky-600 text-white px-16 py-7 rounded-[2.5rem] text-2xl font-black shadow-[0_25px_50px_rgba(2,132,199,0.3)] hover:bg-sky-700 transition-all hover:scale-105 active:scale-95 flex items-center gap-4 mx-auto group">
              Start Protecting Now <ArrowRight size={32} className="group-hover:translate-x-2 transition-transform" />
            </button>
          </div>
          <div className="pt-20 text-[10px] font-black uppercase tracking-[0.3em] opacity-30 space-y-6">
            <p>© 2026 Dori Shield Protection Systems. Crafted with love for our elders.</p>
            <div className="flex justify-center gap-10">
              <a href="#" className="hover:opacity-100 transition-opacity">Privacy</a>
              <a href="#" className="hover:opacity-100 transition-opacity">Terms</a>
              <a href="#" className="hover:opacity-100 transition-opacity">Accessibility</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard: React.FC<{ icon: React.ReactNode, title: string, desc: string, staggerClass: string }> = ({ icon, title, desc, staggerClass }) => (
  <div className={`p-10 rounded-[3rem] border-2 border-slate-100 bg-white hover:shadow-2xl transition-all hover:-translate-y-3 group opacity-0 animate-fade-in-up ${staggerClass} [animation-fill-mode:forwards]`}>
    <div className="mb-8 p-5 bg-slate-50 inline-block rounded-2xl shadow-sm group-hover:bg-sky-50 group-hover:scale-110 transition-all text-sky-600">
      {icon}
    </div>
    <h3 className="text-2xl font-black mb-4 text-slate-800">{title}</h3>
    <p className="text-slate-500 leading-relaxed font-medium">{desc}</p>
  </div>
);

export default LandingPage;
