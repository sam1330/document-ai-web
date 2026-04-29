"use client"

import React from 'react'
import { ResumeData } from '@/types/resume'
import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'

interface MinimalThemeProps {
  data: ResumeData
}

export function MinimalTheme({ data }: MinimalThemeProps) {
  const t = useTranslations()
  const { cv, design } = data
  const { typography } = design

  const fontClass = typography.font_family.body === 'mono' ? 'font-mono' :
    typography.font_family.body === 'sans' ? 'font-sans' :
      'font-serif'

  return (
    <div
      className={cn(
        "bg-white text-gray-800 shadow-2xl print:shadow-none mx-auto relative overflow-hidden transition-all duration-500",
        fontClass
      )}
      style={{
        width: "210mm",
        minHeight: "296mm",
        boxSizing: "border-box",
        padding: "25mm 20mm"
      }}
    >
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-4xl font-light tracking-tight text-gray-900 mb-2">
          {cv.name || t('resumes.builder.preview.placeholderName')}
        </h1>
        <div className="text-xs text-gray-500 font-medium flex flex-wrap gap-4">
          {cv.location && <span>{cv.location}</span>}
          {cv.phone && <span>{cv.phone}</span>}
          {cv.email && <span>{cv.email}</span>}
          {cv.website && (
            <span>{cv.website.replace(/^https?:\/\//, '')}</span>
          )}
          {cv.social_networks && cv.social_networks.map((sn, index) => (
            <span key={index}>{sn.network}: {sn.username}</span>
          ))}
        </div>
      </header>

      {/* Summary */}
      {cv.sections.summary && cv.sections.summary.length > 0 && (
        <section className="mb-8 break-inside-avoid">
          <p className="text-sm leading-relaxed text-gray-600">
            {cv.sections.summary[0]}
          </p>
        </section>
      )}

      {/* Experience */}
      {cv.sections.experience && cv.sections.experience.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-400 mb-4">
            {t('resumes.builder.preview.sections.experience')}
          </h2>
          <div className="space-y-6">
            {cv.sections.experience.map((exp, i) => (
              <div key={i} className="break-inside-avoid">
                <div className="flex flex-col mb-1">
                  <div className="flex justify-between items-baseline">
                    <span className="font-semibold text-gray-900 text-[15px]">{exp.position}</span>
                    <span className="text-xs text-gray-400 font-medium">{exp.start_date} — {exp.end_date}</span>
                  </div>
                  <span className="text-sm text-gray-600">{exp.company}{exp.location ? `, ${exp.location}` : ''}</span>
                </div>
                <ul className="list-none space-y-1.5 mt-2">
                  {(exp.highlights || []).map((highlight, hIndex) => (
                    <li key={hIndex} className="text-[13px] leading-relaxed text-gray-600 relative pl-3 before:content-[''] before:absolute before:left-0 before:top-2 before:w-1 before:h-1 before:bg-gray-300 before:rounded-full">
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
          <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-400 mb-4">
            {t('resumes.builder.preview.sections.education')}
          </h2>
          <div className="space-y-4">
            {cv.sections.education.map((edu, i) => (
              <div key={i} className="flex justify-between items-baseline break-inside-avoid">
                <div>
                  <div className="font-semibold text-gray-900 text-[15px]">{edu.institution}</div>
                  <div className="text-sm text-gray-600">{edu.degree} {t('resumes.builder.preview.themeLabels.in')} {edu.area} {edu.location ? ` • ${edu.location}` : ''}</div>
                </div>
                <div className="text-xs text-gray-400 font-medium">
                  {edu.start_date} — {edu.end_date}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {cv.sections.skills && cv.sections.skills.length > 0 && (
        <section className="mb-8 break-inside-avoid">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-400 mb-4">
            {t('resumes.builder.preview.sections.skills')}
          </h2>
          <div className="flex flex-wrap gap-2">
            {cv.sections.skills.map((skill, i) => (
              <div key={i} className="text-[13px] text-gray-600">
                <span className="font-semibold text-gray-800">{skill.label}:</span> {skill.details}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Custom Sections */}
      {cv.sections.custom && Object.entries(cv.sections.custom).map(([title, items], i) => (
        <section key={i} className="mb-8 break-inside-avoid">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-400 mb-4">
            {items.title}
          </h2>
          <ul className="list-none space-y-1.5">
            {items.content.map((item, index) => (
              <li key={index} className="text-[13px] leading-relaxed text-gray-600 relative pl-3 before:content-[''] before:absolute before:left-0 before:top-2 before:w-1 before:h-1 before:bg-gray-300 before:rounded-full">
                {item}
              </li>
            ))}
          </ul>
        </section>
      ))}

    </div>
  )
}
