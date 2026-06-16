import { motion } from 'motion/react';
import { Users, ShieldCheck, Lock, Zap } from 'lucide-react';

export function TrustIndicators() {
    const stats = [
        {
            icon: <Users className="w-8 h-8 text-teal-400" />,
            subtitle: "Clients Served"
        },
        {
            icon: <ShieldCheck className="w-8 h-8 text-emerald-400" />,
            title: "Expert",
            subtitle: "Chartered Accountants"
        },
        {
            icon: <Lock className="w-8 h-8 text-indigo-400" />,
            title: "Secure &",
            subtitle: "Confidential Process"
        },
        {
            icon: <Zap className="w-8 h-8 text-purple-400" />,
            title: "Fast",
            subtitle: "Digital Filing"
        }
    ];

    return (
        <section className="py-16 bg-white relative -mt-10 z-20 container mx-auto px-4 md:px-8">
            <div className="bg-white rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-gray-100 p-8 md:p-12">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x-0 md:divide-x divide-gray-100">
                    {stats.map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1, duration: 0.5 }}
                            className="flex flex-col items-center text-center px-4"
                        >
                            <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center mb-4 text-indigo-600 shadow-sm">
                                {stat.icon}
                            </div>
                            <h3 className="text-3xl font-bold tracking-tight text-gray-900 mb-1">{stat.title}</h3>
                            <p className="text-gray-500 font-medium">{stat.subtitle}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
