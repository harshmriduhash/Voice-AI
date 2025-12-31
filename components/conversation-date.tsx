"use client"

import { useEffect, useState } from "react"

export function ConversationDate({ date }: { date: string }) {
    const [formattedDate, setFormattedDate] = useState("")

    useEffect(() => {
        setFormattedDate(new Date(date).toLocaleDateString())
    }, [date])

    return (
        <div className="font-medium text-xs text-muted-foreground mb-1">
            {formattedDate || "Loading..."}
        </div>
    )
}
