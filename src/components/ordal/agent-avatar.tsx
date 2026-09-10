import { useId } from "react";

type Ring = "cream" | "charcoal";

/**
 * AgentAvatar — profile picture of the ORDAL Assist chat agent.
 *
 * A bespectacled man drawn as a solid silhouette (NOT a real photo)
 * in the site's flat sticker style:
 *   tile       orange   #F2661A
 *   silhouette cream    #F4F2EC
 *   glasses    charcoal #33363F — rectangular frames (not round),
 *               the only feature on the silhouette
 *
 * `ring` picks the outline color so the tile pops on both the dark
 * header (cream ring) and the light message area (charcoal ring).
 * Pure SVG: crisp at every size (24px bubbles up to 36px header).
 */
export function AgentAvatar({
  className,
  ring = "charcoal",
}: {
  className?: string;
  ring?: Ring;
}) {
  const raw = useId();
  const clipId = `ordal-avatar-clip-${raw.replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const ringColor = ring === "cream" ? "#F4F2EC" : "rgba(51, 54, 63, 0.35)";

  return (
    <svg
      viewBox="0 0 48 48"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <clipPath id={clipId}>
          <rect x="2" y="2" width="44" height="44" rx="10" />
        </clipPath>
      </defs>

      {/* tile background */}
      <rect
        x="2"
        y="2"
        width="44"
        height="44"
        rx="10"
        fill="#F2661A"
        stroke={ringColor}
        strokeWidth="2.6"
      />

      {/* bust — one solid cream silhouette, clipped to the tile */}
      <g clipPath={`url(#${clipId})`}>
        {/* neck */}
        <rect x="21.2" y="30" width="5.6" height="8" rx="1.8" fill="#F4F2EC" />
        {/* ears — part of the silhouette contour */}
        <circle cx="14.9" cy="22.4" r="2" fill="#F4F2EC" />
        <circle cx="33.1" cy="22.4" r="2" fill="#F4F2EC" />
        {/* head */}
        <ellipse cx="24" cy="21.3" rx="8.6" ry="9.6" fill="#F4F2EC" />
        {/* hair — same solid color, only the outer crown adds to the silhouette */}
        <path
          d="M15.4 21 C 14.7 13.2, 18.5 9.9, 24 9.9 C 29.5 9.9, 33.3 13.2, 32.6 21 C 31.4 18.4, 29.9 16.8, 28 16.2 Q 24 17.4, 20 16.2 C 18.1 16.8, 16.6 18.4, 15.4 21 Z"
          fill="#F4F2EC"
        />
        {/* shoulders / shirt */}
        <path
          d="M9.5 48 C 9.5 40.8, 15.5 36.2, 24 36.2 C 32.5 36.2, 38.5 40.8, 38.5 48 Z"
          fill="#F4F2EC"
        />
        {/* black rectangular glasses — the only feature on the silhouette */}
        <rect x="16.8" y="19.3" width="7" height="5.3" rx="1.2" fill="#33363F" />
        <rect x="24.2" y="19.3" width="7" height="5.3" rx="1.2" fill="#33363F" />
        {/* bridge */}
        <rect x="23.5" y="21" width="1" height="1.6" rx="0.5" fill="#33363F" />
      </g>
    </svg>
  );
}
