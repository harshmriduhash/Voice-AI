import { Orb } from "@/components/orb"
import { Button } from "@/components/ui/button"
import { Mic, MessageSquare, Clock } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { ConversationDate } from "@/components/conversation-date"

export const dynamic = 'force-dynamic'

export default async function AppDashboard() {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return redirect("/auth/login")
    }

    const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single()

    // Fetch recent conversations with their latest messages
    const { data: conversations } = await supabase
        .from("conversations")
        .select(`
            *,
            messages (
                text,
                role,
                created_at
            )
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(20) // Increased limit to show more history

    return (
        <div className="flex h-[calc(100vh-3.5rem)] overflow-hidden">
            {/* Sidebar History */}
            <aside className="w-80 border-r border-border bg-card/30 hidden md:flex flex-col">
                <div className="p-4 border-b border-border">
                    <h3 className="font-semibold flex items-center">
                        <Clock className="mr-2 h-4 w-4" /> History
                    </h3>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-6">
                    {conversations?.map((conv, index) => {
                        // Sort messages by time (oldest first for reading flow)
                        const sortedMessages = conv.messages?.sort((a: any, b: any) =>
                            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
                        ) || []

                        // Check if we should show the date header
                        // Show if it's the first item OR if the date is different from the previous item
                        const currentDate = new Date(conv.created_at).toLocaleDateString();
                        const prevDate = index > 0 ? new Date(conversations[index - 1].created_at).toLocaleDateString() : null;
                        const showDateHeader = index === 0 || currentDate !== prevDate;

                        return (
                            <div key={conv.id} className="space-y-2">
                                {showDateHeader && (
                                    <div className="sticky top-0 bg-card/95 backdrop-blur z-10 py-2 border-b border-border/50">
                                        <ConversationDate date={conv.created_at} />
                                    </div>
                                )}

                                <div className="space-y-3 pl-2">
                                    {sortedMessages.map((msg: any, i: number) => (
                                        <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                                            <div className={`max-w-[90%] rounded-lg px-3 py-2 text-sm ${msg.role === 'user'
                                                ? 'bg-primary/10 text-emerald-50 border border-primary/30 rounded-tr-none shadow-[0_0_15px_-5px_rgba(16,185,129,0.2)]'
                                                : 'bg-muted/50 text-foreground border border-border/50 rounded-tl-none'
                                                }`}>
                                                <span className="text-xs opacity-50 block mb-1 uppercase tracking-wider">
                                                    {msg.role === 'user' ? 'You' : 'AI'}
                                                </span>
                                                {msg.text}
                                            </div>
                                        </div>
                                    ))}
                                    {sortedMessages.length === 0 && (
                                        <div className="text-xs text-muted-foreground italic">No messages yet</div>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                    {(!conversations || conversations.length === 0) && (
                        <div className="text-center text-muted-foreground text-sm py-8">
                            No conversations yet.
                        </div>
                    )}
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col items-center justify-center relative overflow-hidden">
                {/* Background ambient glow */}
                <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />

                <div className="z-10 flex flex-col items-center space-y-12 w-full max-w-3xl px-4">
                    <div className="text-center space-y-2">
                        <h2 className="text-2xl font-semibold tracking-tight">Voice Agent Active</h2>
                        <p className="text-muted-foreground">Click the orb to start speaking</p>
                    </div>

                    <div className="py-8">
                        <Orb />
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="px-4 py-2 rounded-full bg-muted/50 border border-border text-sm text-muted-foreground">
                            Status: <span className="text-green-400 font-medium capitalize">{profile?.subscription_status || 'Free'}</span>
                        </div>
                        <div className="px-4 py-2 rounded-full bg-muted/50 border border-border text-sm text-muted-foreground">
                            Credits: <span className="text-gradient-premium font-medium">{profile?.credits_remaining || 0}</span>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
