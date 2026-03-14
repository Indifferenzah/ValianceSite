import express from 'express'
import { readFileSync, writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import 'dotenv/config'

const __dirname = dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = process.env.PORT || 3000

// ── JSON data helpers ────────────────────────────────────────
const dataPath = (file) => join(__dirname, 'data', file)
const readData  = (file) => JSON.parse(readFileSync(dataPath(file), 'utf8'))
const writeData = (file, data) => writeFileSync(dataPath(file), JSON.stringify(data, null, 2), 'utf8')
const nextId    = (arr) => String(arr.reduce((max, x) => Math.max(max, Number(x.id) || 0), 0) + 1)

// ── Middleware ───────────────────────────────────────────────
app.use(express.json())
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  if (req.method === 'OPTIONS') return res.status(204).end()
  next()
})

// ── Auth helper ──────────────────────────────────────────────
function requireAdmin(req, res) {
  const token = (req.headers['authorization'] || '').replace('Bearer ', '').trim()
  const secret = process.env.ADMIN_SECRET
  if (!secret) { res.status(500).json({ error: 'ADMIN_SECRET not configured' }); return false }
  if (!token || token !== secret) { res.status(401).json({ error: 'Unauthorized' }); return false }
  return true
}

// ════════════════════════════════════════════════════════════
//  API ROUTES
// ════════════════════════════════════════════════════════════

// ── GET /api/health ──────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', version: '2.0.0', timestamp: new Date().toISOString(), service: 'Valiance API' })
})

// ── GET /api/stats ───────────────────────────────────────────
app.get('/api/stats', (req, res) => {
  const staff  = readData('staff.json').filter(m => m.active)
  const events = readData('events.json').filter(e => e.active)
  const rules  = readData('rules.json').filter(r => r.active)
  const by_role = staff.reduce((acc, m) => { acc[m.role] = (acc[m.role] || 0) + 1; return acc }, {})
  res.json({
    staff: { total: staff.length, by_role },
    events: { total: events.length },
    rules: { total: rules.length },
    generated_at: new Date().toISOString(),
  })
})

// ── POST /api/auth/login ─────────────────────────────────────
app.post('/api/auth/login', async (req, res) => {
  const { password } = req.body || {}
  const secret = process.env.ADMIN_SECRET
  if (!secret) return res.status(500).json({ error: 'ADMIN_SECRET not configured' })
  await new Promise(r => setTimeout(r, 400))
  if (!password || password !== secret) return res.status(401).json({ error: 'Invalid password' })
  res.json({ token: secret, message: 'Authenticated. Use: Authorization: Bearer <token>' })
})

// ── STAFF ────────────────────────────────────────────────────
app.get('/api/staff', (req, res) => {
  let data = readData('staff.json')
  const { role, active = 'true', limit = '50', offset = '0' } = req.query
  if (active !== 'all') data = data.filter(m => m.active === (active === 'true'))
  if (role) data = data.filter(m => m.role === role)
  data = data.sort((a, b) => a.order_index - b.order_index)
  const slice = data.slice(Number(offset), Number(offset) + Number(limit))
  res.json({ data: slice, count: slice.length })
})

app.post('/api/staff', (req, res) => {
  if (!requireAdmin(req, res)) return
  const { discord_id, username, display_name, role, bio, order_index } = req.body
  if (!discord_id || !username || !role) return res.status(400).json({ error: 'discord_id, username, role required' })
  const staff = readData('staff.json')
  if (staff.find(m => m.discord_id === discord_id)) return res.status(409).json({ error: 'discord_id already exists' })
  const member = { id: nextId(staff), discord_id, username, display_name: display_name || username, role, bio: bio || '', active: true, order_index: order_index || 0, joined_at: new Date().toISOString() }
  staff.push(member)
  writeData('staff.json', staff)
  res.status(201).json({ data: member })
})

app.get('/api/staff/:id', (req, res) => {
  const { id } = req.params
  const staff = readData('staff.json')
  const member = staff.find(m => m.id === id || m.discord_id === id)
  if (!member) return res.status(404).json({ error: 'Not found' })
  res.json({ data: member })
})

app.put('/api/staff/:id', (req, res) => {
  if (!requireAdmin(req, res)) return
  const { id } = req.params
  const staff = readData('staff.json')
  const idx = staff.findIndex(m => m.id === id || m.discord_id === id)
  if (idx === -1) return res.status(404).json({ error: 'Not found' })
  const allowed = ['username', 'display_name', 'role', 'bio', 'order_index', 'active']
  for (const key of allowed) { if (key in req.body) staff[idx][key] = req.body[key] }
  staff[idx].updated_at = new Date().toISOString()
  writeData('staff.json', staff)
  res.json({ data: staff[idx] })
})

