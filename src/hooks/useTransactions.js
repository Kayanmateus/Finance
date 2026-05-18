import { useState, useEffect, useCallback } from 'react'
import { api } from '../api/client'
import { getMonthYear } from '../utils/formatters'

export function useTransactions() {
  const [transactions, setTransactions] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([api.get('/transactions'), api.get('/categories')])
      .then(([txs, cats]) => {
        setTransactions(txs)
        setCategories(cats)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const addTransaction = useCallback(async (tx) => {
    const created = await api.post('/transactions', tx)
    setTransactions(prev => [created, ...prev])
  }, [])

  const updateTransaction = useCallback(async (id, updated) => {
    const result = await api.put(`/transactions/${id}`, updated)
    setTransactions(prev => prev.map(tx => tx.id === id ? result : tx))
  }, [])

  const deleteTransaction = useCallback(async (id) => {
    await api.delete(`/transactions/${id}`)
    setTransactions(prev => prev.filter(tx => tx.id !== id))
  }, [])

  const addCategory = useCallback(async (cat) => {
    const created = await api.post('/categories', cat)
    setCategories(prev => [...prev, created])
  }, [])

  const deleteCategory = useCallback(async (id) => {
    await api.delete(`/categories/${id}`)
    setCategories(prev => prev.filter(c => c.id !== id))
  }, [])

  const getSummary = useCallback((monthYear) => {
    const filtered = monthYear
      ? transactions.filter(tx => getMonthYear(tx.date) === monthYear)
      : transactions
    const income  = filtered.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0)
    const expense = filtered.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
    return { income, expense, balance: income - expense }
  }, [transactions])

  const getExpensesByCategory = useCallback((monthYear) => {
    const filtered = transactions.filter(tx =>
      tx.type === 'expense' && (monthYear ? getMonthYear(tx.date) === monthYear : true)
    )
    const map = {}
    filtered.forEach(tx => { map[tx.category] = (map[tx.category] || 0) + tx.amount })
    return Object.entries(map).map(([name, value]) => {
      const cat = categories.find(c => c.name === name)
      return { name, value, color: cat?.color || '#64748b' }
    }).sort((a, b) => b.value - a.value)
  }, [transactions, categories])

  const getLast6MonthsData = useCallback(() => {
    const months = []
    for (let i = 5; i >= 0; i--) {
      const d = new Date()
      d.setDate(1)
      d.setMonth(d.getMonth() - i)
      months.push(d.toISOString().slice(0, 7))
    }
    return months.map(my => ({ month: my, ...getSummary(my) }))
  }, [getSummary])

  return {
    transactions,
    categories,
    loading,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addCategory,
    deleteCategory,
    getSummary,
    getExpensesByCategory,
    getLast6MonthsData,
  }
}
