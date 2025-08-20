"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { 
  LayoutDashboard, 
  FileText,
  Briefcase,
  Menu,
  X
} from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"

const navigation = [
  {
    name: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    name: "All Jobs",
    href: "/applications",
    icon: FileText,
  },
]

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const SidebarContent = ({ showLogo = false }: { showLogo?: boolean }) => (
    <div className="flex flex-col h-full">
      {/* Logo Section - Only show when showLogo is true */}
      {showLogo && (
        <div className="flex items-center px-4 py-6 border-b border-sidebar-border">
          <Briefcase className="h-6 w-6 text-sidebar-primary" />
          <span className="ml-2 text-xl font-bold text-sidebar-foreground">Job Tracker</span>
        </div>
      )}
      
      {/* Navigation Section */}
      <div className="flex-1 px-4 py-6">
        <nav className="space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  isActive
                    ? "bg-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <item.icon
                  className={cn(
                    "mr-3 h-5 w-5 flex-shrink-0",
                    isActive
                      ? "text-sidebar-primary"
                      : "text-sidebar-foreground group-hover:text-sidebar-primary"
                  )}
                />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Theme Toggle Section */}
      <div className="px-4 py-4 border-t border-sidebar-border">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-sidebar-foreground">Theme</span>
          <ThemeToggle />
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="sm"
        className="md:hidden fixed top-4 right-4 z-50"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? (
          <X className="h-5 w-5" />
        ) : (
          <Menu className="h-5 w-5" />
        )}
      </Button>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-sidebar border-r border-sidebar-border">
            <SidebarContent showLogo={true} />
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className={cn("hidden md:flex md:flex-col md:fixed md:top-16 md:bottom-0 md:w-64 bg-sidebar border-r border-sidebar-border", className)}>
        <SidebarContent showLogo={false} />
      </div>
    </>
  )
}