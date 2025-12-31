import { createClient } from "@/lib/supabase/server"

export const dynamic = 'force-dynamic'

export default async function DebugDBPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return <div>Please log in to run diagnostics.</div>
    }

    // Test 1: Create a test conversation
    const { data: conv, error: convError } = await supabase
        .from('conversations')
        .insert({ user_id: user.id })
        .select()
        .single()

    // Test 2: Add a message
    let msgError = null
    let msgData = null
    if (conv) {
        const result = await supabase
            .from('messages')
            .insert({
                conversation_id: conv.id,
                role: 'user',
                text: 'Test message from debug page'
            })
            .select()

        msgData = result.data
        msgError = result.error
    }

    // Test 3: Read it back
    const { data: readBack, error: readError } = await supabase
        .from('conversations')
        .select('*, messages(*)')
        .eq('id', conv?.id)
        .single()

    return (
        <div className="p-8 max-w-2xl mx-auto space-y-6 font-mono text-sm">
            <h1 className="text-2xl font-bold mb-4">Database Diagnostics</h1>

            <div className="p-4 border rounded bg-card">
                <h2 className="font-bold text-lg mb-2">1. User Info</h2>
                <div>User ID: {user.id}</div>
            </div>

            <div className="p-4 border rounded bg-card">
                <h2 className="font-bold text-lg mb-2">2. Create Conversation</h2>
                {convError ? (
                    <div className="text-red-500">❌ Error: {convError.message}</div>
                ) : (
                    <div className="text-green-500">✅ Success: ID {conv?.id}</div>
                )}
            </div>

            <div className="p-4 border rounded bg-card">
                <h2 className="font-bold text-lg mb-2">3. Create Message</h2>
                {msgError ? (
                    <div className="text-red-500">❌ Error: {msgError.message}</div>
                ) : (
                    <div className="text-green-500">✅ Success: {msgData?.length} message added</div>
                )}
            </div>

            <div className="p-4 border rounded bg-card">
                <h2 className="font-bold text-lg mb-2">4. Read Back (The Real Test)</h2>
                {readError ? (
                    <div className="text-red-500">❌ Error: {readError.message}</div>
                ) : (
                    <div>
                        <div className="text-green-500">✅ Conversation Found</div>
                        <div className="mt-2">
                            Messages found: {readBack?.messages?.length || 0}
                        </div>
                        {readBack?.messages?.length === 0 && (
                            <div className="text-yellow-500 mt-2">
                                ⚠️ WARNING: Conversation found but messages are empty!
                                This usually means RLS policy for 'messages' table is blocking SELECT.
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
