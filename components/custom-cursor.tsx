"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

export function CustomCursor() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const updateMousePosition = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY })
            if (!isVisible) setIsVisible(true)
        }

        const handleMouseLeave = () => setIsVisible(false)
        const handleMouseEnter = () => setIsVisible(true)

        window.addEventListener("mousemove", updateMousePosition)
        document.body.addEventListener("mouseleave", handleMouseLeave)
        document.body.addEventListener("mouseenter", handleMouseEnter)

        return () => {
            window.removeEventListener("mousemove", updateMousePosition)
            document.body.removeEventListener("mouseleave", handleMouseLeave)
            document.body.removeEventListener("mouseenter", handleMouseEnter)
        }
    }, [isVisible])



    return (
        <motion.div
            className="fixed top-0 left-0 w-6 h-6 rounded-full border-2 border-primary pointer-events-none z-[9999] hidden md:flex items-center justify-center mix-blend-difference"
            animate={{
                x: mousePosition.x - 12,
                y: mousePosition.y - 12,
                scale: isVisible ? 1 : 0,
                opacity: isVisible ? 1 : 0,
            }}
            transition={{
                type: "spring",
                stiffness: 1000,
                damping: 50,
                mass: 0.1,
            }}
        >
            <div className="w-1 h-1 bg-primary rounded-full" />
        </motion.div>
    )
}
