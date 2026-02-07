import { Header } from "@/components/layout/header"
import { MobileNav } from "@/components/layout/mobile-nav"
import { Sidebar } from "@/components/layout/sidebar"
import { GenerationProvider } from "@/lib/context/generation-context"
import { GoogleProvider } from "@/lib/context/google-context"
import { LLMProvider } from "@/lib/context/llm-context"
import { OpenAIProvider } from "@/lib/context/openai-context"
import { ReplicateProvider } from "@/lib/context/replicate-context"
import type React from "react"

/**
 * Layout do Dashboard
 * Princípio: Composition Pattern
 * Responsabilidade: compor providers e estrutura do layout
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ReplicateProvider>
      <OpenAIProvider>
        <GoogleProvider>
          <LLMProvider>
            <GenerationProvider>
              <div className="min-h-screen bg-background">
                <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
                  <div className="container flex h-16 items-center justify-between">
                    <div className="flex items-center gap-4">
                      <MobileNav />
                      <Header />
                    </div>
                  </div>
                </header>
                <Sidebar />
                <main className="lg:pl-64">
                  <div className="container py-8">{children}</div>
                </main>
              </div>
            </GenerationProvider>
          </LLMProvider>
        </GoogleProvider>
      </OpenAIProvider>
    </ReplicateProvider>
  )
}
