import { z } from "zod";

export const ResumeSchema = z.object({
  template: z.enum(["classic", "modern", "engineering"]),
  cv_body: z.object({
    cv: z.object({
      name: z.string().min(1, "Name is required"),
      location: z.string().min(1, "Location is required"),
      email: z.string().email("Invalid email address"),
      phone: z.string().min(1, "Phone is required"),
      website: z.string().url().optional().or(z.literal("")),
      sections: z.object({
        summary: z.array(z.string()),
        experience: z.array(z.object({
          company: z.string().min(1, "Company is required"),
          position: z.string().min(1, "Position is required"),
          location: z.string(),
          start_date: z.string(),
          end_date: z.string(),
          highlights: z.array(z.string())
        })),
        education: z.array(z.object({
          institution: z.string().min(1, "Institution is required"),
          area: z.string(),
          degree: z.string(),
          start_date: z.string(),
          end_date: z.string()
        })),
        skills: z.array(z.object({
          label: z.string().min(1, "Skill name is required"),
          details: z.string()
        })),
        custom: z.record(z.string(), z.array(z.string())).optional()
      })
    }),
    design: z.object({
      theme: z.string(),
      font: z.string(),
      margins: z.any()
    })
  })
});

export type ResumeData = z.infer<typeof ResumeSchema>;
