import { motion } from 'motion/react';
import { Star } from 'lucide-react';

export function Testimonials() {
    const testimonials = [
        {
            name: "Rohan K.",
            role: "Tech YouTuber, 1.2M Subs",
            content: "A.R. Wealth & Tax Co. completely took the anxiety out of filing taxes. My brand deals and YouTube AdSense were handled flawlessly. I saved over ₹2 Lakhs in deductions!",
            image: "https://i.pravatar.cc/150?img=11",
            rating: 5
        },
        {
            name: "Sneha M.",
            role: "Lifestyle Influencer",
            content: "As a freelancer, I had no idea how GST applied to PR packages and brand collaborations. Their CA walked me through everything. Unmatched service.",
            image: "https://i.pravatar.cc/150?img=5",
            rating: 5
        },
        {
            name: "Aman D.",
            role: "Freelance UI Developer",
            content: "Fast, digital, and completely transparent. I just uploaded my statements, had a quick Google Meet with my assigned CA, and my taxes were filed error-free.",
            image: "https://i.pravatar.cc/150?img=33",
            rating: 5
        }
    ];

    return (
        <section className="py-24 bg-white">
            <div className="container mx-auto px-6">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-extrabold text-indigo-950 mb-6"
                    >
                        Loved by <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-indigo-600">Industry Leaders</span>
                    </motion.h2>
                    <p className="text-lg text-gray-600">
                        Don't just take our word for it. Here's what our diverse range of clients have to say.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {testimonials.map((test, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-indigo-50/50 rounded-3xl p-8 border border-indigo-100 hover:bg-white hover:shadow-xl transition-all group"
                        >
                            <div className="flex items-center gap-1 mb-6">
                                {[...Array(test.rating)].map((_, idx) => (
                                    <Star key={idx} className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                                ))}
                            </div>

                            <p className="text-gray-700 italic mb-8 min-h-[100px] leading-relaxed relative">
                                <span className="text-4xl text-indigo-200 absolute -top-4 -left-2 tracking-tighter">"</span>
                                {test.content}
                            </p>

                            <div className="flex items-center gap-4">
                                <img
                                    src={test.image}
                                    alt={test.name}
                                    className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm"
                                />
                                <div>
                                    <h4 className="font-bold text-gray-900">{test.name}</h4>
                                    <p className="text-gray-500 text-sm font-medium">{test.role}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
