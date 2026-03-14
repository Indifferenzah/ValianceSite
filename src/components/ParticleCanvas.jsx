import { useEffect, useRef } from 'react'

export default function ParticleCanvas() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let W, H, particles = [], animId

    const COLORS = [
      [70, 123, 28],   // olive-500
      [90, 152, 36],   // olive-400
      [184, 154, 58],  // gold-200
      [114, 180, 46],  // olive-300
    ]

    function rand(a, b) { return Math.random() * (b - a) + a }

    function resize() {
      W = canvas.width = window.innerWidth
      H = canvas.height = window.innerHeight
    }

    function spawn() {
      const count = Math.max(60, Math.floor((W * H) / 14000))
      particles = Array.from({ length: count }, () => ({
        x: rand(0, W),
        y: rand(0, H),
        vx: rand(-0.12, 0.12),
        vy: rand(-0.18, -0.05),
        r: rand(0.4, 1.6),
        color: COLORS[Math.floor(rand(0, COLORS.length))],
        alpha: rand(0.06, 0.22),
        drift: rand(0.002, 0.008),
      }))
    }

    function step(ts) {
      ctx.clearRect(0, 0, W, H)

      particles.forEach(p => {
        p.x += p.vx + Math.sin(ts * p.drift) * 0.3
        p.y += p.vy
        p.vx *= 0.999

        if (p.y < -10) { p.y = H + 10; p.x = rand(0, W) }
        if (p.x < -10) p.x = W + 10
        if (p.x > W + 10) p.x = -10

        const [r, g, b] = p.color
        ctx.beginPath()
        ctx.fillStyle = `rgba(${r},${g},${b},${p.alpha})`
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fill()
      })

      animId = requestAnimationFrame(step)
    }

    resize()
    spawn()
    animId = requestAnimationFrame(step)

    const onResize = () => { resize(); spawn() }
    window.addEventListener('resize', onResize)
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}
      aria-hidden="true"
    />
  )
}
