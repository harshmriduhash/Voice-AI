"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Users, MessageSquare, Database, Ticket } from "lucide-react"
import { getAdminStats, createCoupon, deleteUser } from "./actions"
import { useUser } from "@clerk/nextjs"
import { ADMIN_CONFIG } from "./config"

export default function AdminDashboard() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(true)
    const [stats, setStats] = useState<any>(null)
    const [couponCode, setCouponCode] = useState("")
    const [bonusCredits, setBonusCredits] = useState(5000)
    const [maxRedemptions, setMaxRedemptions] = useState(10)
    const [isCreating, setIsCreating] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

    const { user, isLoaded } = useUser()

    useEffect(() => {
        if (!isLoaded) return

        const email = user?.emailAddresses[0]?.emailAddress
        if (!user || !email || !ADMIN_CONFIG.allowedEmails.includes(email)) {
            router.push("/app")
            return
        }

        const fetchStats = async () => {
            try {
                const data = await getAdminStats()
                setStats(data)
            } catch (error) {
                console.error("Failed to load stats", error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchStats()
    }, [user, isLoaded, router])

    const handleCreateCoupon = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsCreating(true)
        setMessage(null)

        try {
            await createCoupon(couponCode, bonusCredits, maxRedemptions)
            setMessage({ type: 'success', text: `Coupon ${couponCode} created!` })
            setCouponCode("")
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message })
        } finally {
            setIsCreating(false)
        }
    }

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="container py-10 space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
                <Button variant="outline" onClick={() => router.push("/app")}>Back to App</Button>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-6 md:grid-cols-3">
                <Card className="hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 hover:border-primary/30">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-primary">{stats?.userCount}</div>
                        <p className="text-xs text-muted-foreground mt-1">Registered accounts</p>
                    </CardContent>
                </Card>
                <Card className="hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 hover:border-primary/30">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Conversations</CardTitle>
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-primary">{stats?.conversationCount}</div>
                        <p className="text-xs text-muted-foreground mt-1">Total conversations</p>
                    </CardContent>
                </Card>
                <Card className="hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 hover:border-primary/30">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
                        <Database className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-primary">{stats?.messageCount}</div>
                        <p className="text-xs text-muted-foreground mt-1">Messages exchanged</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                {/* Create Coupon Form */}
                <Card className="hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 hover:border-primary/30">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Ticket className="h-5 w-5 text-primary" /> Create Coupon
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleCreateCoupon} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="code">Coupon Code</Label>
                                <Input
                                    id="code"
                                    placeholder="e.g. PRO_USER_2025"
                                    value={couponCode}
                                    onChange={(e) => setCouponCode(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="credits">Bonus Credits</Label>
                                    <Input
                                        id="credits"
                                        type="number"
                                        value={bonusCredits}
                                        onChange={(e) => setBonusCredits(Number(e.target.value))}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="max">Max Uses</Label>
                                    <Input
                                        id="max"
                                        type="number"
                                        value={maxRedemptions}
                                        onChange={(e) => setMaxRedemptions(Number(e.target.value))}
                                        required
                                    />
                                </div>
                            </div>
                            <Button type="submit" className="w-full" disabled={isCreating}>
                                {isCreating ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create Coupon"}
                            </Button>
                            {message && (
                                <p className={`text-sm text-center ${message.type === 'success' ? 'text-green-500' : 'text-red-500'}`}>
                                    {message.text}
                                </p>
                            )}
                        </form>
                    </CardContent>
                </Card>

                {/* Recent Users */}
                <Card className="hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 hover:border-primary/30">
                    <CardHeader>
                        <CardTitle>Recent Users</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {stats?.recentUsers.map((user: any) => (
                                <div key={user.id} className="flex items-center justify-between border-b border-border/50 pb-3 last:border-0 hover:bg-muted/30 transition-colors rounded px-2 -mx-2">
                                    <div>
                                        <p className="font-medium text-sm">{user.email}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="text-right flex items-center gap-4">
                                        <div>
                                            <span className={`text-xs px-2 py-1 rounded-full ${user.subscriptionStatus === 'pro'
                                                ? 'bg-primary/20 text-primary'
                                                : 'bg-muted text-muted-foreground'
                                                }`}>
                                                {user.subscriptionStatus || 'free'}
                                            </span>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                {user.creditsRemaining} credits
                                            </p>
                                        </div>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={async () => {
                                                if (confirm("Are you sure you want to delete this user?")) {
                                                    try {
                                                        await deleteUser(user.id)
                                                        // Refresh stats
                                                        const data = await getAdminStats()
                                                        setStats(data)
                                                    } catch (error) {
                                                        alert("Failed to delete user")
                                                    }
                                                }
                                            }}
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
