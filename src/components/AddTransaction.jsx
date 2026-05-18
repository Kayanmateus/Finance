import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { todayISO } from '../utils/formatters'

const emptyForm = {
  type: 'expense',
  amount: '',
  category: '',
  description: '',
  date: todayISO(),
}

export function AddTransaction({ categories, onSave, onClose, initial }) {
  const [form, setForm] = useState(initial ? { ...initial, amount: String(initial.amount) } : emptyForm)
  const [error, setError] = useState('')

  useEffect(() => {
    if (initial) setForm({ ...initial, amount: String(initial.amount) })
    else setForm(emptyForm)
  }, [initial])

  const filtered = categories.filter(c => c.type === form.type)

  const set = (field, value) => setForm(f => ({
    ...f,
    [field]: value,
    ...(field === 'type' ? { category: '' } : {}),
  }))

  const handleAmountChange = (e) => {
    const raw = e.target.value.replace(/[^0-9,\.]/g, '').replace(',', '.')
    set('amount', raw)
  }

  const submit = (e) => {
    e.preventDefault()
    const amount = parseFloat(form.amount)
    if (!amount || amount <= 0) return setError('Insira um valor válido.')
    if (!form.category) return setError('Selecione uma categoria.')
    if (!form.date) return setError('Selecione uma data.')
    setError('')
    onSave({ ...form, amount })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-slate-800 rounded-2xl w-full max-w-md border border-slate-700 shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-slate-700">
          <h3 className="text-white font-semibold text-lg">
            {initial ? 'Editar lançamento' : 'Novo lançamento'}
          </h3>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-white p-1.5 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={submit} className="p-5 space-y-4">
          {/* Type toggle */}
          <div className="flex rounded-xl overflow-hidden border border-slate-700">
            <button
              type="button"
              onClick={() => set('type', 'expense')}
              className={`flex-1 py-2.5 text-sm font-semibold transition-all ${
                form.type === 'expense'
                  ? 'bg-red-500/20 text-red-400'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Saída
            </button>
            <button
              type="button"
              onClick={() => set('type', 'income')}
              className={`flex-1 py-2.5 text-sm font-semibold transition-all ${
                form.type === 'income'
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Entrada
            </button>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-slate-400 text-xs font-medium mb-1.5">Valor (R$)</label>
            <input
              type="text"
              inputMode="decimal"
              placeholder="0,00"
              value={form.amount}
              onChange={handleAmountChange}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white text-lg font-semibold placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-slate-400 text-xs font-medium mb-1.5">Categoria</label>
            <div className="grid grid-cols-3 gap-2">
              {filtered.map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => set('category', cat.name)}
                  className={`flex flex-col items-center gap-1 p-2.5 rounded-xl text-xs font-medium border transition-all ${
                    form.category === cat.name
                      ? 'border-2 text-white'
                      : 'border-slate-700 text-slate-400 hover:border-slate-600'
                  }`}
                  style={form.category === cat.name ? {
                    borderColor: cat.color,
                    backgroundColor: cat.color + '22',
                    color: cat.color,
                  } : {}}
                >
                  <span>{cat.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-slate-400 text-xs font-medium mb-1.5">Descrição (opcional)</label>
            <input
              type="text"
              placeholder="Ex: Almoço no restaurante"
              value={form.description}
              onChange={e => set('description', e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          {/* Date */}
          <div>
            <label className="block text-slate-400 text-xs font-medium mb-1.5">Data</label>
            <input
              type="date"
              value={form.date}
              onChange={e => set('date', e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors [color-scheme:dark]"
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-white py-3 rounded-xl font-semibold transition-all shadow-lg shadow-emerald-500/20"
          >
            {initial ? 'Salvar alterações' : 'Adicionar lançamento'}
          </button>
        </form>
      </div>
    </div>
  )
}
