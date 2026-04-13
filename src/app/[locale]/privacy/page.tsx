import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Terms of Service | Haku',
  description: 'The legal terms and conditions for using Haku AI Resume Analyzer.',
};

export default function Privacy() {
    const lastUpdated = new Date("2026-04-9");
  return (
    <div className="min-h-screen bg-white font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <Header />

      <div className="max-w-7xl mx-auto pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="mb-12 border-b border-zinc-200 dark:border-zinc-800 pb-8">
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-white mb-4">
            Privacy Policy
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400">
            Last updated: {lastUpdated.toDateString()}
          </p>
        </div>

        {/* Content Section using Tailwind Prose */}
        <article className="prose prose-zinc dark:prose-invert max-w-none">
          <p>
            At <strong>Haku</strong>, we respect your privacy and are committed to protecting the personal data you share with us. This policy outlines how we collect, use, and protect your information when you use our AI resume analysis platform.
          </p>

          <h2>1. Information We Collect</h2>
          <ul>
            <li><strong>Account Information:</strong> Your email address and name (provided via registration or OAuth).</li>
            <li><strong>Resume Data:</strong> The text and files (PDF, Docx) you upload for analysis.</li>
            <li><strong>Job Descriptions:</strong> Any text you provide regarding specific job roles you are targeting.</li>
            <li><strong>Payment Information:</strong> Handled exclusively by <strong>Stripe</strong>. We do not store or see your credit card numbers.</li>
            <li><strong>Usage Data:</strong> Technical metadata such as IP addresses, browser types, and token consumption for credit management.</li>
          </ul>

          <h2>2. How We Use Your Data</h2>
          <ul>
            <li><strong>AI Analysis:</strong> To generate compatibility scores and technical feedback using Large Language Models (LLMs).</li>
            <li><strong>Monetization:</strong> To manage your credit balance and process one-time payments.</li>
            <li><strong>Personalization:</strong> To maintain your analysis history and track improvement over time.</li>
            <li><strong>Security:</strong> To prevent "sybil attacks" or abuse of our Welcome Credit system.</li>
          </ul>

          <h2>3. Data Processing & Third Parties</h2>
          <p>We use industry-leading sub-processors to power Haku:</p>
          <ul>
            <li><strong>AI Processing (Google Gemini):</strong> Resumes are sent to the Google Gemini API for real-time analysis. We use the Paid Tier of these services, which ensures that your prompts and resumes are not used to train Google’s global AI models.</li>
            <li><strong>Payment Processing (Stripe):</strong> Transactional data is managed by Stripe. They act as an independent data controller for your payment security.</li>
            <li><strong>Infrastructure:</strong> Our servers and databases (hosted via AWS) store your encrypted data.</li>
          </ul>

          <h2>4. Right to Erasure (Right to be Forgotten)</h2>
          <p>You have the right to request the permanent deletion of your personal data.</p>
          <ul>
            <li><strong>Manual Deletion:</strong> You may delete individual resumes at any time through your dashboard. Once deleted, they are immediately removed from our active production databases.</li>
            <li><strong>Account Closure:</strong> Upon closing your account, Haku will initiate a "Hard Delete" of your profile, file history, and analysis records.</li>
            <li><strong>Legal Exceptions:</strong> We must retain certain transaction records (via Stripe) for a legally mandated period to comply with tax and financial reporting laws.</li>
            <li><strong>Backups:</strong> Deleted data may persist in encrypted system backups for up to 30 days before being permanently overwritten.</li>
          </ul>

          <h2>5. Data Retention</h2>
          <ul>
            <li><strong>Resumes:</strong> Stored as long as your account is active or until you manually delete them.</li>
            <li><strong>Welcome Credits:</strong> Any unused "Welcome Credits" are automatically removed from our system seven (7) days after account creation.</li>
            <li><strong>Logs:</strong> System logs are purged every 180 days.</li>
          </ul>

          <h2>6. AI Disclosure & Profiling</h2>
          <p>
            By using Haku, you understand that your data is processed by automated AI systems to generate "Compatibility Scores." These scores are estimates based on pattern matching and do not represent a final judgment on your employability or professional worth.
          </p>
          
          <h2>7. Contact Us</h2>
          <p>
            For any data privacy requests or questions regarding your Right to Erasure, please contact: <strong>support@haku.ai</strong>.
          </p>
        </article>
      </div>

      <Footer />
    </div>
  );
}
