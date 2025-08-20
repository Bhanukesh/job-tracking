"use client"

import { Header } from "./header"
import { Sidebar } from "./sidebar"

interface LayoutWrapperProps {
  children: React.ReactNode
}

export function LayoutWrapper({ children }: LayoutWrapperProps) {
  return (
    <div className="min-h-screen background">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 md:ml-64 pt-16 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}