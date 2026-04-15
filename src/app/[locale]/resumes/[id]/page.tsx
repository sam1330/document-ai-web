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
  ExclamationTriangleIcon,
  LightBulbIcon,
  ClockIcon,
  ListBulletIcon,
  ArrowLeftIcon,
  CalendarIcon,
  BriefcaseIcon,
  CheckCircleIcon,
  HandThumbUpIcon,
} from "@heroicons/react/24/outline";
import {
  SparklesIcon as SparklesIconSolid,
  CheckCircleIcon as CheckCircleIconSolid
} from "@heroicons/react/24/solid";
import Link from "next/link";
import api from "@/lib/api";
import { Resume, Analysis, ResumeDetailResponse } from "@/types";
import { formatDate, formatFileSize } from "@/lib/utils";
import toast from "react-hot-toast";
import { Modal, Textarea, Button } from "@/components/ui";
import { useParams, useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useTranslations } from "next-intl";

const initialResumeValue: ResumeDetailResponse = {
  resume: {
    id: "",
    user_id: "",
    original_filename: "",
    file_path: "",
    file_type: "",
    file_size: 0,
    extracted_text: "",
    is_processed: false,
    created_at: "",
    updated_at: "",
  },
  latest_analysis: undefined,
  has_text: false,
  text_length: 0,
};

