import { useState } from 'react'
import { useTransactions } from './hooks/useTransactions'
import { Header } from './components/Header'
import { Dashboard } from './components/Dashboard'
import { TransactionList } from './components/TransactionList'
import { AddTransaction } from './components/AddTransaction'
import { CategoryManager } from './components/CategoryManager'
import { AuthScreen } from './components/AuthScreen'

function getStoredUser() {
  try { return JSON.parse(localStorage.getItem('finance_user')) } catch { return null }
}

function FinanceApp({ user, onLogout }) {
  const [page, setPage] = useState('dashboard')
  const [showModal, setShowModal] = useState(false)
  const [editingTx, setEditingTx] = useState(null)

  const {
    transactions, categories, loading,
    addTransaction, updateTransaction, deleteTransaction,
    addCategory, deleteCategory,
    getSummary, getExpensesByCategory, getLast6MonthsData,
  } = useTransactions()

  const openAdd = () => { setEditingTx(null); setShowModal(true) }
  const openEdit = (tx) => { setEditingTx(tx); setShowModal(true) }

  const handleSave = async (form) => {
    if (editingTx) await updateTransaction(editingTx.id, form)
    else await addTransaction(form)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400 text-sm">Carregando seus dados...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <Header page={page} onNavigate={setPage} onAdd={openAdd} user={user} onLogout={onLogout} />

      <main className="max-w-6xl mx-auto px-4 py-6">
        {page === 'dashboard' && (
          <Dashboard
            getSummary={getSummary}
            getExpensesByCategory={getExpensesByCategory}
            getLast6MonthsData={getLast6MonthsData}
            transactions={transactions}
            onNavigate={setPage}
          />
        )}
        {page === 'transactions' && (
          <TransactionList
            transactions={transactions}
            categories={categories}
            onDelete={deleteTransaction}
            onEdit={openEdit}
          />
        )}
        {page === 'categories' && (
          <CategoryManager
            categories={categories}
            onAdd={addCategory}
            onDelete={deleteCategory}
            transactions={transactions}
          />
        )}
      </main>

      {showModal && (
        <AddTransaction
          categories={categories}
          onSave={handleSave}
          onClose={() => { setShowModal(false); setEditingTx(null) }}
          initial={editingTx}
        />
      )}
    </div>
  )
}

export default function App() {
  const [user, setUser] = useState(getStoredUser)

  const handleAuth = (u) => setUser(u)

  const handleLogout = () => {
    localStorage.removeItem('finance_token')
    localStorage.removeItem('finance_user')
    setUser(null)
  }

  if (!user) return <AuthScreen onAuth={handleAuth} />
  return <FinanceApp user={user} onLogout={handleLogout} />
}
