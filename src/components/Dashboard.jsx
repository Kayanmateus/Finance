import { useMemo } from 'react'
import { Wallet, TrendingUp, TrendingDown } from 'lucide-react'
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
} from 'recharts'
import { StatCard } from './StatCard'
import { formatCurrency, monthLabel, currentMonthYear } from '../utils/formatters'

const MONTH = currentMonthYear()

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm shadow-xl">
      <p className="text-white font-semibold">{payload[0].name}</p>
      <p className="text-emerald-400">{formatCurrency(payload[0].value)}</p>
    </div>
  )
}

function BarTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm shadow-xl">
      <p className="text-slate-300 mb-1">{label}</p>
      {payload.map(p => (
        <p key={p.dataKey} style={{ color: p.color }} className="font-medium">
          {p.name}: {formatCurrency(p.value)}
        </p>
      ))}
    </div>
  )
}

export function Dashboard({ getSummary, getExpensesByCategory, getLast6MonthsData, transactions, onNavigate }) {
  const summary = useMemo(() => getSummary(MONTH), [getSummary])
  const pieData = useMemo(() => getExpensesByCategory(MONTH), [getExpensesByCategory])
  const barData = useMemo(() => getLast6MonthsData().map(d => ({
    ...d,
    month: monthLabel(d.month),
  })), [getLast6MonthsData])

  const recent = transactions.slice(0, 5)

  const balanceColor = summary.balance >= 0 ? 'text-emerald-400' : 'text-red-400'

  return (
    <div className="space-y-6">
      {/* Month label */}
      <div className="flex items-center justify-between">
        <h2 className="text-white font-semibold text-xl">
          {new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
        </h2>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Saldo do mês"
          value={formatCurrency(summary.balance)}
          icon={Wallet}
          color={summary.balance >= 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}
        />
        <StatCard
          title="Entradas"
          value={formatCurrency(summary.income)}
          icon={TrendingUp}
          color="bg-emerald-500/20 text-emerald-400"
        />
        <StatCard
          title="Saídas"
          value={formatCurrency(summary.expense)}
          icon={TrendingDown}
          color="bg-red-500/20 text-red-400"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Pie chart */}
        <div className="bg-slate-800 rounded-2xl p-5 border border-slate-700/50">
          <h3 className="text-white font-semibold mb-4">Gastos por categoria</h3>
          {pieData.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-slate-500 text-sm">
              Nenhum gasto registrado este mês
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <ResponsiveContainer width="55%" height={180}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={75}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {pieData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-2 min-w-0">
                {pieData.slice(0, 6).map((item, i) => (
                  <div key={i} className="flex items-center gap-2 min-w-0">
                    <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="text-slate-300 text-xs truncate flex-1">{item.name}</span>
                    <span className="text-slate-400 text-xs flex-shrink-0">{formatCurrency(item.value)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bar chart */}
        <div className="bg-slate-800 rounded-2xl p-5 border border-slate-700/50">
          <h3 className="text-white font-semibold mb-4">Últimos 6 meses</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={barData} barSize={14}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} width={60}
                tickFormatter={v => `R$${(v / 1000).toFixed(0)}k`} />
              <Tooltip content={<BarTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
              <Bar dataKey="income" name="Entradas" fill="#22c55e" radius={[3, 3, 0, 0]} />
              <Bar dataKey="expense" name="Saídas" fill="#ef4444" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent transactions */}
      <div className="bg-slate-800 rounded-2xl p-5 border border-slate-700/50">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold">Últimas transações</h3>
          <button
            onClick={() => onNavigate('transactions')}
            className="text-emerald-400 text-sm hover:text-emerald-300 transition-colors"
          >
            Ver todas →
          </button>
        </div>
        {recent.length === 0 ? (
          <p className="text-slate-500 text-sm text-center py-8">
            Nenhuma transação ainda. Clique em "Novo lançamento" para começar!
          </p>
        ) : (
          <div className="space-y-2">
            {recent.map(tx => (
              <div key={tx.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-700/50 transition-colors">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                  tx.type === 'income' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                }`}>
                  {tx.type === 'income' ? '+' : '-'}
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
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
