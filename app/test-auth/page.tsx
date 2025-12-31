import { createClient } from "@/lib/supabase/server"

export default async function TestAuthPage() {
    const supabase = await createClient()

    let results = {
        envVars: {
            url: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
            key: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        },
        connection: "Not tested",
        profilesTable: "Not tested",
        authEnabled: "Not tested",
        error: null as string | null,
    }

    try {
        // Test 1: Basic connection
        const { data: testData, error: testError } = await supabase
            .from('profiles')
            .select('count')
            .limit(0)

        if (testError) {
            if (testError.message.includes('relation "public.profiles" does not exist')) {
                results.profilesTable = "❌ Table doesn't exist - Run supabase_schema.sql"
                results.connection = "✅ Connected"
            } else {
                results.error = testError.message
                results.connection = "❌ Error"
            }
        } else {
            results.connection = "✅ Connected"
            results.profilesTable = "✅ Table exists"
        }

        // Test 2: Check auth
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        results.authEnabled = authError ? "❌ Auth error" : "✅ Auth working"

    } catch (err: any) {
        results.error = err.message
    }

    return (
        <div className="container mx-auto p-8 max-w-3xl">
            <h1 className="text-3xl font-bold mb-8">🔍 Auth Setup Test</h1>

            <div className="space-y-6">
                {/* Environment Variables */}
                <div className="p-6 rounded-lg border border-border bg-card">
                    <h2 className="text-xl font-semibold mb-4">1. Environment Variables</h2>
                    <div className="space-y-2 font-mono text-sm">
                        <div className="flex items-center gap-2">
                            <span className={results.envVars.url ? "text-green-500" : "text-red-500"}>
                                {results.envVars.url ? "✅" : "❌"}
                            </span>
                            <span>NEXT_PUBLIC_SUPABASE_URL</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className={results.envVars.key ? "text-green-500" : "text-red-500"}>
                                {results.envVars.key ? "✅" : "❌"}
                            </span>
                            <span>NEXT_PUBLIC_SUPABASE_ANON_KEY</span>
                        </div>
                    </div>
                </div>

                {/* Connection Test */}
                <div className="p-6 rounded-lg border border-border bg-card">
                    <h2 className="text-xl font-semibold mb-4">2. Database Connection</h2>
                    <div className="text-lg mb-2">{results.connection}</div>
                    {results.error && (
                        <div className="mt-2 p-3 rounded bg-red-500/10 border border-red-500/50">
                            <p className="text-sm text-red-400 font-mono">{results.error}</p>
                        </div>
                    )}
                </div>

                {/* Profiles Table */}
                <div className="p-6 rounded-lg border border-border bg-card">
                    <h2 className="text-xl font-semibold mb-4">3. Profiles Table</h2>
                    <div className="text-lg">{results.profilesTable}</div>
                    {results.profilesTable.includes("doesn't exist") && (
                        <div className="mt-4 p-4 rounded bg-yellow-500/10 border border-yellow-500/50">
                            <p className="text-sm text-yellow-400 font-semibold mb-2">Action Required:</p>
                            <ol className="list-decimal list-inside space-y-1 text-sm">
                                <li>Open Supabase Dashboard → SQL Editor</li>
                                <li>Copy contents of <code className="bg-muted px-1 rounded">supabase_schema.sql</code></li>
                                <li>Paste and run in SQL Editor</li>
                                <li>Refresh this page</li>
                            </ol>
                        </div>
                    )}
                </div>

                {/* Auth Status */}
                <div className="p-6 rounded-lg border border-border bg-card">
                    <h2 className="text-xl font-semibold mb-4">4. Authentication</h2>
                    <div className="text-lg">{results.authEnabled}</div>
                </div>

                {/* Next Steps */}
                <div className="p-6 rounded-lg border border-primary/50 bg-primary/5">
                    <h2 className="text-xl font-semibold mb-4">📝 Next Steps</h2>
                    {results.profilesTable.includes("✅") ? (
                        <div className="space-y-2 text-sm">
                            <p className="text-green-400 font-semibold">✅ Everything looks good!</p>
                            <p>Try signing up at <a href="/auth/register" className="text-primary underline">/auth/register</a></p>
                        </div>
                    ) : (
                        <div className="space-y-2 text-sm">
                            <p className="text-yellow-400 font-semibold">⚠️ Setup incomplete</p>
                            <p>Follow the instructions above to complete setup</p>
                        </div>
                    )}
                </div>

                {/* Quick Links */}
                <div className="flex gap-4">
                    <a href="/auth/register" className="px-4 py-2 rounded bg-primary text-primary-foreground hover:bg-primary/90">
                        Try Sign Up
                    </a>
                    <a href="/auth/login" className="px-4 py-2 rounded border border-border hover:bg-muted">
                        Try Login
                    </a>
                    <a href="/" className="px-4 py-2 rounded border border-border hover:bg-muted">
                        Home
                    </a>
                </div>
            </div>
        </div>
    )
}
