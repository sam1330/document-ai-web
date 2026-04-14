"use client"

import React from 'react'
import { useResumeStore } from '@/lib/store/useResumeStore'
import { cn } from '@/lib/utils'
import {
  CheckIcon,
  SwatchIcon,
  RectangleGroupIcon,
  NoSymbolIcon,
  PencilIcon
} from '@heroicons/react/24/outline'

const templates = [
  { id: 'classic', name: 'Classic', description: 'Clean and professional serif layout.' },
  { id: 'modern', name: 'Modern', description: 'Contemporary sans-serif with bold headers.' },
  { id: 'engineering', name: 'Engineering', description: 'Compact and technical layout for developers.' },
]

const fonts = [
  { id: 'serif', name: 'Serif (Classic Professional)', class: 'font-serif' },
  { id: 'sans', name: 'Sans (Modern Minimalist)', class: 'font-sans' },
  { id: 'mono', name: 'Mono (Technical/Developer)', class: 'font-mono' },
]

export function DesignForm() {
  const { data, updateField } = useResumeStore()

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-left-4 duration-500">

      {/* Template Selection */}
      <section className="space-y-4">
        <div className="flex items-center space-x-2 pb-2 border-b border-slate-100">
          <SwatchIcon className="h-5 w-5 text-indigo-600" />
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">Appearance</h2>
        </div>

        <div className="grid gap-4">
          {templates.map((template) => (
            <button
              key={template.id}
              onClick={() => {
                updateField('template', template.id)
                updateField('cv_body.design.theme', template.id)
              }}
              className={cn(
                "flex items-start text-left p-5 rounded-2xl border-2 transition-all relative group overflow-hidden",
                data.template === template.id
                  ? "border-indigo-600 bg-indigo-50/50 ring-4 ring-indigo-50"
                  : "border-slate-100 hover:border-slate-200 bg-white hover:bg-slate-50/50"
              )}
            >
              <div className="flex-1 z-10">
                <div className="flex items-center space-x-2">
                  <p className={cn(
                    "font-bold transition-colors",
                    data.template === template.id ? "text-indigo-900" : "text-slate-700 group-hover:text-slate-900"
                  )}>
                    {template.name}
                  </p>
                  {template.id !== 'classic' && (
                    <span className="text-[10px] font-black uppercase tracking-tighter bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded shadow-sm">
                      Placeholder
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{template.description}</p>
              </div>

              {data.template === template.id && (
                <div className="bg-indigo-600 rounded-full p-1 shadow-lg shadow-indigo-200 z-10">
                  <CheckIcon className="h-3.5 w-3.5 text-white stroke-[3px]" />
                </div>
              )}

              {/* Subtle background decoration */}
              <div className={cn(
                "absolute -right-4 -bottom-4 h-16 w-16 opacity-[0.03] transition-transform duration-500",
                data.template === template.id ? "scale-150 rotate-12" : "group-hover:translate-x-1 group-hover:-translate-y-1"
              )}>
                <RectangleGroupIcon className="h-full w-full" />
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Font Selection */}
      <section className="space-y-4">
        <div className="flex items-center space-x-2 pb-2 border-b border-slate-100">
          <PencilIcon className="h-5 w-5 text-indigo-600" />
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">Typography</h2>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {fonts.map((font) => (
            <button
              key={font.id}
              onClick={() => updateField('cv_body.design.font', font.id)}
              className={cn(
                "flex items-center justify-between p-4 rounded-xl border-2 transition-all text-sm group",
                data.cv_body.design.font === font.id
                  ? "border-indigo-600 bg-indigo-50/30 text-indigo-900 font-bold shadow-sm"
                  : "border-slate-100 text-slate-500 hover:border-slate-200 bg-white hover:text-slate-900"
              )}
            >
              <span className={cn(font.class, "text-base")}>{font.name}</span>
              {data.cv_body.design.font === font.id ? (
                <div className="h-2 w-2 bg-indigo-600 rounded-full"></div>
              ) : (
                <div className="h-2 w-2 bg-slate-200 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
              )}
            </button>
          ))}
        </div>
      </section>

      {/* Spacing & Layout Placeholder */}
      <section className="space-y-4 opacity-50 grayscale select-none cursor-not-allowed">
        <div className="flex items-center space-x-2 pb-2 border-b border-slate-100">
          <NoSymbolIcon className="h-5 w-5 text-slate-400" />
          <h2 className="text-lg font-bold text-slate-400">Advanced Controls</h2>
        </div>
        <div className="p-6 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-center">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Available in Pro</p>
          <p className="text-[10px] text-slate-400 mt-1">Margins, line height, and color customizer.</p>
        </div>
      </section>

    </div>
  )
}
