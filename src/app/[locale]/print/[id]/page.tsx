"use client";

import { ClassicTheme } from "@/components/resume/ClassicTheme";
import api from "@/lib/api";
import { useEffect, useState, use } from "react";

export default function PrintPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [resumeData, setResumeData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResume = async () => {
            setLoading(true);
            try {
                const response = await api.get(`/api/resumes/${id}`);
                const data = response.data.resume;

                if (data && data.metadata) {
                    setResumeData(data.metadata);
                }
            } catch (error) {
                console.error('Failed to fetch resume:', error);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchResume();
        }
    }, [id]);

    if (loading) {
        return (
            <div className="h-screen w-screen flex items-center justify-center bg-white">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (!resumeData) {
        return (
            <div className="h-screen w-screen flex items-center justify-center bg-white">
                <p className="text-slate-500 font-medium">Resume data not found or unable to load.</p>
            </div>
        );
    }

    return (
        <main className="bg-white min-h-screen text-slate-900">
            {/* Force A4/Letter dimensions for the PDF engine */}
            <div className="w-[210mm] min-h-[297mm] mx-auto p-0 print:m-0 print:p-0 print:shadow-none">
                <ClassicTheme data={resumeData} />
            </div>
        </main>
    );
}