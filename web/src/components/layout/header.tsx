'use client';

import Link from 'next/link';
import { Briefcase } from 'lucide-react';
import { ThemeToggle } from "@/components/theme-toggle";

export function Header() {
    return (
        <header className="fixed top-0 left-0 right-0 z-40 bg-background border-b border-border px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
                {/* Logo */}
                <Link href="/" className="flex items-center">
                    <Briefcase className="h-6 w-6 text-primary" />
                    <span className="ml-2 text-lg sm:text-xl font-bold text-foreground">Job Tracker</span>
                </Link>

                {/* Theme Toggle */}
                <ThemeToggle />
            </div>
        </header>
    );
}