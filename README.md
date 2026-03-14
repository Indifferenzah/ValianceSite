# Valiance Site v2

Sito ufficiale del Clan Valiance — Minecraft PvP competitivo.

**Stack:** React + Vite · Vercel Serverless · Supabase · Tema Olive Green

---

## Indice

- [Setup Locale](#setup-locale)
- [Variabili d'Ambiente](#variabili-dambiente)
- [Database (Supabase)](#database-supabase)
- [API Reference](#api-reference)
- [Autenticazione Admin](#autenticazione-admin)
- [Deploy su Vercel](#deploy-su-vercel)

---

## Setup Locale (Dev)

```bash
# 1. Installa le dipendenze
npm install

# 2. Copia e compila le variabili d'ambiente
cp .env.example .env

# 3. Frontend dev (Vite HMR, senza API)
npm run dev

# 4. Backend dev (Express server con --watch)
npm run start:dev
```

> In sviluppo puoi aprire due terminali: uno con `npm run dev` (Vite su porta 5173)
> e uno con `npm run start:dev` (Express su porta 3000).
> I fetch verso `/api/...` dal frontend vanno proxati — aggiungi su `vite.config.js`:
> ```js
> server: { proxy: { '/api': 'http://localhost:3000' } }
> ```

## Deploy su VPS

```bash
# 1. Build del frontend
npm run build          # genera la cartella dist/

# 2. Avvia il server (serve sia le API che il frontend buildato)
npm start              # node server.js sulla porta 3000 (o PORT env)
```

Il server Express:
- espone tutte le API su `/api/*`
- serve il build React da `dist/` per tutte le altre route

### Con PM2 (consigliato in produzione)

```bash
npm install -g pm2
pm2 start server.js --name valiance
pm2 save
pm2 startup   # per avvio automatico al riavvio della VPS
```

### Con nginx come reverse proxy

```nginx
server {
    listen 80;
    server_name tuodominio.it;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## Variabili d'Ambiente

Crea un file `.env` nella root del progetto (o configurale su Vercel):

| Variabile                    | Descrizione                                     | Richiesta |
|------------------------------|-------------------------------------------------|-----------|
| `SUPABASE_URL`               | URL del progetto Supabase                       | ✅ API     |
| `SUPABASE_SERVICE_ROLE_KEY`  | Service role key (accesso completo al DB)       | ✅ API     |
| `SUPABASE_ANON_KEY`          | Anon key (accesso pubblico)                     | Opzionale |
| `DISCORD_BOT_TOKEN`          | Token del bot Discord per fetch avatar          | Consigliata|
| `ADMIN_SECRET`               | Password per endpoint admin (scegli una stringa sicura) | ✅ Admin |

---

## Database (Supabase)

### Setup

1. Vai nel tuo progetto Supabase → **SQL Editor**
2. Esegui il file [`supabase/schema.sql`](supabase/schema.sql)

Questo crea le tabelle, le policy RLS e inserisce i dati iniziali (staff, regole, eventi).

### Tabelle

#### `staff_members`
| Colonna        | Tipo        | Descrizione                          |
|----------------|-------------|--------------------------------------|
| `id`           | UUID (PK)   | ID univoco                           |
| `discord_id`   | TEXT UNIQUE | ID Discord del membro                |
| `username`     | TEXT        | Username Minecraft/Discord           |
| `display_name` | TEXT        | Nome visualizzato (default = username)|
| `role`         | TEXT        | Slug del ruolo (es. `founder`)       |
| `bio`          | TEXT        | Biografia opzionale                  |
| `active`       | BOOLEAN     | Se il membro è attivo                |
| `order_index`  | INTEGER     | Ordine di visualizzazione            |
| `joined_at`    | TIMESTAMPTZ | Data di ingresso                     |

#### `staff_roles`
| Colonna       | Tipo       | Descrizione               |
|---------------|------------|---------------------------|
| `id`          | UUID (PK)  | ID univoco                |
| `name`        | TEXT       | Nome del ruolo            |
| `slug`        | TEXT UNIQUE| Identificatore URL-safe   |
| `color`       | TEXT       | Colore hex                |
| `order_index` | INTEGER    | Ordine gerarchico         |

#### `events`
| Colonna          | Tipo     | Descrizione                             |
|------------------|----------|-----------------------------------------|
| `id`             | UUID     | ID univoco                              |
| `title`          | TEXT     | Titolo evento                           |
| `description`    | TEXT     | Descrizione                             |
| `type`           | TEXT     | Tipo (`cw`, `tournament`, `community`)  |
| `scheduled_at`   | TIMESTAMPTZ | Data/ora evento una tantum           |
| `recurring`      | BOOLEAN  | Se è ricorrente                         |
| `recurring_days` | TEXT[]   | Giorni della settimana                  |
| `recurring_time` | TEXT     | Ora ricorrente (es. `19:00`)            |
| `active`         | BOOLEAN  | Se l'evento è attivo                    |

#### `rules`
| Colonna       | Tipo    | Descrizione              |
|---------------|---------|--------------------------|
| `id`          | UUID    | ID univoco               |
| `title`       | TEXT    | Titolo regola            |
| `description` | TEXT    | Testo completo           |
| `order_index` | INTEGER | Ordine di visualizzazione|
| `active`      | BOOLEAN | Se la regola è attiva    |

---

## API Reference

Base URL: `https://valiancev2.vercel.app/api`

Tutti gli endpoint restituiscono JSON. Gli errori hanno la forma `{ "error": "messaggio" }`.

---

### Health

#### `GET /api/health`
Controlla che l'API sia online.

```json
{
  "status": "ok",
  "version": "2.0.0",
  "timestamp": "2025-01-15T12:00:00.000Z",
  "service": "Valiance API"
}
```

---

### Staff

#### `GET /api/staff`
Restituisce tutti i membri dello staff.

**Query params:**
| Param    | Default | Descrizione                        |
|----------|---------|------------------------------------|
| `role`   | —       | Filtra per slug ruolo (es. `founder`) |
| `active` | `true`  | `true`, `false`, o `all`          |
| `limit`  | `50`    | Numero massimo di risultati        |
| `offset` | `0`     | Offset per paginazione             |

**Risposta:**
```json
{
  "data": [
    {
      "id": "uuid",
      "discord_id": "810890907989049384",
      "username": "GabriNumberOne",
      "display_name": "GabriNumberOne",
      "role": "founder",
      "bio": null,
      "active": true,
      "order_index": 0,
      "joined_at": "2025-01-01T00:00:00.000Z"
    }
  ],
  "count": 1
}
```

**Esempi:**
```bash
# Tutti i fondatori
GET /api/staff?role=founder

# Tutti i membri (attivi e non)
GET /api/staff?active=all
```

---

#### `POST /api/staff` 🔒
Aggiunge un nuovo membro allo staff.

**Headers:** `Authorization: Bearer <ADMIN_SECRET>`
**Body:**
```json
{
  "discord_id": "123456789012345678",
  "username": "NuovoMembro",
  "display_name": "Nuovo Membro",
  "role": "helper",
  "bio": "Ciao sono nuovo!",
  "order_index": 5
}
```

---

#### `GET /api/staff/:id`
Restituisce un singolo membro. `id` può essere l'UUID o il `discord_id`.

```bash
GET /api/staff/810890907989049384
GET /api/staff/3fa85f64-5717-4562-b3fc-2c963f66afa6
```

---

#### `PUT /api/staff/:id` 🔒
Aggiorna i dati di un membro.

**Headers:** `Authorization: Bearer <ADMIN_SECRET>`
**Body (campi modificabili):**
```json
{
  "display_name": "Gabri #1",
  "role": "co-leader",
  "bio": "Fondatore del clan",
  "active": true,
  "order_index": 0
}
```

---

#### `DELETE /api/staff/:id` 🔒
Disattiva un membro (soft delete). Aggiungi `?hard=true` per eliminazione permanente.

```bash
# Soft delete (active = false)
DELETE /api/staff/810890907989049384

# Hard delete (rimozione dal DB)
DELETE /api/staff/810890907989049384?hard=true
```

---

### Staff Roles

#### `GET /api/staff-roles`
Restituisce tutti i ruoli in ordine gerarchico.

```json
{
  "data": [
    { "id": "uuid", "name": "Founder", "slug": "founder", "color": "#B89A3A", "order_index": 0 }
  ]
}
```

---

#### `POST /api/staff-roles` 🔒
Crea un nuovo ruolo.

**Headers:** `Authorization: Bearer <ADMIN_SECRET>`
**Body:**
```json
{
  "name": "Trial",
  "slug": "trial",
  "color": "#4A4A4A",
  "order_index": 4
}
```

---

### Events

#### `GET /api/events`
Restituisce tutti gli eventi.

**Query params:**
| Param    | Default | Descrizione                    |
|----------|---------|--------------------------------|
| `active` | `true`  | `true`, `false`, o `all`      |
| `type`   | —       | Filtra per tipo (`cw`, ecc.)  |

---

#### `POST /api/events` 🔒
Crea un nuovo evento.

**Body:**
```json
{
  "title": "Torneo Primaverile",
  "description": "Torneo a eliminazione diretta tra tutti i membri.",
  "type": "tournament",
  "recurring": false,
  "scheduled_at": "2025-04-20T19:00:00.000Z"
}
```

Per evento ricorrente:
```json
{
  "title": "Allenamento Serale",
  "type": "cw",
  "recurring": true,
  "recurring_days": ["Martedì", "Giovedì"],
  "recurring_time": "20:00"
}
```

---

#### `GET /api/events/:id`
Restituisce un singolo evento per UUID.

---

#### `PUT /api/events/:id` 🔒
Aggiorna un evento.

---

#### `DELETE /api/events/:id` 🔒
Disattiva o elimina un evento. `?hard=true` per eliminazione permanente.

---

### Rules

#### `GET /api/rules`
Restituisce tutte le regole attive.

---

#### `POST /api/rules` 🔒
Aggiunge una nuova regola.

**Body:**
```json
{
  "title": "Fair Play",
  "description": "Nessun hack, mod illegali o comportamento scorretto in game.",
  "order_index": 7
}
```

---

#### `GET /api/rules/:id`
Restituisce una singola regola.

---

#### `PUT /api/rules/:id` 🔒
Modifica una regola.

---

#### `DELETE /api/rules/:id` 🔒
Disattiva o elimina una regola.

---

### Discord

#### `GET /api/discord/avatar?id=DISCORD_USER_ID`
Restituisce l'URL dell'avatar Discord di un utente.

**Risposta:**
```json
{
  "url": "https://cdn.discordapp.com/avatars/810890907989049384/abc123.png?size=128",
  "username": "GabriNumberOne",
  "source": "discord"
}
```

`source` può essere `discord`, `default`, `fallback`, o `error-fallback`.

---

#### `GET /api/discord/guild?id=GUILD_ID`
Restituisce le statistiche di un server Discord (richiede il widget attivo).

**Risposta:**
```json
{
  "id": "1350073876339490826",
  "name": "Valiance Clan",
  "online": 12,
  "total": "N/D",
  "invite": "https://discord.gg/..."
}
```

---

### Server Minecraft

#### `GET /api/server-status?host=play.coralmc.it`
Restituisce lo stato del server Minecraft.

**Risposta:**
```json
{
  "online": true,
  "host": "play.coralmc.it",
  "players": 47,
  "max_players": 500,
  "version": "1.20.4",
  "motd": "CoralMC - Clan Server"
}
```

---

### Statistics

#### `GET /api/stats`
Statistiche aggregate del sito.

**Risposta:**
```json
{
  "staff": {
    "total": 8,
    "by_role": {
      "founder": 2,
      "co-leader": 1,
      "moderator": 1,
      "helper": 4
    }
  },
  "events": { "total": 1 },
  "rules": { "total": 7 },
  "generated_at": "2025-01-15T12:00:00.000Z"
}
```

---

### Authentication

#### `POST /api/auth/login`
Restituisce il token admin verificando la password.

**Body:**
```json
{ "password": "la-tua-password" }
```

**Risposta 200:**
```json
{
  "token": "la-tua-password",
  "message": "Authenticated. Use this token as: Authorization: Bearer <token>"
}
```

Usa il token nelle richieste protette:
```bash
Authorization: Bearer la-tua-password
```

---

## Autenticazione Admin

Gli endpoint con 🔒 richiedono un header `Authorization: Bearer <ADMIN_SECRET>`.

**Esempio con curl:**
```bash
# Aggiungere un membro dello staff
curl -X POST https://valiancev2.vercel.app/api/staff \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer la-tua-ADMIN_SECRET" \
  -d '{"discord_id":"123","username":"NuovoMembro","role":"helper"}'

# Aggiornare un membro
curl -X PUT https://valiancev2.vercel.app/api/staff/discord-id-qui \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer la-tua-ADMIN_SECRET" \
  -d '{"role":"co-leader"}'

# Eliminare un membro (soft delete)
curl -X DELETE https://valiancev2.vercel.app/api/staff/discord-id-qui \
  -H "Authorization: Bearer la-tua-ADMIN_SECRET"
```

---

## Deploy su Vercel

1. Push del repo su GitHub
2. Importa il progetto su [vercel.com](https://vercel.com)
3. Imposta le variabili d'ambiente nella dashboard Vercel:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `DISCORD_BOT_TOKEN`
   - `ADMIN_SECRET`
4. Deploy automatico ad ogni push su `main`

---

## Struttura del Progetto

```
ValianceSite/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx / .css
│   │   ├── Hero.jsx / .css
│   │   ├── About.jsx / .css
│   │   ├── Staff.jsx / .css
│   │   ├── Events.jsx / .css
│   │   ├── Rules.jsx / .css
│   │   ├── ServerStatus.jsx / .css
│   │   ├── DiscordSection.jsx / .css
│   │   ├── Footer.jsx / .css
│   │   └── ParticleCanvas.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Discover.jsx / .css
│   │   ├── Privacy.jsx
│   │   ├── Cookie.jsx
│   │   ├── Terms.jsx
│   │   └── Policy.css
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── api/
│   ├── _lib/
│   │   ├── supabase.js        # Client Supabase condiviso
│   │   └── auth.js            # Helper autenticazione
│   ├── staff/
│   │   ├── index.js           # GET /api/staff, POST /api/staff
│   │   └── [id].js            # GET/PUT/DELETE /api/staff/:id
│   ├── staff-roles/
│   │   └── index.js           # GET/POST /api/staff-roles
│   ├── events/
│   │   ├── index.js           # GET/POST /api/events
│   │   └── [id].js            # GET/PUT/DELETE /api/events/:id
│   ├── rules/
│   │   ├── index.js           # GET/POST /api/rules
│   │   └── [id].js            # GET/PUT/DELETE /api/rules/:id
│   ├── discord/
│   │   ├── avatar.js          # GET /api/discord/avatar
│   │   └── guild.js           # GET /api/discord/guild
│   ├── server-status.js       # GET /api/server-status
│   ├── stats.js               # GET /api/stats
│   ├── health.js              # GET /api/health
│   └── auth/
│       └── login.js           # POST /api/auth/login
│
├── supabase/
│   └── schema.sql             # Schema DB + seed data
│
├── index.html
├── vite.config.js
├── vercel.json
└── package.json
```

---

*Valiance — Non affiliato a Mojang/Microsoft.*
