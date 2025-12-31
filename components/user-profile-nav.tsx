"use client"

import { useState, useRef, useEffect } from "react"
import { User, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { logout } from "@/app/auth/actions"

interface UserProfileNavProps {
    email: string | undefined
}

export function UserProfileNav({ email }: UserProfileNavProps) {
    const [isOpen, setIsOpen] = useState(false)
    const menuRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
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
                size="icon"
                className="rounded-full bg-gradient-to-br from-emerald-400/20 to-emerald-600/20 border border-emerald-500/50 hover:bg-emerald-500/30 w-9 h-9 mr-4 shadow-[0_0_10px_-3px_rgba(16,185,129,0.3)] hover:shadow-[0_0_15px_rgba(16,185,129,0.5)] transition-all duration-300"
                onClick={() => setIsOpen(!isOpen)}
            >
                <User className="h-4 w-4 text-emerald-400" />
            </Button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-60 rounded-xl border border-border/50 bg-card/95 backdrop-blur-xl shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                    <div className="px-4 py-3 border-b border-border/50 bg-muted/20">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Account</p>
                        <p className="text-sm font-medium text-foreground truncate">{email}</p>
                    </div>
                    <div className="p-1">
                        <form action={logout}>
                            <button
                                type="submit"
                                className="flex w-full items-center px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-lg transition-colors text-left group"
                            >
                                <LogOut className="mr-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                Sign out
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
