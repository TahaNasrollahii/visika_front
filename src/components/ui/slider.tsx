"use client"

import React, { useRef, useCallback, useEffect, useState } from "react"

interface SliderProps {
  min: number
  max: number
  step?: number
  value: [number, number]
  onValueChange?: (value: [number, number]) => void
  onValueCommit?: (value: [number, number]) => void
  className?: string
}

export function Slider({
  min,
  max,
  step = 1,
  value,
  onValueChange,
  onValueCommit,
  className = "",
}: SliderProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const latestValue = useRef<[number, number]>(value)
  const dragging = useRef<"min" | "max" | null>(null)
  const [localValue, setLocalValue] = useState<[number, number]>(value)

  // Sync external value when it changes
  useEffect(() => {
    setLocalValue(value)
    latestValue.current = value
  }, [value[0], value[1]])

  const clamp = (v: number) => Math.min(max, Math.max(min, v))

  const snapToStep = (v: number) => {
    const snapped = Math.round((v - min) / step) * step + min
    return clamp(snapped)
  }

  const posToValue = useCallback(
    (clientX: number): number => {
      const track = trackRef.current
      if (!track) return min
      const rect = track.getBoundingClientRect()
      // RTL: right side = min, left side = max (we flip ratio)
      const ratio = 1 - (clientX - rect.left) / rect.width
      return snapToStep(ratio * (max - min) + min)
    },
    [min, max, step]
  )

  const pct = (v: number) => ((v - min) / (max - min)) * 100

  const onPointerDown = (e: React.PointerEvent, thumb: "min" | "max") => {
    e.preventDefault()
    dragging.current = thumb
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  }

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging.current) return
      const newVal = posToValue(e.clientX)
      // Read current value from ref (not state) to avoid stale closures
      let [lo, hi] = latestValue.current
      if (dragging.current === "min") {
        lo = Math.min(newVal, hi)
      } else {
        hi = Math.max(newVal, lo)
      }
      const next: [number, number] = [lo, hi]
      latestValue.current = next
      // Update state and notify parent OUTSIDE the updater to avoid "setState in render"
      setLocalValue(next)
      onValueChange?.(next)
    },
    [posToValue, onValueChange]
  )

  const onPointerUp = useCallback(
    (_e: React.PointerEvent) => {
      if (!dragging.current) return
      dragging.current = null
      onValueCommit?.(latestValue.current)
    },
    [onValueCommit]
  )

  const [lo, hi] = localValue

  // RTL: right side = min, left side = max
  const barRight = pct(lo)        // % from the right edge to start of active bar
  const barWidth = pct(hi) - pct(lo) // active bar width

  return (
    /* py-2 gives enough room so the 20px thumbs aren't clipped by parent overflow-hidden */
    <div
      className={`relative select-none py-2 ${className}`}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    >
      {/* Track + thumbs share this positioning context */}
      <div className="relative flex items-center h-1.5">
        {/* Track background */}
        <div ref={trackRef} className="relative w-full h-full rounded-full bg-secondary">
          {/* Active bar */}
          <div
            className="absolute top-0 h-full rounded-full bg-primary"
            style={{ right: `${barRight}%`, width: `${barWidth}%` }}
          />
        </div>

        {/* Min thumb (right side in RTL) */}
        <div
          className="absolute w-5 h-5 rounded-full bg-white border-2 border-primary shadow-md shadow-primary/20 cursor-grab active:cursor-grabbing transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary/30 -translate-y-0"
          style={{ right: `calc(${pct(lo)}% - 10px)`, top: "50%", transform: "translateY(-50%)" }}
          onPointerDown={(e) => onPointerDown(e, "min")}
          role="slider"
          aria-valuemin={min}
          aria-valuemax={hi}
          aria-valuenow={lo}
          tabIndex={0}
          onKeyDown={(e) => {
            let newLo = lo
            if (e.key === "ArrowRight") newLo = snapToStep(lo + step)
            if (e.key === "ArrowLeft") newLo = snapToStep(lo - step)
            newLo = Math.min(newLo, hi)
            const next: [number, number] = [newLo, hi]
            setLocalValue(next)
            latestValue.current = next
            onValueChange?.(next)
            if (e.key === "ArrowRight" || e.key === "ArrowLeft") onValueCommit?.(next)
          }}
        />

        {/* Max thumb (left side in RTL) */}
        <div
          className="absolute w-5 h-5 rounded-full bg-white border-2 border-primary shadow-md shadow-primary/20 cursor-grab active:cursor-grabbing transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary/30"
          style={{ right: `calc(${pct(hi)}% - 10px)`, top: "50%", transform: "translateY(-50%)" }}
          onPointerDown={(e) => onPointerDown(e, "max")}
          role="slider"
          aria-valuemin={lo}
          aria-valuemax={max}
          aria-valuenow={hi}
          tabIndex={0}
          onKeyDown={(e) => {
            let newHi = hi
            if (e.key === "ArrowRight") newHi = snapToStep(hi + step)
            if (e.key === "ArrowLeft") newHi = snapToStep(hi - step)
            newHi = Math.max(newHi, lo)
            const next: [number, number] = [lo, newHi]
            setLocalValue(next)
            latestValue.current = next
            onValueChange?.(next)
            if (e.key === "ArrowRight" || e.key === "ArrowLeft") onValueCommit?.(next)
          }}
        />
      </div>
    </div>
  )
}
