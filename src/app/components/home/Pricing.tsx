import { motion } from 'motion/react';
import { Check, Star } from 'lucide-react';
import { Link } from 'react-router';

export function Pricing() {
    const plans = [
        {
            name: "Essential ITR Filing",
            price: "₹1,499",
            period: "/ year",
            description: "Perfect for freelancers and early-stage startups with straightforward income.",
            features: [
                "Dedicated Chartered Accountant",
                "Salary & Platform Income",
                "Business Deductions Claim",
                "E-filing confirmation within 48 hrs",
                "Email Support"
            ],
            cta: "Get Started",
            popular: false,
            color: "indigo"
        },
        {
            name: "Freelancer Tax Package",
            price: "₹3,999",
            period: "/ year",
            description: "For established businesses managing multiple revenue streams and complex compliance.",
            features: [
                "Everything in Essential plan",
                "Brand Deal & Sponsorship Income",
                "Advance Tax Calculation",
                "Foreign Income Declaration (Schedule FA)",
                "Priority WhatsApp Support"
            ],
            cta: "Choose Recommended",
            popular: true,
            color: "teal"
        },
        {
            name: "Corporate GST & Compliance",
            price: "₹2,499",
            period: "/ one-time",
            description: "Required for growing enterprises crossing revenue thresholds or handling overseas clients.",
            features: [
                "GST Registration",
                "HSN Code Classification",
                "Letter of Undertaking (LUT) for Exports",
                "First month GST return free",
                "Compliance Advisory"
            ],
            cta: "Register GST",
            popular: false,
            color: "emerald"
        }
    ];

    return (
        <section className="py-24 bg-gray-50 relative">
            <div className="container mx-auto px-6">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-extrabold text-indigo-950 mb-6"
                    >
                        Transparent, Flat Pricing
                    </motion.h2>
                    <p className="text-lg text-gray-600">
                        No hidden fees. Pick the package that aligns with your business growth.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-center">
                    {plans.map((plan, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className={`bg-white rounded-3xl p-8 border ${plan.popular
                                    ? 'border-teal-400 shadow-[0_20px_50px_-15px_rgba(45,212,191,0.3)] ring-2 ring-teal-400/20 transform md:-translate-y-4'
                                    : 'border-gray-100 shadow-sm hover:shadow-lg'
                                } transition-all relative flex flex-col h-full`}
                        >
                            {plan.popular && (
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-teal-400 to-emerald-400 text-white px-4 py-1 rounded-full text-sm font-bold tracking-wide flex items-center gap-1 shadow-md">
                                    <Star className="w-4 h-4 fill-white" /> Most Popular
                                </div>
                            )}

                            <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                            <p className="text-gray-500 mb-6 text-sm min-h-[40px]">{plan.description}</p>

                            <div className="mb-8 flex items-end gap-1">
                                <span className="text-4xl font-extrabold text-gray-900">{plan.price}</span>
                                <span className="text-gray-500 font-medium pb-1">{plan.period}</span>
                            </div>

                            <ul className="mb-8 space-y-4 flex-grow">
                                {plan.features.map((feature, idx) => (
                                    <li key={idx} className="flex items-start gap-3">
                                        <Check className={`w-5 h-5 flex-shrink-0 mt-0.5 ${plan.popular ? 'text-teal-500' : 'text-indigo-500'
                                            }`} />
                                        <span className="text-gray-700 font-medium">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <Link to="/contact">
                                <button className={`w-full py-4 rounded-full font-bold transition-all ${plan.popular
                                        ? 'bg-gradient-to-r from-teal-400 to-emerald-400 text-white hover:shadow-[0_10px_20px_-10px_rgba(45,212,191,0.5)] hover:scale-[1.02]'
                                        : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                                    }`}>
                                    {plan.cta}
                                </button>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
