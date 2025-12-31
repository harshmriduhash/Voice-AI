"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Check, Loader2 } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Footer } from "@/components/footer"

export default function PricingPage() {
    const router = useRouter()
    const [couponCode, setCouponCode] = useState("")
    const [isRedeeming, setIsRedeeming] = useState(false)
    const [redemptionMessage, setRedemptionMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

    const [isUpgrading, setIsUpgrading] = useState(false)

    const handleRedeemCoupon = async () => {
        if (!couponCode) return
        setIsRedeeming(true)
        setRedemptionMessage(null)

        try {
            const res = await fetch("/api/coupons/redeem", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code: couponCode }),
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || "Failed to redeem coupon")
            }

            setRedemptionMessage({ type: 'success', text: `Success! Added ${data.bonus_credits} credits.` })
            setCouponCode("")
            router.refresh()
        } catch (error: any) {
            setRedemptionMessage({ type: 'error', text: error.message })
        } finally {
            setIsRedeeming(false)
        }
    }

    const handleUpgrade = async () => {
        if (!confirm("This is a mock payment simulation. Proceed?")) return

        setIsUpgrading(true)
        try {
            const res = await fetch("/api/payment/mock", { method: "POST" })
            if (!res.ok) throw new Error("Payment failed")

            // alert("Payment successful! 5,000 credits added to your account.")
            // router.refresh()
            // router.push("/app")

            // Maintenance Mode Alert
            alert("Payment system is currently under maintenance. Please contact support to get a coupon for the Pro plan.")

        } catch (error) {
            alert("Payment failed. Please try again.")
        } finally {
            setIsUpgrading(false)
        }
    }

    return (
        <div className="flex flex-col min-h-screen">
            <div className="container px-4 md:px-6 py-24 space-y-12 flex-1">
                <div className="text-center space-y-4">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
                        Upgrade Your Plan
                    </h1>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Choose the plan that fits your needs. No hidden fees.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {/* Free Plan */}
                    <Card className="flex flex-col border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:shadow-[0_0_30px_-10px_rgba(255,255,255,0.1)] hover:border-primary/20">
                        <CardHeader>
                            <CardTitle>Free</CardTitle>
                            <CardDescription>Perfect for trying out the voice agent.</CardDescription>
                            <div className="mt-4">
                                <span className="text-4xl font-bold">$0</span>
                                <span className="text-muted-foreground">/month</span>
                            </div>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <ul className="space-y-2 text-sm">
                                <li className="flex items-center">
                                    <Check className="mr-2 h-4 w-4 text-primary" />
                                    300 credits / month
                                </li>
                                <li className="flex items-center">
                                    <Check className="mr-2 h-4 w-4 text-primary" />
                                    Standard voice models
                                </li>
                                <li className="flex items-center">
                                    <Check className="mr-2 h-4 w-4 text-primary" />
                                    Basic support
                                </li>
                            </ul>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full" variant="outline">Get Started</Button>
                        </CardFooter>
                    </Card>

                    {/* Pro Plan */}
                    <Card className="flex flex-col border-primary/50 bg-card/80 backdrop-blur-sm relative overflow-hidden transition-all duration-300 hover:shadow-[0_0_40px_-10px_var(--color-primary)] hover:scale-105">
                        <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-bl-lg">
                            POPULAR
                        </div>
                        <CardHeader>
                            <CardTitle>Pro</CardTitle>
                            <CardDescription>For power users who need more.</CardDescription>
                            <div className="mt-4">
                                <span className="text-4xl font-bold">$20</span>
                                <span className="text-muted-foreground">/month</span>
                            </div>
                        </CardHeader>
                        <CardContent className="flex-1 space-y-6">
                            <ul className="space-y-2 text-sm">
                                <li className="flex items-center">
                                    <Check className="mr-2 h-4 w-4 text-primary" />
                                    5,000 credits / month
                                </li>
                                <li className="flex items-center">
                                    <Check className="mr-2 h-4 w-4 text-primary" />
                                    Premium voice models
                                </li>
                                <li className="flex items-center">
                                    <Check className="mr-2 h-4 w-4 text-primary" />
                                    Priority support
                                </li>
                                <li className="flex items-center">
                                    <Check className="mr-2 h-4 w-4 text-primary" />
                                    Early access to new features
                                </li>
                            </ul>

                            <div className="space-y-2 pt-4 border-t border-border/50">
                                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                                    Have a Pro Coupon?
                                </p>
                                <div className="flex space-x-2">
                                    <Input
                                        type="text"
                                        placeholder="Enter coupon for Pro status"
                                        value={couponCode}
                                        onChange={(e) => setCouponCode(e.target.value)}
                                        className="bg-background/50"
                                    />
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleRedeemCoupon}
                                        disabled={isRedeeming || !couponCode}
                                    >
                                        {isRedeeming ? <Loader2 className="h-4 w-4 animate-spin" /> : "Apply"}
                                    </Button>
                                </div>
                                {redemptionMessage && (
                                    <p className={`text-xs ${redemptionMessage.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                                        {redemptionMessage.text}
                                    </p>
                                )}
                            </div>
                        </CardContent>
                        <CardFooter className="flex-col gap-2">
                            <Button
                                className="w-full"
                                variant="glow"
                                onClick={handleUpgrade}
                                disabled={isUpgrading}
                            >
                                {isUpgrading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
                                    </>
                                ) : (
                                    "Upgrade to Pro"
                                )}
                            </Button>
                            <p className="text-[10px] text-muted-foreground text-center">
                                * Payment system under maintenance. Contact support.
                            </p>
                        </CardFooter>
                    </Card>

                    {/* Enterprise Plan */}
                    <Card className="flex flex-col border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:shadow-[0_0_30px_-10px_rgba(255,255,255,0.1)] hover:border-primary/20">
                        <CardHeader>
                            <CardTitle>Enterprise</CardTitle>
                            <CardDescription>Custom solutions for large teams.</CardDescription>
                            <div className="mt-4">
                                <span className="text-4xl font-bold">Custom</span>
                            </div>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <ul className="space-y-2 text-sm">
                                <li className="flex items-center">
                                    <Check className="mr-2 h-4 w-4 text-primary" />
                                    Unlimited credits
                                </li>
                                <li className="flex items-center">
                                    <Check className="mr-2 h-4 w-4 text-primary" />
                                    Custom voice cloning
                                </li>
                                <li className="flex items-center">
                                    <Check className="mr-2 h-4 w-4 text-primary" />
                                    Dedicated account manager
                                </li>
                                <li className="flex items-center">
                                    <Check className="mr-2 h-4 w-4 text-primary" />
                                    SSO & Advanced Security
                                </li>
                            </ul>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full" variant="outline">Contact Sales</Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
            <Footer />
        </div>
    )
}
