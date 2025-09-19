'use client'

import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import Header from '@/components/Header'
import { 
  DocumentTextIcon, 
  BriefcaseIcon, 
  SparklesIcon,
  ChartBarIcon,
  CheckCircleIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline'

export default function Home() {
  const { user } = useAuth()

  if (user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="pt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
              Welcome back, {user.first_name}!
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Ready to take your job search to the next level?
            </p>
            <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
              <div className="rounded-md shadow">
                <Link
                  href="/dashboard"
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"
                >
                  Go to Dashboard
                </Link>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      {/* Hero section */}
      <div className="relative overflow-hidden bg-white pt-20">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block xl:inline">AI-Powered Resume &</span>{' '}
                  <span className="block text-indigo-600 xl:inline">Job Application Assistant</span>
                </h1>
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  Transform your job search with AI-powered resume analysis, optimization, and personalized cover letter generation. Get hired faster with intelligent insights.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <Link
                      href="/register"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"
                    >
                      Get started for free
                    </Link>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <Link
                      href="/login"
                      className="w-full flex items-center justify-center px-8 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
                    >
                      Sign in
                    </Link>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <div className="h-56 w-full bg-gradient-to-br from-indigo-500 via-purple-600 to-purple-700 sm:h-72 md:h-96 lg:w-full lg:h-full flex items-center justify-center">
            <div className="text-white text-center">
              <SparklesIcon className="mx-auto h-24 w-24 mb-4" />
              <h3 className="text-2xl font-bold">Powered by AI</h3>
              <p className="text-lg opacity-90">GPT-4 Technology</p>
            </div>
          </div>
        </div>
      </div>

      {/* Features section */}
      <div id="features" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need to land your dream job
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
              Our AI-powered platform provides comprehensive tools to optimize your job search process.
            </p>
          </div>

          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white mb-4">
                  <DocumentTextIcon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Resume Analysis</h3>
                <p className="text-gray-500">
                  Upload your resume and get instant AI-powered analysis with ATS optimization suggestions.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white mb-4">
                  <BriefcaseIcon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Job Applications</h3>
                <p className="text-gray-500">
                  Track and manage your job applications with personalized cover letter generation.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white mb-4">
                  <SparklesIcon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">AI Optimization</h3>
                <p className="text-gray-500">
                  Get AI-powered suggestions to improve your resume and increase your chances of getting hired.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white mb-4">
                  <ChartBarIcon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Analytics Dashboard</h3>
                <p className="text-gray-500">
                  Track your progress with detailed analytics and insights into your job search performance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How it works section */}
      <div id="how-it-works" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              How it works
            </h2>
            <p className="mt-4 text-xl text-gray-500">
              Get started in minutes and transform your job search
            </p>
          </div>

          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
              <div className="text-center">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 text-indigo-600 mx-auto mb-4">
                  <span className="text-2xl font-bold">1</span>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Upload Your Resume</h3>
                <p className="text-gray-500">
                  Upload your resume in PDF or DOCX format. Our AI will analyze it for ATS compatibility and optimization opportunities.
                </p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 text-indigo-600 mx-auto mb-4">
                  <span className="text-2xl font-bold">2</span>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Get AI Analysis</h3>
                <p className="text-gray-500">
                  Receive detailed feedback on your resume with specific suggestions for improvement, keyword optimization, and ATS compatibility.
                </p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 text-indigo-600 mx-auto mb-4">
                  <span className="text-2xl font-bold">3</span>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Land More Interviews</h3>
                <p className="text-gray-500">
                  Apply with confidence using optimized resumes and personalized cover letters that get you noticed by recruiters.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Why choose us section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Why choose CvEnhance?
            </h2>
            <p className="mt-4 text-xl text-gray-500">
              The most advanced AI-powered job search platform
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-10 w-10 rounded-md bg-indigo-500 text-white">
                    <SparklesIcon className="h-6 w-6" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Powered by Advanced AI</h3>
                  <p className="mt-2 text-gray-500">
                    Our platform uses GPT-4 technology to provide intelligent resume analysis, optimization suggestions, and personalized cover letter generation that adapts to your industry and role.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-10 w-10 rounded-md bg-indigo-500 text-white">
                    <ChartBarIcon className="h-6 w-6" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">ATS-Optimized</h3>
                  <p className="mt-2 text-gray-500">
                    Every resume is analyzed for ATS compatibility, ensuring your application passes through automated screening systems and reaches human recruiters.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-10 w-10 rounded-md bg-indigo-500 text-white">
                    <BriefcaseIcon className="h-6 w-6" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Complete Job Search Solution</h3>
                  <p className="mt-2 text-gray-500">
                    Track applications, generate cover letters, analyze job descriptions, and get insights - all in one platform designed to streamline your job search process.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-10 w-10 rounded-md bg-indigo-500 text-white">
                    <CheckCircleIcon className="h-6 w-6" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Proven Results</h3>
                  <p className="mt-2 text-gray-500">
                    Our users report 3x more interview callbacks and significantly improved job search success rates with our AI-powered optimization tools.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success stories section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Success stories
            </h2>
            <p className="mt-4 text-xl text-gray-500">
              See how CvEnhance has helped job seekers land their dream jobs
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="h-5 w-5 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                "CvEnhance's AI analysis helped me identify exactly what was wrong with my resume. I went from 0 callbacks to 5 interviews in just 2 weeks!"
              </p>
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                  <span className="text-indigo-600 font-medium">SJ</span>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Sarah Johnson</p>
                  <p className="text-sm text-gray-500">Software Engineer at Google</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="h-5 w-5 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                "The cover letter generator is incredible. It saved me hours and the personalized letters actually got responses from recruiters."
              </p>
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                  <span className="text-indigo-600 font-medium">MR</span>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Mike Rodriguez</p>
                  <p className="text-sm text-gray-500">Marketing Manager at Microsoft</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="h-5 w-5 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                "The application tracking feature kept me organized throughout my job search. I landed my dream job in 3 months!"
              </p>
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                  <span className="text-indigo-600 font-medium">AL</span>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Alex Lee</p>
                  <p className="text-sm text-gray-500">Product Manager at Amazon</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing section */}
      <div id="pricing" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Simple, transparent pricing
            </h2>
            <p className="mt-4 text-xl text-gray-500">
              Choose the plan that's right for your job search
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Free Plan */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900">Free</h3>
                <p className="mt-4 text-gray-500">
                  Perfect for getting started with your job search
                </p>
                <p className="mt-8">
                  <span className="text-4xl font-bold text-gray-900">$0</span>
                  <span className="text-gray-500">/month</span>
                </p>
                <ul className="mt-8 space-y-4">
                  <li className="flex items-start">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5 mr-3" />
                    <span className="text-gray-500">Upload up to 3 resumes</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5 mr-3" />
                    <span className="text-gray-500">Basic resume analysis</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5 mr-3" />
                    <span className="text-gray-500">5 AI requests per month</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5 mr-3" />
                    <span className="text-gray-500">Email support</span>
                  </li>
                </ul>
                <Link
                  href="/register"
                  className="mt-8 w-full bg-gray-100 text-gray-900 py-3 px-4 rounded-md text-center font-medium hover:bg-gray-200 transition-colors block"
                >
                  Get started for free
                </Link>
              </div>
            </div>

            {/* Pro Plan */}
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg shadow-sm relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-indigo-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </span>
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900">Pro</h3>
                <p className="mt-4 text-gray-500">
                  For serious job seekers who want the best results
                </p>
                <p className="mt-8">
                  <span className="text-4xl font-bold text-gray-900">$29</span>
                  <span className="text-gray-500">/month</span>
                </p>
                <ul className="mt-8 space-y-4">
                  <li className="flex items-start">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5 mr-3" />
                    <span className="text-gray-500">Unlimited resume uploads</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5 mr-3" />
                    <span className="text-gray-500">Advanced AI analysis</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5 mr-3" />
                    <span className="text-gray-500">Unlimited AI requests</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5 mr-3" />
                    <span className="text-gray-500">Resume optimization</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5 mr-3" />
                    <span className="text-gray-500">Priority support</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5 mr-3" />
                    <span className="text-gray-500">Cover letter generation</span>
                  </li>
                </ul>
                <Link
                  href="/register"
                  className="mt-8 w-full bg-indigo-600 text-white py-3 px-4 rounded-md text-center font-medium hover:bg-indigo-700 transition-colors block"
                >
                  Start Pro trial
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-500">
              All plans include a 14-day free trial. No credit card required.
            </p>
          </div>
        </div>
      </div>

      {/* FAQ section */}
      <div id="faq" className="py-16 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Frequently asked questions
            </h2>
            <p className="mt-4 text-xl text-gray-500">
              Everything you need to know about Haku
            </p>
          </div>

          <div className="mt-16 space-y-8">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                How does the AI resume analysis work?
              </h3>
              <p className="text-gray-500">
                Our AI analyzes your resume for ATS compatibility, keyword optimization, action verbs, formatting, and overall impact. It provides specific, actionable feedback to help you improve your resume's effectiveness.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Is my resume data secure and private?
              </h3>
              <p className="text-gray-500">
                Yes, absolutely. We use enterprise-grade security to protect your data. Your resume is processed securely and can be deleted at any time. We never share your personal information with third parties.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                What file formats do you support?
              </h3>
              <p className="text-gray-500">
                We support PDF and DOCX formats. For best results, we recommend using a clean, ATS-friendly template without complex formatting or graphics.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                How long does the analysis take?
              </h3>
              <p className="text-gray-500">
                Our AI analysis is instant! You'll receive your detailed feedback and optimization suggestions within seconds of uploading your resume.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Do you offer a free trial?
              </h3>
              <p className="text-gray-500">
                Yes! We offer a free tier that includes basic resume analysis and limited AI requests. You can upgrade to our Pro plan for unlimited access to all features.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700">
        <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">Ready to get started?</span>
            <span className="block">Start your free trial today.</span>
          </h2>
          <p className="mt-4 text-lg leading-6 text-indigo-100">
            Join thousands of job seekers who have already transformed their careers with our AI-powered platform.
          </p>
          <Link
            href="/register"
            className="mt-8 inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 shadow-lg hover:shadow-xl transition-all duration-200"
          >
            Get started for free
            <ArrowRightIcon className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </div>
  )
}
