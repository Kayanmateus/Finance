import { useState } from 'react'
import { Trash2, Plus, ShoppingCart, Car, Gamepad2, HeartPulse, BookOpen, Home, Shirt, MoreHorizontal, Briefcase, Laptop, TrendingUp, Gift, Star, Coffee, Plane, Music, Dumbbell } from 'lucide-react'

const ICONS = [
  { name: 'ShoppingCart', Icon: ShoppingCart },
  { name: 'Car', Icon: Car },
  { name: 'Gamepad2', Icon: Gamepad2 },
  { name: 'HeartPulse', Icon: HeartPulse },
  { name: 'BookOpen', Icon: BookOpen },
  { name: 'Home', Icon: Home },
  { name: 'Shirt', Icon: Shirt },
  { name: 'Briefcase', Icon: Briefcase },
  { name: 'Laptop', Icon: Laptop },
  { name: 'TrendingUp', Icon: TrendingUp },
  { name: 'Gift', Icon: Gift },
  { name: 'Star', Icon: Star },
  { name: 'Coffee', Icon: Coffee },
  { name: 'Plane', Icon: Plane },
  { name: 'Music', Icon: Music },
  { name: 'Dumbbell', Icon: Dumbbell },
  { name: 'MoreHorizontal', Icon: MoreHorizontal },
]

const COLORS = [
  '#f97316', '#ef4444', '#ec4899', '#a855f7', '#8b5cf6',
  '#3b82f6', '#06b6d4', '#14b8a6', '#22c55e', '#10b981',
  '#f59e0b', '#64748b',
]

function IconComponent({ name, size = 18 }) {
  const found = ICONS.find(i => i.name === name)
  if (!found) return <span style={{ fontSize: size * 0.7 }}>•</span>
  const { Icon } = found
  return <Icon size={size} />
}

const emptyForm = { name: '', type: 'expense', color: '#f97316', icon: 'ShoppingCart' }

export function CategoryManager({ categories, onAdd, onDelete, transactions }) {
  const [form, setForm] = useState(emptyForm)
  const [showForm, setShowForm] = useState(false)
  const [error, setError] = useState('')

  const expenseCategories = categories.filter(c => c.type === 'expense')
  const incomeCategories = categories.filter(c => c.type === 'income')

  const handleAdd = () => {
    if (!form.name.trim()) return setError('Informe um nome.')
    if (categories.some(c => c.name.toLowerCase() === form.name.toLowerCase()))
      return setError('Já existe uma categoria com esse nome.')
    onAdd(form)
    setForm(emptyForm)
    setShowForm(false)
    setError('')
  }

  const handleDelete = async (cat) => {
    try {
      await onDelete(cat.id)
    } catch (err) {
      alert(err.message || `Não foi possível deletar "${cat.name}".`)
    }
  }

  const renderGroup = (cats, label) => (
    <div>
      <h3 className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-3">{label}</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {cats.map(cat => (
          <div
            key={cat.id}
            className="bg-slate-800 rounded-xl p-3.5 border border-slate-700/50 flex items-center gap-3 group"
          >
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: cat.color + '33', color: cat.color }}
            >
              <IconComponent name={cat.icon} />
            </div>
            <span className="text-white text-sm font-medium flex-1 truncate">{cat.name}</span>
            <button
              onClick={() => handleDelete(cat)}
              className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-red-400 transition-all rounded"
            >
              <Trash2 size={13} />
            </button>
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-white font-semibold text-xl">Categorias</h2>
        <button
          onClick={() => setShowForm(v => !v)}
          className="flex items-center gap-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 px-3 py-2 rounded-xl text-sm font-medium transition-colors"
        >
          <Plus size={16} />
          Nova categoria
        </button>
      </div>

      {showForm && (
        <div className="bg-slate-800 rounded-2xl p-5 border border-slate-700/50 space-y-4">
          <h3 className="text-white font-medium">Nova categoria</h3>

          {/* Type */}
          <div className="flex rounded-xl overflow-hidden border border-slate-700">
            <button
              type="button"
              onClick={() => setForm(f => ({ ...f, type: 'expense' }))}
              className={`flex-1 py-2 text-sm font-medium transition-all ${
                form.type === 'expense' ? 'bg-red-500/20 text-red-400' : 'text-slate-400'
              }`}
            >Saída</button>
            <button
              type="button"
              onClick={() => setForm(f => ({ ...f, type: 'income' }))}
              className={`flex-1 py-2 text-sm font-medium transition-all ${
                form.type === 'income' ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-400'
              }`}
            >Entrada</button>
          </div>

          {/* Name */}
          <input
            type="text"
            placeholder="Nome da categoria"
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-colors"
          />

          {/* Colors */}
          <div>
            <p className="text-slate-400 text-xs mb-2">Cor</p>
            <div className="flex flex-wrap gap-2">
              {COLORS.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setForm(f => ({ ...f, color: c }))}
                  className={`w-7 h-7 rounded-full transition-all ${form.color === c ? 'ring-2 ring-offset-2 ring-offset-slate-800 scale-110' : ''}`}
                  style={{ backgroundColor: c, ringColor: c }}
                />
              ))}
            </div>
          </div>

          {/* Icons */}
          <div>
            <p className="text-slate-400 text-xs mb-2">Ícone</p>
            <div className="flex flex-wrap gap-2">
              {ICONS.map(({ name, Icon }) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => setForm(f => ({ ...f, icon: name }))}
                  className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
                    form.icon === name
                      ? 'text-white'
                      : 'text-slate-500 bg-slate-900 hover:text-slate-300'
                  }`}
                  style={form.icon === name ? { backgroundColor: form.color + '44', color: form.color } : {}}
                >
                  <Icon size={18} />
                </button>
              ))}
            </div>
          </div>

          {/* Preview */}
          <div className="flex items-center gap-3 p-3 bg-slate-900 rounded-xl">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: form.color + '33', color: form.color }}
            >
              <IconComponent name={form.icon} />
            </div>
            <span className="text-white text-sm font-medium">{form.name || 'Nome da categoria'}</span>
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <div className="flex gap-2">
            <button
              onClick={handleAdd}
              className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-white py-2.5 rounded-xl text-sm font-semibold transition-colors"
            >
              Criar categoria
            </button>
            <button
              onClick={() => { setShowForm(false); setError('') }}
              className="px-4 bg-slate-700 hover:bg-slate-600 text-slate-300 py-2.5 rounded-xl text-sm font-medium transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {renderGroup(expenseCategories, 'Saídas')}
      {renderGroup(incomeCategories, 'Entradas')}
    </div>
  )
}
