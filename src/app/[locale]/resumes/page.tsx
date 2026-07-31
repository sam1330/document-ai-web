"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "@/i18n/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Navigation from "@/components/Navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import {
  DocumentTextIcon,
  TrashIcon,
  EyeIcon,
  SparklesIcon,
  CloudArrowUpIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  InformationCircleIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import api from "@/lib/api";
import { Resume } from "@/types";
import { formatDate, formatFileSize } from "@/lib/utils";
import toast from "react-hot-toast";
import { Modal, Textarea, Button, Input } from "@/components/ui";
import { useCredits } from "@/contexts/CreditContext";
import { useTranslations } from "next-intl";
import ResumeCard from "@/components/resume/ResumeCard";
import { clearPendingResume, getPendingResume } from "@/lib/pendingResume";

function ResumesPageContent() {
  const t = useTranslations();
  const { user } = useAuth();
  const { getBalance } = useCredits();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [resumes, setResumes] = useState<Resume[]>([]);
  const [resumesLoading, setResumesLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedResumeId, setSelectedResumeId] = useState<string | null>(null);
  const [isAnalyzeModalOpen, setIsAnalyzeModalOpen] = useState(false);
  const [jobDescription, setJobDescription] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [targetCompany, setTargetCompany] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [convertingId, setConvertingId] = useState<string | null>(null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "analyzed" | "pending"
  >("all");

  useEffect(() => {
    if (user) {
      fetchResumes();
    }
  }, [user]);

  const filteredResumes = resumes.filter((resume) => {
    const matchesSearch = resume.original_filename
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesFilter =
      statusFilter === "all"
        ? true
        : statusFilter === "analyzed"
          ? !!resume.latest_analysis
          : statusFilter === "pending"
            ? !resume.latest_analysis && resume.is_processed
            : true;

    return matchesSearch && matchesFilter;
  });

  const fetchResumes = async () => {
    try {
      const response = await api.get("/api/resumes");
      setResumes(response.data.resumes || []);
    } catch (error) {
      console.error("Failed to fetch resumes:", error);
      toast.error(t("resumes.errors.failedToLoad"));
      setResumes([]);
    } finally {
      setResumesLoading(false);
    }
  };

  /** Uploads a resume and returns the new resume id, or null if it failed. */
  const uploadResumeFile = async (file: File): Promise<string | null> => {
    // Validate file type
    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!allowedTypes.includes(file.type)) {
      toast.error(t("resumes.upload.invalidType"));
      return null;
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      toast.error(t("resumes.upload.invalidSize"));
      return null;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("resume", file);

    try {
      const response = await api.post("/api/resumes/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success(t("resumes.upload.success"));
      await fetchResumes();
      return response.data?.resume?.id ?? null;
    } catch (error: any) {
      toast.error(error.response?.data?.message || t("resumes.upload.failed"));
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      await uploadResumeFile(file);
    } finally {
      // Reset file input
      event.target.value = "";
    }
  };

  const handleConvertToEditable = async (resumeId: string) => {
    setConvertingId(resumeId);
    try {
      await api.post(`/api/resumes/${resumeId}/convert`);
      toast.success(t("resumes.convert.success"));
      getBalance();
      router.push(`/resumes/builder/${resumeId}`);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || error.response?.data?.error || t("resumes.convert.failed"),
      );
    } finally {
      setConvertingId(null);
    }
  };

  const handleDeleteResume = async (resumeId: string) => {
    if (!confirm(t("resumes.delete.confirm"))) return;

    try {
      await api.delete(`/api/resumes/${resumeId}`);
      toast.success(t("resumes.delete.success"));
      fetchResumes();
    } catch (error: any) {
      toast.error(error.response?.data?.message || t("resumes.delete.failed"));
    }
  };

  const handleAnalyzeClick = (resumeId: string) => {
    setSelectedResumeId(resumeId);
    setJobDescription("");
    setTargetRole("");
    setTargetCompany("");
    setIsAnalyzeModalOpen(true);
  };

  // Entry points from the landing-page grader:
  //   ?analyze=<id>    the resume was already uploaded, just open the modal
  //   ?pending=grader  the PDF is waiting in IndexedDB, upload it then open the modal
  // The ref guards against React StrictMode double-invoking the effect in dev,
  // which would otherwise upload the same file twice.
  const graderHandledRef = useRef(false);

  useEffect(() => {
    if (!user || graderHandledRef.current) return;

    const analyzeId = searchParams.get("analyze");
    const pending = searchParams.get("pending");
    if (!analyzeId && pending !== "grader") return;

    graderHandledRef.current = true;

    const run = async () => {
      if (analyzeId) {
        handleAnalyzeClick(analyzeId);
      } else {
        const file = await getPendingResume();
        if (!file) {
          toast.error(t("resumes.grader.pendingNotFound"));
        } else {
          const resumeId = await uploadResumeFile(file);
          await clearPendingResume();
          if (resumeId) handleAnalyzeClick(resumeId);
        }
      }
      // Strip the param so a refresh doesn't re-run this.
      router.replace("/resumes");
    };

    run();
  }, [user, searchParams]);

  const handleConfirmAnalyze = async () => {
    if (!selectedResumeId) return;
    if (!jobDescription.trim() || !targetRole.trim() || !targetCompany.trim()) {
      toast.error(t("resumes.errors.allFieldsRequired"));
      return;
    }

    setAnalyzing(true);
    try {
      await api.post(`/api/resumes/${selectedResumeId}/analyze`, {
        job_description: jobDescription,
        target_role: targetRole,
        target_company: targetCompany,
      });
      toast.success("Resume analysis completed!");
      getBalance();
      setIsAnalyzeModalOpen(false);
      fetchResumes();
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || t("resumes.errors.failedToAnalyze"),
      );
    } finally {
      setAnalyzing(false);
    }
  };

  if (resumesLoading) {
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

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-50/50">
        <Navigation />
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center">
                <DocumentTextIcon className="h-8 w-8 text-indigo-600 mr-3" />
                {t("resumes.title")}
              </h1>
              <p className="mt-2 text-slate-500 text-lg">
                {t("resumes.subtitle")}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <label className="inline-flex items-center px-5 py-2.5 border border-gray-300 bg-white text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-indigo-500 font-bold rounded-2xl cursor-pointer group">
                <CloudArrowUpIcon className="h-5 w-5 mr-2 group-hover:-translate-y-0.5 transition-transform" />
                {t("resumes.uploadNew")}
                <input
                  type="file"
                  accept=".pdf,.docx"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
              <Link
                href="/resumes/builder"
                className="inline-flex items-center px-5 py-2.5 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition shadow-lg shadow-indigo-100 cursor-pointer group"
              >
                <PencilSquareIcon className="h-5 w-5 mr-2 group-hover:-translate-y-0.5 transition-transform" />
                {t("resumes.createNew")}
              </Link>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder={t("resumes.searchPlaceholder")}
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 text-slate-700 font-medium transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <FunnelIcon className="h-5 w-5 text-slate-400 ml-2" />
              <div className="flex bg-slate-50 p-1 rounded-2xl border border-slate-100">
                {(["all", "analyzed", "pending"] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setStatusFilter(filter)}
                    className={`px-4 py-2 rounded-xl text-sm font-bold capitalize transition-all ${statusFilter === filter
                      ? "bg-white text-indigo-600 shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                      }`}
                  >
                    {t(`resumes.filters.${filter}`)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {resumes.length === 0 ? (
            /* Enhanced Empty State / Dropzone */
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-violet-600 rounded-3xl blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>
              <div className="relative flex flex-col items-center justify-center py-20 px-6 bg-white border-2 border-dashed border-slate-200 rounded-3xl hover:border-indigo-400 transition-all duration-300">
                <div className="p-6 bg-indigo-50 rounded-full mb-6">
                  <DocumentTextIcon className="h-12 w-12 text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  {t("resumes.emptyState.title")}
                </h3>
                <p className="text-slate-500 text-center max-w-sm mb-10">
                  {t("resumes.emptyState.description")}
                </p>
                <label className="inline-flex items-center px-10 py-4 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 transition shadow-xl shadow-indigo-200 cursor-pointer">
                  {t("resumes.emptyState.buttonText")}
                  <input
                    type="file"
                    accept=".pdf,.docx"
                    onChange={handleFileUpload}
                    disabled={uploading}
                    className="hidden"
                  />
                </label>
                <p className="mt-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                  {t("resumes.emptyState.supportedFormats")}
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredResumes.map((resume) => (
                <ResumeCard
                  key={resume.id}
                  resume={resume}
                  handleDeleteResume={handleDeleteResume}
                  handleAnalyzeClick={handleAnalyzeClick}
                  analyzing={analyzing}
                  handleConvertToEditable={handleConvertToEditable}
                  converting={convertingId === resume.id}
                  t={t}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={isAnalyzeModalOpen}
        onClose={() => !analyzing && setIsAnalyzeModalOpen(false)}
        title={t("resumes.modal.title")}
        subtitle={t("resumes.modal.subtitle")}
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => setIsAnalyzeModalOpen(false)}
              disabled={analyzing}
            >
              {t("resumes.modal.cancel")}
            </Button>
            <Button
              onClick={handleConfirmAnalyze}
              loading={analyzing}
              disabled={!jobDescription.trim()}
            >
              {t("resumes.modal.startAnalysis")}
            </Button>
          </>
        }
      >
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label={t("resumes.modal.targetRole")}
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder={t("resumes.modal.targetRolePlaceholder")}
              required
            />
            <Input
              label={t("resumes.modal.targetCompany")}
              value={targetCompany}
              onChange={(e) => setTargetCompany(e.target.value)}
              placeholder={t("resumes.modal.targetCompanyPlaceholder")}
              required
            />
          </div>
          <p className="text-sm text-slate-500 font-medium">
            {t("resumes.modal.jobDescriptionHint")}
          </p>
          <Textarea
            label={t("resumes.modal.jobDescription")}
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder={t("resumes.modal.jobDescriptionPlaceholder")}
            rows={8}
            className="w-full text-slate-700 rounded-2xl"
            required
          />
        </div>
      </Modal>
    </ProtectedRoute>
  );
}

export default function ResumesPage() {
  return (
    <Suspense>
      <ResumesPageContent />
    </Suspense>
  );
}
