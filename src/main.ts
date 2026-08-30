import type { AddonValues, CanvasAddonMountContext } from '../generated/mywallpaper-runtime'

type Settings = {
  primaryColor: string
  displayText: string
  showMatrixRain: boolean
  rainOpacity: number
  showClock: boolean
  showDate: boolean
}

const DEFAULT_SETTINGS: Settings = {
  primaryColor: '#00ff41',
  displayText: 'MYWALLPAPER TEMPLATE',
  showMatrixRain: true,
  rainOpacity: 0.7,
  showClock: true,
  showDate: true,
}

const CHARACTERS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'

export function mount({ layer }: CanvasAddonMountContext): () => void {
  const root = layer.root
  root.classList.add('mwa-template-root')

  const style = document.createElement('style')
  style.textContent = `
    .mwa-template-root {
      --mwa-template-color: #00ff41;
      position: relative;
      width: 100%;
      height: 100%;
      overflow: hidden;
      color: var(--mwa-template-color);
      background: #020502;
      font-family: "Share Tech Mono", "Cascadia Mono", monospace;
    }

    .mwa-template-root .mwa-template-rain {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      opacity: 0.7;
    }

    .mwa-template-root .mwa-template-panel {
      position: absolute;
      top: 50%;
      left: 50%;
      width: min(450px, calc(100% - 32px));
      transform: translate(-50%, -50%);
      border: 2px solid var(--mwa-template-color);
      border-radius: 8px;
      background: rgba(0, 0, 0, 0.88);
      box-shadow: 0 0 20px color-mix(in srgb, var(--mwa-template-color) 60%, transparent), inset 0 0 20px color-mix(in srgb, var(--mwa-template-color) 12%, transparent);
    }

    .mwa-template-root .mwa-template-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 15px;
      border-bottom: 1px solid var(--mwa-template-color);
      background: color-mix(in srgb, var(--mwa-template-color) 15%, transparent);
    }

    .mwa-template-root .mwa-template-version {
      font-size: 0.85rem;
      font-weight: 700;
      text-shadow: 0 0 5px var(--mwa-template-color);
    }

    .mwa-template-root .mwa-template-lights {
      display: flex;
      gap: 7px;
    }

    .mwa-template-root .mwa-template-light {
      width: 10px;
      height: 10px;
      border: 1px solid var(--mwa-template-color);
      border-radius: 50%;
    }

    .mwa-template-root .mwa-template-light:nth-child(1) { background: #f5d90a; }
    .mwa-template-root .mwa-template-light:nth-child(2) { background: #35d05a; }
    .mwa-template-root .mwa-template-light:nth-child(3) { background: #df394f; }

    .mwa-template-root .mwa-template-content {
      min-height: 180px;
      padding: 22px;
    }

    .mwa-template-root .mwa-template-title {
      margin: 0 0 18px;
      color: var(--mwa-template-color);
      font-size: clamp(1.2rem, 4vw, 1.8rem);
      text-align: center;
      text-shadow: 0 0 8px color-mix(in srgb, var(--mwa-template-color) 70%, transparent);
    }

    .mwa-template-root .mwa-template-info {
      display: grid;
      gap: 8px;
      margin: 0 auto;
      max-width: 18rem;
      color: rgba(255, 255, 255, 0.75);
      font-size: 0.85rem;
    }

    .mwa-template-root .mwa-template-info-row {
      display: flex;
      justify-content: space-between;
      gap: 16px;
    }

    .mwa-template-root .mwa-template-value {
      color: var(--mwa-template-color);
      text-align: right;
    }

    .mwa-template-root .mwa-template-cursor {
      margin-top: 18px;
      color: var(--mwa-template-color);
      text-align: center;
      animation: mwa-template-blink 1.1s steps(2, jump-none) infinite;
    }

    @keyframes mwa-template-blink { 50% { opacity: 0; } }
  `
  document.head.append(style)

  const rain = document.createElement('canvas')
  rain.className = 'mwa-template-rain'

  const panel = document.createElement('section')
  panel.className = 'mwa-template-panel'
  panel.setAttribute('aria-label', 'MyWallpaper add-on template')

  const header = document.createElement('header')
  header.className = 'mwa-template-header'
  const version = document.createElement('span')
  version.className = 'mwa-template-version'
  version.textContent = 'v3.0.0'
  const lights = document.createElement('span')
  lights.className = 'mwa-template-lights'
  for (let index = 0; index < 3; index += 1) {
    const light = document.createElement('span')
    light.className = 'mwa-template-light'
    light.setAttribute('aria-hidden', 'true')
    lights.append(light)
  }
  header.append(version, lights)

  const content = document.createElement('div')
  content.className = 'mwa-template-content'
  const title = document.createElement('h1')
  title.className = 'mwa-template-title'
  const info = document.createElement('div')
  info.className = 'mwa-template-info'

  const timeRow = createInfoRow('TIME')
  const dateRow = createInfoRow('DATE')
  const statusRow = createInfoRow('STATUS')
  statusRow.value.textContent = 'ONLINE'
  info.append(timeRow.row, dateRow.row, statusRow.row)

  const cursor = document.createElement('div')
  cursor.className = 'mwa-template-cursor'
  cursor.textContent = '▊'
  content.append(title, info, cursor)
  panel.append(header, content)
  root.replaceChildren(rain, panel)

  const context = rain.getContext('2d')
  let viewportWidth = 1
  let viewportHeight = 1
  let columns = 1
  let drops: number[] = []
  let animationFrame = 0
  let running = true
  let settings = { ...DEFAULT_SETTINGS }

  function resize(): void {
    const rect = root.getBoundingClientRect()
    viewportWidth = Math.max(1, Math.floor(rect.width || window.innerWidth))
    viewportHeight = Math.max(1, Math.floor(rect.height || window.innerHeight))
    const pixelRatio = Math.min(2, window.devicePixelRatio || 1)
    rain.width = Math.floor(viewportWidth * pixelRatio)
    rain.height = Math.floor(viewportHeight * pixelRatio)
    context?.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
    columns = Math.max(1, Math.floor(viewportWidth / 14))
    drops = Array.from({ length: columns }, () => Math.random() * viewportHeight / 14)
  }

  function drawRain(): void {
    if (!context) return
    context.fillStyle = 'rgba(0, 0, 0, 0.07)'
    context.fillRect(0, 0, viewportWidth, viewportHeight)
    if (!settings.showMatrixRain) {
      context.clearRect(0, 0, viewportWidth, viewportHeight)
      return
    }
    context.fillStyle = settings.primaryColor
    context.font = '14px "Cascadia Mono", monospace'
    context.globalAlpha = settings.rainOpacity
    for (let index = 0; index < drops.length; index += 1) {
      const x = index * 14
      const y = drops[index]! * 14
      context.fillText(CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)]!, x, y)
      if (y > viewportHeight && Math.random() > 0.975) drops[index] = 0
      drops[index] = (drops[index] ?? 0) + 1
    }
    context.globalAlpha = 1
  }

  function tick(): void {
    if (!running) return
    drawRain()
    animationFrame = window.requestAnimationFrame(tick)
  }

  function updateClock(): void {
    const now = new Date()
    timeRow.value.textContent = now.toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    })
    dateRow.value.textContent = now.toLocaleDateString(undefined, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
    timeRow.row.hidden = !settings.showClock
    dateRow.row.hidden = !settings.showDate
  }

  function applySettings(values: AddonValues): void {
    settings = normalizeSettings(values)
    root.style.setProperty('--mwa-template-color', settings.primaryColor)
    title.textContent = settings.displayText
    rain.style.opacity = String(settings.rainOpacity)
    updateClock()
  }

  resize()
  applySettings(layer.settings.get())
  const unsubscribeSettings = layer.settings.subscribe(applySettings)
  const clockTimer = window.setInterval(updateClock, 1000)
  window.addEventListener('resize', resize)
  animationFrame = window.requestAnimationFrame(tick)

  return () => {
    running = false
    window.cancelAnimationFrame(animationFrame)
    window.clearInterval(clockTimer)
    window.removeEventListener('resize', resize)
    unsubscribeSettings()
    style.remove()
    root.classList.remove('mwa-template-root')
    root.replaceChildren()
  }
}

function createInfoRow(label: string): { row: HTMLDivElement; value: HTMLSpanElement } {
  const row = document.createElement('div')
  row.className = 'mwa-template-info-row'
  const labelElement = document.createElement('span')
  labelElement.textContent = `${label}:`
  const value = document.createElement('span')
  value.className = 'mwa-template-value'
  row.append(labelElement, value)
  return { row, value }
}

function normalizeSettings(values: AddonValues): Settings {
  const primaryColor = values.primaryColor
  const displayText = values.displayText
  const rainOpacity = values.rainOpacity
  return {
    primaryColor: typeof primaryColor === 'string' && primaryColor.trim() ? primaryColor.trim() : DEFAULT_SETTINGS.primaryColor,
    displayText: typeof displayText === 'string' && displayText.trim() ? displayText.trim() : DEFAULT_SETTINGS.displayText,
    showMatrixRain: values.showMatrixRain !== false,
    rainOpacity: typeof rainOpacity === 'number' && Number.isFinite(rainOpacity)
      ? Math.min(1, Math.max(0, rainOpacity))
      : DEFAULT_SETTINGS.rainOpacity,
    showClock: values.showClock !== false,
    showDate: values.showDate !== false,
  }
}
