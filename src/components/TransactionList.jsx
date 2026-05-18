import { useState, useMemo } from 'react'
import { Trash2, Pencil, Search, Filter } from 'lucide-react'
import { formatCurrency, currentMonthYear } from '../utils/formatters'

export function TransactionList({ transactions, categories, onDelete, onEdit }) {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [monthFilter, setMonthFilter] = useState(currentMonthYear())
  const [confirmDelete, setConfirmDelete] = useState(null)

  const months = useMemo(() => {
    const set = new Set(transactions.map(tx => tx.date.slice(0, 7)))
    return [...set].sort().reverse()
  }, [transactions])

  const filtered = useMemo(() => {
    return transactions.filter(tx => {
      if (typeFilter !== 'all' && tx.type !== typeFilter) return false
      if (categoryFilter !== 'all' && tx.category !== categoryFilter) return false
      if (monthFilter && tx.date.slice(0, 7) !== monthFilter) return false
      if (search && !tx.description?.toLowerCase().includes(search.toLowerCase()) &&
          !tx.category.toLowerCase().includes(search.toLowerCase())) return false
      return true
    })
  }, [transactions, typeFilter, categoryFilter, monthFilter, search])

  const handleDelete = (id) => {
    if (confirmDelete === id) {
      onDelete(id)
      setConfirmDelete(null)
    } else {
      setConfirmDelete(id)
      setTimeout(() => setConfirmDelete(null), 3000)
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-white font-semibold text-xl">Transações</h2>

      {/* Filters */}
      <div className="bg-slate-800 rounded-2xl p-4 border border-slate-700/50 space-y-3">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Buscar por descrição ou categoria..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-emerald-500"
          >
            <option value="all">Todos os tipos</option>
            <option value="income">Entradas</option>
            <option value="expense">Saídas</option>
          </select>

          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-emerald-500"
          >
            <option value="all">Todas as categorias</option>
            {categories.map(c => (
              <option key={c.id} value={c.name}>{c.name}</option>
            ))}
          </select>

          <select
            value={monthFilter}
            onChange={e => setMonthFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-emerald-500"
          >
            <option value="">Todos os meses</option>
            {months.map(m => (
              <option key={m} value={m}>
                {new Date(m + '-01').toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results count */}
      <p className="text-slate-500 text-sm">{filtered.length} transação(ões) encontrada(s)</p>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="bg-slate-800 rounded-2xl p-12 border border-slate-700/50 text-center">
          <p className="text-slate-500">Nenhuma transação encontrada com esses filtros.</p>
        </div>
      ) : (
        <div className="bg-slate-800 rounded-2xl border border-slate-700/50 overflow-hidden divide-y divide-slate-700/50">
          {filtered.map(tx => {
            const cat = categories.find(c => c.name === tx.category)
            return (
              <div key={tx.id} className="flex items-center gap-3 p-4 hover:bg-slate-700/30 transition-colors">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: (cat?.color || '#64748b') + '33' }}
                >
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat?.color || '#64748b' }} />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">{tx.description || tx.category}</p>
                  <p className="text-slate-500 text-xs">{tx.category} · {tx.date.split('-').reverse().join('/')}</p>
                </div>

                <span className={`text-sm font-semibold flex-shrink-0 ${
                  tx.type === 'income' ? 'text-emerald-400' : 'text-red-400'
                }`}>
                  {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                </span>

                <div className="flex gap-1 flex-shrink-0">
                  <button
                    onClick={() => onEdit(tx)}
                    className="p-1.5 text-slate-500 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(tx.id)}
                    className={`p-1.5 rounded-lg transition-colors ${
                      confirmDelete === tx.id
                        ? 'text-red-400 bg-red-400/20'
                        : 'text-slate-500 hover:text-red-400 hover:bg-red-400/10'
                    }`}
                    title={confirmDelete === tx.id ? 'Clique novamente para confirmar' : 'Deletar'}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