export default function ResumeDetailPage() {
  const t = useTranslations()
  const { user } = useAuth();
  const { id } = useParams();
  const router = useRouter();
  const [resume, setResume] = useState<ResumeDetailResponse>(initialResumeValue);
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [selectedAnalysis, setSelectedAnalysis] = useState<Analysis | null>(null);
  const [resumeLoading, setResumeLoading] = useState(true);
  const [isJDModalOpen, setIsJDModalOpen] = useState(false);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    setResumeLoading(true);
    try {
      const [resumeRes, analysesRes] = await Promise.all([
        api.get(`/api/resumes/${id}`),
        api.get(`/api/resumes/${id}/analyses`)
      ]);

      const resumeData = resumeRes.data;
      setResume(resumeData || initialResumeValue);
      setAnalyses(analysesRes.data.analyses || []);

      // Set the default selected analysis to the latest one
      setSelectedAnalysis(resumeData.latest_analysis || null);
    } catch (error) {
      console.error("Failed to fetch page data:", error);
      toast.error(t("resumeDetail.errors.failedToLoad"));
    } finally {
      setResumeLoading(false);
    }
  };

  const handleAnalysisSelect = (analysis: Analysis) => {
    setSelectedAnalysis(analysis);
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

  const analysisData = selectedAnalysis?.analysis_results || null;
  const score = analysisData?.atsScore || 0;
  const isLatest = selectedAnalysis?.id === resume.latest_analysis?.id;

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
                    {resume.resume.original_filename}
                  </h1>
                  <div className="flex items-center space-x-3 text-xs text-slate-500 mt-0.5">
                    {selectedAnalysis ? (
                      <span className={`flex items-center font-bold px-2 py-0.5 rounded-lg mr-2 ${isLatest ? 'text-emerald-600 bg-emerald-50' : 'text-indigo-600 bg-indigo-50'
                        }`}>
                        {isLatest ? (
                          <CheckCircleIconSolid className="h-3 w-3 mr-1" />
                        ) : (
                          <ClockIcon className="h-3 w-3 mr-1" />
                        )}
                        {selectedAnalysis.target_role}
                        {!isLatest && <span className="ml-2 opacity-60 font-medium">{t('resumeDetail.history.historical')}</span>}
                      </span>
                    ) : null}
                    <span className="flex items-center">
                      <CalendarIcon className="h-3 w-3 mr-1" />
                      {formatDate(resume.resume.updated_at)}
                    </span>
                    <span className="flex items-center">
                      <DocumentTextIcon className="h-3 w-3 mr-1" />
                      {formatFileSize(resume.resume.file_size)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={fetchData}>
                  {t('resumeDetail.refresh')}
                </Button>
                <Link href={`/api/resumes/${id}/download`} target="_blank">
                  <Button variant="outline" size="sm">
                    {t('resumeDetail.viewOriginal')}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          {!resume.resume.is_processed ? (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
              <SparklesIconSolid className="h-12 w-12 text-indigo-500 mx-auto mb-4 animate-pulse" />
              <h2 className="text-xl font-semibold text-slate-900">{t('resumeDetail.analysisInProgress.title')}</h2>
              <p className="text-slate-500 mt-2 max-w-sm mx-auto">
                {t('resumeDetail.analysisInProgress.description')}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

              {/* History Sidebar */}
              <div className="lg:col-span-1 space-y-4">
                <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="font-bold text-slate-800 flex items-center">
                      <ClockIcon className="h-5 w-5 mr-2 text-indigo-500" />
                      {t('resumeDetail.history.title')}
                    </h3>
                    <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-black uppercase tracking-widest">
                      {analyses.length} Session{analyses.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="max-h-[70vh] overflow-y-auto overflow-x-hidden p-3 space-y-2">
                    {analyses.map((analysis) => (
                      <button
                        key={analysis.id}
                        onClick={() => handleAnalysisSelect(analysis)}
                        className={`w-full text-left p-4 rounded-2xl transition-all duration-200 border-2 ${selectedAnalysis?.id === analysis.id
                          ? "bg-indigo-50 border-indigo-200"
                          : "bg-white border-transparent hover:bg-slate-50 hover:border-slate-100"
                          }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-bold text-slate-900 truncate leading-tight">
                              {analysis.target_role}
                            </p>
                            <p className="text-[10px] font-medium text-slate-500 mt-1 uppercase tracking-tight truncate">
                              {analysis.target_company}
                            </p>
                          </div>
                          <span className={`flex-shrink-0 text-[10px] font-black px-1.5 py-0.5 rounded ${analysis.analysis_results.atsScore >= 70 ? 'text-emerald-600 bg-emerald-50' :
                            analysis.analysis_results.atsScore >= 40 ? 'text-amber-600 bg-amber-50' :
                              'text-rose-600 bg-rose-50'
                            }`}>
                            {analysis.analysis_results.atsScore}
                          </span>
                        </div>
                        <div className="mt-3 flex items-center justify-between text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                          <span>{formatDate(analysis.created_at)}</span>
                          {analysis.id === resume.latest_analysis?.id && (
                            <span className="text-emerald-500 flex items-center">
                              <CheckCircleIconSolid className="h-3 w-3 mr-1" />
                              {t('resumeDetail.history.latest')}
                            </span>
                          )}
                        </div>
                      </button>
                    ))}
                    {analyses.length === 0 && (
                      <div className="py-10 text-center">
                        <ListBulletIcon className="h-10 w-10 text-slate-200 mx-auto mb-2" />
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
                          {t('resumeDetail.history.noHistory')}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Main Analysis Content */}
              <div className="lg:col-span-2 space-y-8">

                {/* Overview Card */}
                <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="bg-indigo-50/30 px-6 py-5 border-b border-indigo-100 flex items-center">
                    <LightBulbIcon className="h-6 w-6 text-indigo-600 mr-2" />
                    <h2 className="text-lg font-bold text-slate-900">{t('resumeDetail.analysisOverview.title')}</h2>
                  </div>
                  <div className="p-8">
                    <p className="text-slate-700 leading-relaxed text-lg">
                      {analysisData?.overview || t('resumeDetail.analysisOverview.noOverview')}
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
                      <h3 className="text-xl font-bold text-slate-900">{t('resumeDetail.strongPoints.title')}</h3>
                    </div>
                    <ul className="space-y-4">
                      {analysisData?.strongPoints?.map((point, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircleIcon className="h-5 w-5 text-emerald-500 mr-3 mt-1 flex-shrink-0" />
                          <span className="text-slate-700 leading-snug">{point}</span>
                        </li>
                      ))}
                      {(!analysisData?.strongPoints || analysisData.strongPoints.length === 0) && (
                        <li className="text-slate-400 italic">{t('resumeDetail.strongPoints.noneIdentified')}</li>
                      )}
                    </ul>
                  </div>

                  {/* Weaknesses */}
                  <div className="bg-amber-50/20 rounded-3xl border border-amber-100/50 p-6 sm:p-8">
                    <div className="flex items-center mb-6">
                      <div className="p-2 bg-amber-100 rounded-xl mr-3">
                        <ExclamationTriangleIcon className="h-6 w-6 text-amber-600" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-900">{t('resumeDetail.weaknesses.title')}</h3>
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
                        <li className="text-slate-400 italic">{t('resumeDetail.weaknesses.noneIdentified')}</li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Sidebar: Score and Job Description */}
              <div className="lg:col-span-1 space-y-6">
                {/* Score Card */}
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
                  <div className="relative bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col items-center text-center">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                      {t('resumeDetail.score.title')}
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
                      {score >= 8 ? t('resumeDetail.score.excellentMatch') : score >= 6 ? t('resumeDetail.score.goodPotential') : t('resumeDetail.score.significantGaps')}
                    </p>
                  </div>
                </div>

                {/* Job Description Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="border-b border-slate-100 px-6 py-4 bg-slate-50/50 flex items-center">
                    <BriefcaseIcon className="h-5 w-5 mr-2 text-slate-500" />
                    <h2 className="font-semibold text-slate-800 text-sm">{t('resumeDetail.jobDescription.title')}</h2>
                  </div>
                  <div className="p-6">
                    <div className="mb-4">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{t('resumeDetail.jobDescription.company')}</p>
                      <p className="font-bold text-slate-900">{selectedAnalysis?.target_company || t('resumeDetail.jobDescription.notAvailable')}</p>
                    </div>
                    <div className="text-sm text-slate-600 line-clamp-[8] whitespace-pre-wrap leading-relaxed border-t border-slate-50 pt-4">
                      {selectedAnalysis?.job_description || t('resumeDetail.jobDescription.noDescription')}
                    </div>
                    <button
                      onClick={() => setIsJDModalOpen(true)}
                      className="mt-4 text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
                    >
                      {t('resumeDetail.jobDescription.viewFullDescription')}
                    </button>
                    <Modal
                      isOpen={isJDModalOpen}
                      onClose={() => setIsJDModalOpen(false)}
                      title={t('resumeDetail.jobDescription.fullTitle')}
                    >
                      <div className="py-4">
                        <div className="bg-slate-50 rounded-xl p-6 text-slate-700 text-sm leading-relaxed whitespace-pre-wrap max-h-[60vh] overflow-y-auto border border-slate-200">
                          {selectedAnalysis?.job_description}
                        </div>
                      </div>
                    </Modal>
                  </div>
                </div>

                <div className={`rounded-2xl border p-6 transition-colors ${isLatest ? 'bg-emerald-50 border-emerald-100' : 'bg-amber-50 border-amber-100'
                  }`}>
                  <div className="flex items-center">
                    {isLatest ? (
                      <CheckCircleIconSolid className="h-5 w-5 text-emerald-600 mr-2" />
                    ) : (
                      <ClockIcon className="h-5 w-5 text-amber-600 mr-2" />
                    )}
                    <span className={`font-semibold ${isLatest ? 'text-emerald-900' : 'text-amber-900'}`}>
                      {isLatest ? t('resumeDetail.version.latest') : t('resumeDetail.version.historical')}
                    </span>
                  </div>
                  <p className={`text-xs mt-2 ${isLatest ? 'text-emerald-700' : 'text-amber-700'}`}>
                    Match {isLatest ? t('resumeDetail.version.verified') : t('resumeDetail.version.archived')} on {selectedAnalysis?.created_at ? formatDate(selectedAnalysis.created_at) : t('resumeDetail.jobDescription.notAvailable')}.
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
