

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { login } from "../actions"

export default async function LoginPage({
    searchParams,
}: {
    searchParams: Promise<{ message?: string; error?: string }>
}) {
    const params = await searchParams

    return (
        <div className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8 p-8 rounded-xl border border-border bg-card/50 backdrop-blur-sm shadow-2xl glow-green">
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-bold tracking-tight text-foreground text-glow">
                        Welcome back
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Sign in to your account
                    </p>
                </div>

                <form className="mt-8 space-y-6">
                    <div className="space-y-4 rounded-md shadow-sm">
                        <div>
                            <Label htmlFor="email-address">Email address</Label>
                            <Input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="mt-1 bg-background/50 border-input focus:ring-primary"
                                placeholder="name@example.com"
                            />
                        </div>
                        <div>
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="mt-1 bg-background/50 border-input focus:ring-primary"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    {params?.error && (
                        <div className="text-red-500 text-sm text-center">
                            {params.error}
                        </div>
                    )}

                    <div>
                        <Button
                            formAction={login}
                            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_20px_-5px_var(--color-primary)]"
                        >
                            Sign in
                        </Button>
                    </div>
                </form>

                <div className="text-center text-sm">
                    <span className="text-muted-foreground">Don't have an account? </span>
                    <Link
                        href="/auth/register"
                        className="font-medium text-primary hover:text-primary/80 transition-colors"
                    >
                        Sign up
                    </Link>
                </div>
            </div>
        </div>
    )
}
