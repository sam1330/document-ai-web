"use client"

import React, { useEffect } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { getResumeSchema, ResumeData } from '@/types/resume'
import { useResumeStore } from '@/lib/store/useResumeStore'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/Accordion'
import { Input, Button, Textarea } from '@/components/ui'
import {
  PlusIcon,
  TrashIcon,
  SparklesIcon,
  UserIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  WrenchScrewdriverIcon,
} from '@heroicons/react/24/outline'
import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'
import { SOCIAL_NETWORKS } from '@/types/resume'

export function ResumeForm() {
  const t = useTranslations()
  const { data: storeData, setData: setStoreData } = useResumeStore()

  const { register, control, handleSubmit, watch, reset, getValues, setValue, formState: { errors } } = useForm<ResumeData>({
    resolver: zodResolver(getResumeSchema(t)),
    defaultValues: storeData
  })

  // Sync form changes to the store using a subscription
  useEffect(() => {
    const subscription = watch((value) => {
      if (value) {
        setStoreData(value as ResumeData)
      }
    })
    return () => subscription.unsubscribe()
  }, [watch, setStoreData])

  // Field arrays
  const { fields: experienceFields, append: appendExperience, remove: removeExperience } = useFieldArray({
    control,
    name: "cv.sections.experience"
  })

  const { fields: educationFields, append: appendEducation, remove: removeEducation } = useFieldArray({
    control,
    name: "cv.sections.education"
  })

  const { fields: skillFields, append: appendSkill, remove: removeSkill } = useFieldArray({
    control,
    name: "cv.sections.skills"
  })

  const { fields: socialFields, append: appendSocial, remove: removeSocial } = useFieldArray({
    control,
    name: "cv.social_networks"
  })

  // Watch for 'present' checkbox logic
  const watchedExperience = watch("cv.sections.experience")
  const watchedEducation = watch("cv.sections.education")

  const [enhancingIndex, setEnhancingIndex] = React.useState<{ section: number; highlight: number } | null>(null)

  const handleEnhance = async (sectionIndex: number, highlightIndex: number) => {
    const values = getValues()
    const currentText = values.cv.sections.experience[sectionIndex].highlights[highlightIndex]

    if (!currentText?.trim()) {
      import('react-hot-toast').then(m => m.default.error(t('resumes.builder.toasts.enterText')))
      return
    }

    setEnhancingIndex({ section: sectionIndex, highlight: highlightIndex })
    const toast = (await import('react-hot-toast')).default
    const toastId = toast.loading(t('resumes.builder.toasts.enhancing'))

    try {
      const axios = (await import('axios')).default
      const response = await axios.post('/api/ai/enhance', {
        text: currentText,
        type: 'resume_bullet'
      })

      const enhancedText = response.data.enhancedText

      // Update form
      setValue(`cv.sections.experience.${sectionIndex}.highlights.${highlightIndex}`, enhancedText);

      toast.success(t('resumes.builder.toasts.enhanceSuccess'), { id: toastId })
    } catch (error: any) {
      console.error("AI Enhancement failed:", error)
      toast.error(error.response?.data?.message || t('resumes.builder.toasts.enhanceFailed'), { id: toastId })
    } finally {
      setEnhancingIndex(null)
    }
  }

  return (
    <div className="space-y-6 pb-20">
      <Accordion type="single" collapsible defaultValue="personal-info" className="w-full space-y-4">

        {/* Personal Info */}
        <AccordionItem value="personal-info" className="bg-white rounded-2xl border border-slate-200 px-6 shadow-sm">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-indigo-50 rounded-xl">
                <UserIcon className="h-5 w-5 text-indigo-600" />
              </div>
              <span className="text-lg">{t('resumes.builder.form.sections.personalInfo')}</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label={t('resumes.builder.form.fields.fullName')}
                {...register("cv.name")}
                placeholder={t('resumes.builder.form.placeholders.fullName')}
                error={errors.cv?.name?.message}
              />
              <Input
                label={t('resumes.builder.form.fields.location')}
                {...register("cv.location")}
                placeholder={t('resumes.builder.form.placeholders.location')}
                error={errors.cv?.location?.message}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label={t('resumes.builder.form.fields.email')}
                type="email"
                {...register("cv.email")}
                placeholder={t('resumes.builder.form.placeholders.email')}
                error={errors.cv?.email?.message}
              />
              <Input
                label={t('resumes.builder.form.fields.phone')}
                {...register("cv.phone")}
                placeholder={t('resumes.builder.form.placeholders.phone')}
                error={errors.cv?.phone?.message}
              />
            </div>
            <Input
              label={t('resumes.builder.form.fields.website')}
              {...register("cv.website")}
              placeholder={t('resumes.builder.form.placeholders.website')}
              error={errors.cv?.website?.message}
            />

            {/* Social Networks */}
            <div className="space-y-4 border-t border-slate-100 pt-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-slate-700">{t('resumes.builder.form.sections.socialNetworks') || "Social Networks"}</label>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  className="text-indigo-600 text-xs h-8"
                  onClick={() => appendSocial({ network: "LinkedIn", username: "" })}
                >
                  <PlusIcon className="h-3 w-3 mr-1" /> {t('resumes.builder.form.actions.addSocial') || "Add Social"}
                </Button>
              </div>

              <div className="grid gap-3">
                {socialFields.map((field, index) => (
                  <div key={field.id} className="flex gap-2 items-end bg-slate-50/50 p-3 rounded-xl border border-slate-100 transition-all hover:bg-slate-50">
                    <div className="w-1/3">
                      <label className="text-[10px] font-black uppercase text-slate-400 mb-1 block">Network</label>
                      <select
                        {...register(`cv.social_networks.${index}.network`)}
                        className="w-full h-10 px-3 bg-white border border-slate-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                      >
                        {SOCIAL_NETWORKS.map(net => <option key={net} value={net}>{net}</option>)}
                      </select>
                    </div>
                    <div className="flex-1">
                      <Input
                        label="Username"
                        {...register(`cv.social_networks.${index}.username`)}
                        placeholder="@johndoe"
                        className="bg-white"
                        error={errors.cv?.social_networks?.[index]?.username?.message}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeSocial(index)}
                      className="p-2.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">{t('resumes.builder.form.sections.summary')}</label>
              <Textarea
                placeholder={t('resumes.builder.form.placeholders.summary')}
                className="min-h-[100px]"
                {...register("cv.sections.summary.0")}
                error={errors.cv?.sections?.summary?.[0]?.message}
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Experience */}
        <AccordionItem value="experience" className="bg-white rounded-2xl border border-slate-200 px-6 shadow-sm">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-violet-50 rounded-xl">
                <BriefcaseIcon className="h-5 w-5 text-violet-600" />
              </div>
              <span className="text-lg">{t('resumes.builder.form.sections.experience')}</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-6">
            {experienceFields.map((field, index) => (
              <div key={field.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 space-y-4 relative group">
                <button
                  type="button"
                  onClick={() => removeExperience(index)}
                  className="absolute top-4 right-4 p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label={t('resumes.builder.form.fields.company')}
                    {...register(`cv.sections.experience.${index}.company`)}
                    placeholder={t('resumes.builder.form.placeholders.company')}
                    error={errors.cv?.sections?.experience?.[index]?.company?.message}
                  />
                  <Input
                    label={t('resumes.builder.form.fields.position')}
                    {...register(`cv.sections.experience.${index}.position`)}
                    placeholder={t('resumes.builder.form.placeholders.position')}
                    error={errors.cv?.sections?.experience?.[index]?.position?.message}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                  <div className="md:col-span-12">
                    <Input
                      label={t('resumes.builder.form.fields.jobLocation')}
                      {...register(`cv.sections.experience.${index}.location`)}
                      placeholder={t('resumes.builder.form.placeholders.jobLocation')}
                      error={errors.cv?.sections?.experience?.[index]?.location?.message}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                  <div className="md:col-span-12 grid grid-cols-2 gap-2">
                    <div className="relative">
                      <Input
                        label={t('resumes.builder.form.fields.startDate')}
                        type="month"
                        {...register(`cv.sections.experience.${index}.start_date`)}
                        error={errors.cv?.sections?.experience?.[index]?.start_date?.message}
                      />
                    </div>
                    <div className="relative">
                      <Input
                        label={t('resumes.builder.form.fields.endDate')}
                        type="month"
                        {...register(`cv.sections.experience.${index}.end_date`)}
                        disabled={watchedExperience?.[index]?.end_date === 'present'}
                        className="pr-10"
                        error={errors.cv?.sections?.experience?.[index]?.end_date?.message}
                      />
                      <div className="absolute -bottom-6 right-0 flex items-center space-x-1.5 px-1 py-1">
                        <input
                          type="checkbox"
                          id={`present-${index}`}
                          checked={watchedExperience?.[index]?.end_date === 'present'}
                          onChange={(e) => {
                            setValue(`cv.sections.experience.${index}.end_date`, e.target.checked ? 'present' : '');
                          }}
                          className="h-3.5 w-3.5 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer"
                        />
                        <label htmlFor={`present-${index}`} className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter cursor-pointer hover:text-indigo-600 transition-colors">
                          {t('resumes.builder.form.fields.present') || "Present"}
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-bold text-slate-700">{t('resumes.builder.form.fields.highlights')}</label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-xs h-8 text-indigo-600"
                      onClick={() => {
                        const values = getValues()
                        const highlights = values.cv.sections.experience[index].highlights || [];
                        setValue(`cv.sections.experience.${index}.highlights`, [...highlights, ""]);
                      }}
                    >
                      <PlusIcon className="h-3 w-3 mr-1" /> {t('resumes.builder.form.actions.addBullet')}
                    </Button>
                  </div>
                  {(field.highlights || []).map((_, hIndex) => (
                    <div key={hIndex} className="group/bullet relative">
                      <Textarea
                        className="min-h-[80px] text-[13px] leading-relaxed pr-12 pb-10 bg-white border-slate-200 focus:border-indigo-300 focus:ring-indigo-100 transition-all rounded-xl"
                        {...register(`cv.sections.experience.${index}.highlights.${hIndex}`)}
                      />
                      <div className="absolute bottom-3 right-3 flex items-center space-x-2 opacity-0 group-hover/bullet:opacity-100 transition-all">
                        <button
                          type="button"
                          disabled={enhancingIndex?.section === index && enhancingIndex?.highlight === hIndex}
                          onClick={() => handleEnhance(index, hIndex)}
                          className={cn(
                            "flex items-center space-x-1 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all",
                            enhancingIndex?.section === index && enhancingIndex?.highlight === hIndex
                              ? "bg-indigo-100 text-indigo-600 animate-pulse"
                              : "bg-slate-100 text-slate-500 hover:bg-indigo-600 hover:text-white"
                          )}
                        >
                          <SparklesIcon className={cn("h-3 w-3", enhancingIndex?.section === index && enhancingIndex?.highlight === hIndex && "animate-spin")} />
                          <span>{t('resumes.builder.form.credits.oneCredit')}</span>
                        </button>
                        <button
                          type="button"
                          className="p-1.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                          onClick={() => {
                            const values = getValues()
                            const highlights = values.cv.sections.experience[index].highlights.filter((_, hi) => hi !== hIndex);
                            setValue(`cv.sections.experience.${index}.highlights`, highlights);
                          }}
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <Button
              variant="outline"
              className="w-full border-dashed border-slate-300 text-slate-500 hover:text-indigo-600 hover:border-indigo-300 h-12"
              onClick={() => appendExperience({
                company: "", position: "", location: "", start_date: "", end_date: "", highlights: [""]
              })}
            >
              <PlusIcon className="h-4 w-4 mr-2" /> {t('resumes.builder.form.actions.addExperience')}
            </Button>
          </AccordionContent>
        </AccordionItem>

        {/* Education */}
        <AccordionItem value="education" className="bg-white rounded-2xl border border-slate-200 px-6 shadow-sm">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-emerald-50 rounded-xl">
                <AcademicCapIcon className="h-5 w-5 text-emerald-600" />
              </div>
              <span className="text-lg">{t('resumes.builder.form.sections.education')}</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-6">
            {educationFields.map((field, index) => (
              <div key={field.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 space-y-4 relative group">
                <button
                  onClick={() => removeEducation(index)}
                  className="absolute top-4 right-4 p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
                <Input
                  label={t('resumes.builder.form.fields.institution')}
                  {...register(`cv.sections.education.${index}.institution`)}
                  placeholder={t('resumes.builder.form.placeholders.institution')}
                  error={errors.cv?.sections?.education?.[index]?.institution?.message}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label={t('resumes.builder.form.fields.degree')}
                    {...register(`cv.sections.education.${index}.degree`)}
                    placeholder={t('resumes.builder.form.placeholders.degree')}
                    error={errors.cv?.sections?.education?.[index]?.degree?.message}
                  />
                  <Input
                    label={t('resumes.builder.form.fields.area')}
                    {...register(`cv.sections.education.${index}.area`)}
                    placeholder={t('resumes.builder.form.placeholders.area')}
                    error={errors.cv?.sections?.education?.[index]?.area?.message}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                  <div className="md:col-span-12 lg:col-span-5">
                    <Input
                      label={t('resumes.builder.form.fields.jobLocation')}
                      {...register(`cv.sections.education.${index}.location`)}
                      placeholder={t('resumes.builder.form.placeholders.jobLocation')}
                      error={errors.cv?.sections?.education?.[index]?.location?.message}
                    />
                  </div>
                  <div className="md:col-span-12 lg:col-span-7 grid grid-cols-2 gap-2">
                    <div className="relative">
                      <Input
                        label={t('resumes.builder.form.fields.startDate')}
                        type="month"
                        {...register(`cv.sections.education.${index}.start_date`)}
                        error={errors.cv?.sections?.education?.[index]?.start_date?.message}
                      />
                    </div>
                    <div className="relative">
                      <Input
                        label={t('resumes.builder.form.fields.endDate')}
                        type="month"
                        {...register(`cv.sections.education.${index}.end_date`)}
                        disabled={watchedEducation?.[index]?.end_date === 'present'}
                        className="pr-10"
                        error={errors.cv?.sections?.education?.[index]?.end_date?.message}
                      />
                      <div className="absolute -bottom-6 right-0 flex items-center space-x-1.5 px-1 py-1">
                        <input
                          type="checkbox"
                          id={`edu-present-${index}`}
                          checked={watchedEducation?.[index]?.end_date === 'present'}
                          onChange={(e) => {
                            setValue(`cv.sections.education.${index}.end_date`, e.target.checked ? 'present' : '');
                          }}
                          className="h-3.5 w-3.5 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer"
                        />
                        <label htmlFor={`edu-present-${index}`} className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter cursor-pointer hover:text-indigo-600 transition-colors">
                          {t('resumes.builder.form.fields.present') || "Present"}
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <Button
              variant="outline"
              className="w-full border-dashed border-slate-300 text-slate-500 hover:text-emerald-600 hover:border-emerald-300 h-12"
              onClick={() => appendEducation({
                institution: "", degree: "", area: "", location: "", start_date: "", end_date: ""
              })}
            >
              <PlusIcon className="h-4 w-4 mr-2" /> {t('resumes.builder.form.actions.addEducation')}
            </Button>
          </AccordionContent>
        </AccordionItem>

        {/* Skills */}
        <AccordionItem value="skills" className="bg-white rounded-2xl border border-slate-200 px-6 shadow-sm">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-amber-50 rounded-xl">
                <WrenchScrewdriverIcon className="h-5 w-5 text-amber-600" />
              </div>
              <span className="text-lg">{t('resumes.builder.form.sections.skills')}</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-6">
            {skillFields.map((field, index) => (
              <div key={field.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end bg-slate-50/50 p-4 rounded-xl border border-slate-100 group relative">
                <button
                  type="button"
                  onClick={() => removeSkill(index)}
                  className="absolute top-2 right-2 p-1.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                >
                  <TrashIcon className="h-3.5 w-3.5" />
                </button>
                <div className="md:col-span-1">
                  <Input
                    label={t('resumes.builder.form.fields.skillCategory')}
                    {...register(`cv.sections.skills.${index}.label`)}
                    placeholder={t('resumes.builder.form.placeholders.skillCategory')}
                    error={errors.cv?.sections?.skills?.[index]?.label?.message}
                  />
                </div>
                <div className="md:col-span-2">
                  <Input
                    label={t('resumes.builder.form.fields.skillDetails')}
                    {...register(`cv.sections.skills.${index}.details`)}
                    placeholder={t('resumes.builder.form.placeholders.skillDetails')}
                    error={errors.cv?.sections?.skills?.[index]?.details?.message}
                  />
                </div>
              </div>
            ))}
            <Button
              variant="outline"
              className="w-full border-dashed border-slate-300 text-slate-500 hover:text-amber-600 hover:border-amber-300 h-12"
              onClick={() => appendSkill({ label: "", details: "" })}
            >
              <PlusIcon className="h-4 w-4 mr-2" /> {t('resumes.builder.form.actions.addSkill')}
            </Button>
          </AccordionContent>
        </AccordionItem>

      </Accordion>
    </div>
  )
}
