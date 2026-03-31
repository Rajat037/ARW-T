import { motion } from 'motion/react';
import { Briefcase, FileSignature, Calculator, TrendingUp, HandCoins } from 'lucide-react';

export function Services() {
    const services = [
        {
            icon: <FileSignature className="w-8 h-8" />,
            title: "Income Tax Filing",
            description: "Hassle-free accurate ITR filing specialized for creators, startups, and enterprises.",
            color: "from-blue-500 to-indigo-500",
            bgLight: "bg-blue-50 text-blue-600"
        },
        {
            icon: <Briefcase className="w-8 h-8" />,
            title: "GST Registration & Compliance",
            description: "Stay compliant across state borders with seamless GST integration and monthly filing.",
            color: "from-teal-400 to-emerald-500",
            bgLight: "bg-teal-50 text-teal-600"
        },
        {
            icon: <Calculator className="w-8 h-8" />,
            title: "Strategic Tax Planning",
            description: "Keep more of what you earn through intelligent, legal tax deductions.",
            color: "from-purple-500 to-pink-500",
            bgLight: "bg-purple-50 text-purple-600"
        },
        {
            icon: <TrendingUp className="w-8 h-8" />,
            title: "Revenue & Compliance Management",
            description: "Account for diversified income, corporate revenue, and global transactions seamlessly.",
            color: "from-orange-400 to-red-500",
            bgLight: "bg-orange-50 text-orange-600"
        },
        {
            icon: <HandCoins className="w-8 h-8" />,
            title: "Business & Digital Advisory",
            description: "Strategic financial advice customized for scale-ups, founders, and digital creators.",
            color: "from-indigo-600 to-purple-600",
            bgLight: "bg-indigo-50 text-indigo-600"
        }
    ];

    return (
        <section className="py-24 bg-gray-50">
            <div className="container mx-auto px-6">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-extrabold text-indigo-950 mb-6"
                    >
                        Services Designed for <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-indigo-600">You</span>
                    </motion.h2>
                    <p className="text-lg text-gray-600">
                        We offer comprehensive tax and financial services so you can focus 100% on what you do best: growing your business.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map((service, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            whileHover={{ y: -8 }}
                            className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] transition-all border border-gray-100 group cursor-pointer relative overflow-hidden"
                        >
                            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-bl-full`} />

                            <div className={`w-16 h-16 rounded-2xl ${service.bgLight} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                {service.icon}
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
                            <p className="text-gray-600 leading-relaxed font-medium">
                                {service.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
