"use client"

import { useEffect, useRef, ReactNode, useState } from "react"

interface RevealWrapperProps {
  children: ReactNode
  className?: string
  index?: number
}

export default function RevealWrapper({
  children,
  className = "",
  index = 0,
}: RevealWrapperProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
      },
      { threshold: 0.3 } // adjust sensitivity
    )

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`${isVisible ? "elevated" : ""} ${className}`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      {children}
    </div>
  )
}