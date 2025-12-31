import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function DebugAuthPage() {
    const supabase = await createClient()

    const { data: { user }, error } = await supabase.auth.getUser()

    // Get all users (admin only, won't work with anon key but let's try)
    const { data: session } = await supabase.auth.getSession()

    return (
        <div className="container mx-auto p-8 max-w-3xl">
            <h1 className="text-3xl font-bold mb-8">🔍 Auth Debug Info</h1>

            <div className="space-y-6">
                {/* Current User */}
                <div className="p-6 rounded-lg border border-border bg-card">
                    <h2 className="text-xl font-semibold mb-4">Current User</h2>
                    {user ? (
                        <div className="space-y-2 font-mono text-sm">
                            <div>✅ Logged in as: <span className="text-green-400">{user.email}</span></div>
                            <div>User ID: {user.id}</div>
                            <div>Email Confirmed: {user.email_confirmed_at ? '✅ Yes' : '❌ No'}</div>
                            <div>Created: {new Date(user.created_at!).toLocaleString()}</div>
                        </div>
                    ) : (
                        <div className="text-red-400">❌ Not logged in</div>
                    )}
                </div>

                {/* Session Info */}
                <div className="p-6 rounded-lg border border-border bg-card">
                    <h2 className="text-xl font-semibold mb-4">Session</h2>
                    {session?.session ? (
                        <div className="space-y-2 font-mono text-sm">
                            <div>✅ Active session</div>
                            <div>Expires: {new Date(session.session.expires_at! * 1000).toLocaleString()}</div>
                        </div>
                    ) : (
                        <div className="text-red-400">❌ No active session</div>
                    )}
                </div>

                {/* Error Info */}
                {error && (
                    <div className="p-6 rounded-lg border border-red-500/50 bg-red-500/10">
                        <h2 className="text-xl font-semibold mb-4 text-red-400">Error</h2>
                        <pre className="text-sm overflow-auto">{JSON.stringify(error, null, 2)}</pre>
                    </div>
                )}

                {/* Actions */}
                <div className="p-6 rounded-lg border border-border bg-card">
                    <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
                    <div className="flex gap-4">
                        {user ? (
                            <>
                                <a href="/app" className="px-4 py-2 rounded bg-primary text-primary-foreground">
                                    Go to App
                                </a>
                                <form action="/api/auth/logout" method="post">
                                    <button className="px-4 py-2 rounded border border-border hover:bg-muted">
                                        Logout
                                    </button>
                                </form>
                            </>
                        ) : (
                            <>
                                <a href="/auth/login" className="px-4 py-2 rounded bg-primary text-primary-foreground">
                                    Login
                                </a>
                                <a href="/auth/register" className="px-4 py-2 rounded border border-border hover:bg-muted">
                                    Sign Up
                                </a>
                            </>
                        )}
                    </div>
                </div>

                {/* Instructions */}
                <div className="p-6 rounded-lg border border-yellow-500/50 bg-yellow-500/10">
                    <h2 className="text-xl font-semibold mb-4 text-yellow-400">Troubleshooting</h2>
                    <div className="space-y-2 text-sm">
                        <p><strong>If you clicked the email link but still can't log in:</strong></p>
                        <ol className="list-decimal list-inside space-y-1 ml-4">
                            <li>Check if you're already logged in (see "Current User" above)</li>
                            <li>If logged in, go to <a href="/app" className="text-primary underline">/app</a></li>
                            <li>If not logged in, try the login form again</li>
                            <li>Make sure you're using the exact same email and password</li>
                            <li>Check Supabase Dashboard → Authentication → Users to see if your account exists</li>
                        </ol>
                    </div>
                </div>
            </div>
        </div>
    )
}
