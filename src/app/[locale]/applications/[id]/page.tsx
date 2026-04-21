"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Navigation from "@/components/Navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import {
  BriefcaseIcon,
  CalendarIcon,
  LinkIcon,
  PencilIcon,
  TrashIcon,
  SparklesIcon,
  CheckBadgeIcon,
  XCircleIcon,
  DocumentTextIcon,
  ClockIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";
import { Button, Textarea, Modal, Input, Select } from "@/components/ui";
import api from "@/lib/api";
import { JobApplication, Resume, ResumeDetailResponse } from "@/types";
import { formatDate } from "@/lib/utils";
import toast from "react-hot-toast";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const tones = [
  {
    value: "professional",
    label: "Professional",
  },
  {
    value: "casual",
    label: "Casual",
  },
  {
    value: "enthusiastic",
    label: "Enthusiastic",
  }
];

const lengths = [
  {
    value: "short",
    label: "Short",
  },
  {
    value: "medium",
    label: "Medium",
  },
  {
    value: "long",
    label: "Long",
  }
]

export default function ApplicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { user } = useAuth();
  const router = useRouter();
  const t = useTranslations();

  const [application, setApplication] = useState<JobApplication | null>(null);
  const [resume, setResume] = useState<Resume | null>(null);
  const [latestAnalysis, setLatestAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [coverLetterLoading, setCoverLetterLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [editNotes, setEditNotes] = useState("");
  const [editJobDescription, setEditJobDescription] = useState("");
  const [editCoverLetter, setEditCoverLetter] = useState("");

  const coverLetterSchema = z.object({
    tone: z
      .enum(["professional", "casual", "enthusiastic"], {
        message: t("applications.validation.selectTone"),
      })
      .default("professional"),
    length: z
      .enum(["short", "medium", "long"], {
        message: t("applications.validation.selectLength"),
      })
      .default("short"),
  });

  type coverLetterFormData = z.infer<typeof coverLetterSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<coverLetterFormData>({
    resolver: zodResolver(coverLetterSchema) as any,
    defaultValues: {
      tone: "professional",
      length: "short",
    },
  });

  const [showCreateCoverLetterModal, setShowCreateCoverLetterModal] =
    useState(false);

  useEffect(() => {
    if (user && id) {
      fetchDetail();
    }
  }, [user, id]);

  const fetchDetail = async () => {
    try {
      setLoading(true);
      const appRes = await api.get(`/api/job-applications/${id}`);
      const appData = appRes.data.job_application as JobApplication;
      setApplication(appData);

      // Fetch resume and analysis if resume_id exists
      if (appData.resume_id) {
        const resumeRes = await api.get(`/api/resumes/${appData.resume_id}`);
        const resumeData = resumeRes.data as ResumeDetailResponse;
        setResume(resumeData.resume);
        setLatestAnalysis(resumeData.latest_analysis);
      }
    } catch (error) {
      console.error("Failed to fetch application detail:", error);
      toast.error(t("applicationDetail.toasts.loadFailed"));
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (status: string) => {
    try {
      await api.put(`/api/job-applications/${id}`, { status });
      setApplication((prev) =>
        prev ? { ...prev, status: status as any } : null,
      );
      toast.success(t("applicationDetail.toasts.statusUpdated"));
    } catch (error) {
      toast.error(t("applicationDetail.toasts.statusUpdateFailed"));
    }
  };

  const handleSaveEdit = async (
    field: "job_description" | "notes" | "cover_letter_data",
    editValue: string,
  ) => {
    try {
      setIsSaving(true);
      await api.put(`/api/job-applications/${id}`, { [field]: editValue });
      setApplication((prev) => (prev ? { ...prev, [field]: editValue } : null));
      setIsEditingDescription(false);
      setIsEditingNotes(false);
      toast.success(t("applicationDetail.toasts.updateSuccess"));
    } catch (error) {
      toast.error(t("applicationDetail.toasts.updateFailed"));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(t("applicationDetail.confirmations.deleteApplication")))
      return;
    try {
      setDeleteLoading(true);
      await api.delete(`/api/job-applications/${id}`);
      toast.success(t("applicationDetail.toasts.deleteSuccess"));
      setDeleteLoading(false);
      router.push("/applications");
    } catch (error) {
      setDeleteLoading(false);
      toast.error(t("applicationDetail.toasts.deleteFailed"));
    }
  };

  const handleGenerateCoverLetter = async () => {
    setCoverLetterLoading(true);
    try {
      toast.loading(t("applicationDetail.toasts.coverLetterGenerating"), {
        id: "cl-gen",
      });
      await api.post(`/api/job-applications/${id}/cover-letter`);
      toast.success(t("applicationDetail.toasts.coverLetterSuccess"), {
        id: "cl-gen",
      });
      setCoverLetterLoading(false);
      fetchDetail();
    } catch (error) {
      setCoverLetterLoading(false);
      toast.error(t("applicationDetail.toasts.coverLetterFailed"), {
        id: "cl-gen",
      });
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-slate-50/50">
          <Navigation />
          <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
            <div className="animate-pulse space-y-8">
              <div className="h-20 bg-slate-200 rounded-3xl w-full"></div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 h-96 bg-slate-200 rounded-3xl"></div>
                <div className="h-64 bg-slate-200 rounded-3xl"></div>
              </div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!application) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-slate-50/50">
          <Navigation />
          <div className="max-w-7xl mx-auto py-20 px-4 text-center">
            <BriefcaseIcon className="h-16 w-16 text-slate-200 mx-auto mb-4" />
            <h2 className="text-2xl font-black text-slate-800">
              Application not found
            </h2>
            <Link
              href="/applications"
              className="text-indigo-600 font-bold mt-4 inline-block hover:underline"
            >
              Back to Applications
            </Link>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  const statusMap = {
    draft: {
      icon: PencilIcon,
      color: "text-slate-500",
      bg: "bg-slate-50",
      border: "border-slate-100",
    },
    applied: {
      icon: BriefcaseIcon,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
      border: "border-indigo-100",
    },
    interview: {
      icon: ClockIcon,
      color: "text-amber-600",
      bg: "bg-amber-50",
      border: "border-amber-100",
    },
    accepted: {
      icon: CheckBadgeIcon,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      border: "border-emerald-100",
    },
    rejected: {
      icon: XCircleIcon,
      color: "text-rose-600",
      bg: "bg-rose-50",
      border: "border-rose-100",
    },
  };

  const currentStatus = statusMap[application.status] || statusMap.draft;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-50/50 pb-12">
        <Navigation />

        <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">
            <Link
              href="/applications"
              className="hover:text-indigo-600 transition-colors"
            >
              Applications
            </Link>
            <span className="text-slate-200">/</span>
            <span className="text-slate-900">{application.company_name}</span>
          </div>

          {/* Header Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm mb-8"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-start space-x-6">
                <div className="h-20 w-20 rounded-3xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-black text-3xl shadow-inner">
                  {application.company_name.charAt(0)}
                </div>
                <div className="pt-1">
                  <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">
                    {application.position_title}
                  </h1>
                  <div className="flex flex-wrap items-center gap-4 mt-2">
                    <p className="text-lg font-bold text-slate-600">
                      {application.company_name}
                    </p>
                    <div
                      className={`flex items-center space-x-2 px-4 py-1.5 rounded-full border ${currentStatus.bg} ${currentStatus.border} ${currentStatus.color}`}
                    >
                      <currentStatus.icon className="h-4 w-4" />
                      <span className="text-xs font-black uppercase tracking-widest">
                        {application.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  className="rounded-2xl border-slate-200 text-slate-400 hover:text-rose-600 hover:border-rose-100"
                  onClick={handleDelete}
                  loading={deleteLoading}
                >
                  <TrashIcon className="h-5 w-5 mr-2" />
                  Delete
                </Button>
                <Button
                  onClick={() => setShowCreateCoverLetterModal(true)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl px-6 py-3 shadow-lg shadow-indigo-100 group"
                  loading={coverLetterLoading}
                >
                  <SparklesIcon className="h-5 w-5 mr-2 transition-transform group-hover:scale-110" />
                  Generate AI Cover Letter
                </Button>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Column */}
            <div className="lg:col-span-2 space-y-8">
              {/* Job Description Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm"
              >
                <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <DocumentTextIcon className="h-5 w-5 text-indigo-600" />
                    <h2 className="font-black text-slate-800 uppercase text-xs tracking-widest">
                      Job Description
                    </h2>
                  </div>
                  {!isEditingDescription && (
                    <button
                      onClick={() => {
                        setEditJobDescription(application.job_description);
                        setIsEditingDescription(true);
                      }}
                      className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <div className="p-8">
                  {isEditingDescription ? (
                    <div className="space-y-4">
                      <Textarea
                        value={editJobDescription}
                        onChange={(e) => setEditJobDescription(e.target.value)}
                        rows={12}
                        className="text-sm rounded-2xl"
                      />
                      <div className="flex justify-end space-x-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setIsEditingDescription(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          loading={isSaving}
                          onClick={() =>
                            handleSaveEdit(
                              "job_description",
                              editJobDescription,
                            )
                          }
                        >
                          Save changes
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <article className="prose prose-slate prose-sm max-w-none prose-headings:font-black prose-a:text-indigo-600">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {application.job_description ||
                          "*No description provided.*"}
                      </ReactMarkdown>
                    </article>
                  )}
                </div>
              </motion.div>

              {/* Notes Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm"
              >
                <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <PencilIcon className="h-5 w-5 text-amber-500" />
                    <h2 className="font-black text-slate-800 uppercase text-xs tracking-widest">
                      Personal Notes
                    </h2>
                  </div>
                  {!isEditingNotes && (
                    <button
                      onClick={() => {
                        setEditNotes(application.notes || "");
                        setIsEditingNotes(true);
                      }}
                      className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <div className="p-8">
                  {isEditingNotes ? (
                    <div className="space-y-4">
                      <Textarea
                        value={editNotes}
                        onChange={(e) => setEditNotes(e.target.value)}
                        rows={6}
                        placeholder="Key interview points, names of recruiters, etc."
                        className="text-sm rounded-2xl"
                      />
                      <div className="flex justify-end space-x-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setIsEditingNotes(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          loading={isSaving}
                          onClick={() => handleSaveEdit("notes", editNotes)}
                        >
                          Save Notes
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
                      {application.notes ||
                        "No notes added yet. Use this space for recruiter names, interview dates, or prep work."}
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Cover letter Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm"
              >
                <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <PencilIcon className="h-5 w-5 text-amber-500" />
                    <h2 className="font-black text-slate-800 uppercase text-xs tracking-widest">
                      Cover letter
                    </h2>
                  </div>
                  {!isEditingNotes && (
                    <button
                      onClick={() => {
                        setEditCoverLetter(application?.cover_letter_data?.content || "");
                        setIsEditingNotes(true);
                      }}
                      className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <div className="p-8">
                  {isEditingNotes ? (
                    <div className="space-y-4">
                      <Textarea
                        value={editCoverLetter}
                        onChange={(e) => setEditCoverLetter(e.target.value)}
                        rows={6}
                        placeholder="Key interview points, names of recruiters, etc."
                        className="text-sm rounded-2xl"
                      />
                      <div className="flex justify-end space-x-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setIsEditingNotes(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          loading={isSaving}
                          onClick={() =>
                            handleSaveEdit("cover_letter_data", editCoverLetter)
                          }
                        >
                          Save Cover letter
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
                      {application?.cover_letter_data?.content || "No cover letter added yet."}
                    </div>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Sidebar Column */}
            <div className="space-y-8">
              {/* Match Score Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm"
              >
                <h2 className="font-black text-slate-800 uppercase text-xs tracking-widest mb-6">
                  AI Match Analysis
                </h2>
                <div className="flex flex-col items-center">
                  <div className="relative h-32 w-32 flex items-center justify-center mb-4">
                    <svg className="h-full w-full transform -rotate-90">
                      <circle
                        cx="64"
                        cy="64"
                        r="58"
                        stroke="currentColor"
                        strokeWidth="10"
                        fill="transparent"
                        className="text-slate-50"
                      />
                      <circle
                        cx="64"
                        cy="64"
                        r="58"
                        stroke="currentColor"
                        strokeWidth="10"
                        fill="transparent"
                        strokeDasharray={364}
                        strokeDashoffset={
                          364 -
                          (364 *
                            (latestAnalysis?.analysis_results?.atsScore || 0)) /
                          100
                        }
                        className={`text-indigo-600 transition-all duration-1000 ease-out`}
                      />
                    </svg>
                    <span className="absolute text-3xl font-black text-slate-900 leading-none">
                      {latestAnalysis?.analysis_results?.atsScore || "N/A"}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                    ATS Compatibility Score
                  </p>
                  {latestAnalysis ? (
                    <Link
                      href={`/resumes/${application.resume_id}`}
                      className="text-indigo-600 text-xs font-bold hover:underline"
                    >
                      View full analysis report &rarr;
                    </Link>
                  ) : (
                    <p className="text-[10px] text-slate-400 text-center italic">
                      Register more data for high-fidelity scoring.
                    </p>
                  )}
                </div>
              </motion.div>

              {/* Pipeline Status Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm"
              >
                <h2 className="font-black text-slate-800 uppercase text-xs tracking-widest mb-6">
                  Pipeline Stage
                </h2>
                <div className="space-y-3">
                  {Object.keys(statusMap).map((s) => {
                    const isSelected = application.status === s;
                    const sm = (statusMap as any)[s];
                    return (
                      <button
                        key={s}
                        onClick={() => handleUpdateStatus(s)}
                        className={`w-full flex items-center justify-between p-4 rounded-3xl border transition-all ${isSelected ? `border-indigo-600 ${sm.bg}` : "border-slate-100 hover:border-slate-300"}`}
                      >
                        <div className="flex items-center space-x-3">
                          <sm.icon
                            className={`h-4 w-4 ${isSelected ? "text-indigo-600" : "text-slate-400"}`}
                          />
                          <span
                            className={`text-xs font-black uppercase tracking-widest ${isSelected ? "text-indigo-900" : "text-slate-600"}`}
                          >
                            {s}
                          </span>
                        </div>
                        {isSelected && (
                          <CheckIcon className="h-4 w-4 text-indigo-600" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </motion.div>

              {/* Info Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm"
              >
                <h2 className="font-black text-slate-800 uppercase text-xs tracking-widest mb-6">
                  Quick Info
                </h2>
                <div className="space-y-6">
                  <InfoItem
                    icon={CalendarIcon}
                    label="Creation Date"
                    value={formatDate(application.created_at)}
                  />
                  {application.application_deadline && (
                    <InfoItem
                      icon={ClockIcon}
                      label="Deadline"
                      value={formatDate(application.application_deadline)}
                    />
                  )}
                  <InfoItem
                    icon={LinkIcon}
                    label="Job URL"
                    value={
                      application.application_url ? (
                        <a
                          href={application.application_url}
                          target="_blank"
                          className="text-indigo-600 hover:underline"
                        >
                          Link &rarr;
                        </a>
                      ) : (
                        "Not specified"
                      )
                    }
                  />
                  <div className="pt-4 border-t border-slate-50">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                      Linked Assets
                    </p>
                    <Link
                      href={`/resumes/${application.resume_id}`}
                      className="flex items-center space-x-3 p-3 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-slate-100 transition-colors"
                    >
                      <div className="p-2 bg-white rounded-xl shadow-sm">
                        <DocumentTextIcon className="h-4 w-4 text-slate-500" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-600 truncate">
                          {resume?.original_filename || "Active Resume"}
                        </p>
                      </div>
                    </Link>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </main>

        <Modal
          isOpen={showCreateCoverLetterModal}
          onClose={() => setShowCreateCoverLetterModal(false)}
          title={t("applications.modal.createCoverLetterTitle")}
        >
          <form
            onSubmit={handleSubmit(handleGenerateCoverLetter)}
            className="space-y-6 pt-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <Select
                {...register("tone")}
                label={t("applications.modal.selectTone")}
                options={tones.map((r) => ({
                  value: r.value,
                  label: r.label,
                }))}
                error={errors.tone?.message}
              />
              <Select
                {...register("length")}
                label={t("applications.modal.selectLength")}
                options={lengths.map((r) => ({
                  value: r.value,
                  label: r.label,
                }))}
                error={errors.length?.message}
              />
            </div>

            <div className="flex space-x-3 pt-6 border-t border-slate-100">
              <Button
                variant="outline"
                className="flex-1 rounded-xl"
                onClick={() => setShowCreateCoverLetterModal(false)}
              >
                {t("applications.modal.cancel")}
              </Button>
              <Button
                variant="primary"
                className="flex-1 rounded-xl bg-indigo-600"
                type="submit"
                loading={isSubmitting}
              >
                {t("applications.modal.createCoverLetterTitle")}
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </ProtectedRoute>
  );
}

function InfoItem({
  icon: Icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: any;
}) {
  return (
    <div className="flex items-center space-x-4">
      <div className="p-2.5 bg-slate-50 rounded-2xl border border-slate-100">
        <Icon className="h-5 w-5 text-slate-400" />
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
          {label}
        </p>
        <div className="text-xs font-bold text-slate-900">{value}</div>
      </div>
    </div>
  );
}
