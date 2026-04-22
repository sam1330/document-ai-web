"use client"

import React from 'react'
import { ResumeData } from '@/types/resume'
import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'

interface ModernThemeProps {
  data: ResumeData
}

export function ModernTheme({ data }: ModernThemeProps) {
  const t = useTranslations()
  const { cv, design } = data
  const { typography } = design

  const fontClass = typography.font_family.body === 'mono' ? 'font-mono' :
    typography.font_family.body === 'sans' ? 'font-sans' :
      'font-serif'

  return (
    <div
      className={cn(
        "bg-white text-slate-800 shadow-2xl print:shadow-none mx-auto relative overflow-hidden transition-all duration-500 flex",
        fontClass
      )}
      style={{
        width: "210mm",
        minHeight: "297mm",
        boxSizing: "border-box"
      }}
    >
      {/* Sidebar sidebar-ish element */}
      <div className="w-[60mm] bg-slate-100 p-[15mm] border-r border-slate-200">
        <h1 className="text-2xl font-bold tracking-tight text-indigo-900 mb-2 leading-tight">
          {cv.name || t('resumes.builder.preview.placeholderName')}
        </h1>

        <div className="text-xs space-y-3 mt-8 mb-8 text-slate-600">
          {cv.location && (
            <div>
              <p className="font-bold text-slate-400 uppercase text-[9px] tracking-wider mb-0.5">{t('resumes.builder.preview.themeLabels.location')}</p>
              <p>{cv.location}</p>
            </div>
          )}
          {cv.phone && (
            <div>
              <p className="font-bold text-slate-400 uppercase text-[9px] tracking-wider mb-0.5">{t('resumes.builder.preview.themeLabels.phone')}</p>
              <p>{cv.phone}</p>
            </div>
          )}
          {cv.email && (
            <div>
              <p className="font-bold text-slate-400 uppercase text-[9px] tracking-wider mb-0.5">{t('resumes.builder.preview.themeLabels.email')}</p>
              <p className="break-all">{cv.email}</p>
            </div>
          )}
          {cv.website && (
            <div>
              <p className="font-bold text-slate-400 uppercase text-[9px] tracking-wider mb-0.5">{t('resumes.builder.preview.themeLabels.website')}</p>
              <p className="text-indigo-600 break-all">{cv.website.replace(/^https?:\/\//, '')}</p>
            </div>
          )}
        </div>

        {cv.social_networks && cv.social_networks.length > 0 && (
          <div className="text-xs space-y-3 text-slate-600">
            <p className="font-bold text-slate-400 uppercase text-[9px] tracking-wider mb-1">{t('resumes.builder.preview.themeLabels.social')}</p>
            {cv.social_networks.map((sn, index) => (
              <div key={index}>
                <span className="font-medium text-slate-700">{sn.network}:</span> <span className="break-all">{sn.username}</span>
              </div>
            ))}
          </div>
        )}

        {/* Skills in sidebar */}
        {cv.sections.skills && cv.sections.skills.length > 0 && (
          <div className="mt-8">
            <h2 className="text-sm font-bold uppercase tracking-wider text-indigo-900 mb-3 pb-1 border-b-2 border-indigo-100">
              {t('resumes.builder.preview.sections.skills')}
            </h2>
            <div className="space-y-3">
              {cv.sections.skills.map((skill, i) => (
                <div key={i} className="text-xs leading-relaxed">
                  <div className="font-bold text-slate-800 mb-0.5">{skill.label}</div>
                  <div className="text-slate-500 leading-tight">{skill.details}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 p-[15mm]">
        {/* Summary */}
        {cv.sections.summary && cv.sections.summary.length > 0 && (
          <section className="mb-8">
            <h2 className="text-sm font-bold uppercase tracking-wider text-indigo-900 mb-3 pb-1 border-b-2 border-indigo-100">
              {t('resumes.builder.preview.sections.summary')}
            </h2>
            <p className="text-sm leading-relaxed text-slate-600">
              {cv.sections.summary[0]}
            </p>
          </section>
        )}

        {/* Experience */}
        {cv.sections.experience && cv.sections.experience.length > 0 && (
          <section className="mb-8">
            <h2 className="text-sm font-bold uppercase tracking-wider text-indigo-900 mb-4 pb-1 border-b-2 border-indigo-100">
              {t('resumes.builder.preview.sections.experience')}
            </h2>
            <div className="space-y-6">
              {cv.sections.experience.map((exp, i) => (
                <div key={i} className="relative pl-4 border-l-2 border-slate-200">
                  <div className="absolute w-2.5 h-2.5 bg-indigo-400 rounded-full -left-[6px] top-1.5 border-2 border-white"></div>
                  <div className="flex justify-between items-baseline mb-1">
                    <div>
                      <span className="font-bold text-slate-900">{exp.position}</span>
                      <span className="mx-2 text-slate-300">{t('resumes.builder.preview.themeLabels.at')}</span>
                      <span className="font-medium text-indigo-700">{exp.company}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-slate-500 mb-2">
                    <span className="font-medium bg-slate-100 px-1.5 py-0.5 rounded">{exp.start_date} – {exp.end_date}</span>
                    {exp.location && <span>• {exp.location}</span>}
                  </div>
                  <ul className="list-disc list-outside ml-4 space-y-1">
                    {(exp.highlights || []).map((highlight, hIndex) => (
                      <li key={hIndex} className="text-[13px] leading-relaxed text-slate-600 pl-1">
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {cv.sections.education && cv.sections.education.length > 0 && (
          <section className="mb-8">
            <h2 className="text-sm font-bold uppercase tracking-wider text-indigo-900 mb-4 pb-1 border-b-2 border-indigo-100">
              {t('resumes.builder.preview.sections.education')}
            </h2>
            <div className="space-y-5">
              {cv.sections.education.map((edu, i) => (
                <div key={i} className="relative pl-4 border-l-2 border-slate-200">
                  <div className="absolute w-2.5 h-2.5 bg-indigo-400 rounded-full -left-[6px] top-1.5 border-2 border-white"></div>
                  <div className="font-bold text-slate-900">{edu.degree} {t('resumes.builder.preview.themeLabels.in')} {edu.area}</div>
                  <div className="text-sm text-indigo-700 font-medium mb-1">{edu.institution}</div>
                  <div className="flex items-center space-x-2 text-xs text-slate-500">
                    <span className="font-medium">{edu.start_date} – {edu.end_date}</span>
                    {edu.location && <span>• {edu.location}</span>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Custom Sections */}
        {cv.sections.custom && Object.entries(cv.sections.custom).map(([title, items], i) => (
          <section key={i} className="mb-8">
            <h2 className="text-sm font-bold uppercase tracking-wider text-indigo-900 mb-3 pb-1 border-b-2 border-indigo-100">
              {title}
            </h2>
            <div className="pl-4 border-l-2 border-slate-200 relative">
              <div className="absolute w-2.5 h-2.5 bg-indigo-400 rounded-full -left-[6px] top-1.5 border-2 border-white"></div>
              <div className="font-bold text-slate-800 mb-2">{items.title}</div>
              <ul className="list-disc list-outside ml-4 space-y-1">
                {items.content.map((item, index) => (
                  <li key={index} className="text-[13px] leading-relaxed text-slate-600 pl-1">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
