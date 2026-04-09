export default function SocialIcon({ name }: { name: string }) {
  return (
    <div className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all cursor-pointer">
       <span className="sr-only">{name}</span>
       <div className="h-5 w-5 bg-current opacity-50 rounded-sm"></div>
    </div>
  )
}