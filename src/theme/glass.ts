import { colors } from "./colors";

export const glass = {
  webFilter: "url(#menuai-liquid-refraction) blur(12px) saturate(150%)",
  lightAngle: "24deg",
  refraction: {
    boundsStart: "-20%",
    boundsSize: "140%",
    frequency: "0.012 0.025",
    octaves: 1,
    seed: 4,
    blur: 4,
    scale: 8,
  },
  primarySheen:
    "linear-gradient(145deg, rgba(255,255,255,0.12), rgba(255,255,255,0.02) 65%, rgba(255,255,255,0.08))",
  sheen:
    "linear-gradient(145deg, rgba(255,255,255,0.42), rgba(255,255,255,0.04) 48%, rgba(255,255,255,0.16))",
  blur: "blur(24px) saturate(160%)",
  backdrop: [colors.backdropTop, colors.backdropMiddle, colors.backdropBottom] as const,
  highlight: [colors.clear, colors.backdropLight, colors.clear] as const,
  shadow: [{ offsetX: 0, offsetY: 8, blurRadius: 24, color: colors.shadow }],
};
