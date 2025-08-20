"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { FileText, Users, MessageSquare, XCircle, Handshake } from "lucide-react"
import { AddJobModal } from "@/components/add-job-modal"

export default function DashboardPage() {
    const stats = [
  {
    title: "Total Applications",
    value: "24",
    icon: FileText,
    iconColor: "text-blue-500",
    bgColor: "bg-blue-50 dark:bg-blue-900/30"
  },
  {
    title: "Offers",
    value: "8",
    icon: Handshake,
    iconColor: "text-purple-500",
    bgColor: "bg-purple-50 dark:bg-purple-900/30"
  },
  {
    title: "Interviews",
    value: "5",
    icon: Users,
    iconColor: "text-green-500",
    bgColor: "bg-green-50 dark:bg-green-900/30"
  },
  {
    title: "Rejected",
    value: "11",
    icon: XCircle,
    iconColor: "text-red-500",
    bgColor: "bg-red-50 dark:bg-red-900/30"
  }
]


    interface JobApplication {
        jobTitle: string;
        company: string;
        location: string;
        status: 'Applied' | 'Interview' | 'Offer' | 'Rejected';
        dateApplied: string;
    }

    const recentApplications: JobApplication[] = [
        {
            jobTitle: "Senior Frontend Developer",
            company: "Google",
            location: "Mountain View, CA",
            status: "Interview",
            dateApplied: "2025-08-15"
        },
        {
            jobTitle: "Full Stack Engineer",
            company: "Microsoft",
            location: "Seattle, WA",
            status: "Applied",
            dateApplied: "2025-08-12"
        },
        {
            jobTitle: "React Developer",
            company: "Meta",
            location: "Menlo Park, CA",
            status: "Offer",
            dateApplied: "2025-08-10"
        },
        {
            jobTitle: "Software Engineer",
            company: "Apple",
            location: "Cupertino, CA",
            status: "Rejected",
            dateApplied: "2025-08-08"
        },
        {
            jobTitle: "Frontend Engineer",
            company: "Netflix",
            location: "Los Gatos, CA",
            status: "Applied",
            dateApplied: "2025-08-05"
        }
    ]

    const getStatusBadgeColor = (status: string) => {
        switch (status) {
            case 'Applied':
                return 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 hover:bg-blue-100'
            case 'Interview':
                return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 hover:bg-green-100'
            case 'Offer':
                return 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 hover:bg-purple-100'
            case 'Rejected':
                return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 hover:bg-red-100'
            default:
                return 'bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 hover:bg-gray-100'
        }
    }

    return (
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Dashboard</h1>
                </div>
                <div className="flex justify-center sm:justify-end">
                    <AddJobModal />
                </div>
            </div>

            {/* Stats Cards - Responsive grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {stats.map((stat) => (
                    <Card key={stat.title} className="p-4 sm:p-6">
                        <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                                <p className="text-xs sm:text-sm font-medium text-muted-foreground uppercase tracking-wide truncate">
                                    {stat.title}
                                </p>
                                <p className="text-2xl sm:text-3xl font-bold mt-1 sm:mt-2 text-foreground">{stat.value}</p>
                            </div>
                            <div className={`h-10 w-10 sm:h-12 sm:w-12 rounded-lg ${stat.bgColor} flex items-center justify-center flex-shrink-0 ml-3`}>
                                <stat.icon className={`h-5 w-5 sm:h-6 sm:w-6 ${stat.iconColor}`} />
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Recent Applications Table */}
            <Card className="mt-6 sm:mt-8">
                <CardHeader className="pb-3 sm:pb-4 px-4 sm:px-6">
                    <CardTitle className="text-lg sm:text-xl font-semibold">Recent Applications</CardTitle>
                </CardHeader>
                <CardContent className="px-0">
                    {/* Mobile Card View */}
                    <div className="block lg:hidden">
                        <div className="space-y-3 px-4 sm:px-6">
                            {recentApplications.length === 0 ? (
                                <div className="py-12 text-center">
                                    <div className="flex flex-col items-center justify-center space-y-3 text-muted-foreground">
                                        <FileText className="h-12 w-12" />
                                        <p className="text-lg">No applications found</p>
                                        <p className="text-sm">Get started by adding your first job application</p>
                                    </div>
                                </div>
                            ) : (
                                recentApplications.map((app, index: number) => (
                                    <Card key={index} className="p-4 border border-border">
                                        <div className="space-y-3">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-medium text-foreground truncate">{app.jobTitle}</h3>
                                                    <p className="text-sm text-muted-foreground truncate">{app.company}</p>
                                                </div>
                                                <Badge 
                                                    variant="secondary"
                                                    className={`${getStatusBadgeColor(app.status)} ml-2 flex-shrink-0`}
                                                >
                                                    {app.status}
                                                </Badge>
                                            </div>
                                            <div className="flex items-center justify-between text-sm text-muted-foreground">
                                                <span className="truncate">{app.location}</span>
                                                <span className="flex-shrink-0 ml-2">{app.dateApplied}</span>
                                            </div>
                                        </div>
                                    </Card>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Desktop Table View */}
                    <div className="hidden lg:block">
                        <Table>
                            <TableHeader>
                                <TableRow className="border-b bg-muted">
                                    <TableHead className="px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">JOB TITLE</TableHead>
                                    <TableHead className="px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">COMPANY</TableHead>
                                    <TableHead className="px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">LOCATION</TableHead>
                                    <TableHead className="px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">STATUS</TableHead>
                                    <TableHead className="px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">DATE APPLIED</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {recentApplications.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="px-6 py-16 text-center">
                                            <div className="flex flex-col items-center justify-center space-y-3 text-muted-foreground">
                                                <FileText className="h-12 w-12" />
                                                <p className="text-lg">No applications found</p>
                                                <p className="text-sm">Get started by adding your first job application</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    recentApplications.map((app, index: number) => (
                                        <TableRow key={index} className="border-b border-border hover:bg-muted/50 transition-colors">
                                            <TableCell className="px-6 py-4 font-medium">{app.jobTitle}</TableCell>
                                            <TableCell className="px-6 py-4">{app.company}</TableCell>
                                            <TableCell className="px-6 py-4">{app.location}</TableCell>
                                            <TableCell className="px-6 py-4">
                                                <Badge 
                                                    variant="secondary"
                                                    className={getStatusBadgeColor(app.status)}
                                                >
                                                    {app.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="px-6 py-4 text-muted-foreground">{app.dateApplied}</TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}