"use client";

import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useState } from "react";

export default function Faq() {
  const t = useTranslations();

  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      question: t("landing.faq.questions.q1.question"),
      answer: t("landing.faq.questions.q1.answer"),
    },
    {
      question: t("landing.faq.questions.q2.question"),
      answer: t("landing.faq.questions.q2.answer"),
    },
    {
      question: t("landing.faq.questions.q3.question"),
      answer: t("landing.faq.questions.q3.answer"),
    },
    {
      question: t("landing.faq.questions.q4.question"),
      answer: t("landing.faq.questions.q4.answer"),
    },
  ];

  return (
    <section id="faq" className="py-24 lg:py-32">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-indigo-600 font-black uppercase tracking-widest text-sm mb-4">
            Support
          </h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">
            Common Questions
          </h3>
          <p className="text-slate-500">
            Everything you need to know about the Haku platform.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-slate-200 rounded-2xl overflow-hidden bg-white hover:border-indigo-100 transition-colors"
            >
              <button
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                className="w-full px-6 py-5 text-left flex items-center justify-between group"
              >
                <span
                  className={`font-bold transition-colors ${openFaq === index ? "text-indigo-600" : "text-slate-900 group-hover:text-indigo-600"}`}
                >
                  {faq.question}
                </span>
                <ChevronDownIcon
                  className={`h-5 w-5 text-slate-400 transition-transform duration-300 ${openFaq === index ? "rotate-180 text-indigo-500" : ""}`}
                />
              </button>
              <AnimatePresence>
                {openFaq === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div className="px-6 pb-6 text-slate-500 text-sm leading-relaxed border-t border-slate-50 pt-4">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* <div className="mt-16 p-8 bg-indigo-50 rounded-[2rem] border border-indigo-100 flex flex-col sm:flex-row items-center justify-between">
            <div className="flex items-center mb-4 sm:mb-0">
               <div className="p-3 bg-white rounded-2xl mr-4 shadow-sm">
                  <QuestionMarkCircleIcon className="h-6 w-6 text-indigo-600" />
               </div>
               <div className="text-center sm:text-left">
                  <p className="font-bold text-slate-900">Still have questions?</p>
                  <p className="text-sm text-slate-500">We're here to help you land that role.</p>
               </div>
            </div>
            <Link 
              href="/contact" 
              className="px-6 py-3 bg-white text-indigo-600 font-bold rounded-xl border border-indigo-100 hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
            >
              Contact Support
            </Link>
          </div> */}
      </div>
    </section>
  );
}
