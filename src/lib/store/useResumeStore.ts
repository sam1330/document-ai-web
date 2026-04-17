import { create } from 'zustand';
import { ResumeData } from '@/types/resume';
import set from 'lodash/set';
import cloneDeep from 'lodash/cloneDeep';

export const initialDefaultData: ResumeData = {
  cv: {
    name: "John Doe",
    location: "San Francisco, CA",
    email: "john.doe@example.com",
    phone: "+1 234 567 890",
    website: "https://johndoe.com",
    social_networks: [],
    sections: {
      summary: ["Senior Software Engineer with 10+ years of experience in building scalable web applications."],
      experience: [
        {
          company: "Tech Corp",
          position: "Lead Developer",
          location: "San Francisco",
          start_date: "2020-01",
          end_date: "present",
          highlights: ["Led a team of 10 developers to build a high-scale SaaS platform.", "Architected and implemented a new microservices architecture reducing latency by 40%."]
        }
      ],
      education: [
        {
          institution: "Stanford University",
          area: "Computer Science",
          degree: "Master of Science",
          location: "Stanford, CA",
          start_date: "2010-09",
          end_date: "2012-06"
        }
      ],
      skills: [
        {
          label: "Programming Languages",
          details: "JavaScript, TypeScript, Python, Go, Rust"
        },
        {
          label: "Frameworks & Tools",
          details: "Next.js, React, Node.js, PostgreSQL, Docker, AWS"
        }
      ],
      custom: []
    }
  },
  design: {
    theme: "classic",
    typography: {
      font_family: {
        body: "serif",
        name: "serif",
        section_titles: "serif",
        headline: "serif",
      }
    }
  },
  locale: {
    language: "english"
  }
};

interface ResumeState {
  data: ResumeData;
  updateField: (path: string, value: any) => void;
  setData: (data: ResumeData) => void;
  resetData: () => void;
}

export const useResumeStore = create<ResumeState>((setStore) => ({
  data: initialDefaultData,
  updateField: (path, value) => setStore((state) => {
    const newData = cloneDeep(state.data);
    set(newData, path, value);
    return { data: newData };
  }),
  setData: (data) => setStore({ data }),
  resetData: () => setStore({ data: initialDefaultData }),
}));
