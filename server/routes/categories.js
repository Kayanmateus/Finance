import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import db from '../db.js'

const router = Router()
router.use(requireAuth)

router.get('/', (req, res) => {
  const rows = db.prepare('SELECT * FROM categories WHERE user_id = ? ORDER BY type, name').all(req.userId)
  res.json(rows)
})

router.post('/', (req, res) => {
  const { name, type, color, icon } = req.body ?? {}
  if (!name || !type) return res.status(400).json({ error: 'Nome e tipo são obrigatórios.' })

  const exists = db.prepare('SELECT id FROM categories WHERE user_id = ? AND name = ?').get(req.userId, name)
  if (exists) return res.status(409).json({ error: 'Já existe uma categoria com esse nome.' })

  const { lastInsertRowid } = db.prepare(
    'INSERT INTO categories (user_id, name, type, color, icon) VALUES (?, ?, ?, ?, ?)'
  ).run(req.userId, name, type, color ?? '#64748b', icon ?? 'MoreHorizontal')

  res.status(201).json(db.prepare('SELECT * FROM categories WHERE id = ?').get(lastInsertRowid))
})

router.delete('/:id', (req, res) => {
  const cat = db.prepare('SELECT * FROM categories WHERE id = ? AND user_id = ?').get(req.params.id, req.userId)
  if (!cat) return res.status(404).json({ error: 'Categoria não encontrada.' })

  const inUse = db.prepare('SELECT id FROM transactions WHERE user_id = ? AND category = ? LIMIT 1').get(req.userId, cat.name)
  if (inUse) return res.status(409).json({ error: 'Categoria em uso por transações existentes.' })

  db.prepare('DELETE FROM categories WHERE id = ?').run(cat.id)
  res.json({ ok: true })
})

export default router
