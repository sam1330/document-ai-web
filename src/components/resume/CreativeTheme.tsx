"use client"

import React from 'react'
import { ResumeData } from '@/types/resume'
import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'

interface CreativeThemeProps {
  data: ResumeData
}

export function CreativeTheme({ data }: CreativeThemeProps) {
  const t = useTranslations()
  const { cv, design } = data
  const { typography } = design

  const fontClass = typography.font_family.body === 'mono' ? 'font-mono' :
    typography.font_family.body === 'sans' ? 'font-sans' :
      'font-serif'

  return (
    <div
      className={cn(
        "bg-white shadow-2xl print:shadow-none mx-auto relative overflow-hidden transition-all duration-500",
        fontClass
      )}
      style={{
        width: "210mm",
        minHeight: "297mm",
        boxSizing: "border-box"
      }}
    >
      {/* Top Banner */}
      <div className="w-full bg-teal-800 text-white p-[20mm] pb-[15mm]">
        <h1 className="text-4xl font-extrabold tracking-tight mb-3">
          {cv.name || t('resumes.builder.preview.placeholderName')}
        </h1>
        {cv.sections.summary && cv.sections.summary.length > 0 && (
          <p className="text-sm leading-relaxed text-teal-50 max-w-2xl font-light">
            {cv.sections.summary[0]}
          </p>
        )}
      </div>

      <div className="flex h-full">
        {/* Left Column (Dark Side) */}
        <div className="w-[70mm] bg-teal-900 text-white p-[15mm] border-t border-teal-800 min-h-[calc(296mm-80mm)]">

          <div className="space-y-6">
            {/* Contact */}
            <div>
              <h2 className="text-xs font-bold text-teal-400 uppercase tracking-widest mb-3">Contact</h2>
              <div className="space-y-2 text-xs font-light text-teal-50">
                {cv.location && <div className="break-words">{cv.location}</div>}
                {cv.phone && <div className="break-words">{cv.phone}</div>}
                {cv.email && <div className="break-words">{cv.email}</div>}
                {cv.website && <div className="break-words">{cv.website.replace(/^https?:\/\//, '')}</div>}
              </div>
            </div>

            {/* Social */}
            {cv.social_networks && cv.social_networks.length > 0 && (
              <div>
                <h2 className="text-xs font-bold text-teal-400 uppercase tracking-widest mb-3">Social</h2>
                <div className="space-y-2 text-xs font-light text-teal-50">
                  {cv.social_networks.map((sn, index) => (
                    <div key={index} className="break-words">
                      <strong className="font-semibold">{sn.network}:</strong> {sn.username}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Skills */}
            {cv.sections.skills && cv.sections.skills.length > 0 && (
              <div>
                <h2 className="text-xs font-bold text-teal-400 uppercase tracking-widest mb-3">
                  {t('resumes.builder.preview.sections.skills')}
                </h2>
                <div className="space-y-3">
                  {cv.sections.skills.map((skill, i) => (
                    <div key={i} className="text-xs">
                      <div className="font-semibold text-teal-100 mb-0.5">{skill.label}</div>
                      <div className="font-light text-teal-200/80 leading-normal">{skill.details}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Right Column (Light Side) */}
        <div className="flex-1 bg-white text-slate-800 p-[15mm] pt-[12mm]">

          {/* Experience */}
          {cv.sections.experience && cv.sections.experience.length > 0 && (
            <section className="mb-8">
              <h2 className="text-[15px] font-bold uppercase tracking-widest text-teal-800 mb-5 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-12 after:h-1 after:bg-teal-500">
                {t('resumes.builder.preview.sections.experience')}
              </h2>
              <div className="space-y-6">
                {cv.sections.experience.map((exp, i) => (
                  <div key={i}>
                    <div className="flex justify-between items-baseline mb-1">
                      <span className="font-bold text-[15px] text-slate-900">{exp.position}</span>
                      <span className="text-xs font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded">{exp.start_date} – {exp.end_date}</span>
                    </div>
                    <div className="text-sm font-medium text-slate-500 mb-2">
                      {exp.company} {exp.location && `• ${exp.location}`}
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
              <h2 className="text-[15px] font-bold uppercase tracking-widest text-teal-800 mb-5 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-12 after:h-1 after:bg-teal-500">
                {t('resumes.builder.preview.sections.education')}
              </h2>
              <div className="space-y-5">
                {cv.sections.education.map((edu, i) => (
                  <div key={i}>
                    <div className="flex justify-between items-baseline mb-1">
                      <span className="font-bold text-[14px] text-slate-900">{edu.degree} in {edu.area}</span>
                      <span className="text-xs font-bold text-teal-600">{edu.start_date} – {edu.end_date}</span>
                    </div>
                    <div className="text-sm text-slate-500">
                      <span className="font-medium">{edu.institution}</span>
                      {edu.location && <span> • {edu.location}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Custom Sections */}
          {cv.sections.custom && Object.entries(cv.sections.custom).map(([title, items], i) => (
            <section key={i} className="mb-8">
              <h2 className="text-[15px] font-bold uppercase tracking-widest text-teal-800 mb-5 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-12 after:h-1 after:bg-teal-500">
                {title}
              </h2>
              <div className="font-bold text-[14px] text-slate-900 mb-2">{items.title}</div>
              <ul className="list-disc list-outside ml-4 space-y-1">
                {items.content.map((item, index) => (
                  <li key={index} className="text-[13px] leading-relaxed text-slate-600 pl-1">
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          ))}

        </div>
      </div>
    </div>
  )
}
