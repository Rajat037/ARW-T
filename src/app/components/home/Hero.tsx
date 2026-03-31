import { motion } from 'motion/react';
import { ArrowRight, FileText } from 'lucide-react';
import { Link } from 'react-router';

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-24 pb-32 bg-indigo-950 text-white">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-indigo-600 rounded-full mix-blend-multiply filter blur-[120px] opacity-60 animate-blob"></div>
        <div className="absolute top-[20%] right-[-10%] w-[400px] h-[400px] bg-teal-500 rounded-full mix-blend-multiply filter blur-[120px] opacity-40 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-32 left-[20%] w-[600px] h-[600px] bg-purple-600 rounded-full mix-blend-multiply filter blur-[120px] opacity-40 animate-blob animation-delay-4000"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10 text-center flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="max-w-4xl"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-8 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
            <span className="text-sm font-medium tracking-wide text-indigo-100">Tax Advisory for the Creator Economy</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-8 leading-tight">
            Built for Creators. Trusted by Businesses. <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-emerald-300 to-indigo-300">
              Designed for Growth.
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-indigo-200 mb-12 max-w-3xl mx-auto font-light leading-relaxed">
            Whether you’re a freelancer, startup founder, or enterprise leader—our end-to-end tax and compliance solutions help you scale confidently while we handle the complexities.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            <Link to="/contact">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-teal-400 hover:bg-teal-300 text-indigo-950 font-bold text-lg shadow-[0_0_40px_-10px_rgba(45,212,191,0.5)] transition-all flex items-center justify-center gap-2"
              >
                Start Free Consultation
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </Link>
            
            <Link to="/pricing">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 text-white font-semibold text-lg transition-all flex items-center justify-center gap-2"
              >
                Explore Services
                <FileText className="w-5 h-5" />
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
