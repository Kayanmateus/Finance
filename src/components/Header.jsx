import { LayoutDashboard, List, PlusCircle, Tag, LogOut } from 'lucide-react'

const navItems = [
  { id: 'dashboard',    label: 'Dashboard',   icon: LayoutDashboard },
  { id: 'transactions', label: 'Transações',  icon: List },
  { id: 'categories',   label: 'Categorias',  icon: Tag },
]

export function Header({ page, onNavigate, onAdd, user, onLogout }) {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur border-b border-slate-700/50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center">
            <span className="text-slate-900 font-bold text-sm">$</span>
          </div>
          <span className="font-semibold text-white text-lg hidden sm:block">FinanceTrack</span>
        </div>

        <nav className="hidden sm:flex items-center gap-1">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                page === id
                  ? 'bg-slate-700 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={onAdd}
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-lg shadow-emerald-500/20"
          >
            <PlusCircle size={16} />
            <span className="hidden sm:inline">Novo lançamento</span>
            <span className="sm:hidden">+</span>
          </button>

          {user && (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-700">
              <div className="hidden sm:block text-right">
                <p className="text-white text-xs font-medium leading-none">{user.name}</p>
                <p className="text-slate-500 text-xs">{user.email}</p>
              </div>
              <button
                onClick={onLogout}
                title="Sair"
                className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
              >
                <LogOut size={16} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile nav */}
      <div className="sm:hidden flex border-t border-slate-700/50">
        {navItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onNavigate(id)}
            className={`flex-1 flex flex-col items-center gap-1 py-2 text-xs font-medium transition-all ${
              page === id ? 'text-emerald-400' : 'text-slate-500'
            }`}
          >
            <Icon size={18} />
            {label}
          </button>
        ))}
      </div>
    </header>
  )
}
