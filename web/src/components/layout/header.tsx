"use client"

import { Briefcase, Bell, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MobileSidebar } from "./mobile-sidebar"

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <MobileSidebar />
          <div className="hidden md:flex items-center">
            <Briefcase className="h-6 w-6 text-blue-600" />
            <span className="ml-2 text-lg font-semibold">Job Application Tracker</span>
          </div>
        </div>
        
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            {/* Search component can go here */}
          </div>
          <nav className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <Bell className="h-4 w-4" />
              <span className="sr-only">Notifications</span>
            </Button>
            <Button variant="ghost" size="sm">
              <User className="h-4 w-4" />
              <span className="sr-only">User menu</span>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  )
}