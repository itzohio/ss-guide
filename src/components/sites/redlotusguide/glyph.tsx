import type { CSSProperties } from "react";

export type IconData = { viewBox: string; path: string };

export function Glyph({
  icon,
  className,
  size,
  style,
}: {
  icon: IconData | null | undefined;
  className?: string;
  size?: number;
  style?: CSSProperties;
}) {
  if (!icon) return null;
  return (
    <svg
      aria-hidden="true"
      viewBox={icon.viewBox}
      fill="currentColor"
      className={className}
      style={{ overflow: "visible", width: size, height: size, ...style }}
    >
      <path fill="currentColor" d={icon.path} />
    </svg>
  );
}
