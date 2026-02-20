"use client"

import { useState, useEffect } from "react"
import { signOut, useSession } from "next-auth/react"
import { useTheme } from "next-themes"
import Link from "next/link"
import { LogOut, Monitor, Moon, Settings, Sun, User } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { ProfileModal } from "@/components/profile/profile-modal"

function getInitials(name?: string | null, email?: string | null): string {
  if (name) {
    return name
      .split(" ")
      .slice(0, 2)
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }
  if (email) return email[0].toUpperCase()
  return "U"
}

const THEMES = [
  { value: "light", label: "Claro", icon: Sun },
  { value: "dark", label: "Escuro", icon: Moon },
  { value: "system", label: "Sistema", icon: Monitor },
] as const

export function UserMenu() {
  const { data: session } = useSession()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)

  useEffect(() => setMounted(true), [])

  const user = session?.user
  const initials = getInitials(user?.name, user?.email)

  const ThemeIcon =
    !mounted ? Monitor
    : theme === "light" ? Sun
    : theme === "dark" ? Moon
    : Monitor

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button type="button" className="flex items-center gap-2 rounded-full outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
            <Avatar className="h-8 w-8 cursor-pointer">
              <AvatarImage src={user?.image ?? undefined} alt={user?.name ?? "Usuário"} />
              <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-56" align="end" forceMount>
          {/* Cabeçalho com nome e email */}
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user?.name ?? "Usuário"}</p>
              <p className="text-xs leading-none text-muted-foreground truncate">
                {user?.email ?? ""}
              </p>
            </div>
          </DropdownMenuLabel>

          <DropdownMenuSeparator />

          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <Link href="/dashboard/settings" className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                Configurações da conta
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem
              className="cursor-pointer"
              onSelect={() => setProfileOpen(true)}
            >
              <User className="mr-2 h-4 w-4" />
              Ver perfil
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          {/* Submenu de Tema */}
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="cursor-pointer">
              <ThemeIcon className="mr-2 h-4 w-4" />
              Tema
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                {THEMES.map((t) => (
                  <DropdownMenuItem
                    key={t.value}
                    onClick={() => setTheme(t.value)}
                    className={cn(
                      "cursor-pointer",
                      mounted && theme === t.value && "text-primary font-medium"
                    )}
                  >
                    <t.icon className="mr-2 h-4 w-4" />
                    {t.label}
                    {mounted && theme === t.value && (
                      <span className="ml-auto text-xs">✓</span>
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="cursor-pointer text-destructive focus:text-destructive"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ProfileModal open={profileOpen} onOpenChange={setProfileOpen} />
    </>
  )
}
