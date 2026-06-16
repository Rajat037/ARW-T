import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, HelpCircle } from "lucide-react";

const faqs = [
  {
    question: "Who is required to file an Income Tax Return (ITR)?",
    answer: "In India, any individual whose income exceeds the basic exemption limit (₹2.5 Lakhs under the old regime, ₹3 Lakhs under the new regime for FY 2023-24) is required to file an ITR. You must also file an ITR if you have deposited more than ₹1 Crore in a current account, spent more than ₹2 Lakhs on foreign travel, or paid an electricity bill exceeding ₹1 Lakh."
  },
  {
    question: "What is the penalty for filing ITR after the due date?",
    answer: "Filing your ITR after the due date (usually July 31st for individuals) attracts a penalty under Section 234F. If your total income exceeds ₹5 Lakhs, the late fee is ₹5,000. If your income is below ₹5 Lakhs, the maximum penalty is ₹1,000. You may also have to pay interest under Section 234A on the pending tax amount."
  },
  {
    question: "Can I revise my ITR if I made a mistake?",
    answer: "Yes, if you discover an omission or error after filing your original return, you can file a 'Revised Return' under Section 139(5). This must be filed before the end of the relevant assessment year (i.e., by December 31st) or before the completion of the assessment, whichever is earlier."
  },
  {
    question: "Which ITR form should I use?",
    answer: "The correct form depends on your income source:\n- ITR-1 (Sahaj): For individuals having income from salary, one house property, and other sources (interest etc.) up to ₹50 Lakhs.\n- ITR-2: For individuals/HUFs not having income from business or profession.\n- ITR-3: For individuals having income from business or profession.\n- ITR-4 (Sugam): For presumptive income from business or profession."
  },
  {
    question: "Is it mandatory to link Aadhaar with PAN for e-filing?",
    answer: "Yes, it is mandatory to link your Aadhaar card with your PAN. Without this linkage, your PAN will become inoperative, you will not be able to file your ITR, and pending refunds will not be processed."
  },
  {
    question: "How do I claim a tax refund?",
    answer: "A tax refund is automatically calculated when you file your ITR if the taxes paid (TDS/TCS/Advance Tax) exceed your actual tax liability. Ensure you pre-validate your bank account on the e-filing portal to receive the refund directly into your bank account."
  },
  {
    question: "What are the common deductions under Section 80C?",
    answer: "Section 80C allows a maximum deduction of ₹1.5 Lakhs per year. Common investments include Life Insurance Premiums, Public Provident Fund (PPF), Equity Linked Savings Scheme (ELSS), Employee Provident Fund (EPF), National Savings Certificate (NSC), and principal repayment of a Home Loan."
  }
];

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="bg-[#f8f9fa] min-h-[calc(100vh-80px)] py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <HelpCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
          <p className="text-lg text-gray-600">
            Find answers to common tax-related queries and clear your doubts regarding ITR filing.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-gray-100 last:border-none">
              <button
                className="w-full text-left px-6 py-5 flex items-center justify-between focus:outline-none focus:bg-gray-50 hover:bg-gray-50 transition-colors"
                onClick={() => toggleAccordion(index)}
                aria-expanded={openIndex === index}
              >
                <span className="font-semibold text-gray-800 pr-8">{faq.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-gray-500 transition-transform flex-shrink-0 ${openIndex === index ? "rotate-180 text-green-600" : ""}`}
                />
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-5 text-gray-600 whitespace-pre-line leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center bg-green-50 rounded-2xl p-8 border border-green-100">
          <h3 className="text-xl font-bold text-green-800 mb-2">Still have questions?</h3>
          <p className="text-green-700 mb-6">Can't find the answer you're looking for? Please chat to our friendly team.</p>
          <a
            href="/contact"
            className="inline-block bg-green-600 text-white font-semibold px-8 py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            Get in touch
          </a>
        </div>
      </div>
    </div>
  );
}
