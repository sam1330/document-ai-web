"use client"

import React, { useLayoutEffect, useRef, useState } from 'react'
import { useResumeStore } from '@/lib/store/useResumeStore'
import { ClassicTheme } from './ClassicTheme'
import { ModernTheme } from './ModernTheme'
import { EngineeringTheme } from './EngineeringTheme'
import { MinimalTheme } from './MinimalTheme'
import { CreativeTheme } from './CreativeTheme'

export function ResumePreview() {
  const data = useResumeStore((state) => state.data)
  const containerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(0.8)

  useLayoutEffect(() => {
    const calculateScale = () => {
      if (!containerRef.current) return
      const containerWidth = containerRef.current.clientWidth
      const containerHeight = containerRef.current.clientHeight

      // A4 dimensions in pixels (approximate at 96 DPI)
      const a4WidthPxl = 793.7
      const padding = 32 // Reduced padding for better space utilization

      const availableWidth = containerWidth - padding
      const newScale = availableWidth / a4WidthPxl

      // Allow slightly larger scale for smaller resolutions
      setScale(Math.min(newScale, 1.1))
    }

    // Initial calculation
    calculateScale()

    // Observe container size changes
    const observer = new ResizeObserver(calculateScale)
    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={containerRef}
      className="w-full h-full bg-slate-200/30 flex justify-center py-12 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-slate-300"
    >
      <div
        className="origin-top shadow-2xl transition-transform duration-300 ease-in-out"
        style={{
          transform: `scale(${scale})`,
          minWidth: "210mm" // Ensure it doesn't shrink the component itself, just the scale
        }}
      >
        {data.design.theme === 'modern' ? <ModernTheme data={data} /> :
         data.design.theme === 'engineering' ? <EngineeringTheme data={data} /> :
         data.design.theme === 'minimal' ? <MinimalTheme data={data} /> :
         data.design.theme === 'creative' ? <CreativeTheme data={data} /> :
         <ClassicTheme data={data} />}
      </div>
    </div>
  )
}
