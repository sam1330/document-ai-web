import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Terms of Service | Haku',
  description: 'The legal terms and conditions for using Haku AI Resume Analyzer.',
};

export default function Terms() {
    const lastUpdated = new Date("2026-04-9");
  return (
    <div className="min-h-screen bg-white font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <Header />

      <div className="max-w-7xl mx-auto pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="mb-12 border-b border-zinc-200 dark:border-zinc-800 pb-8">
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-white mb-4">
            Terms of Service
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400">
            Last updated: {lastUpdated.toDateString()}
          </p>
        </div>

        {/* Content Section using Tailwind Prose */}
        <article className="prose prose-zinc dark:prose-invert max-w-none">
          <p>
            By accessing or using <strong>Haku</strong> (the "Service"), you agree to be bound by these Terms of Service. If you do not agree, you must immediately cease use of the Service.
          </p>

          <h2>1. Description of Service</h2>
          <p>
            Haku is an AI-powered resume analysis platform. The Service uses Large Language Models (LLMs), specifically Google Gemini, to provide feedback, scoring, and optimization suggestions for resumes based on job descriptions.
          </p>

          <h2>2. The Credit System</h2>
          <p>Haku operates on a credit-based monetization model.</p>
          <ul>
            <li><strong>Credit Usage:</strong> Each analysis or premium feature consumes a specific number of credits as indicated within the app.</li>
            <li><strong>Purchased Credits:</strong> Credits purchased via Stripe are non-refundable and do not expire as long as your account remains active.</li>
            <li><strong>Welcome Credits:</strong> Haku may provide "Welcome Credits" to new users. These credits are a gift, have no cash value, and <strong>expire seven (7) days</strong> after account creation.</li>
            <li><strong>Abuse Policy:</strong> Creating multiple accounts to harvest Welcome Credits is strictly prohibited. Haku reserves the right to terminate accounts and forfeit credits if abuse is detected via IP tracking or device fingerprinting.</li>
          </ul>

          <h2>3. AI Disclaimer & "As-Is" Results</h2>
          <ul>
            <li><strong>No Guarantee:</strong> You acknowledge that AI can produce "hallucinations" or inaccuracies. Haku does not guarantee that following AI suggestions will result in an interview, job offer, or specific ATS (Applicant Tracking System) performance.</li>
            <li><strong>Not Professional Advice:</strong> The feedback provided is for informational purposes only and does not constitute professional career coaching or legal advice.</li>
            <li><strong>Service Availability:</strong> While we aim for 100% uptime, we are not responsible for delays caused by LLM provider outages (e.g., Google Gemini) or Stripe processing delays.</li>
          </ul>

          <h2>4. User Content & Data</h2>
          <ul>
            <li><strong>Ownership:</strong> You retain 100% ownership of any resumes, job descriptions, or text you upload to Haku.</li>
            <li><strong>License to Process:</strong> By uploading content, you grant Haku a limited license to process that data through third-party AI processors (Google Gemini) solely to provide the Service to you.</li>
            <li><strong>Data Security:</strong> We implement industry-standard security measures, but you acknowledge that no transmission over the internet is 100% secure.</li>
          </ul>

          <h2>5. Payments & Refunds</h2>
          <ul>
            <li><strong>Processing:</strong> All payments are handled securely via Stripe. Haku does not store your credit card information.</li>
            <li><strong>Refund Policy:</strong> Due to the immediate costs associated with AI token consumption, all sales are final. Refunds are only considered in the event of a verified technical error where credits were deducted but no analysis was generated.</li>
          </ul>

          <h2>6. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law, Haku and its operators shall not be liable for any indirect, incidental, or consequential damages—including loss of income or employment opportunities—resulting from your use of the Service.
          </p>

          <h2>7. Contact</h2>
          <p>
            If you have questions about these terms, please contact us at <strong>support@haku.ai</strong>.
          </p>
        </article>
      </div>
      <Footer />
    </div>
  );
}
