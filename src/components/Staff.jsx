import { useState, useEffect } from 'react'
import { useInView } from '../hooks/useInView'
import './Staff.css'

function buildGroups(staffData, rolesData) {
  const roleMap = Object.fromEntries(rolesData.map(r => [r.slug, r]))
  const groupsMap = {}
  staffData
    .filter(m => m.active)
    .forEach(m => {
      const role = roleMap[m.role] || { name: m.role, color: '#888', textColor: '#aaa', order_index: 99 }
      if (!groupsMap[m.role]) {
        groupsMap[m.role] = { group: role.name, color: role.color, textColor: role.textColor, order: role.order_index, members: [] }
      }
      groupsMap[m.role].members.push({
        discord_id: m.discord_id,
        username: m.display_name,
        role: m.bio || role.name,
        order_index: m.order_index,
      })
    })
  return Object.values(groupsMap)
    .sort((a, b) => a.order - b.order)
    .map(g => ({ ...g, members: g.members.sort((a, b) => a.order_index - b.order_index) }))
}

function getDefaultAvatar(id) {
  try { return `https://cdn.discordapp.com/embed/avatars/${Number(BigInt(id) >> 22n) % 6}.png` }
  catch { return 'https://cdn.discordapp.com/embed/avatars/0.png' }
}

function MemberCard({ member, groupColor, groupTextColor, onCopy, delay }) {
  const [avatar, setAvatar] = useState(null)
  const [ref, inView] = useInView()

  useEffect(() => {
    let cancelled = false
    fetch(`/api/discord/avatar?id=${member.discord_id}`)
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (!cancelled) setAvatar(d?.url || getDefaultAvatar(member.discord_id)) })
      .catch(() => { if (!cancelled) setAvatar(getDefaultAvatar(member.discord_id)) })
    return () => { cancelled = true }
  }, [member.discord_id])

  function handleClick() {
    navigator.clipboard.writeText(member.discord_id).catch(() => {}).finally(() => onCopy())
  }

  return (
    <div
      ref={ref}
      className={`member-card card reveal ${inView ? 'visible' : ''}`}
      style={{ transitionDelay: `${delay}s`, '--grp-color': groupColor }}
      onClick={handleClick}
      title="Clicca per copiare l'ID Discord"
    >
      <div className="member-avatar-wrap">
        <div className="member-avatar">
          {avatar
            ? <img src={avatar} alt={member.username} />
            : <div className="member-avatar-ph" />}
        </div>
        <div className="member-avatar-ring" />
      </div>
      <div className="member-info">
        <strong className="member-name">{member.username}</strong>
        <span className="member-role condensed" style={{ color: groupTextColor }}>{member.role}</span>
      </div>
      <div className="member-copy-icon">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="9" y="9" width="13" height="13" rx="2"/>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
        </svg>
      </div>
    </div>
  )
}

export default function Staff() {
  const [groups, setGroups] = useState([])
  const [toast, setToast] = useState(false)
  const [secRef, secInView] = useInView()

  useEffect(() => {
    Promise.all([
      fetch('/api/staff').then(r => r.json()),
      fetch('/api/staff-roles').then(r => r.json()),
    ]).then(([staffRes, rolesRes]) => {
      setGroups(buildGroups(staffRes.data, rolesRes.data))
    }).catch(() => {})
  }, [])

  function handleCopy() {
    setToast(true)
    setTimeout(() => setToast(false), 3000)
  }

  return (
    <section id="roster" ref={secRef}>
      <div className="container">
        <div className={`reveal ${secInView ? 'visible' : ''}`}>
          <div className="label">Team</div>
          <h2>Staff</h2>
          <p className="muted mt-1 mb-3">
            Il team che tiene in piedi Valiance. Clicca su un membro per copiare il suo ID Discord.
          </p>
        </div>

        {groups.map(group => (
          <div className="staff-group" key={group.group}>
            <div className="staff-group-header">
              <span className="staff-group-dot" style={{ background: group.color }} />
              <span className="staff-group-name condensed" style={{ color: group.textColor }}>
                {group.group}
              </span>
              <span className="staff-group-count condensed faint">
                {group.members.length} {group.members.length === 1 ? 'membro' : 'membri'}
              </span>
            </div>
            <div className="staff-grid">
              {group.members.map((m, i) => (
                <MemberCard
                  key={m.discord_id}
                  member={m}
                  groupColor={group.color}
                  groupTextColor={group.textColor}
                  onCopy={handleCopy}
                  delay={i * 0.07}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className={`toast ${toast ? 'show' : ''}`}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        ID copiato negli appunti
        <button className="toast-close" onClick={() => setToast(false)}>×</button>
      </div>
    </section>
  )
}
