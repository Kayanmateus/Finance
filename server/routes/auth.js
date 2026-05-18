import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import db from '../db.js'

const router = Router()

const DEFAULT_CATEGORIES = [
  { name: 'Alimentação', type: 'expense', color: '#f97316', icon: 'ShoppingCart' },
  { name: 'Transporte',  type: 'expense', color: '#3b82f6', icon: 'Car' },
  { name: 'Lazer',       type: 'expense', color: '#a855f7', icon: 'Gamepad2' },
  { name: 'Saúde',       type: 'expense', color: '#ec4899', icon: 'HeartPulse' },
  { name: 'Educação',    type: 'expense', color: '#14b8a6', icon: 'BookOpen' },
  { name: 'Moradia',     type: 'expense', color: '#ef4444', icon: 'Home' },
  { name: 'Roupas',      type: 'expense', color: '#f59e0b', icon: 'Shirt' },
  { name: 'Outros',      type: 'expense', color: '#64748b', icon: 'MoreHorizontal' },
  { name: 'Salário',     type: 'income',  color: '#22c55e', icon: 'Briefcase' },
  { name: 'Freelance',   type: 'income',  color: '#10b981', icon: 'Laptop' },
  { name: 'Investimentos',type:'income',  color: '#06b6d4', icon: 'TrendingUp' },
  { name: 'Presente',    type: 'income',  color: '#8b5cf6', icon: 'Gift' },
]

const insertCategory = db.prepare(
  'INSERT INTO categories (user_id, name, type, color, icon) VALUES (?, ?, ?, ?, ?)'
)

router.post('/register', (req, res) => {
  const { name, email, password } = req.body ?? {}
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Nome, e-mail e senha são obrigatórios.' })
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'A senha deve ter pelo menos 6 caracteres.' })
  }
  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email)
  if (existing) {
    return res.status(409).json({ error: 'E-mail já cadastrado.' })
  }

  const hash = bcrypt.hashSync(password, 10)
  const { lastInsertRowid: userId } = db.prepare(
    'INSERT INTO users (name, email, password) VALUES (?, ?, ?)'
  ).run(name, email, hash)

  const insertMany = db.transaction((cats) => {
    for (const c of cats) insertCategory.run(userId, c.name, c.type, c.color, c.icon)
  })
  insertMany(DEFAULT_CATEGORIES)

  const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '30d' })
  const user = db.prepare('SELECT id, name, email FROM users WHERE id = ?').get(userId)
  res.status(201).json({ token, user })
})

router.post('/login', (req, res) => {
  const { email, password } = req.body ?? {}
  if (!email || !password) {
    return res.status(400).json({ error: 'E-mail e senha são obrigatórios.' })
  }
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email)
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ error: 'E-mail ou senha incorretos.' })
  }
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '30d' })
  res.json({ token, user: { id: user.id, name: user.name, email: user.email } })
})

export default router
