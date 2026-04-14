This `SKILL.md` is designed as a technical specification for an AI coding agent (like Cursor, v0, or Bolt.new). It provides the exact schema, architectural patterns, and UI constraints needed to build the **Haku AI Resume Crafter** while ensuring real-time performance.

---

# SKILL.md: Haku AI Resume Crafter Implementation

## 1. Context & Objective
Build a "Resume Crafting" page for the Haku AI SaaS. The goal is a high-fidelity, split-screen editor where the left side manages data input via forms and the right side provides a real-time React-based preview. 

**Core Tech Stack:** Next.js 15 (App Router), Tailwind CSS v4, Zustand (State), React-Hook-Form, Zod.

---

## 2. The Data Schema (Single Source of Truth)
To maintain compatibility with the RenderCV PDF microservice, the frontend state must follow this structure.

```typescript
// types/resume.ts
import { z } from "zod";

export const ResumeSchema = z.object({
  template: z.enum(["classic", "modern", "engineering"]),
  cv_body: z.object({
    cv: z.object({
      name: z.string(),
      location: z.string(),
      email: z.string().email(),
      phone: z.string(),
      website: z.string().url().optional(),
      sections: z.object({
        summary: z.array(z.string()),
        experience: z.array(z.object({
          company: z.string(),
          position: z.string(),
          location: z.string(),
          start_date: z.string(),
          end_date: z.string(),
          highlights: z.array(z.string())
        })),
        education: z.array(z.object({
          institution: z.string(),
          area: z.string(),
          degree: z.string(),
          start_date: z.string(),
          end_date: z.string()
        })),
        skills: z.array(z.object({
          label: z.string(),
          details: z.string()
        })),
        // Allows for Custom Sections
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
```

---

## 3. State Management (Zustand)
Implement a store to synchronize the Form and the Preview without prop-drilling.



```typescript
// store/useResumeStore.ts
import { create } from 'zustand';

interface ResumeState {
  data: z.infer<typeof ResumeSchema>;
  updateField: (path: string, value: any) => void;
  addListItem: (section: string) => void;
  removeListItem: (section: string, index: number) => void;
}

export const useResumeStore = create<ResumeState>((set) => ({
  data: initialDefaultData,
  updateField: (path, value) => set((state) => ({
    // Use lodash.set or similar for deep updates
  })),
  // ... helpers
}));
```

---

## 4. UI Architecture & Components

### A. The Editor (Left Panel)
* **Accordion Layout:** Use Radix UI / Shadcn Accordions for sections (Personal Info, Experience, etc.).
* **Dynamic Lists:** Use `useFieldArray` from `react-hook-form` for Experience and Education blocks.
* **Draggable Items:** Implement `@dnd-kit` to allow users to reorder experience bullet points or entire sections.
* **Custom Section Creator:** A button that adds a new key-value pair to the `custom` object in the schema.

### B. The Real-time Preview (Right Panel)
* **React Component Replica:** Create a component that mimics the LaTeX "Classic" theme using Tailwind (e.g., `font-serif`, specific border-bottoms for headers).
* **Scaling:** Wrap the preview in a `transform: scale()` container to ensure it fits the viewport while maintaining "A4" proportions (210mm x 297mm).
* **Syncing:** The preview must listen to the Zustand store. Use `useDeferredValue` if typing lag occurs.

---

## 5. Feature Logic

### AI Enhancement (Premium)
* **Action:** "Enhance with AI" button.
* **Trigger:** Calls `/api/ai/enhance`.
* **Payload:** The current section's text (e.g., a specific experience highlight).
* **Instruction:** Return optimized, ATS-friendly bullet points.
* **Cost:** Deduct 1 credit via Prisma transaction before returning the AI response.

### PDF Generation (Export)
* **Action:** "Download PDF" button.
* **Logic:** 1.  Validate data with Zod.
    2.  `POST` JSON to the Python microservice (`http://localhost:8000/generate`).
    3.  Receive the blob and trigger a browser download: `window.URL.createObjectURL(blob)`.

---

## 6. Design Tokens (Haku Brand)
Maintain the existing app's design language:
* **Primary Color:** `#6D28D9` (Violet-700)
* **Secondary Color:** `#F3F4F6` (Gray-100) for section backgrounds.
* **Border Radius:** `0.75rem` (xl) for containers.
* **Input Style:** Subtle borders, focuses to Primary Color with an outer glow.

---

## 7. Implementation Steps for Agent
1.  **Step 1:** Define the Zod schema and Zustand store.
2.  **Step 2:** Build the `ResumePreview` component using pure Tailwind to match the "Classic" theme.
3.  **Step 3:** Build the `ResumeForm` using Shadcn components.
4.  **Step 4:** Connect the `Download` button to the external microservice endpoint.
5.  **Step 5:** Integrate the credit-check and AI-prompt logic for the "Enhance" feature.