import { Header } from "@/components/layout/header"
import { MobileNav } from "@/components/layout/mobile-nav"
import { Sidebar } from "@/components/layout/sidebar"
import { PersonaProvider } from "@/lib/context/persona-context"
import { GenerationProvider } from "@/lib/context/generation-context"
import { GoogleProvider } from "@/lib/context/google-context"
import { LLMProvider } from "@/lib/context/llm-context"
import { OpenAIProvider } from "@/lib/context/openai-context"
import { ReplicateProvider } from "@/lib/context/replicate-context"
import { ElevenLabsProvider } from "@/lib/context/elevenlabs-context"
import { CampaignProvider } from "@/lib/context/campaign-context"
import { BillingProvider } from "@/lib/context/billing-context"
import { CreditIndicator } from "@/components/billing/credit-indicator"
import { UpgradeModal } from "@/components/billing/upgrade-modal"
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
    <BillingProvider>
    <PersonaProvider>
      <ReplicateProvider>
        <OpenAIProvider>
          <GoogleProvider>
            <LLMProvider>
              <GenerationProvider>
                <ElevenLabsProvider>
                <CampaignProvider>
                <div className="min-h-screen bg-background">
                  <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
                    <div className="container flex h-16 items-center justify-between">
                      <div className="flex items-center gap-4">
                        <MobileNav />
                        <Header />
                      </div>
                      <CreditIndicator />
                    </div>
                  </header>
                  <Sidebar />
                  <main className="lg:pl-64">
                    <div className="container py-8">{children}</div>
                  </main>
                </div>
                <UpgradeModal />
                </CampaignProvider>
                </ElevenLabsProvider>
              </GenerationProvider>
            </LLMProvider>
          </GoogleProvider>
        </OpenAIProvider>
      </ReplicateProvider>
    </PersonaProvider>
    </BillingProvider>
  )
}
