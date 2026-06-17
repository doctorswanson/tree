interface HexProps {
  size: number
  fill: string
  stroke: string
  strokeWidth?: number
  glow?: string
  className?: string
}

const POINTS = '50,3 95,26 95,74 50,97 5,74 5,26'

export default function Hex({ size, fill, stroke, strokeWidth = 2, glow, className }: HexProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      style={{ filter: glow ? `drop-shadow(${glow})` : undefined, overflow: 'visible' }}
    >
      <polygon points={POINTS} fill={fill} stroke={stroke} strokeWidth={strokeWidth} vectorEffect="non-scaling-stroke" />
    </svg>
  )
}
