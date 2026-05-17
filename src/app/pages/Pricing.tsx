import { Check } from "lucide-react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";

const pricingPlans = [
  {
    id: "standard",
    name: "eCA Assisted - Standard",
    icon: "💳",
    description:
      "Includes salary income from one employer, single house property income & income from other sources.",
    basePrice: "₹2999",
    price: "₹ 2000",
    features: [
      "Salary income from one employer",
      "Single house property income",
      "Income from other sources",
      "Expert eCA support",
      "100% refund guarantee",
    ],
  },
  {
    id: "multiple-form-16",
    name: "eCA Assisted - Multiple Form 16",
    icon: "💼",
    description:
      "Everything in Standard plus salary income from multiple employers.",
    basePrice: "₹3429",
    price: "₹ 2799",
    features: [
      "All features of Standard plan",
      "Salary income from multiple employers",
      "Multiple Form 16 support",
      "Expert eCA support",
      "Priority processing",
    ],
  },
  {
    id: "business-income",
    name: "eCA Assisted - Business Income",
    icon: "📊",
    description:
      "Everything in Multiple Form 16 plus income from multiple house property and income u/s 44AD & 44ADA.",
    basePrice: "₹5160",
    price: "₹ 4000",
    features: [
      "All features of Multiple Form 16",
      "Multiple house property income",
      "Business income u/s 44AD & 44ADA",
      "Comprehensive tax planning",
      "Dedicated expert support",
    ],
  },
  {
    id: "capital-gain",
    name: "eCA Assisted - Capital Gain",
    icon: "📈",
    description:
      "Everything in Business Income plus capital gain income and relief u/s 89.",
    basePrice: "₹7939",
    price: "₹ 5999",
    features: [
      "All features of Business Income",
      "Capital gain income calculation",
      "Relief under section 89",
      "Investment advisory",
      "Tax saving strategies",
    ],
  },
  {
    id: "nri",
    name: "eCA Assisted - NRI",
    icon: "🌍",
    description: "Provides maximum tax benefit on your Indian income.",
    basePrice: "₹11910",
    price: "₹ 9528",
    features: [
      "NRI-specific tax filing",
      "Maximum tax benefits",
      "Double taxation relief",
      "Foreign income reporting",
      "Expert NRI tax consultant",
    ],
  },
  {
    id: "foreign",
    name: "eCA Assisted - Foreign",
    icon: "🔍",
    description:
      "Covers all your foreign income and provides the maximum benefit under DTAA.",
    basePrice: "₹15880",
    price: "₹ 12704",
    features: [
      "Foreign income reporting",
      "Maximum benefit under DTAA",
      "Schedule FA filing",
      "Comprehensive tax planning",
      "Premium expert support",
    ],
  },
];

export function Pricing() {
  return (
    <div className="bg-gradient-to-b from-blue-50 to-white min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-indigo-700 py-16 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-semibold mb-4"
          >
            Income Tax Return Filing Pricing Plans
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-blue-100"
          >
            Select The{" "}
            <span className="underline decoration-2">Product That's Right</span>{" "}
            For You
          </motion.p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all border border-gray-200"
            >
              <div className="text-5xl mb-4">{plan.icon}</div>
              <h3 className="text-2xl font-semibold mb-3">{plan.name}</h3>
              <p className="text-gray-600 text-sm mb-6 min-h-[60px]">
                {plan.description}
              </p>

              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm text-gray-500">Base Price:</span>
                  <span className="text-lg text-gray-400 line-through">
                    {plan.basePrice}
                  </span>
                </div>
                <div className="text-4xl font-semibold text-gray-900 mb-1">
                  {plan.price}
                </div>
                <div className="text-sm text-gray-500">+ Taxes</div>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-gray-700"
                  >
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                to="/contact"
                className="block w-full bg-white border-2 border-gray-900 text-gray-900 px-6 py-3 rounded-full font-semibold text-center hover:bg-gray-900 hover:text-white transition-colors"
              >
                Buy Now
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-semibold text-center mb-12"
          >
            Why Choose A.R. Wealth & Tax Co.?
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">
                100% Accurate Filing
              </h3>
              <p className="text-gray-600">
                Our expert eCAs ensure your returns are filed accurately with
                maximum refund
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">
                Quick & Easy Process
              </h3>
              <p className="text-gray-600">
                File your ITR in just 4 minutes with our simple and intuitive
                platform
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">
                Secure & Confidential
              </h3>
              <p className="text-gray-600">
                Your data is encrypted and protected with bank-level security
                standards
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-3xl p-12 text-center text-white"
        >
          <h2 className="text-4xl font-semibold mb-4">
            Not Sure Which Plan to Choose?
          </h2>
          <p className="text-xl text-indigo-100 mb-8">
            Our tax experts can help you select the best plan for your needs
          </p>
          <Link
            to="/contact"
            className="inline-block bg-white text-indigo-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-indigo-50 transition-colors"
          >
            Talk to an Expert
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
