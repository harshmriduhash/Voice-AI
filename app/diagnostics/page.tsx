import { createClient } from "@/lib/supabase/server"

export default async function DiagnosticsPage() {
    const supabase = await createClient()

    // Test connection
    let connectionStatus = "❌ Not Connected"
    let errorMessage = ""
    let envVarsSet = {
        url: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        key: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    }

    try {
        const { data, error } = await supabase.from('profiles').select('count').limit(1)
        if (error) {
            errorMessage = error.message
            connectionStatus = "❌ Connection Error"
        } else {
            connectionStatus = "✅ Connected Successfully"
        }
    } catch (err: any) {
        errorMessage = err.message
        connectionStatus = "❌ Connection Failed"
    }

    return (
        <div className="container mx-auto p-8 max-w-2xl">
            <h1 className="text-3xl font-bold mb-8">Supabase Diagnostics</h1>

            <div className="space-y-6">
                {/* Environment Variables */}
                <div className="p-6 rounded-lg border border-border bg-card">
                    <h2 className="text-xl font-semibold mb-4">Environment Variables</h2>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <span className={envVarsSet.url ? "text-green-500" : "text-red-500"}>
                                {envVarsSet.url ? "✅" : "❌"}
                            </span>
                            <span>NEXT_PUBLIC_SUPABASE_URL</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className={envVarsSet.key ? "text-green-500" : "text-red-500"}>
                                {envVarsSet.key ? "✅" : "❌"}
                            </span>
                            <span>NEXT_PUBLIC_SUPABASE_ANON_KEY</span>
                        </div>
                    </div>
                </div>

                {/* Connection Status */}
                <div className="p-6 rounded-lg border border-border bg-card">
                    <h2 className="text-xl font-semibold mb-4">Database Connection</h2>
                    <div className="text-lg">{connectionStatus}</div>
                    {errorMessage && (
                        <div className="mt-4 p-4 rounded bg-red-500/10 border border-red-500/50">
                            <p className="text-sm text-red-400">Error: {errorMessage}</p>
                        </div>
                    )}
                </div>

                {/* Instructions */}
                <div className="p-6 rounded-lg border border-border bg-card">
                    <h2 className="text-xl font-semibold mb-4">Setup Instructions</h2>
                    <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                        <li>Create a Supabase project at <a href="https://database.new" target="_blank" className="text-primary underline">database.new</a></li>
                        <li>Run the SQL schemas in your Supabase SQL Editor</li>
                        <li>Create <code className="bg-muted px-1 rounded">.env.local</code> file with your credentials</li>
                        <li>Restart the dev server</li>
                        <li>Refresh this page to test connection</li>
                    </ol>
                </div>

                {/* Quick Actions */}
                <div className="p-6 rounded-lg border border-border bg-card">
                    <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
                    <div className="space-y-2">
                        <a href="/auth/register" className="block text-primary hover:underline">
                            → Go to Sign Up
                        </a>
                        <a href="/auth/login" className="block text-primary hover:underline">
                            → Go to Login
                        </a>
                        <a href="/" className="block text-primary hover:underline">
                            → Go to Home
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}
