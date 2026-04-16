import Link from "next/link";
import { Button } from "../ui";
import { DocumentTextIcon, EyeIcon, InformationCircleIcon, PencilIcon, SparklesIcon, TrashIcon } from "@heroicons/react/24/outline";
import { formatDate, formatFileSize } from "@/lib/utils";


export default function ResumeCard({ resume, handleDeleteResume, handleAnalyzeClick, analyzing, t }: { resume: any, handleDeleteResume: (id: string) => void, handleAnalyzeClick: (id: string) => void, analyzing: boolean, t: any }) {

  return (
    <div
      key={resume.id}
      className="group bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full leading-relaxed overflow-hidden"
    >
      {/* Card Header */}
      <div className="p-6 border-b border-slate-50 flex-1">
        <div className="flex items-start justify-between mb-4">
          <div
            className={`p-3 rounded-2xl ${resume.file_type === "pdf" ? "bg-rose-50 text-rose-600" : "bg-blue-50 text-blue-600"}`}
          >
            <DocumentTextIcon className="h-7 w-7" />
          </div>
          <div className="flex space-x-1">
            {resume.source === 'builder' && (
              <Link
                href={`/resumes/builder/${resume.id}`}
                className="p-2 text-slate-300 hover:text-indigo-500 transition-colors rounded-xl hover:bg-indigo-50"
              >
                <PencilIcon className="h-5 w-5" />
              </Link>
            )}
            <Button
              variant="ghost"
              onClick={() => handleDeleteResume(resume.id)}
              className="p-2 text-slate-300 hover:text-rose-500 transition-colors rounded-xl hover:bg-rose-50"
            >
              <TrashIcon className="h-5 w-5" />
            </Button>
          </div>
        </div>
        <div className="flex items-center space-x-2 mb-1.5">
          <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-widest ${resume.source === 'builder' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600'}`}>
            {t(`resumes.source.${resume.source || 'upload'}`)}
          </span>
        </div>
        <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors truncate mb-1">
          {resume.original_filename}
        </h3>
        <div className="flex items-center text-xs font-bold text-slate-400 uppercase tracking-tight">
          <span>{formatFileSize(resume.file_size)}</span>
          <span className="mx-2">•</span>
          <span>{formatDate(resume.created_at)}</span>
        </div>

        {/* Latest Analysis Info */}
        <div className="mt-6 p-4 bg-slate-50/80 rounded-2xl border border-slate-100">
          {resume.latest_analysis ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  {t("resumes.analysis.latestAnalysis")}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-lg text-xs font-black ring-1 ${resume.latest_analysis.analysis_results
                    .atsScore >= 70
                    ? "bg-emerald-50 text-emerald-600 ring-emerald-200"
                    : resume.latest_analysis.analysis_results
                      .atsScore >= 40
                      ? "bg-amber-50 text-amber-600 ring-amber-200"
                      : "bg-rose-50 text-rose-600 ring-rose-200"
                    }`}
                >
                  {t("resumes.analysis.score")}:{" "}
                  {resume.latest_analysis.analysis_results.atsScore}
                </span>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800 line-clamp-1">
                  {resume.latest_analysis.target_role}
                </p>
                <p className="text-xs font-medium text-slate-500 mt-0.5">
                  {t("resumes.analysis.atCompany")}{" "}
                  {resume.latest_analysis.target_company}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-3 text-slate-400 italic">
              <InformationCircleIcon className="h-5 w-5 opacity-50" />
              <span className="text-xs font-medium">
                {t("resumes.analysis.readyForAnalysis")}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Card Actions */}
      <div className="p-6 bg-slate-50/30">
        <div className="flex flex-col space-y-3">
          <Button
            onClick={() => handleAnalyzeClick(resume.id)}
            disabled={!resume.is_processed || analyzing}
            className="w-full py-3 text-md bg-indigo-600 text-white font-black rounded-xl hover:bg-indigo-700 transition shadow-lg shadow-indigo-100 flex items-center justify-center disabled:opacity-50"
          >
            <SparklesIcon className="h-5 w-5 mr-2" />
            {resume.latest_analysis
              ? t("resumes.analysis.newAnalysis")
              : t("resumes.analysis.goDetailedAnalysis")}
          </Button>

          {resume.latest_analysis && (
            <Link href={`/resumes/${resume.id}`}>
              <Button className="w-full py-3 text-md bg-white text-indigo-600 border border-indigo-100 font-bold rounded-xl hover:bg-indigo-50 transition flex items-center justify-center">
                <EyeIcon className="h-5 w-5 mr-2" />
                {t("resumes.analysis.viewLastReport")}
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}