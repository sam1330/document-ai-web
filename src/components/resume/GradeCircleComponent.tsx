

export default function GradeCircleComponent({ score }: { score: number }) {
    return (
        <div className="relative flex items-center justify-center">
            <svg className="w-32 h-32 transform -rotate-90">
                <circle
                    className="text-slate-100"
                    strokeWidth="8"
                    stroke="currentColor"
                    fill="transparent"
                    r="58"
                    cx="64"
                    cy="64"
                />
                <circle
                    className={`${score >= 80 ? 'text-emerald-500' : score >= 60 ? 'text-amber-500' : 'text-indigo-600'
                        } transition-all duration-1000 ease-out`}
                    strokeWidth="8"
                    strokeDasharray={364.42}
                    strokeDashoffset={364.42 - (364.42 * (score * 10)) / 100}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="58"
                    cx="64"
                    cy="64"
                />
            </svg>
            <div className="absolute flex flex-col items-center">
                <span className="text-4xl font-extrabold text-slate-900">{score}/10</span>
            </div>
        </div>
    )
}