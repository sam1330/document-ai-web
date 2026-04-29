"use client";

import React, { useState } from "react";
import Navigation from "@/components/Navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import { ResumeForm } from "@/components/resume/ResumeForm";
import { DesignForm } from "@/components/resume/DesignForm";
import { ResumePreview } from "@/components/resume/ResumePreview";
import { Button, Modal, Input, Textarea } from "@/components/ui";
import { useResumeStore } from "@/lib/store/useResumeStore";
import {
  ArrowDownTrayIcon,
  PencilSquareIcon,
  SparklesIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import axios from "axios";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import api from "@/lib/api";
import { useParams, useRouter } from "next/navigation";

interface ResumeBuilderProps {
  resumeId?: string;
}

export default function ResumeBuilder({ resumeId }: ResumeBuilderProps) {
  const t = useTranslations();
  const router = useRouter();
  const { locale } = useParams();
  const { data, setData } = useResumeStore();
  const [activeTab, setActiveTab] = useState<"content" | "design" | "preview">(
    "content",
  );
  const [isOptimizeModalOpen, setIsOptimizeModalOpen] = useState(false);
  const [optimizing, setOptimizing] = useState(false);
  const [targetRole, setTargetRole] = useState("");
  const [targetCompany, setTargetCompany] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [exporting, setExporting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    const toastId = toast.loading(t("resumes.builder.toasts.saving"));

    try {
      const payload = {
        original_filename: `${data.cv.name.replace(/\s+/g, "-").toLowerCase()}-resume`,
        metadata: data,
      };

      if (resumeId) {
        await api.put(`/api/resumes/${resumeId}`, payload);
        toast.success(t("resumes.builder.toasts.saveSuccess"), { id: toastId });
      } else {
        const response = await api.post("/api/resumes", payload);
        const newId = response.data.resume?.id || response.data.id;
        toast.success(t("resumes.builder.toasts.saveSuccess"), { id: toastId });
        if (newId) {
          router.push(`/resumes/builder/${newId}`);
        }
      }
    } catch (error) {
      console.error("Failed to save resume:", error);
      toast.error(t("resumes.builder.toasts.saveFailed"), { id: toastId });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!resumeId) return;
    if (!confirm(t("resumes.delete.confirm"))) return;

    setDeleting(true);
    const toastId = toast.loading(
      t("resumes.delete.progress") || "Deleting...",
    );

    try {
      await api.delete(`/api/resumes/${resumeId}`);
      toast.success(t("resumes.delete.success"), { id: toastId });
      router.push("/resumes");
    } catch (error) {
      console.error("Failed to delete resume:", error);
      toast.error(t("resumes.delete.failed"), { id: toastId });
    } finally {
      setDeleting(false);
    }
  };

  const handleDownloadPDF = async () => {
    setExporting(true);
    const toastId = toast.loading(t("resumes.builder.toasts.generatingPDF"));
    try {
      const response = await api.post(
        `/api/resumes/${resumeId}/generate`,
        { locale },
        { responseType: "blob" },
      );

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `haku-resume-${data.cv.name.replace(/\s+/g, "-").toLowerCase()}.pdf`,
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success(t("resumes.builder.toasts.downloadSuccess"), {
        id: toastId,
      });
    } catch (error) {
      console.error("PDF Generation failed:", error);
      toast.error(t("resumes.builder.toasts.downloadFailed"), { id: toastId });
    } finally {
      setExporting(false);
    }
  };

  const handleOptimize = async () => {
    if (!resumeId) return;
    if (!jobDescription.trim() || !targetRole.trim() || !targetCompany.trim()) {
      toast.error(t("resumes.errors.allFieldsRequired"));
      return;
    }

    setOptimizing(true);
    const toastId = toast.loading(t("resumes.builder.toasts.optimizing"));

    try {
      const response = await api.post(`/api/resumes/${resumeId}/optimize`, {
        target_role: targetRole,
        target_company: targetCompany,
        job_description: jobDescription,
      });

      const { optimized_resume } = response.data;

      // Merge the optimized CV into the existing resume data
      setData({
        ...data,
        cv: optimized_resume,
      });

      toast.success(t("resumes.builder.toasts.optimizeSuccess"), { id: toastId });
      setIsOptimizeModalOpen(false);
    } catch (error: any) {
      console.error("Optimization failed:", error);
      toast.error(
        error.response?.data?.message || t("resumes.builder.toasts.optimizeFailed"),
        { id: toastId },
      );
    } finally {
      setOptimizing(false);
    }
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-white selection:bg-indigo-100 selection:text-indigo-700">
      <Navigation />

      {/* Top Sticky Toolbar */}
      <div className="h-16 border-b border-slate-200/60 px-4 md:px-6 flex items-center justify-between bg-white/80 backdrop-blur-md z-20">
        <div className="flex items-center space-x-3 md:space-x-6">
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 bg-indigo-600 rounded-lg shadow-sm shrink-0 hidden lg:block">
              <SparklesIcon className="h-4 w-4 text-white" />
            </div>
            <h1 className="text-lg font-black tracking-tight text-slate-900 hidden lg:block">
              {t("resumes.builder.title")}
            </h1>
          </div>

          <nav className="flex items-center bg-slate-100 p-1 rounded-xl shrink-0">
            <button
              onClick={() => setActiveTab("content")}
              className={cn(
                "px-3 md:px-4 py-1.5 text-xs font-bold rounded-lg transition-all",
                activeTab === "content"
                  ? "bg-white text-indigo-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-900",
              )}
            >
              {t("resumes.builder.content")}
            </button>
            <button
              onClick={() => setActiveTab("design")}
              className={cn(
                "px-3 md:px-4 py-1.5 text-xs font-bold rounded-lg transition-all",
                activeTab === "design"
                  ? "bg-white text-indigo-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-900",
              )}
            >
              {t("resumes.builder.designText")}
            </button>
            <button
              onClick={() => setActiveTab("preview")}
              className={cn(
                "lg:hidden px-3 md:px-4 py-1.5 text-xs font-bold rounded-lg transition-all",
                activeTab === "preview"
                  ? "bg-white text-indigo-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-900",
              )}
            >
              {t("resumes.builder.previewText")}
            </button>
          </nav>
        </div>

        <div className="flex items-center space-x-2 md:space-x-3">
          {resumeId && (
            <Button
              size="sm"
              variant="outline"
              onClick={handleDelete}
              loading={deleting}
              leftIcon={<TrashIcon className="h-4 w-4" />}
              className="rounded-xl border-slate-200 font-bold px-3 md:px-4 shrink-0 text-rose-600 hover:bg-rose-50"
            >
              <span className="hidden sm:inline">
                {t("resumes.actions.delete") || "Delete"}
              </span>
            </Button>
          )}
          <Button
            size="sm"
            variant="outline"
            onClick={handleDownloadPDF}
            loading={exporting}
            leftIcon={<ArrowDownTrayIcon className="h-4 w-4" />}
            className="rounded-xl border-slate-200 font-bold px-3 md:px-4 shrink-0"
          >
            <span className="hidden sm:inline">
              {t("resumes.builder.downloadPDF")}
            </span>
            <span className="sm:hidden text-[10px]">
              {t("resumes.fileType.pdf")}
            </span>
          </Button>
          {resumeId && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsOptimizeModalOpen(true)}
              leftIcon={<SparklesIcon className="h-4 w-4" />}
              className="rounded-xl border-indigo-200 bg-indigo-50/50 text-indigo-700 font-bold px-3 md:px-4 shrink-0 hover:bg-indigo-100 hover:border-indigo-300"
            >
              <span className="hidden sm:inline">
                {t("resumes.builder.optimize.button")}
              </span>
            </Button>
          )}
          <Button
            size="sm"
            onClick={handleSave}
            loading={saving}
            className="rounded-xl border-slate-200 font-bold px-3 md:px-4 shrink-0"
            leftIcon={<PencilSquareIcon className="h-4 w-4" />}
          >
            <span className="hidden sm:inline">{t("common.saveChanges")}</span>
          </Button>
        </div>
      </div>

      {/* Main Split Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel: Dynamic Content (Manual toggle on mobile, static on desktop) */}
        <aside
          className={cn(
            "w-full lg:w-[380px] xl:w-[480px] 2xl:w-[540px] shrink-0 h-full overflow-y-auto border-r border-slate-100 bg-slate-50/40 custom-scrollbar",
            activeTab === "preview" ? "hidden lg:block" : "block",
          )}
        >
          <div className="max-w-2xl mx-auto px-6 py-10">
            {activeTab === "design" ? <DesignForm /> : <ResumeForm />}
          </div>
        </aside>

        {/* Right Panel: Live Viewport (Manual toggle on mobile, static on desktop) */}
        <main
          className={cn(
            "flex-1 h-full bg-slate-200/40 relative overflow-hidden",
            activeTab === "preview" ? "block" : "hidden lg:block",
          )}
        >
          <ResumePreview />

          {/* Template Selector Badge */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur shadow-2xl border border-slate-200 px-6 py-3 rounded-full flex items-center space-x-6 z-30">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                {t("resumes.builder.template")}
              </span>
              <span className="text-sm font-bold text-slate-900">
                {t("resumes.builder.design.templates.classic.name")}
              </span>
            </div>
            <div className="w-px h-4 bg-slate-200"></div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                {t("resumes.builder.scale")}
              </span>
              <span className="text-sm font-bold text-slate-900">
                {t("resumes.builder.fitToWidth")}
              </span>
            </div>
          </div>
        </main>
      </div>

      <Modal
        isOpen={isOptimizeModalOpen}
        onClose={() => !optimizing && setIsOptimizeModalOpen(false)}
        title={t("resumes.builder.optimize.modal.title")}
        subtitle={t("resumes.builder.optimize.modal.subtitle")}
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => setIsOptimizeModalOpen(false)}
              disabled={optimizing}
            >
              {t("resumes.builder.optimize.modal.cancel") || t("resumes.modal.cancel")}
            </Button>
            <Button
              onClick={handleOptimize}
              loading={optimizing}
              disabled={!jobDescription.trim() || !targetRole.trim() || !targetCompany.trim()}
            >
              {t("resumes.builder.optimize.modal.button")}
            </Button>
          </>
        }
      >
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label={t("resumes.builder.optimize.modal.role")}
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder={t("resumes.builder.optimize.modal.rolePlaceholder")}
              required
            />
            <Input
              label={t("resumes.builder.optimize.modal.company")}
              value={targetCompany}
              onChange={(e) => setTargetCompany(e.target.value)}
              placeholder={t("resumes.builder.optimize.modal.companyPlaceholder")}
              required
            />
          </div>
          <div className="space-y-2">
            <p className="text-sm text-slate-500 font-medium">
              {t("resumes.builder.optimize.modal.jobDescriptionHint")}
            </p>
            <Textarea
              label={t("resumes.builder.optimize.modal.jobDescription")}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder={t("resumes.builder.optimize.modal.jobDescriptionPlaceholder")}
              rows={8}
              className="w-full text-slate-700 rounded-2xl"
              required
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
