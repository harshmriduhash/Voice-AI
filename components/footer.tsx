import Link from "next/link"

export function Footer() {
    return (
        <footer className="border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
                <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
                    <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                        Built by{" "}
                        <a
                            href="https://shaizamalikai.vercel.app"
                            target="_blank"
                            rel="noreferrer"
                            className="font-medium underline underline-offset-4"
                        >
                            Shaiza Malik
                        </a>
                    </p>
                </div>
                <div className="flex gap-6">
                    <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                        Features
                    </a>
                    <a href="#testimonials" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                        Testimonials
                    </a>
                    <a href="#faq" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                        FAQs
                    </a>
                    <a href="#contact" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                        Contact Us
                    </a>
                </div>
            </div>
        </footer>
    )
}
