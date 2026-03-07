<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

interface Props {
  active?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  active: false,
})

const canvasRef = ref<HTMLCanvasElement | null>(null)
let ctx: CanvasRenderingContext2D | null = null
let animationId: number | null = null
let time = 0
let currentAmplitude = 0

const numWaves = 5
const colorPrimary = { r: 155, g: 155, b: 155 }

function resize() {
  if (!canvasRef.value)
    return

  const dpr = window.devicePixelRatio || 1
  const rect = canvasRef.value.parentElement?.getBoundingClientRect()

  if (rect) {
    // Physical pixels = CSS pixels × DPR
    canvasRef.value.width = rect.width * dpr
    canvasRef.value.height = rect.height * dpr

    // Keep the CSS display size unchanged
    canvasRef.value.style.width = `${rect.width}px`
    canvasRef.value.style.height = `${rect.height}px`

    // Re-acquire context and re-apply scale after every resize
    ctx = canvasRef.value.getContext('2d')
    ctx?.scale(dpr, dpr)
  }
}

function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t
}

function drawWave(
  centerY: number,
  baseAmplitude: number,
  waveIndex: number,
  alpha: number,
  cssWidth: number,
) {
  if (!ctx)
    return

  const phase = time * 2 + waveIndex * 0.5

  ctx.beginPath()
  ctx.lineWidth = 1
  ctx.strokeStyle = `rgba(${colorPrimary.r}, ${colorPrimary.g}, ${colorPrimary.b}, ${alpha})`

  const noiseOffset = Math.sin(phase * 1.3 + waveIndex) * 10

  for (let x = 0; x <= cssWidth; x += 1) {
    const normalizedX = x / cssWidth
    const sine1 = Math.sin(normalizedX * Math.PI * 4 + phase + waveIndex * 0.8)
    const sine2 = Math.sin(normalizedX * Math.PI * 8 + phase * 1.7 + waveIndex * 1.2)
    const sine3 = Math.sin(normalizedX * Math.PI * 2 + phase * 0.5 + waveIndex * 0.3)

    const envelope = Math.sin(normalizedX * Math.PI)
    const waveY = (sine1 * 0.5 + sine2 * 0.3 + sine3 * 0.2) * baseAmplitude * envelope

    const noise = (Math.random() - 0.5) * noiseOffset * envelope
    const y = centerY + waveY + noise

    if (x === 0)
      ctx.moveTo(x, y)
    else
      ctx.lineTo(x, y)
  }

  ctx.stroke()
}

function draw() {
  if (!ctx || !canvasRef.value)
    return

  // Work in CSS pixels — ctx.scale(dpr, dpr) handles the physical pixel mapping
  const dpr = window.devicePixelRatio || 1
  const cssWidth = canvasRef.value.width / dpr
  const cssHeight = canvasRef.value.height / dpr
  const centerY = cssHeight / 2

  ctx.clearRect(0, 0, cssWidth, cssHeight)

  const targetAmplitude = props.active ? cssHeight * 0.4 : 0
  currentAmplitude = lerp(currentAmplitude, targetAmplitude, 0.08)

  for (let i = 0; i < numWaves; i++) {
    const waveProgress = i / (numWaves - 1)
    const baseAmplitude = currentAmplitude * (0.4 + waveProgress * 0.6)
    const alpha = 0.15 + waveProgress * 0.15

    drawWave(centerY, baseAmplitude, i, alpha, cssWidth)
  }

  if (currentAmplitude > 0.5) {
    ctx.globalCompositeOperation = 'screen'

    const gradient = ctx.createLinearGradient(0, centerY - 100, 0, centerY + 100)
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)')
    gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.4)')
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0.3)')

    const globalAlpha = Math.min(currentAmplitude / (cssHeight * 11), 1) * 0.3
    ctx.fillStyle = gradient
    ctx.globalAlpha = globalAlpha
    ctx.fillRect(0, centerY - 100, cssWidth, 200)

    ctx.globalAlpha = 1
    ctx.globalCompositeOperation = 'source-over'
  }

  time += 0.02
}

function animate() {
  draw()
  animationId = requestAnimationFrame(animate)
}

function start() {
  if (!canvasRef.value)
    return

  resize()
  animate()
}

function stop() {
  if (animationId !== null) {
    cancelAnimationFrame(animationId)
    animationId = null
  }
}

onMounted(() => {
  start()
  window.addEventListener('resize', resize)
})

onUnmounted(() => {
  stop()
  window.removeEventListener('resize', resize)
})
</script>

<template>
  <div class="siri-wave-container">
    <canvas ref="canvasRef" />
  </div>
</template>

<style scoped>
.siri-wave-container {
  width: 100%;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: transparent;
}

.siri-wave-container canvas {
  width: 100%;
  height: 50px;
  background: transparent;
}
</style>
