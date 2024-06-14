export class Color {
  hue: number
  saturation: number
  lightness: number

  constructor(hue: number, saturation: number, lightness: number) {
    this.hue = hue
    this.saturation = saturation
    this.lightness = lightness
  }

  lighten(lightness: number): Color {
    return new Color(this.hue, this.saturation, this.lightness + lightness)
  }

  hex(): string {
    const rgb = this.toRgb()

    return `#${rgb[0].toString(16).padStart(2, '0')}${rgb[1]
      .toString(16)
      .padStart(2, '0')}${rgb[2].toString(16).padStart(2, '0')}`
  }

  toRgb(): number[] {
    const hue = this.hue / 360
    const saturation = this.saturation / 100
    const lightness = this.lightness / 100

    const chroma = (1 - Math.abs(2 * lightness - 1)) * saturation
    const huePrime = hue * 6
    const secondComponent = chroma * (1 - Math.abs((huePrime % 2) - 1))

    let r = 0,
      g = 0,
      b = 0

    if (0 <= huePrime && huePrime < 1) {
      r = chroma
      g = secondComponent
    } else if (1 <= huePrime && huePrime < 2) {
      r = secondComponent
      g = chroma
    } else if (2 <= huePrime && huePrime < 3) {
      g = chroma
      b = secondComponent
    } else if (3 <= huePrime && huePrime < 4) {
      g = secondComponent
      b = chroma
    } else if (4 <= huePrime && huePrime < 5) {
      r = secondComponent
      b = chroma
    } else if (5 <= huePrime && huePrime < 6) {
      r = chroma
      b = secondComponent
    }

    const lightnessAdjustment = lightness - chroma / 2

    r += lightnessAdjustment
    g += lightnessAdjustment
    b += lightnessAdjustment

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)]
  }

  toString(): string {
    return `hsl(${this.hue}, ${this.saturation}%, ${this.lightness}%)`
  }

  // initialize Color from hex code
  static fromHex(hex: string): Color {
    // Remove '#' if present
    hex = hex.replace(/^#/, '')

    // Parse hex code into RGB components
    const bigint = parseInt(hex, 16)
    const r = (bigint >> 16) & 255
    const g = (bigint >> 8) & 255
    const b = bigint & 255

    // Convert RGB to HSL
    const rNormalized = r / 255
    const gNormalized = g / 255
    const bNormalized = b / 255

    const max = Math.max(rNormalized, gNormalized, bNormalized)
    const min = Math.min(rNormalized, gNormalized, bNormalized)

    let hue = 0
    let saturation = 0
    const lightness = (max + min) / 2

    if (max !== min) {
      const d = max - min
      saturation = lightness > 0.5 ? d / (2 - max - min) : d / (max + min)

      switch (max) {
        case rNormalized:
          hue =
            (gNormalized - bNormalized) / d +
            (gNormalized < bNormalized ? 6 : 0)
          break
        case gNormalized:
          hue = (bNormalized - rNormalized) / d + 2
          break
        case bNormalized:
          hue = (rNormalized - gNormalized) / d + 4
          break
      }

      hue /= 6
    }

    return new Color(hue * 360, saturation * 100, lightness * 100)
  }
}

export const generateColors = (
  N: number,
  baseColor = new Color(129, 100, 32),
): string[] => {
  const colors: string[] = []

  // 生成N个颜色
  for (let i = 0; i < N; i++) {
    // 计算亮度调整值，使得颜色逐步变亮或变暗
    const lightnessAdjustment = (i / (N - 1)) * 20 - 10 // 可根据需要调整范围

    // 生成新颜色
    const newColor = baseColor.lighten(lightnessAdjustment)

    colors.push(newColor.hex())
  }

  return colors
}

// export const generateLinearColors = (
//   baseHue: number,
//   numColors: number,
// ): Color[] => {
//   // 创建颜色数组
//   const colorArray = []
//
//   // 生成相邻颜色
//   for (let i = 0; i < numColors; i++) {
//     // 计算饱和度和亮度
//     const saturation = 100 - i * (100 / (numColors - 1))
//     const lightness = 50
//
//     // 构造 HSL 表示的颜色
//     const color = new Color(baseHue, saturation, lightness)
//
//     // 将颜色添加到数组中
//     colorArray.push(color)
//   }
//
//   return colorArray
// }

export function generateLinearColors(
  startColor: Color,
  endColor: Color,
  steps: number,
): Color[] {
  const colors: Color[] = []

  for (let i = 0; i <= steps; i++) {
    const t = i / steps
    const hue = startColor.hue + (endColor.hue - startColor.hue) * t
    const saturation =
      startColor.saturation + (endColor.saturation - startColor.saturation) * t
    const lightness =
      startColor.lightness + (endColor.lightness - startColor.lightness) * t

    colors.push(new Color(hue, saturation, lightness))
  }

  return colors
}
