/** Het Trengix-beeldmerk: de punt en de schuine streep. */
export function Mark({
  color = "#FFFFFF",
  className,
  style,
  animated = false,
}: {
  color?: string;
  className?: string;
  style?: React.CSSProperties;
  animated?: boolean;
}) {
  return (
    <svg aria-hidden="true" viewBox="140 339 312 322" className={className} style={style}>
      <circle className={animated ? "a-dot" : undefined} cx="206" cy="406" r="61" fill={color} />
      <g className={animated ? "a-cap" : undefined}>
        <line x1="386" y1="405" x2="275" y2="595" stroke={color} strokeWidth="122" strokeLinecap="round" />
      </g>
    </svg>
  );
}
