"use client"

import { useEffect, useRef } from 'react'

export function WarpBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    let stars: { x: number; y: number; z: number; size: number }[] = []

    const initStars = () => {
      stars = Array.from({ length: 400 }, () => ({
        x: Math.random() * canvas.width - canvas.width / 2,
        y: Math.random() * canvas.height - canvas.height / 2,
        z: Math.random() * canvas.width,
        size: Math.random() * 2
      }))
    }

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      initStars()
    }

    const draw = () => {
      if (!canvas || !ctx) return
      
      // Clear with slight fade for trail effect? No, clean clear for crisp stars
      ctx.fillStyle = '#030014'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      const cx = canvas.width / 2
      const cy = canvas.height / 2

      ctx.fillStyle = '#ffffff'
      
      stars.forEach(star => {
        // Move stars closer (decrease z)
        star.z -= 2
        if (star.z <= 0) {
          star.x = Math.random() * canvas.width - cy
          star.y = Math.random() * canvas.height - cy
          star.z = canvas.width
        }

        // Project 3D to 2D
        const x = (star.x * 128) / star.z + cx
        const y = (star.y * 128) / star.z + cy
        
        if (x >= 0 && x < canvas.width && y >= 0 && y < canvas.height) {
          const size = (1 - star.z / canvas.width) * 3
          const opacity = (1 - star.z / canvas.width)
          
          ctx.globalAlpha = opacity
          ctx.beginPath()
          ctx.arc(x, y, size * 0.7, 0, Math.PI * 2)
          ctx.fill()
        }
      })
      
      ctx.globalAlpha = 1
      animationFrameId = requestAnimationFrame(draw)
    }

    window.addEventListener('resize', resize)
    resize()
    draw()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 z-[-1] pointer-events-none opacity-60"
    />
  )
}
