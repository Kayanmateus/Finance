import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import db from '../db.js'

const router = Router()
router.use(requireAuth)

router.get('/', (req, res) => {
  const rows = db.prepare(
    'SELECT * FROM transactions WHERE user_id = ? ORDER BY date DESC, id DESC'
  ).all(req.userId)
  res.json(rows)
})

router.post('/', (req, res) => {
  const { type, amount, category, description, date } = req.body ?? {}
  if (!type || !amount || !category || !date) {
    return res.status(400).json({ error: 'Campos obrigatórios: type, amount, category, date.' })
  }
  const { lastInsertRowid } = db.prepare(
    'INSERT INTO transactions (user_id, type, amount, category, description, date) VALUES (?, ?, ?, ?, ?, ?)'
  ).run(req.userId, type, amount, category, description ?? '', date)

  const row = db.prepare('SELECT * FROM transactions WHERE id = ?').get(lastInsertRowid)
  res.status(201).json(row)
})

router.put('/:id', (req, res) => {
  const tx = db.prepare('SELECT * FROM transactions WHERE id = ? AND user_id = ?').get(req.params.id, req.userId)
  if (!tx) return res.status(404).json({ error: 'Transação não encontrada.' })

  const { type, amount, category, description, date } = req.body ?? {}
  db.prepare(
    'UPDATE transactions SET type=?, amount=?, category=?, description=?, date=? WHERE id=?'
  ).run(
    type ?? tx.type,
    amount ?? tx.amount,
    category ?? tx.category,
    description ?? tx.description,
    date ?? tx.date,
    tx.id
  )
  res.json(db.prepare('SELECT * FROM transactions WHERE id = ?').get(tx.id))
})

router.delete('/:id', (req, res) => {
  const tx = db.prepare('SELECT id FROM transactions WHERE id = ? AND user_id = ?').get(req.params.id, req.userId)
  if (!tx) return res.status(404).json({ error: 'Transação não encontrada.' })
  db.prepare('DELETE FROM transactions WHERE id = ?').run(tx.id)
  res.json({ ok: true })
})

export default router
