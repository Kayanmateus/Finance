export function StatCard({ title, value, icon: Icon, color, subtitle }) {
  return (
    <div className={`bg-slate-800 rounded-2xl p-5 border border-slate-700/50 flex items-start gap-4`}>
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
        <Icon size={22} />
      </div>
      <div className="min-w-0">
        <p className="text-slate-400 text-sm font-medium">{title}</p>
        <p className="text-white text-xl font-bold mt-0.5 truncate">{value}</p>
        {subtitle && <p className="text-slate-500 text-xs mt-0.5">{subtitle}</p>}
      </div>
    </div>
  )
}