app.delete('/api/staff/:id', (req, res) => {
  if (!requireAdmin(req, res)) return
  const { id } = req.params
  const staff = readData('staff.json')
  const idx = staff.findIndex(m => m.id === id || m.discord_id === id)
  if (idx === -1) return res.status(404).json({ error: 'Not found' })
  if (req.query.hard === 'true') {
    const [removed] = staff.splice(idx, 1)
    writeData('staff.json', staff)
    return res.json({ message: 'Permanently deleted', data: removed })
  }
  staff[idx].active = false
  staff[idx].updated_at = new Date().toISOString()
  writeData('staff.json', staff)
  res.json({ data: staff[idx], message: 'Deactivated' })
})

// ── STAFF ROLES ──────────────────────────────────────────────
app.get('/api/staff-roles', (req, res) => {
  const data = readData('roles.json').sort((a, b) => a.order_index - b.order_index)
  res.json({ data })
})

app.post('/api/staff-roles', (req, res) => {
  if (!requireAdmin(req, res)) return
  const { name, slug, color, order_index } = req.body
  if (!name || !slug) return res.status(400).json({ error: 'name and slug required' })
  const roles = readData('roles.json')
  if (roles.find(r => r.slug === slug)) return res.status(409).json({ error: 'slug already exists' })
  const role = { id: nextId(roles), name, slug, color: color || '#6B8A30', order_index: order_index || 0 }
  roles.push(role)
  writeData('roles.json', roles)
  res.status(201).json({ data: role })
})

// ── EVENTS ───────────────────────────────────────────────────
app.get('/api/events', (req, res) => {
  let data = readData('events.json')
  const { active = 'true', type } = req.query
  if (active !== 'all') data = data.filter(e => e.active === (active === 'true'))
  if (type) data = data.filter(e => e.type === type)
  res.json({ data: data.sort((a, b) => a.order_index - b.order_index) })
})

app.post('/api/events', (req, res) => {
  if (!requireAdmin(req, res)) return
  const { title, description, type, scheduled_at, recurring, recurring_days, recurring_time, order_index } = req.body
  if (!title) return res.status(400).json({ error: 'title required' })
  const events = readData('events.json')
  const event = { id: nextId(events), title, description: description || '', type: type || 'cw', scheduled_at: scheduled_at || null, recurring: recurring || false, recurring_days: recurring_days || [], recurring_time: recurring_time || null, active: true, order_index: order_index || 0, created_at: new Date().toISOString() }
  events.push(event)
  writeData('events.json', events)
  res.status(201).json({ data: event })
})

app.get('/api/events/:id', (req, res) => {
  const event = readData('events.json').find(e => e.id === req.params.id)
  if (!event) return res.status(404).json({ error: 'Not found' })
  res.json({ data: event })
})

app.put('/api/events/:id', (req, res) => {
  if (!requireAdmin(req, res)) return
  const events = readData('events.json')
  const idx = events.findIndex(e => e.id === req.params.id)
  if (idx === -1) return res.status(404).json({ error: 'Not found' })
  const allowed = ['title', 'description', 'type', 'scheduled_at', 'recurring', 'recurring_days', 'recurring_time', 'active', 'order_index']
  for (const key of allowed) { if (key in req.body) events[idx][key] = req.body[key] }
  events[idx].updated_at = new Date().toISOString()
  writeData('events.json', events)
  res.json({ data: events[idx] })
})

app.delete('/api/events/:id', (req, res) => {
  if (!requireAdmin(req, res)) return
  const events = readData('events.json')
  const idx = events.findIndex(e => e.id === req.params.id)
  if (idx === -1) return res.status(404).json({ error: 'Not found' })
  if (req.query.hard === 'true') {
    const [removed] = events.splice(idx, 1)
    writeData('events.json', events)
    return res.json({ message: 'Permanently deleted', data: removed })
  }
  events[idx].active = false
  writeData('events.json', events)
  res.json({ data: events[idx], message: 'Deactivated' })
})

// ── RULES ────────────────────────────────────────────────────
app.get('/api/rules', (req, res) => {
  let data = readData('rules.json')
  if (req.query.active !== 'all') data = data.filter(r => r.active === (req.query.active !== 'false'))
  res.json({ data: data.sort((a, b) => a.order_index - b.order_index) })
})

app.post('/api/rules', (req, res) => {
  if (!requireAdmin(req, res)) return
  const { title, description, order_index } = req.body
  if (!title || !description) return res.status(400).json({ error: 'title and description required' })
  const rules = readData('rules.json')
  const rule = { id: nextId(rules), title, description, order_index: order_index || 0, active: true, created_at: new Date().toISOString() }
  rules.push(rule)
  writeData('rules.json', rules)
  res.status(201).json({ data: rule })
})

