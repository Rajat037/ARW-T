import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";

export function CallToAction() {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-indigo-950"></div>
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>

      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-teal-500 rounded-full mix-blend-multiply filter blur-[150px] opacity-40 animate-blob"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-600 rounded-full mix-blend-multiply filter blur-[150px] opacity-40 animate-blob animation-delay-2000"></div>

      <div className="container mx-auto px-6 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-10 md:p-16 shadow-2xl"
        >
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-teal-300" />
            </div>
          </div>

          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
            Focus on Growth. <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-emerald-300">
              We'll Handle the Taxes.
            </span>
          </h2>

          <p className="text-xl text-indigo-200 mb-10 max-w-2xl mx-auto font-light">
            Join hundreds of founders, enterprises, and creators who trust A.R.
            Wealth & Tax Co. to secure their financial future.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/contact">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-teal-400 hover:bg-teal-300 text-indigo-950 font-bold text-lg shadow-[0_0_30px_-10px_rgba(45,212,191,0.6)] transition-all flex items-center justify-center gap-2"
              >
                Start Tax Filing
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </Link>

            <Link to="/contact">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-transparent border border-white/30 hover:bg-white/10 text-white font-semibold text-lg transition-all flex items-center justify-center"
              >
                Get Free Consultation
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
