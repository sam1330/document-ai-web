"use client"

import React, { useEffect } from 'react'
import { useForm, useFieldArray, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ResumeSchema, ResumeData } from '@/types/resume'
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
  PuzzlePieceIcon
} from '@heroicons/react/24/outline'
import { cn } from '@/lib/utils'

import isEqual from 'lodash/isEqual'

export function ResumeForm() {
  const { data: storeData, setData: setStoreData } = useResumeStore()

  const { register, control, handleSubmit, watch, reset, getValues } = useForm<ResumeData>({
    resolver: zodResolver(ResumeSchema),
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
  }, [])

  // Field arrays
  const { fields: experienceFields, append: appendExperience, remove: removeExperience } = useFieldArray({
    control,
    name: "cv_body.cv.sections.experience"
  })

  const { fields: educationFields, append: appendEducation, remove: removeEducation } = useFieldArray({
    control,
    name: "cv_body.cv.sections.education"
  })

  const { fields: skillFields, append: appendSkill, remove: removeSkill } = useFieldArray({
    control,
    name: "cv_body.cv.sections.skills"
  })

  const [enhancingIndex, setEnhancingIndex] = React.useState<{ section: number; highlight: number } | null>(null)

  const handleEnhance = async (sectionIndex: number, highlightIndex: number) => {
    const values = getValues()
    const currentText = values.cv_body.cv.sections.experience[sectionIndex].highlights[highlightIndex]

    if (!currentText?.trim()) {
      import('react-hot-toast').then(m => m.default.error("Please enter some text to enhance"))
      return
    }

    setEnhancingIndex({ section: sectionIndex, highlight: highlightIndex })
    const toast = (await import('react-hot-toast')).default
    const toastId = toast.loading("AI is polishing your bullet point...")

    try {
      const axios = (await import('axios')).default
      const response = await axios.post('/api/ai/enhance', {
        text: currentText,
        type: 'resume_bullet'
      })

      const enhancedText = response.data.enhancedText

      // Update form
      reset({
        ...values,
        cv_body: {
          ...values.cv_body,
          cv: {
            ...values.cv_body.cv,
            sections: {
              ...values.cv_body.cv.sections,
              experience: values.cv_body.cv.sections.experience.map((exp, i) =>
                i === sectionIndex ? {
                  ...exp,
                  highlights: exp.highlights.map((h, hi) => hi === highlightIndex ? enhancedText : h)
                } : exp
              )
            }
          }
        }
      })

      toast.success("Enhanced!", { id: toastId })
    } catch (error: any) {
      console.error("AI Enhancement failed:", error)
      toast.error(error.response?.data?.message || "Failed to enhance", { id: toastId })
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
              <span className="text-lg">Personal Information</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input label="Full Name" {...register("cv_body.cv.name")} placeholder="John Doe" />
              <Input label="Location" {...register("cv_body.cv.location")} placeholder="City, Country" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Email" type="email" {...register("cv_body.cv.email")} placeholder="john@example.com" />
              <Input label="Phone" {...register("cv_body.cv.phone")} placeholder="+1 234 567 890" />
            </div>
            <Input label="Website" {...register("cv_body.cv.website")} placeholder="https://yourwebsite.com" />
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Professional Summary</label>
              <Textarea
                placeholder="A brief overview of your professional background..."
                className="min-h-[100px]"
                {...register("cv_body.cv.sections.summary.0")}
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
              <span className="text-lg">Experience</span>
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
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Company" {...register(`cv_body.cv.sections.experience.${index}.company`)} placeholder="Company Name" />
                  <Input label="Position" {...register(`cv_body.cv.sections.experience.${index}.position`)} placeholder="Job Title" />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <Input label="Location" {...register(`cv_body.cv.sections.experience.${index}.location`)} placeholder="Remote / City" />
                  <Input label="Start Date" {...register(`cv_body.cv.sections.experience.${index}.start_date`)} placeholder="MM/YYYY" />
                  <Input label="End Date" {...register(`cv_body.cv.sections.experience.${index}.end_date`)} placeholder="MM/YYYY or Present" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-bold text-slate-700">Highlights</label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-xs h-8 text-indigo-600"
                      onClick={() => {
                        const values = getValues()
                        const highlights = values.cv_body.cv.sections.experience[index].highlights || [];
                        reset({
                          ...values,
                          cv_body: {
                            ...values.cv_body,
                            cv: {
                              ...values.cv_body.cv,
                              sections: {
                                ...values.cv_body.cv.sections,
                                experience: values.cv_body.cv.sections.experience.map((exp, i) =>
                                  i === index ? { ...exp, highlights: [...highlights, ""] } : exp
                                )
                              }
                            }
                          }
                        });
                      }}
                    >
                      <PlusIcon className="h-3 w-3 mr-1" /> Add Bullet
                    </Button>
                  </div>
                  {(field.highlights || []).map((_, hIndex) => (
                    <div key={hIndex} className="flex gap-2">
                      <div className="flex-1">
                        <Textarea
                          className="min-h-[60px] text-sm"
                          {...register(`cv_body.cv.sections.experience.${index}.highlights.${hIndex}`)}
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <button
                          type="button"
                          className="p-2 text-slate-300 hover:text-rose-500"
                          onClick={() => {
                            const values = getValues()
                            reset({
                              ...values,
                              cv_body: {
                                ...values.cv_body,
                                cv: {
                                  ...values.cv_body.cv,
                                  sections: {
                                    ...values.cv_body.cv.sections,
                                    experience: values.cv_body.cv.sections.experience.map((exp, i) =>
                                      i === index ? {
                                        ...exp,
                                        highlights: exp.highlights.filter((_, hi) => hi !== hIndex)
                                      } : exp
                                    )
                                  }
                                }
                              }
                            })
                          }}
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          disabled={enhancingIndex?.section === index && enhancingIndex?.highlight === hIndex}
                          onClick={() => handleEnhance(index, hIndex)}
                          className={cn(
                            "p-2 rounded-lg transition-all relative group/ai",
                            enhancingIndex?.section === index && enhancingIndex?.highlight === hIndex
                              ? "text-indigo-600 bg-indigo-50 animate-pulse"
                              : "text-slate-300 hover:text-indigo-600 hover:bg-slate-50"
                          )}
                        >
                          <SparklesIcon className={cn("h-4 w-4", enhancingIndex?.section === index && enhancingIndex?.highlight === hIndex && "animate-spin")} />
                          <span className="absolute -top-3 -right-2 text-[8px] bg-indigo-600 text-white px-1.5 py-0.5 rounded-full font-black shadow-sm group-hover/ai:scale-110 transition-transform">
                            1 Credit
                          </span>
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
              <PlusIcon className="h-4 w-4 mr-2" /> Add Experience
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
              <span className="text-lg">Education</span>
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
                <Input label="Institution" {...register(`cv_body.cv.sections.education.${index}.institution`)} placeholder="University Name" />
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Degree" {...register(`cv_body.cv.sections.education.${index}.degree`)} placeholder="Master of Science" />
                  <Input label="Area of Study" {...register(`cv_body.cv.sections.education.${index}.area`)} placeholder="Computer Science" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Start Date" {...register(`cv_body.cv.sections.education.${index}.start_date`)} placeholder="MM/YYYY" />
                  <Input label="End Date" {...register(`cv_body.cv.sections.education.${index}.end_date`)} placeholder="MM/YYYY" />
                </div>
              </div>
            ))}
            <Button
              variant="outline"
              className="w-full border-dashed border-slate-300 text-slate-500 hover:text-emerald-600 hover:border-emerald-300 h-12"
              onClick={() => appendEducation({
                institution: "", degree: "", area: "", start_date: "", end_date: ""
              })}
            >
              <PlusIcon className="h-4 w-4 mr-2" /> Add Education
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
              <span className="text-lg">Skills</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-6">
            {skillFields.map((field, index) => (
              <div key={field.id} className="grid grid-cols-3 gap-4 items-end bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                <Input label="Skill Category" {...register(`cv_body.cv.sections.skills.${index}.label`)} placeholder="e.g. Languages" />
                <div className="col-span-2 flex gap-2 items-end">
                  <div className="flex-1">
                    <Input label="Skills" {...register(`cv_body.cv.sections.skills.${index}.details`)} placeholder="JavaScript, React, Node.js" />
                  </div>
                  <button
                    onClick={() => removeSkill(index)}
                    className="p-2.5 text-slate-400 hover:text-rose-500"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
            <Button
              variant="outline"
              className="w-full border-dashed border-slate-300 text-slate-500 hover:text-amber-600 hover:border-amber-300 h-12"
              onClick={() => appendSkill({ label: "", details: "" })}
            >
              <PlusIcon className="h-4 w-4 mr-2" /> Add Skill Category
            </Button>
          </AccordionContent>
        </AccordionItem>

      </Accordion>
    </div>
  )
}
