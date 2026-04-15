"use client"

import React from 'react'
import { ResumeData } from '@/types/resume'
import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'

interface ClassicThemeProps {
  data: ResumeData
}

export function ClassicTheme({ data }: ClassicThemeProps) {
  const t = useTranslations()
  const { cv } = data.cv_body
  const { font, theme } = data.cv_body.design
  
  const fontClass = font === 'mono' ? 'font-mono' : 
                    font === 'sans' ? 'font-sans' : 
                    'font-serif'

  return (
    <div
      className={cn(
        "bg-white text-slate-900 p-[20mm] shadow-2xl mx-auto relative overflow-hidden transition-all duration-500",
        fontClass
      )}
      style={{
        width: "210mm",
        minHeight: "297mm",
        boxSizing: "border-box"
      }}
    >
      {/* Template Placeholder Indicator */}
      {data.template !== 'classic' && (
        <div className="absolute top-4 right-4 bg-amber-500 text-white text-[10px] font-black px-2 py-1 rounded shadow-lg uppercase tracking-widest z-50 animate-bounce">
          {t('resumes.builder.preview.modePlaceholder', { template: data.template })}
        </div>
      )}

      {/* Header */}
      <header className="text-center mb-6">
        <h1 className="text-3xl font-bold uppercase tracking-widest border-b-2 border-slate-900 pb-1 mb-2">
          {cv.name || t('resumes.builder.preview.placeholderName')}
        </h1>
        <div className="text-sm space-x-2 text-slate-700">
          <span>{cv.location}</span>
          {cv.location && <span>•</span>}
          <span>{cv.phone}</span>
          {cv.phone && <span>•</span>}
          <span className="font-semibold">{cv.email}</span>
          {cv.website && (
            <>
              <span>•</span>
              <span className="text-indigo-600">{cv.website.replace(/^https?:\/\//, '')}</span>
            </>
          )}
        </div>
      </header>

      {/* Summary */}
      {cv.sections.summary && cv.sections.summary.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-bold uppercase tracking-wider border-b border-slate-300 mb-2">
            {t('resumes.builder.preview.sections.summary')}
          </h2>
          <p className="text-sm leading-relaxed text-slate-800">
            {cv.sections.summary[0]}
          </p>
        </section>
      )}

      {/* Experience */}
      <section className="mb-6">
        <h2 className="text-lg font-bold uppercase tracking-wider border-b border-slate-300 mb-3">
          {t('resumes.builder.preview.sections.experience')}
        </h2>
        <div className="space-y-4">
          {cv.sections.experience.map((exp, i) => (
            <div key={i}>
              <div className="flex justify-between items-baseline mb-1">
                <div>
                  <span className="font-bold text-md">{exp.company}</span>
                  <span className="mx-2 text-slate-400">|</span>
                  <span className="italic text-slate-700">{exp.position}</span>
                </div>
                <div className="text-sm font-bold text-slate-600 uppercase">
                  {exp.start_date} – {exp.end_date}
                </div>
              </div>
              <p className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-tight">
                {exp.location}
              </p>
              <ul className="list-disc list-outside ml-4 space-y-1">
                {(exp.highlights || []).map((highlight, hIndex) => (
                  <li key={hIndex} className="text-[13px] leading-relaxed text-slate-800 pl-1">
                    {highlight}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Education */}
      <section className="mb-6">
        <h2 className="text-lg font-bold uppercase tracking-wider border-b border-slate-300 mb-3">
          {t('resumes.builder.preview.sections.education')}
        </h2>
        <div className="space-y-3">
          {cv.sections.education.map((edu, i) => (
            <div key={i} className="flex justify-between items-baseline">
              <div>
                <span className="font-bold">{edu.institution}</span>
                <span className="mx-2 text-slate-400">|</span>
                <span className="italic text-slate-700">{edu.degree} in {edu.area}</span>
              </div>
              <div className="text-sm font-bold text-slate-600">
                {edu.start_date} – {edu.end_date}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Skills */}
      <section className="mb-6">
        <h2 className="text-lg font-bold uppercase tracking-wider border-b border-slate-300 mb-2">
          {t('resumes.builder.preview.sections.skills')}
        </h2>
        <div className="space-y-1">
          {cv.sections.skills.map((skill, i) => (
            <div key={i} className="text-[13px] leading-relaxed">
              <span className="font-bold">{skill.label}:</span>{" "}
              <span className="text-slate-800">{skill.details}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Custom Sections */}
      {cv.sections.custom && Object.entries(cv.sections.custom).map(([title, items], i) => (
        <section key={i} className="mb-6">
          <h2 className="text-lg font-bold uppercase tracking-wider border-b border-slate-300 mb-2">
            {title}
          </h2>
          <ul className="list-disc list-outside ml-4 space-y-1">
            {items.map((item, index) => (
              <li key={index} className="text-[13px] leading-relaxed text-slate-800 pl-1">
                {item}
              </li>
            ))}
          </ul>
        </section>
      ))}

    </div>
  )
}
