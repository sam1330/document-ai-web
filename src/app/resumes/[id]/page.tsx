"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Navigation from "@/components/Navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import {
  DocumentTextIcon,
  PlusIcon,
  TrashIcon,
  EyeIcon,
  SparklesIcon,
  CloudArrowUpIcon,
  PencilIcon,
  ArrowLeftIcon,
  CalendarIcon,
  BriefcaseIcon,
  CheckCircleIcon,
  HandThumbUpIcon,
  ExclamationTriangleIcon,
  LightBulbIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import api from "@/lib/api";
import { Resume, AnalysisResults } from "@/types";
import { formatDate, formatFileSize } from "@/lib/utils";
import toast from "react-hot-toast";
import { Modal, Textarea, Button } from "@/components/ui";
import { useParams, useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const initialResumeValue: Resume = {
  id: "",
  user_id: "",
  original_filename: "",
  file_path: "",
  file_type: "",
  file_size: 0,
  extracted_text: "",
  analysis_results: {
    job_description: "",
    analysis: {
      overview: "",
      atsScore: 0,
      strongPoints: [],
      weaknesses: []
    },
    timestamp: ""
  },
  is_processed: false,
  created_at: "",
  updated_at: "",
};

export default function ResumeDetailPage() {
  const { user } = useAuth();
  const { id } = useParams();
  const router = useRouter();
  const [resume, setResume] = useState<Resume>(initialResumeValue);
  const [resumeLoading, setResumeLoading] = useState(true);
  const [isJDModalOpen, setIsJDModalOpen] = useState(false);

  useEffect(() => {
    if (user) {
      fetchResume();
    }
  }, [user]);

  const fetchResume = async () => {
    try {
      const response = await api.get(`/api/resume/${id}`);
      setResume(response.data.resume || initialResumeValue);
    } catch (error) {
      console.error("Failed to fetch resumes:", error);
      toast.error("Failed to load resumes");
      setResume(initialResumeValue);
    } finally {
      setResumeLoading(false);
    }
  };

  if (resumeLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50">
          <Navigation />
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="px-4 py-6 sm:px-0">
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="bg-white p-6 rounded-lg shadow">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                      <div className="h-8 bg-gray-200 rounded w-full"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  const analysisData = resume.analysis_results?.analysis || null;
  const score = analysisData?.atsScore || 0;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-50">
        <Navigation />

        {/* Header Section */}
        <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => router.back()}
                  className="p-2 rounded-full hover:bg-slate-100 transition-colors text-slate-500"
                >
                  <ArrowLeftIcon className="h-5 w-5" />
                </button>
                <div>
                  <h1 className="text-xl font-bold text-slate-900 truncate max-w-md">
                    {resume.original_filename}
                  </h1>
                  <div className="flex items-center space-x-3 text-xs text-slate-500 mt-0.5">
                    <span className="flex items-center">
                      <CalendarIcon className="h-3 w-3 mr-1" />
                      {formatDate(resume.updated_at)}
                    </span>
                    <span className="flex items-center">
                      <DocumentTextIcon className="h-3 w-3 mr-1" />
                      {formatFileSize(resume.file_size)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={fetchResume}>
                  Refresh
                </Button>
                <Link href={`/api/resume/${id}/download`} target="_blank">
                  <Button variant="outline" size="sm">
                    View Original
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          {!resume.is_processed ? (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
              <SparklesIcon className="h-12 w-12 text-indigo-500 mx-auto mb-4 animate-pulse" />
              <h2 className="text-xl font-semibold text-slate-900">Analysis in Progress</h2>
              <p className="text-slate-500 mt-2 max-w-sm mx-auto">
                We're still processing your resume. This usually takes a few moments.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

              {/* Main Analysis Content */}
              <div className="lg:col-span-2 space-y-8">
                
                {/* Overview Card */}
                <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="bg-indigo-50/30 px-6 py-5 border-b border-indigo-100 flex items-center">
                    <LightBulbIcon className="h-6 w-6 text-indigo-600 mr-2" />
                    <h2 className="text-lg font-bold text-slate-900">Analysis Overview</h2>
                  </div>
                  <div className="p-8">
                    <p className="text-slate-700 leading-relaxed text-lg">
                      {analysisData?.overview || "No overview provided."}
                    </p>
                  </div>
                </div>

                {/* Strong Points & Weaknesses Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Strong Points */}
                  <div className="bg-emerald-50/20 rounded-3xl border border-emerald-100/50 p-6 sm:p-8">
                    <div className="flex items-center mb-6">
                      <div className="p-2 bg-emerald-100 rounded-xl mr-3">
                        <HandThumbUpIcon className="h-6 w-6 text-emerald-600" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-900">Strong Points</h3>
                    </div>
                    <ul className="space-y-4">
                      {analysisData?.strongPoints?.map((point, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircleIcon className="h-5 w-5 text-emerald-500 mr-3 mt-1 flex-shrink-0" />
                          <span className="text-slate-700 leading-snug">{point}</span>
                        </li>
                      ))}
                      {(!analysisData?.strongPoints || analysisData.strongPoints.length === 0) && (
                        <li className="text-slate-400 italic">None identified.</li>
                      )}
                    </ul>
                  </div>

                  {/* Weaknesses */}
                  <div className="bg-amber-50/20 rounded-3xl border border-amber-100/50 p-6 sm:p-8">
                    <div className="flex items-center mb-6">
                      <div className="p-2 bg-amber-100 rounded-xl mr-3">
                        <ExclamationTriangleIcon className="h-6 w-6 text-amber-600" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-900">Potential Gaps</h3>
                    </div>
                    <ul className="space-y-4">
                      {analysisData?.weaknesses?.map((point, index) => (
                        <li key={index} className="flex items-start">
                          <div className="w-5 h-5 bg-amber-200/50 rounded-full flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                            <div className="w-1.5 h-1.5 bg-amber-600 rounded-full"></div>
                          </div>
                          <span className="text-slate-700 leading-snug">{point}</span>
                        </li>
                      ))}
                      {(!analysisData?.weaknesses || analysisData.weaknesses.length === 0) && (
                        <li className="text-slate-400 italic">None identified.</li>
                      )}
                    </ul>
                  </div>
                </div>

                {/* Detailed Analysis (Fallback for any extra markdown content) */}
                {/* We can hide this now that we have structured fields, or use it for any raw content */}
              </div>

              {/* Sidebar: Score and Job Description */}
              <div className="space-y-6">
                {/* Score Card */}
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
                  <div className="relative bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col items-center text-center">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                      Compatibility Score
                    </span>
                    <div className="relative flex items-center justify-center">
                      <svg className="w-32 h-32 transform -rotate-90">
                        <circle
                          className="text-slate-100"
                          strokeWidth="8"
                          stroke="currentColor"
                          fill="transparent"
                          r="58"
                          cx="64"
                          cy="64"
                        />
                        <circle
                          className={`${score >= 80 ? 'text-emerald-500' : score >= 60 ? 'text-amber-500' : 'text-indigo-600'
                            } transition-all duration-1000 ease-out`}
                          strokeWidth="8"
                          strokeDasharray={364.42}
                          strokeDashoffset={364.42 - (364.42 * (score * 10)) / 100}
                          strokeLinecap="round"
                          stroke="currentColor"
                          fill="transparent"
                          r="58"
                          cx="64"
                          cy="64"
                        />
                      </svg>
                      <div className="absolute flex flex-col items-center">
                        <span className="text-4xl font-extrabold text-slate-900">{score}/10</span>
                      </div>
                    </div>
                    <p className="mt-4 text-sm text-slate-600 font-medium">
                      {score >= 8 ? "Excellent Match!" : score >= 6 ? "Good Potential" : "Significant Gaps Found"}
                    </p>
                  </div>
                </div>

                {/* Job Description Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="border-b border-slate-100 px-6 py-4 bg-slate-50/50 flex items-center">
                    <BriefcaseIcon className="h-5 w-5 mr-2 text-slate-500" />
                    <h2 className="font-semibold text-slate-800">Job Description</h2>
                  </div>
                  <div className="p-6">
                    <div className="text-sm text-slate-600 line-clamp-[12] whitespace-pre-wrap leading-relaxed">
                      {resume.analysis_results?.job_description || "No job description provided."}
                    </div>
                    <button 
                      onClick={() => setIsJDModalOpen(true)}
                      className="mt-4 text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
                    >
                      View Full Description
                    </button>
                    <Modal
                      isOpen={isJDModalOpen}
                      onClose={() => setIsJDModalOpen(false)}
                      title="Full Job Description"
                    >
                      <div className="py-4">
                        <div className="bg-slate-50 rounded-xl p-6 text-slate-700 text-sm leading-relaxed whitespace-pre-wrap max-h-[60vh] overflow-y-auto border border-slate-200">
                          {resume.analysis_results?.job_description}
                        </div>
                      </div>
                    </Modal>
                  </div>
                </div>

                {/* Status Card */}
                <div className="bg-emerald-50 rounded-2xl border border-emerald-100 p-6">
                  <div className="flex items-center">
                    <CheckCircleIcon className="h-5 w-5 text-emerald-600 mr-2" />
                    <span className="font-semibold text-emerald-900">Analysis Verified</span>
                  </div>
                  <p className="text-xs text-emerald-700 mt-2">
                    This analysis was generated on {resume.analysis_results?.timestamp ? formatDate(resume.analysis_results.timestamp) : 'N/A'}.
                  </p>
                </div>

              </div>
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}
