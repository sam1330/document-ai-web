export default function RoadmapItem({ title, description, status }: { title: string, description: string, status: string }) {
  return (
    <div className="border border-slate-800 p-6 rounded-3xl bg-slate-800/50 hover:bg-slate-800 transition-colors">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-bold text-white tracking-tight">{title}</h4>
        <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400 bg-indigo-400/10 px-2 py-0.5 rounded-full border border-indigo-400/20">
          {status}
        </span>
      </div>
      <p className="text-sm text-slate-400 tracking-tight leading-relaxed">{description}</p>
    </div>
  )
}