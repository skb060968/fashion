'use client'

import { useEffect } from "react"

export default function ClientGuards() {
  useEffect(() => {
    const disableContextMenu = (e: MouseEvent) => e.preventDefault()

    let pressTimer: NodeJS.Timeout

    const handleTouchStart = (e: TouchEvent) => {
      // start a timer when touch begins
      pressTimer = setTimeout(() => {
        e.preventDefault()
      }, 500) // 500ms threshold for long press
    }

    const handleTouchEnd = () => {
      clearTimeout(pressTimer)
    }

    document.addEventListener("contextmenu", disableContextMenu)
    document.addEventListener("touchstart", handleTouchStart)
    document.addEventListener("touchend", handleTouchEnd)

    return () => {
      document.removeEventListener("contextmenu", disableContextMenu)
      document.removeEventListener("touchstart", handleTouchStart)
      document.removeEventListener("touchend", handleTouchEnd)
    }
  }, [])

  return null
}