export function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export function formatDate(dateStr) {
  const [year, month, day] = dateStr.split('-')
  return `${day}/${month}/${year}`
}

export function getMonthYear(dateStr) {
  const [year, month] = dateStr.split('-')
  return `${year}-${month}`
}

export function monthLabel(yearMonth) {
  const [year, month] = yearMonth.split('-')
  const date = new Date(Number(year), Number(month) - 1, 1)
  return date.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' })
}

export function todayISO() {
  return new Date().toISOString().split('T')[0]
}

export function currentMonthYear() {
  return todayISO().slice(0, 7)
}
