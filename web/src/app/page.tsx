"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { FileText, Users, MessageSquare, XCircle, Handshake, Loader2, X, Edit, Trash2, Filter } from "lucide-react"
import { useRouter } from "next/navigation"
import { AddJobModal } from "@/components/add-job-modal"
import { useGetJobApplicationsQuery, useDeleteJobApplicationMutation } from "@/store/api/generated/jobApplications"
import { toast } from "sonner"
import { useMemo, useState } from "react"
import { safeSortArray } from "@/lib/utils"

export default function DashboardPage() {
    const router = useRouter()
    const { data: applications = [], isLoading, error } = useGetJobApplicationsQuery()
    const [deleteJobApplication, { isLoading: isDeleting }] = useDeleteJobApplicationMutation()
    const [statusFilter, setStatusFilter] = useState<string | null>(null)
    
    // Calculate stats from real data
    const stats = useMemo(() => {
        const total = applications.length
        const statusCounts = applications.reduce((acc, app) => {
            acc[app.status] = (acc[app.status] || 0) + 1
            return acc
        }, {} as Record<string, number>)

        return [
            {
                title: "Total Applications",
                value: total.toString(),
                icon: FileText,
                iconColor: "text-blue-500",
                bgColor: "bg-blue-50 dark:bg-blue-900/30",
                status: null
            },
            {
                title: "Offers",
                value: (statusCounts.Offer || 0).toString(),
                icon: Handshake,
                iconColor: "text-purple-500",
                bgColor: "bg-purple-50 dark:bg-purple-900/30",
                status: "Offer"
            },
            {
                title: "Interviews",
                value: (statusCounts.Interview || 0).toString(),
                icon: Users,
                iconColor: "text-green-500",
                bgColor: "bg-green-50 dark:bg-green-900/30",
                status: "Interview"
            },
            {
                title: "Rejected",
                value: (statusCounts.Rejected || 0).toString(),
                icon: XCircle,
                iconColor: "text-red-500",
                bgColor: "bg-red-50 dark:bg-red-900/30",
                status: "Rejected"
            }
        ]
    }, [applications])

    // Get recent applications (last 5) with optional status filter
    // Note: RTK Query returns immutable arrays, so we use safeSortArray to create a copy before sorting
    const recentApplications = useMemo(() => {
        let filteredApps = applications;
        
        // Apply status filter if active
        if (statusFilter) {
            filteredApps = applications.filter(app => app.status === statusFilter);
        }
        
        return safeSortArray(filteredApps, (a, b) => 
            new Date(b.dateApplied).getTime() - new Date(a.dateApplied).getTime()
        ).slice(0, 10)
    }, [applications, statusFilter])

    const handleStatusFilter = (status: string | null) => {
        // Toggle filter: if same status is clicked, clear filter
        setStatusFilter(statusFilter === status ? null : status)
    }

    const clearFilter = () => {
        setStatusFilter(null)
    }

    // Handle delete functionality
    const handleDelete = async (id: number) => {
        if (confirm('Are you sure you want to delete this application?')) {
            try {
                await deleteJobApplication({ id }).unwrap()
                toast.success('Job application deleted successfully!')
            } catch (error: any) {
                console.error('Failed to delete application:', error)
                const errorMessage = error?.data?.message || error?.message || 'Failed to delete job application. Please try again.'
                toast.error(errorMessage)
            }
        }
    }

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

    if (error) {
        return (
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <XCircle className="h-12 w-12 text-red-500 mb-4" />
                    <h2 className="text-xl font-semibold mb-2">Failed to load dashboard</h2>
                    <p className="text-muted-foreground">Please try refreshing the page</p>
                </div>
            </div>
        )
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
                    <Card 
                        key={stat.title} 
                        className={`p-4 sm:p-6 cursor-pointer transition-all duration-200 hover:shadow-md ${
                            statusFilter === stat.status 
                                ? 'ring-2 ring-offset-2 ring-blue-500 bg-blue-50/50 dark:bg-blue-900/20' 
                                : 'hover:bg-muted/50'
                        }`}
                        onClick={() => handleStatusFilter(stat.status)}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                                <p className="text-xs sm:text-sm font-medium text-muted-foreground uppercase tracking-wide truncate">
                                    {stat.title}
                                </p>
                                {isLoading ? (
                                    <div className="flex items-center mt-1 sm:mt-2">
                                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                                    </div>
                                ) : (
                                    <p className="text-2xl sm:text-3xl font-bold mt-1 sm:mt-2 text-foreground">{stat.value}</p>
                                )}
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
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-lg sm:text-xl font-semibold">
                            {statusFilter 
                                ? `${statusFilter} Applications` 
                                : 'Recent Applications'
                            }
                        </CardTitle>
                        {statusFilter && (
                            <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={clearFilter}
                                className="flex items-center gap-2"
                            >
                                <X className="h-4 w-4" />
                                Clear Filter
                            </Button>
                        )}
                    </div>
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
                            ) : isLoading ? (
                                Array.from({ length: 3 }).map((_, index) => (
                                    <Card key={index} className="p-4 border border-border">
                                        <div className="space-y-3 animate-pulse">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1 min-w-0 space-y-2">
                                                    <div className="h-4 bg-muted rounded w-3/4"></div>
                                                    <div className="h-3 bg-muted rounded w-1/2"></div>
                                                </div>
                                                <div className="h-6 bg-muted rounded w-16 ml-2"></div>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="h-3 bg-muted rounded w-1/3"></div>
                                                <div className="h-3 bg-muted rounded w-20"></div>
                                            </div>
                                        </div>
                                    </Card>
                                ))
                            ) : (
                                recentApplications.map((app) => (
                                    <Card key={app.id} className="p-4 border border-border cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => router.push(`/applications/${app.id}?from=dashboard`)}>
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
                                                <span className="truncate">{app.location || 'Location not specified'}</span>
                                                <span className="flex-shrink-0 ml-2">{new Date(app.dateApplied).toLocaleDateString()}</span>
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
                                {recentApplications.length === 0 && !isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="px-6 py-16 text-center">
                                            <div className="flex flex-col items-center justify-center space-y-3 text-muted-foreground">
                                                <FileText className="h-12 w-12" />
                                                <p className="text-lg">No applications found</p>
                                                <p className="text-sm">Get started by adding your first job application</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : isLoading ? (
                                    Array.from({ length: 3 }).map((_, index) => (
                                        <TableRow key={index}>
                                            <TableCell className="px-6 py-4">
                                                <div className="h-4 bg-muted rounded w-3/4 animate-pulse"></div>
                                            </TableCell>
                                            <TableCell className="px-6 py-4">
                                                <div className="h-4 bg-muted rounded w-1/2 animate-pulse"></div>
                                            </TableCell>
                                            <TableCell className="px-6 py-4">
                                                <div className="h-4 bg-muted rounded w-2/3 animate-pulse"></div>
                                            </TableCell>
                                            <TableCell className="px-6 py-4">
                                                <div className="h-6 bg-muted rounded w-16 animate-pulse"></div>
                                            </TableCell>
                                            <TableCell className="px-6 py-4">
                                                <div className="h-4 bg-muted rounded w-20 animate-pulse"></div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    recentApplications.map((app) => (
                                        <TableRow key={app.id} className="border-b border-border hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => router.push(`/applications/${app.id}?from=dashboard`)}>
                                            <TableCell className="px-6 py-4 font-medium">{app.jobTitle}</TableCell>
                                            <TableCell className="px-6 py-4">{app.company}</TableCell>
                                            <TableCell className="px-6 py-4">{app.location || 'Location not specified'}</TableCell>
                                            <TableCell className="px-6 py-4">
                                                <Badge 
                                                    variant="secondary"
                                                    className={getStatusBadgeColor(app.status)}
                                                >
                                                    {app.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="px-6 py-4 text-muted-foreground">{new Date(app.dateApplied).toLocaleDateString()}</TableCell>
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