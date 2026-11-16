import { glass } from "@/theme";

export function GlassRefraction() {
  return (
    <svg width={0} height={0} aria-hidden>
      <defs>
        <filter
          id="menuai-liquid-refraction"
          x={glass.refraction.boundsStart}
          y={glass.refraction.boundsStart}
          width={glass.refraction.boundsSize}
          height={glass.refraction.boundsSize}
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency={glass.refraction.frequency}
            numOctaves={glass.refraction.octaves}
            seed={glass.refraction.seed}
            result="texture"
          />
          <feGaussianBlur in="texture" stdDeviation={glass.refraction.blur} result="soft-texture" />
          <feDisplacementMap
            in="SourceGraphic"
            in2="soft-texture"
            scale={glass.refraction.scale}
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
    </svg>
  );
}