app.get('/api/rules/:id', (req, res) => {
  const rule = readData('rules.json').find(r => r.id === req.params.id)
  if (!rule) return res.status(404).json({ error: 'Not found' })
  res.json({ data: rule })
})

app.put('/api/rules/:id', (req, res) => {
  if (!requireAdmin(req, res)) return
  const rules = readData('rules.json')
  const idx = rules.findIndex(r => r.id === req.params.id)
  if (idx === -1) return res.status(404).json({ error: 'Not found' })
  const allowed = ['title', 'description', 'order_index', 'active']
  for (const key of allowed) { if (key in req.body) rules[idx][key] = req.body[key] }
  rules[idx].updated_at = new Date().toISOString()
  writeData('rules.json', rules)
  res.json({ data: rules[idx] })
})

app.delete('/api/rules/:id', (req, res) => {
  if (!requireAdmin(req, res)) return
  const rules = readData('rules.json')
  const idx = rules.findIndex(r => r.id === req.params.id)
  if (idx === -1) return res.status(404).json({ error: 'Not found' })
  if (req.query.hard === 'true') {
    const [removed] = rules.splice(idx, 1)
    writeData('rules.json', rules)
    return res.json({ message: 'Permanently deleted', data: removed })
  }
  rules[idx].active = false
  writeData('rules.json', rules)
  res.json({ data: rules[idx], message: 'Deactivated' })
})

// ── DISCORD AVATAR ───────────────────────────────────────────
app.get('/api/discord/avatar', async (req, res) => {
  const { id } = req.query
  if (!id) return res.status(400).json({ error: 'id required' })
  const token = process.env.DISCORD_BOT_TOKEN

  function fallback() {
    try {
      const idx = Number(BigInt(id) >> 22n) % 6
      return res.json({ url: `https://cdn.discordapp.com/embed/avatars/${idx}.png`, source: 'fallback' })
    } catch {
      return res.json({ url: 'https://cdn.discordapp.com/embed/avatars/0.png', source: 'fallback' })
    }
  }

  if (!token) return fallback()

  try {
    const r = await fetch(`https://discord.com/api/v10/users/${id}`, { headers: { Authorization: `Bot ${token}` } })
    if (!r.ok) return fallback()
    const user = await r.json()
    if (!user.avatar) {
      const idx = Number(user.discriminator) === 0 ? Number(BigInt(id) >> 22n) % 6 : Number(user.discriminator) % 5
      return res.json({ url: `https://cdn.discordapp.com/embed/avatars/${idx}.png`, username: user.username, source: 'default' })
    }
    const ext = user.avatar.startsWith('a_') ? 'gif' : 'png'
    res.json({ url: `https://cdn.discordapp.com/avatars/${id}/${user.avatar}.${ext}?size=128`, username: user.username, source: 'discord' })
  } catch {
    fallback()
  }
})

// ── DISCORD GUILD ────────────────────────────────────────────
app.get('/api/discord/guild', async (req, res) => {
  const { id } = req.query
  if (!id) return res.status(400).json({ error: 'id required' })
  try {
    const r = await fetch(`https://discord.com/api/guilds/${id}/widget.json`)
    if (r.status === 403) return res.json({ online: 'N/D', total: 'N/D', error: 'Widget disabled' })
    if (!r.ok) throw new Error(`${r.status}`)
    const data = await r.json()
    res.json({ id: data.id, name: data.name, online: data.presence_count ?? data.members?.length ?? 0, total: data.approximate_member_count ?? 'N/D', invite: data.instant_invite ?? null })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ── SERVER STATUS ────────────────────────────────────────────
app.get('/api/server-status', async (req, res) => {
  const host = req.query.host || 'play.coralmc.it'
  try {
    const r = await fetch(`https://api.mcstatus.io/v2/status/java/${encodeURIComponent(host)}`)
    if (!r.ok) throw new Error(`${r.status}`)
    const data = await r.json()
    res.json({ online: data.online ?? false, host, players: data.players?.online ?? 0, max_players: data.players?.max ?? 0, version: data.version?.name_raw ?? null, motd: data.motd?.clean ?? null })
  } catch {
    res.json({ online: false, host, players: 0 })
  }
})

// ════════════════════════════════════════════════════════════
//  SERVE REACT BUILD
// ════════════════════════════════════════════════════════════
app.use(express.static(join(__dirname, 'dist')))
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'))
})

app.listen(PORT, () => {
  console.log(`Valiance server running on http://localhost:${PORT}`)
})
