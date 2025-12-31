"use client"

import { motion } from "framer-motion"
import { useState, useRef, useEffect } from "react"
import { Mic, Square, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface OrbProps {
    state?: "idle" | "listening" | "thinking" | "speaking"
    onCreditsUpdate?: (credits: number) => void
}

export function Orb({ state: externalState = "idle", onCreditsUpdate }: OrbProps) {
    const router = useRouter()
    const [internalState, setInternalState] = useState<"idle" | "listening" | "thinking" | "speaking">(externalState)
    const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)
    const [showOutOfCreditsModal, setShowOutOfCreditsModal] = useState(false)
    const audioChunks = useRef<Blob[]>([])
    const audioPlayerRef = useRef<HTMLAudioElement | null>(null)

    useEffect(() => {
        if (externalState !== "idle") {
            setInternalState(externalState)
        }
    }, [externalState])

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
            const recorder = new MediaRecorder(stream)

            recorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunks.current.push(event.data)
                }
            }

            recorder.onstop = async () => {
                setInternalState("thinking")
                const audioBlob = new Blob(audioChunks.current, { type: "audio/webm" })
                audioChunks.current = []

                const formData = new FormData()
                formData.append("audio", audioBlob)

                try {
                    const response = await fetch("/api/voice/conversation", {
                        method: "POST",
                        body: formData,
                    })

                    if (response.status === 402) {
                        setInternalState("idle")
                        setShowOutOfCreditsModal(true)
                        return
                    }

                    if (!response.ok) throw new Error("API request failed")

                    const creditsRemaining = response.headers.get("X-Credits-Remaining")
                    if (creditsRemaining && onCreditsUpdate) {
                        onCreditsUpdate(parseInt(creditsRemaining))
                    }

                    const audioBlobResponse = await response.blob()
                    const audioUrl = URL.createObjectURL(audioBlobResponse)

                    if (audioPlayerRef.current) {
                        audioPlayerRef.current.src = audioUrl
                        setInternalState("speaking")
                        audioPlayerRef.current.play()
                        audioPlayerRef.current.onended = () => {
                            setInternalState("idle")
                            router.refresh()
                        }
                    }
                } catch (error) {
                    console.error("Error processing voice:", error)
                    setInternalState("idle")
                    alert("Something went wrong. Please try again.")
                }
            }

            recorder.start()
            setMediaRecorder(recorder)
            setInternalState("listening")
        } catch (error) {
            console.error("Error accessing microphone:", error)
            alert("Microphone access denied")
        }
    }

    const stopRecording = () => {
        if (mediaRecorder && mediaRecorder.state !== "inactive") {
            mediaRecorder.stop()
            mediaRecorder.stream.getTracks().forEach(track => track.stop())
            setMediaRecorder(null)
        }
    }

    const handleClick = () => {
        if (internalState === "idle") {
            startRecording()
        } else if (internalState === "listening") {
            stopRecording()
        }
    }

    const isActive = internalState !== "idle"

    return (
        <>
            <div className="relative flex items-center justify-center">
                {/* Outer glow - enhanced for thinking */}
                <motion.div
                    className="absolute w-80 h-80 rounded-full bg-primary/5 blur-3xl"
                    animate={{
                        scale: internalState === "thinking" ? [1, 1.4, 1] : isActive ? [1, 1.2, 1] : 1,
                        opacity: internalState === "thinking" ? [0.5, 0.8, 0.5] : isActive ? [0.3, 0.5, 0.3] : 0.2,
                    }}
                    transition={{
                        duration: internalState === "thinking" ? 1 : 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />

                {/* Middle glow - enhanced for thinking */}
                <motion.div
                    className="absolute w-64 h-64 rounded-full bg-primary/10 blur-2xl"
                    animate={{
                        scale: internalState === "thinking" ? [1, 1.3, 1] : isActive ? [1, 1.15, 1] : 1,
                        opacity: internalState === "thinking" ? [0.6, 0.9, 0.6] : isActive ? [0.4, 0.6, 0.4] : 0.3,
                    }}
                    transition={{
                        duration: internalState === "thinking" ? 0.8 : 1.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 0.2,
                    }}
                />

                {/* Rotating gradient ring - faster when thinking */}
                <motion.div
                    className="absolute w-52 h-52 rounded-full"
                    style={{
                        background: internalState === "thinking"
                            ? "conic-gradient(from 0deg, hsl(var(--primary)), transparent, hsl(var(--primary)))"
                            : "conic-gradient(from 0deg, transparent, hsl(var(--primary)), transparent)",
                        opacity: internalState === "thinking" ? 0.7 : 0.3,
                    }}
                    animate={{
                        rotate: 360,
                    }}
                    transition={{
                        duration: internalState === "thinking" ? 2 : 8,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                />

                {/* Pulse ring - more aggressive when thinking */}
                <motion.div
                    className="absolute w-48 h-48 rounded-full border-2 border-primary/30"
                    animate={{
                        scale: internalState === "thinking" ? [1, 1.5, 1] : isActive ? [1, 1.3, 1] : [1, 1.1, 1],
                        opacity: internalState === "thinking" ? [0.8, 0, 0.8] : isActive ? [0.5, 0, 0.5] : [0.3, 0, 0.3],
                    }}
                    transition={{
                        duration: internalState === "thinking" ? 1 : 2,
                        repeat: Infinity,
                        ease: "easeOut",
                    }}
                />

                {/* Main orb - rotates and glows more when thinking */}
                <motion.button
                    onClick={handleClick}
                    className="relative w-40 h-40 rounded-full bg-gradient-to-br from-emerald-400 via-emerald-600 to-emerald-950 shadow-2xl shadow-primary/50 border border-primary/20 cursor-pointer overflow-hidden group"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    animate={{
                        scale: internalState === "thinking" ? [1, 1.1, 1] : 1,
                        rotate: internalState === "thinking" ? 360 : 0,
                        boxShadow: internalState === "thinking"
                            ? [
                                "0 0 80px 20px hsl(var(--primary) / 0.8)",
                                "0 0 100px 30px hsl(var(--primary) / 1)",
                                "0 0 80px 20px hsl(var(--primary) / 0.8)",
                            ]
                            : isActive
                                ? [
                                    "0 0 60px 10px hsl(var(--primary) / 0.5)",
                                    "0 0 80px 20px hsl(var(--primary) / 0.7)",
                                    "0 0 60px 10px hsl(var(--primary) / 0.5)",
                                ]
                                : "0 0 40px 5px hsl(var(--primary) / 0.3)",
                    }}
                    transition={{
                        scale: { duration: 0.5, repeat: internalState === "thinking" ? Infinity : 0 },
                        rotate: { duration: 2, repeat: internalState === "thinking" ? Infinity : 0, ease: "linear" },
                        boxShadow: { duration: 1, repeat: Infinity, ease: "easeInOut" },
                    }}
                >
                    <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/5 to-white/20" />

                    <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                        animate={{
                            x: ["-100%", "200%"],
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "linear",
                            repeatDelay: 1,
                        }}
                    />

                    <div className="absolute inset-0 flex items-center justify-center">
                        <motion.div
                            animate={{
                                scale: isActive ? [1, 1.2, 1] : 1,
                            }}
                            transition={{
                                duration: 0.5,
                                repeat: isActive ? Infinity : 0,
                            }}
                        >
                            {internalState === "listening" ? (
                                <Square className="w-16 h-16 text-white fill-current drop-shadow-lg" />
                            ) : (
                                <Mic className="w-16 h-16 text-white drop-shadow-lg" />
                            )}
                        </motion.div>
                    </div>

                    {isActive && (
                        <>
                            {[...Array(8)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    className="absolute w-2 h-2 bg-white/60 rounded-full"
                                    style={{
                                        left: "50%",
                                        top: "50%",
                                    }}
                                    animate={{
                                        x: [0, Math.cos((i * Math.PI * 2) / 8) * 60],
                                        y: [0, Math.sin((i * Math.PI * 2) / 8) * 60],
                                        opacity: [0.8, 0],
                                        scale: [1, 0],
                                    }}
                                    transition={{
                                        duration: 1.5,
                                        repeat: Infinity,
                                        ease: "easeOut",
                                        delay: i * 0.1,
                                    }}
                                />
                            ))}
                        </>
                    )}
                </motion.button>

                {/* Status indicator */}
                <motion.div
                    className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-background/80 backdrop-blur-sm border border-border text-xs font-medium"
                    animate={{
                        opacity: isActive ? 1 : 0.7,
                    }}
                >
                    {internalState === "listening" ? (
                        <span className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                            Listening...
                        </span>
                    ) : internalState === "thinking" ? (
                        <span className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
                            Thinking...
                        </span>
                    ) : internalState === "speaking" ? (
                        <span className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            Speaking...
                        </span>
                    ) : (
                        <span className="text-muted-foreground">Click to speak</span>
                    )}
                </motion.div>

                <audio ref={audioPlayerRef} className="hidden" />
            </div>

            {showOutOfCreditsModal && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-card border border-border rounded-xl p-8 max-w-md w-full space-y-6 shadow-2xl"
                    >
                        <div className="flex items-center justify-center">
                            <div className="rounded-full bg-red-500/10 p-4">
                                <AlertCircle className="h-12 w-12 text-red-500" />
                            </div>
                        </div>

                        <div className="text-center space-y-2">
                            <h3 className="text-2xl font-bold">Out of Fuel!</h3>
                            <p className="text-muted-foreground">
                                You've run out of credits. Upgrade to Pro or apply a coupon to continue.
                            </p>
                        </div>

                        <div className="flex flex-col gap-3">
                            <Button
                                variant="glow"
                                className="w-full"
                                onClick={() => router.push("/pricing")}
                            >
                                Upgrade to Pro
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={() => setShowOutOfCreditsModal(false)}
                            >
                                Close
                            </Button>
                        </div>
                    </motion.div>
                </div>
            )}
        </>
    )
}
