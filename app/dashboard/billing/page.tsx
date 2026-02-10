"use client"

import { useEffect, useState, useCallback } from "react"
import { Check, CreditCard, ExternalLink, Loader2, Coins, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useBilling } from "@/lib/context/billing-context"
import type { CreditTransactionData } from "@/lib/types/billing"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

export default function BillingPage() {
  const { balance, subscription, plans, fetchBalance, fetchPlans } = useBilling()
  const [transactions, setTransactions] = useState<CreditTransactionData[]>([])
  const [isLoadingTx, setIsLoadingTx] = useState(false)
  const [loadingSlug, setLoadingSlug] = useState<string | null>(null)
  const [loadingPortal, setLoadingPortal] = useState(false)

  const currentPlan = subscription?.plan
  const creditsMonthly = currentPlan?.creditsMonthly || 50
  const usedCredits = Math.max(0, creditsMonthly - balance)
  const usagePercent = Math.min(100, (usedCredits / creditsMonthly) * 100)

  const fetchTransactions = useCallback(async () => {
    setIsLoadingTx(true)
    try {
      const res = await fetch("/api/billing/transactions?limit=10")
      const json = await res.json()
      if (json.success) {
        setTransactions(json.data.transactions)
      }
    } catch {
      // silent
    } finally {
      setIsLoadingTx(false)
    }
  }, [])

  useEffect(() => {
    fetchBalance()
    fetchPlans()
    fetchTransactions()
  }, [fetchBalance, fetchPlans, fetchTransactions])

  const handleCheckout = async (planSlug: string) => {
    setLoadingSlug(planSlug)
    try {
      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planSlug }),
      })
      const json = await res.json()
      if (!json.success) {
        toast.error(json.error || "Erro ao iniciar checkout")
        return
      }
      window.location.href = json.data.url
    } catch {
      toast.error("Erro ao iniciar checkout")
    } finally {
      setLoadingSlug(null)
    }
  }

  const handlePortal = async () => {
    setLoadingPortal(true)
    try {
      const res = await fetch("/api/billing/portal", { method: "POST" })
      const json = await res.json()
      if (!json.success) {
        toast.error(json.error || "Erro ao abrir portal")
        return
      }
      window.location.href = json.data.url
    } catch {
      toast.error("Erro ao abrir portal")
    } finally {
      setLoadingPortal(false)
    }
  }

  const currentPlanSlug = currentPlan?.slug || "free"

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Billing & Créditos</h1>
        <p className="text-muted-foreground mt-1">
          Gerencie seu plano e créditos de geração
        </p>
      </div>

      {/* Balance + Current Plan */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Coins className="h-4 w-4 text-amber-500" />
              Saldo de Créditos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{balance}</div>
            <p className="text-sm text-muted-foreground mt-1">
              créditos disponíveis
            </p>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Usados este mês</span>
                <span>{usedCredits} / {creditsMonthly}</span>
              </div>
              <Progress value={usagePercent} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Plano Atual
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold">{currentPlan?.name || "Gratuito"}</span>
              {subscription?.cancelAtPeriodEnd && (
                <Badge variant="destructive">Cancela em breve</Badge>
              )}
            </div>
            {currentPlan && currentPlan.priceMonthly > 0 ? (
              <p className="text-sm text-muted-foreground mt-1">
                R$ {(currentPlan.priceMonthly / 100).toFixed(2).replace(".", ",")} /mês
                — {currentPlan.creditsMonthly} créditos/mês
              </p>
            ) : (
              <p className="text-sm text-muted-foreground mt-1">
                Plano gratuito — 50 créditos/mês
              </p>
            )}
            {subscription?.stripeCustomerId && (
              <Button
                variant="outline"
                size="sm"
                className="mt-3"
                onClick={handlePortal}
                disabled={loadingPortal}
              >
                {loadingPortal ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <ExternalLink className="h-4 w-4 mr-2" />
                )}
                Gerenciar Assinatura
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Plans Comparison */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Planos Disponíveis</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {plans.map((plan) => {
            const isCurrent = plan.slug === currentPlanSlug
            const isPopular = plan.slug === "pro"
            return (
              <Card
                key={plan.id}
                className={cn(
                  "relative",
                  isCurrent && "ring-2 ring-primary",
                  isPopular && !isCurrent && "ring-1 ring-primary/50"
                )}
              >
                {isPopular && (
                  <Badge className="absolute -top-2.5 left-1/2 -translate-x-1/2">
                    Popular
                  </Badge>
                )}
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="mt-2">
                    {plan.priceMonthly === 0 ? (
                      <span className="text-3xl font-bold">Grátis</span>
                    ) : (
                      <>
                        <span className="text-3xl font-bold">
                          R$ {(plan.priceMonthly / 100).toFixed(2).replace(".", ",")}
                        </span>
                        <span className="text-sm text-muted-foreground">/mês</span>
                      </>
                    )}
                  </div>
                  <p className="text-sm font-medium text-primary mt-1">
                    {plan.creditsMonthly} créditos/mês
                  </p>
                </CardHeader>
                <CardContent className="space-y-3">
                  <ul className="space-y-1.5">
                    {plan.features.map((feature) => (
                      <li key={feature} className="text-sm flex items-start gap-2">
                        <Check className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  {isCurrent ? (
                    <Button variant="outline" className="w-full" disabled>
                      Plano atual
                    </Button>
                  ) : plan.priceMonthly === 0 ? (
                    <Button variant="outline" className="w-full" disabled>
                      Gratuito
                    </Button>
                  ) : (
                    <Button
                      className="w-full"
                      disabled={!plan.stripePriceId || loadingSlug !== null}
                      onClick={() => handleCheckout(plan.slug)}
                    >
                      {loadingSlug === plan.slug ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Assinar"
                      )}
                    </Button>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Transações</CardTitle>
          <CardDescription>Últimas movimentações de créditos</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingTx ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : transactions.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              Nenhuma transação encontrada.
            </p>
          ) : (
            <div className="space-y-2">
              {transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between py-2 border-b last:border-0"
                >
                  <div className="flex items-center gap-3">
                    {tx.amount > 0 ? (
                      <ArrowUpRight className="h-4 w-4 text-green-500" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4 text-red-500" />
                    )}
                    <div>
                      <p className="text-sm font-medium">{tx.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(tx.createdAt).toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={tx.amount > 0 ? "default" : "secondary"}>
                      {tx.amount > 0 ? "+" : ""}{tx.amount}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Saldo: {tx.balanceAfter}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
