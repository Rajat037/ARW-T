import { motion } from 'motion/react';
import { UploadCloud, FileSearch, CheckCircle } from 'lucide-react';

export function HowItWorks() {
    const steps = [
        {
            icon: <UploadCloud className="w-8 h-8 text-indigo-600" />,
            title: "Step 1: Upload your documents",
            description: "Securely upload your bank statements, invoices, and expense receipts via our encrypted vault. No complex spreadsheets needed."
        },
        {
            icon: <FileSearch className="w-8 h-8 text-teal-600" />,
            title: "Step 2: CA reviews your case",
            description: "A dedicated Chartered Accountant analyzes your income streams, maximizes your deductions, and prepares your filings."
        },
        {
            icon: <CheckCircle className="w-8 h-8 text-emerald-600" />,
            title: "Step 3: Filing & Confirmation",
            description: "We handle the accurate submission to the tax department and send you the final confirmation receipt instantly."
        }
    ];

    return (
        <section className="py-24 bg-white relative overflow-hidden">
            {/* Decorative Line Path Background */}
            <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-100 to-transparent hidden md:block"></div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="inline-block px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-700 font-semibold mb-6 tracking-wide text-sm"
                    >
                        SIMPLE PROCESS
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6"
                    >
                        How A.R. Wealth & Tax Co. Works
                    </motion.h2>
                    <p className="text-lg text-gray-600">
                        A frictionless, 3-step timeline designed to take taxes entirely off your plate.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                    {steps.map((step, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.2 }}
                            className="relative flex flex-col items-center text-center"
                        >
                            <div className="w-20 h-20 bg-white rounded-3xl shadow-[0_10px_30px_-10px_rgba(0,0,0,0.1)] border border-gray-100 flex items-center justify-center mb-8 relative z-10">
                                <div className={`absolute inset-0 rounded-3xl opacity-10 ${i === 0 ? 'bg-indigo-600' : i === 1 ? 'bg-teal-600' : 'bg-emerald-600'}`}></div>
                                {step.icon}
                            </div>

                            {/* Connector line for mobile */}
                            {i < 2 && (
                                <div className="w-[1px] h-12 bg-indigo-100 my-2 md:hidden"></div>
                            )}

                            <h3 className="text-2xl font-bold text-gray-900 mb-4">{step.title}</h3>
                            <p className="text-gray-600 leading-relaxed">
                                {step.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
