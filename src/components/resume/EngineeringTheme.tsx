"use client"

import React from 'react'
import { ResumeData } from '@/types/resume'
import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'

interface EngineeringThemeProps {
  data: ResumeData
}

export function EngineeringTheme({ data }: EngineeringThemeProps) {
  const t = useTranslations()
  const { cv, design } = data
  const { typography } = design

  const fontClass = typography.font_family.body === 'mono' ? 'font-mono' :
    typography.font_family.body === 'sans' ? 'font-sans' :
      'font-serif'

  return (
    <div
      className={cn(
        "bg-white text-black p-[20mm] shadow-2xl print:shadow-none mx-auto relative overflow-hidden transition-all duration-500",
        fontClass
      )}
      style={{
        width: "210mm",
        minHeight: "296mm",
        boxSizing: "border-box"
      }}
    >
      {/* Header */}
      <header className="mb-4">
        <h1 className="text-3xl font-bold mb-1">
          {cv.name || t('resumes.builder.preview.placeholderName')}
        </h1>
        <div className="text-sm flex flex-wrap gap-x-3 text-slate-800">
          {cv.location && <span>{cv.location}</span>}
          {cv.phone && <span>{cv.phone}</span>}
          {cv.email && <span className="underline">{cv.email}</span>}
          {cv.website && (
            <span className="underline">{cv.website.replace(/^https?:\/\//, '')}</span>
          )}
          {cv.social_networks && cv.social_networks.map((sn, index) => (
            <span key={index}><span className="font-semibold">{sn.network}:</span> <span className="underline">{sn.username}</span></span>
          ))}
        </div>
      </header>

      {/* Summary */}
      {cv.sections.summary && cv.sections.summary.length > 0 && (
        <section className="mb-4">
          <p className="text-sm leading-tight">
            {cv.sections.summary[0]}
          </p>
        </section>
      )}

      {/* Skills (Engineering standard usually puts skills near top) */}
      {cv.sections.skills && cv.sections.skills.length > 0 && (
        <section className="mb-4 mt-2">
          <h2 className="text-sm font-bold uppercase border-b-2 border-black mb-2">
            {t('resumes.builder.preview.sections.skills')}
          </h2>
          <div className="flex flex-col gap-1">
            {cv.sections.skills.map((skill, i) => (
              <div key={i} className="text-[13px] leading-tight">
                <span className="font-bold">{skill.label}:</span>{" "}
                <span>{skill.details}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Experience */}
      <section className="mb-4">
        <h2 className="text-sm font-bold uppercase border-b-2 border-black mb-2 mt-2">
          {t('resumes.builder.preview.sections.experience')}
        </h2>
        <div className="space-y-3">
          {cv.sections.experience.map((exp, i) => (
            <div key={i}>
              <div className="flex justify-between items-baseline">
                <span className="font-bold text-sm">{exp.company} — {exp.position}</span>
                <span className="text-sm">{exp.start_date} – {exp.end_date}</span>
              </div>
              <div className="text-xs italic mb-1">
                {exp.location}
              </div>
              <ul className="list-disc list-outside ml-4 space-y-0.5">
                {(exp.highlights || []).map((highlight, hIndex) => (
                  <li key={hIndex} className="text-[13px] leading-tight pl-1">
                    {highlight}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Education */}
      <section className="mb-4">
        <h2 className="text-sm font-bold uppercase border-b-2 border-black mb-2 mt-2">
          {t('resumes.builder.preview.sections.education')}
        </h2>
        <div className="space-y-2">
          {cv.sections.education.map((edu, i) => (
            <div key={i} className="flex justify-between items-baseline">
              <div>
                <span className="font-bold text-sm">{edu.institution}</span>
                <span className="mx-2">—</span>
                <span className="text-[13px]">{edu.degree} {t('resumes.builder.preview.themeLabels.in')} {edu.area}</span>
              </div>
              <div className="text-sm">
                {edu.start_date} – {edu.end_date}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Custom Sections */}
      {cv.sections.custom && Object.entries(cv.sections.custom).map(([title, items], i) => (
        <section key={i} className="mb-4">
          <h2 className="text-sm font-bold uppercase border-b-2 border-black mb-2 mt-2">
            {title}
          </h2>
          <div className="font-bold text-sm mb-1">{items.title}</div>
          <ul className="list-disc list-outside ml-4 space-y-0.5">
            {items.content.map((item, index) => (
              <li key={index} className="text-[13px] leading-tight pl-1">
                {item}
              </li>
            ))}
          </ul>
        </section>
      ))}

    </div>
  )
}
