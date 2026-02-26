import { SignInButton, SignUpButton, UserButton, SignedIn, SignedOut } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Mic } from "lucide-react"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"

export function Navbar() {

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
                        <SignedOut>
                            <SignInButton mode="modal">
                                <Button variant="ghost" size="sm">
                                    Login
                                </Button>
                            </SignInButton>
                            <SignUpButton mode="modal">
                                <Button size="sm" variant="glow">
                                    Get Started
                                </Button>
                            </SignUpButton>
                        </SignedOut>
                        <SignedIn>
                            <UserButton
                                appearance={{
                                    elements: {
                                        userButtonAvatarBox: "h-8 w-8"
                                    }
                                }}
                            />
                        </SignedIn>
                    </nav>
                </div>
            </div>
        </header>
    )
}
