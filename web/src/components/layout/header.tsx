'use client';

import Link from 'next/link';
import { Briefcase } from 'lucide-react';

export function Header() {
    return (
        <header className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center h-16">
                {/* Logo */}
                <Link href="/" className="flex items-center">
                    <Briefcase className="h-6 w-6 text-blue-600" />
                    <span className="ml-2 text-lg sm:text-xl font-bold text-gray-900">Job Tracker</span>
                </Link>
            </div>
        </header>
    );
}