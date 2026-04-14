import { create } from 'zustand';
import { ResumeData } from '@/types/resume';
import set from 'lodash/set';
import cloneDeep from 'lodash/cloneDeep';

export const initialDefaultData: ResumeData = {
  template: "classic",
  cv_body: {
    cv: {
      name: "John Doe",
      location: "San Francisco, CA",
      email: "john.doe@example.com",
      phone: "+1 234 567 890",
      website: "https://johndoe.com",
      sections: {
        summary: ["Senior Software Engineer with 10+ years of experience in building scalable web applications."],
        experience: [
          {
            company: "Tech Corp",
            position: "Lead Developer",
            location: "San Francisco",
            start_date: "2020-01",
            end_date: "Present",
            highlights: ["Led a team of 10 developers to build a high-scale SaaS platform.", "Architected and implemented a new microservices architecture reducing latency by 40%."]
          }
        ],
        education: [
          {
            institution: "Stanford University",
            area: "Computer Science",
            degree: "Master of Science",
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
        custom: {}
      }
    },
    design: {
      theme: "classic",
      font: "serif",
      margins: {}
    }
  }
};

interface ResumeState {
  data: ResumeData;
  updateField: (path: string, value: any) => void;
  setData: (data: ResumeData) => void;
}

export const useResumeStore = create<ResumeState>((setStore) => ({
  data: initialDefaultData,
  updateField: (path, value) => setStore((state) => {
    const newData = cloneDeep(state.data);
    set(newData, path, value);
    return { data: newData };
  }),
  setData: (data) => setStore({ data }),
}));
