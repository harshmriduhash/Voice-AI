import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Mic } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { logout } from "@/app/auth/actions"
import { UserProfileNav } from "@/components/user-profile-nav"
import { ThemeToggle } from "@/components/theme-toggle"

export async function Navbar() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 max-w-screen-2xl items-center">
                <div className="mr-6 flex">
                    <Link href="/" className="mr-8 flex items-center space-x-2">
                        <Mic className="h-7 w-7 text-emerald-500 drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                        <span className="hidden font-bold text-lg sm:inline-block">
                            VoiceAI
                        </span>
                    </Link>
                    <nav className="flex items-center space-x-8 text-base font-medium">
                        <Link
                            href="/app"
                            className="transition-colors hover:text-foreground/80 text-foreground/60"
                        >
                            App
                        </Link>
                        <Link
                            href="/pricing"
                            className="transition-colors hover:text-foreground/80 text-foreground/60"
                        >
                            Pricing
                        </Link>
                        <a
                            href="/#contact"
                            className="transition-colors hover:text-foreground/80 text-foreground/60"
                        >
                            Contact
                        </a>
                    </nav>
                </div>
                <div className="flex flex-1 items-center justify-end space-x-2">
                    <nav className="flex items-center space-x-4">
                        <ThemeToggle />
                        {user ? (
                            <UserProfileNav email={user.email} />
                        ) : (
                            <>
                                <Link href="/auth/login">
                                    <Button variant="ghost" size="sm">
                                        Login
                                    </Button>
                                </Link>
                                <Link href="/auth/register">
                                    <Button size="sm" variant="glow">
                                        Get Started
                                    </Button>
                                </Link>
                            </>
                        )}
                    </nav>
                </div>
            </div>
        </header>
    )
}
