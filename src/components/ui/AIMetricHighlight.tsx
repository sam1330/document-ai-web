'use client'

import { useState } from 'react'
import { ShieldExclamationIcon } from '@heroicons/react/24/outline'

// Regex catches: 20%, 3x, $1.5M, 50+ users, increased by 40%, reduced by 25%, etc.
const METRIC_REGEX =
  /(\$[\d,]+(?:\.\d+)?(?:[KMB])?|\b\d+(?:\.\d+)?(?:%|x|\+)|\b(?:increased?|reduced?|improved?|saved?|generated?|grew|cut|boosted?)\s+(?:by\s+)?\d+(?:\.\d+)?(?:%|x)?(?:\s+[A-Za-z]+)*|\b\d+(?:,\d+)*\+?\s+(?:users?|customers?|clients?|leads?|sales?|revenue|conversions?|visits?|sessions?))/gi

interface HighlightedSegment {
  text: string
  isMetric: boolean
}

function parseSegments(text: string): HighlightedSegment[] {
  const segments: HighlightedSegment[] = []
  let lastIndex = 0
  let match: RegExpExecArray | null

  METRIC_REGEX.lastIndex = 0
  while ((match = METRIC_REGEX.exec(text)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ text: text.slice(lastIndex, match.index), isMetric: false })
    }
    segments.push({ text: match[0], isMetric: true })
    lastIndex = match.index + match[0].length
  }
  if (lastIndex < text.length) {
    segments.push({ text: text.slice(lastIndex), isMetric: false })
  }
  return segments
}

function MetricSpan({ text }: { text: string }) {
  const [showTip, setShowTip] = useState(false)

  return (
    <span className="relative inline">
      <mark
        className="bg-amber-100 text-amber-900 rounded px-0.5 cursor-help not-italic font-medium"
        onMouseEnter={() => setShowTip(true)}
        onMouseLeave={() => setShowTip(false)}
        onFocus={() => setShowTip(true)}
        onBlur={() => setShowTip(false)}
        tabIndex={0}
        aria-describedby="ai-metric-tooltip"
      >
        {text}
      </mark>
      {showTip && (
        <span
          id="ai-metric-tooltip"
          role="tooltip"
          className="
            absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50
            w-64 px-3 py-2 bg-slate-900 text-white text-xs rounded-xl
            shadow-xl leading-relaxed pointer-events-none
            before:content-[''] before:absolute before:top-full before:left-1/2 before:-translate-x-1/2
            before:border-4 before:border-transparent before:border-t-slate-900
          "
        >
          <span className="flex items-start gap-1.5">
            <ShieldExclamationIcon className="h-3.5 w-3.5 flex-shrink-0 mt-0.5 text-amber-400" />
            AI-suggested metric. Please verify this matches your actual achievement before exporting.
          </span>
        </span>
      )}
    </span>
  )
}

interface AIMetricHighlightProps {
  text?: string | null
  className?: string
}

export default function AIMetricHighlight({ text, className }: AIMetricHighlightProps) {
  if (!text) return null

  const segments = parseSegments(text)

  return (
    <span className={className}>
      {segments.map((seg, i) =>
        seg.isMetric ? (
          <MetricSpan key={i} text={seg.text} />
        ) : (
          <span key={i}>{seg.text}</span>
        )
      )}
    </span>
  )
}
