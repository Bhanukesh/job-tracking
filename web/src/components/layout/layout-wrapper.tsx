"use client"

import { Header } from "./header"
import { Sidebar } from "./sidebar"

interface LayoutWrapperProps {
  children: React.ReactNode
}

export function LayoutWrapper({ children }: LayoutWrapperProps) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <aside className="hidden md:flex md:flex-col md:fixed md:inset-y-0 md:pt-14 border-r">
          <Sidebar />
        </aside>
        <main className="flex-1 md:ml-64">
          <div className="container py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}