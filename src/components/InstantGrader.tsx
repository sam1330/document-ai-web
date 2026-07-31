'use client'

import { useState, useRef, DragEvent, ChangeEvent } from 'react'
import { useTranslations } from 'next-intl'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CloudArrowUpIcon,
  SparklesIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  LightBulbIcon,
  RocketLaunchIcon,
} from '@heroicons/react/24/outline'
import api from '@/lib/api'
import toast from 'react-hot-toast'
import GradeCircleComponent from './resume/GradeCircleComponent'
import { useRouter } from '@/i18n/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { savePendingResume } from '@/lib/pendingResume'

type GraderState = 'idle' | 'loading' | 'result' | 'error'
interface GraderResult { atsScore: number; tip: string }

// Flip to true when POST /api/public/grade is live on the backend
const ENDPOINT_AVAILABLE = true


async function callGradeEndpoint(file: File): Promise<GraderResult> {
  const form = new FormData()
  form.append('resume', file)
  const res = await api.post('/api/resumes/public/grade', form, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  if (res.status !== 200) toast.error('Error uploading file', { id: 'file-upload-error' });

  return res.data.analysis;
}

export default function InstantGrader() {
  const t = useTranslations('landing.grader')
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [state, setState] = useState<GraderState>('idle')
  const [result, setResult] = useState<GraderResult | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = async (selected?: File) => {
    if (!selected || selected.type !== 'application/pdf' || selected.size > 10 * 1024 * 1024) {
      toast.error(t('toasts.invalidFile')); return
    }
    setFile(selected)
    if (!ENDPOINT_AVAILABLE) { setState('result'); setResult(null); return }
    setState('loading')
    try {
      const data = await callGradeEndpoint(selected)
      setResult(data); setState('result')
    } catch { setState('error') }
  }

  // Carries the graded PDF into the authenticated deep-analysis flow: signed-in
  // users upload it straight away, everyone else stashes it until they have a token.
  const handleUnlock = async () => {
    if (authLoading || submitting || !file) return
    setSubmitting(true)
    try {
      if (user) {
        const form = new FormData()
        form.append('resume', file)
        const res = await api.post('/api/resumes/upload', form, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        const resumeId = res.data?.resume?.id
        router.push(resumeId ? `/resumes?analyze=${resumeId}` : '/resumes')
      } else {
        await savePendingResume(file)
        router.push('/register?next=grader')
      }
    } catch {
      toast.error(t('toasts.uploadFailed'))
      if (user) router.push('/resumes')
      setSubmitting(false)
    }
  }

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault(); setIsDragging(false); handleFile(e.dataTransfer.files[0])
  }
  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => handleFile(e.target.files?.[0])
  const reset = () => {
    setState('idle'); setResult(null); setFile(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  const ctaClasses = 'w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 group'

  return (
    <section id="instant-grader" className="py-24 lg:py-32" aria-labelledby="grader-heading">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-flex items-center gap-2 text-indigo-600 font-black uppercase tracking-widest text-sm mb-4">
            <SparklesIcon className="h-4 w-4" />
            {t('sectionTitle')}
          </span>
          <h2 id="grader-heading" className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            {t('sectionSubtitle')}
          </h2>
        </div>

        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl overflow-hidden">
          <AnimatePresence mode="wait">
            {state === 'idle' && (
              <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-10 lg:p-16">
                <div
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={onDrop}
                  onClick={() => inputRef.current?.click()}
                  className={`cursor-pointer rounded-2xl border-2 border-dashed p-14 text-center transition-all duration-200 group ${isDragging ? 'border-indigo-400 bg-indigo-50' : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50'}`}
                >
                  <input ref={inputRef} type="file" accept="application/pdf" className="hidden" onChange={onInputChange} id="grader-upload" />
                  <div className="h-16 w-16 mx-auto mb-4 bg-indigo-50 group-hover:bg-indigo-100 rounded-2xl flex items-center justify-center transition-colors">
                    <CloudArrowUpIcon className="h-9 w-9 text-indigo-500" />
                  </div>
                  <p className="text-lg font-bold text-slate-800 mb-2">{t('dropzone')}</p>
                  <p className="text-sm text-slate-400">{t('dropzoneHint')}</p>
                </div>
              </motion.div>
            )}

            {state === 'loading' && (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-16 text-center">
                <div className="h-16 w-16 mx-auto mb-6 rounded-2xl bg-indigo-50 flex items-center justify-center">
                  <SparklesIcon className="h-9 w-9 text-indigo-500 animate-pulse" />
                </div>
                <p className="text-lg font-bold text-slate-800 mb-6">{t('analyzing')}</p>
                <div className="w-full max-w-sm mx-auto h-2 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full" initial={{ width: '5%' }} animate={{ width: '85%' }} transition={{ duration: 2.5, ease: 'easeInOut' }} />
                </div>
              </motion.div>
            )}

            {state === 'result' && (
              <motion.div key="result" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="p-10 lg:p-12">
                {result ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div className="text-center">
                      <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">{t('yourScore')}</p>
                      <GradeCircleComponent score={result.atsScore} />
                    </div>
                    <div className="space-y-6">
                      <div className="p-6 bg-amber-50 border border-amber-100 rounded-2xl">
                        <div className="flex items-center gap-2 mb-3">
                          <LightBulbIcon className="h-5 w-5 text-amber-600" />
                          <p className="text-sm font-black text-amber-800 uppercase tracking-wide">{t('tip')}</p>
                        </div>
                        <p className="text-slate-700 text-sm leading-relaxed">{result.tip}</p>
                      </div>
                      <button onClick={handleUnlock} disabled={authLoading || submitting} className={ctaClasses}>
                        {submitting ? (
                          <>
                            <SparklesIcon className="h-4 w-4 animate-pulse" />{t('unlocking')}
                          </>
                        ) : (
                          <>
                            {t('cta')}<ArrowRightIcon className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                          </>
                        )}
                      </button>
                      <p className="text-xs text-center text-slate-400">{t('ctaSubtext')}</p>
                      <button onClick={reset} disabled={submitting} className="w-full text-sm text-slate-400 hover:text-indigo-600 disabled:opacity-60 transition-colors font-medium">{t('uploadAnother')}</button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="h-16 w-16 mx-auto mb-5 bg-indigo-50 rounded-2xl flex items-center justify-center">
                      <RocketLaunchIcon className="h-9 w-9 text-indigo-500" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 mb-3">{t('comingSoon')}</h3>
                    <p className="text-slate-500 mb-8 max-w-sm mx-auto">{t('comingSoonSubtext')}</p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <button onClick={handleUnlock} disabled={authLoading || submitting} className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-indigo-600 text-white font-bold rounded-2xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all group">
                        {submitting ? (
                          <>
                            <SparklesIcon className="h-4 w-4 animate-pulse" />{t('unlocking')}
                          </>
                        ) : (
                          <>
                            {t('cta')}<ArrowRightIcon className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                          </>
                        )}
                      </button>
                      <button onClick={reset} disabled={submitting} className="px-8 py-4 border border-slate-200 text-slate-600 font-bold rounded-2xl hover:bg-slate-50 disabled:opacity-60 transition-colors">{t('uploadAnother')}</button>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {state === 'error' && (
              <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-16 text-center">
                <p className="text-slate-600 mb-6">Something went wrong. Please try again.</p>
                <button onClick={reset} className="px-6 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors">Try again</button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {state === 'idle' && (
          <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 font-medium">
            {['No account required', 'PDF deleted after grading', 'Powered by Vertex AI'].map((item) => (
              <span key={item} className="flex items-center gap-1.5">
                <CheckCircleIcon className="h-3.5 w-3.5 text-emerald-500" />{item}
              </span>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
