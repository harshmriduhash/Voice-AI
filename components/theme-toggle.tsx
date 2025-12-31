"use client"

import * as React from "react"
import { Moon, Sun, Laptop, Palette } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"

export function ThemeToggle() {
    const { setTheme, theme } = useTheme()
    const [isOpen, setIsOpen] = React.useState(false)
    const menuRef = React.useRef<HTMLDivElement>(null)

    React.useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    return (
        <div className="relative" ref={menuRef}>
            <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-2 px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors rounded-lg border border-transparent hover:border-border/50"
                onClick={() => setIsOpen(!isOpen)}
            >
                <Palette className="h-4 w-4" />
                <span className="text-sm font-medium">Theme Mode</span>
            </Button>

            {isOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 rounded-xl border border-border/50 bg-card/95 backdrop-blur-xl shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200 p-1">
                    <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                        Select Theme
                    </div>
                    <button
                        onClick={() => { setTheme("light"); setIsOpen(false) }}
                        className={`flex w-full items-center px-3 py-2 text-sm rounded-lg transition-colors text-left gap-3 ${theme === 'light' ? 'bg-primary/10 text-primary' : 'text-foreground hover:bg-muted/50'}`}
                    >
                        <Sun className="h-4 w-4" />
                        Light
                    </button>
                    <button
                        onClick={() => { setTheme("dark"); setIsOpen(false) }}
                        className={`flex w-full items-center px-3 py-2 text-sm rounded-lg transition-colors text-left gap-3 ${theme === 'dark' ? 'bg-primary/10 text-primary' : 'text-foreground hover:bg-muted/50'}`}
                    >
                        <Moon className="h-4 w-4" />
                        Dark
                    </button>
                    <button
                        onClick={() => { setTheme("system"); setIsOpen(false) }}
                        className={`flex w-full items-center px-3 py-2 text-sm rounded-lg transition-colors text-left gap-3 ${theme === 'system' ? 'bg-primary/10 text-primary' : 'text-foreground hover:bg-muted/50'}`}
                    >
                        <Laptop className="h-4 w-4" />
                        System
                    </button>
                </div>
            )}
        </div>
    )
}
