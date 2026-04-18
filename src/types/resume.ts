import { z } from "zod";

export const getResumeSchema = (t: any) => z.object({
  cv: z.object({
    name: z.string().min(1, t('resumes.builder.form.validation.required', { field: t('resumes.builder.form.fields.fullName') })),
    location: z.string().min(1, t('resumes.builder.form.validation.required', { field: t('resumes.builder.form.fields.location') })),
    email: z.email(t('resumes.builder.form.validation.invalidEmail'))
      .min(1, t('resumes.builder.form.validation.required', { field: t('resumes.builder.form.fields.email') })),
    phone: z.string()
      .min(1, t('resumes.builder.form.validation.required', { field: t('resumes.builder.form.fields.phone') }))
      .regex(/^\+[1-9]\d{1,14}$/, t('resumes.builder.form.validation.invalidPhone')),
    website: z.url(t('resumes.builder.form.validation.invalidUrl')).optional().or(z.literal("")),
    social_networks: z.array(z.object({
      network: z.string(),
      username: z.string().min(1, t('resumes.builder.form.validation.required', { field: "Username" }))
    })).optional(),
    sections: z.object({
      summary: z.array(z.string()),
      experience: z.array(z.object({
        company: z.string().min(1, t('resumes.builder.form.validation.required', { field: t('resumes.builder.form.fields.company') })),
        position: z.string().min(1, t('resumes.builder.form.validation.required', { field: t('resumes.builder.form.fields.position') })),
        location: z.string().min(1, t('resumes.builder.form.validation.required', { field: t('resumes.builder.form.fields.jobLocation') })),
        start_date: z.string().min(1, t('resumes.builder.form.validation.required', { field: t('resumes.builder.form.fields.startDate') })),
        end_date: z.string().min(1, t('resumes.builder.form.validation.required', { field: t('resumes.builder.form.fields.endDate') })),
        highlights: z.array(z.string())
      })),
      education: z.array(z.object({
        institution: z.string().min(1, t('resumes.builder.form.validation.required', { field: t('resumes.builder.form.fields.institution') })),
        area: z.string().min(1, t('resumes.builder.form.validation.required', { field: t('resumes.builder.form.fields.area') })),
        degree: z.string().min(1, t('resumes.builder.form.validation.required', { field: t('resumes.builder.form.fields.degree') })),
        location: z.string().min(1, t('resumes.builder.form.validation.required', { field: t('resumes.builder.form.fields.jobLocation') })),
        start_date: z.string().min(1, t('resumes.builder.form.validation.required', { field: t('resumes.builder.form.fields.startDate') })),
        end_date: z.string().min(1, t('resumes.builder.form.validation.required', { field: t('resumes.builder.form.fields.endDate') }))
      })),
      skills: z.array(z.object({
        label: z.string().min(1, t('resumes.builder.form.validation.required', { field: t('resumes.builder.form.fields.skillCategory') })),
        details: z.string().min(1, t('resumes.builder.form.validation.required', { field: t('resumes.builder.form.fields.skillDetails') }))
      })),
      custom: z.array(z.object({
        title: z.string().min(1, t('resumes.builder.form.validation.required', { field: "Custom" })),
        content: z.array(z.string())
      }))
    })
  }),
  design: z.object({
    theme: z.string(),
    typography: z.object({
      font_family: z.object({
        body: z.string(),
        name: z.string(),
        section_titles: z.string(),
        headline: z.string(),
      })
    })
  }),
  locale: z.object({
    language: z.string().default("english")
  })
});

export const ResumeSchema = getResumeSchema((key: string) => key); // Fallback for static typing/usage

export type ResumeData = z.infer<ReturnType<typeof getResumeSchema>>;

export const SOCIAL_NETWORKS = [
  "LinkedIn",
  "GitHub",
  "GitLab",
  "IMDB",
  "Instagram",
  "ORCID",
  "Mastodon",
  "StackOverflow",
  "ResearchGate",
  "YouTube",
  "Google Scholar",
  "Telegram",
  "WhatsApp",
  "Leetcode",
  "X",
  "Bluesky",
  "Reddit"
];
