"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { FileText, Users, MessageSquare, XCircle, Handshake } from "lucide-react"
import { AddJobModal } from "@/components/add-job-modal"

export default function DashboardPage() {
    const [selectedFilter, setSelectedFilter] = useState<string | null>(null)

    interface JobApplication {
        jobTitle: string;
        company: string;
        location: string;
        status: 'Applied' | 'Interview' | 'Offer' | 'Rejected';
        dateApplied: string;
    }

    const allApplications: JobApplication[] = [
        {
            jobTitle: "Senior Frontend Developer",
            company: "Google",
            location: "Mountain View, CA",
            status: "Interview",
            dateApplied: "2025-08-20"
        },
        {
            jobTitle: "Full Stack Engineer",
            company: "Microsoft",
            location: "Seattle, WA",
            status: "Applied",
            dateApplied: "2025-08-20"
        },
        {
            jobTitle: "React Developer",
            company: "Meta",
            location: "Menlo Park, CA",
            status: "Offer",
            dateApplied: "2025-08-19"
        },
        {
            jobTitle: "Software Engineer",
            company: "Apple",
            location: "Cupertino, CA",
            status: "Rejected",
            dateApplied: "2025-08-18"
        },
        {
            jobTitle: "Frontend Engineer",
            company: "Netflix",
            location: "Los Gatos, CA",
            status: "Applied",
            dateApplied: "2025-08-17"
        },
        {
            jobTitle: "Backend Developer",
            company: "Amazon",
            location: "Seattle, WA",
            status: "Interview",
            dateApplied: "2025-08-16"
        },
        {
            jobTitle: "DevOps Engineer",
            company: "Spotify",
            location: "New York, NY",
            status: "Rejected",
            dateApplied: "2025-08-15"
        },
        {
            jobTitle: "UI/UX Designer",
            company: "Adobe",
            location: "San Jose, CA",
            status: "Offer",
            dateApplied: "2025-08-14"
        },
        {
            jobTitle: "Mobile Developer",
            company: "Uber",
            location: "San Francisco, CA",
            status: "Applied",
            dateApplied: "2025-08-13"
        },
        {
            jobTitle: "Data Scientist",
            company: "Tesla",
            location: "Austin, TX",
            status: "Rejected",
            dateApplied: "2025-08-12"
        }
    ]

    const stats = useMemo(() => {
        const totalCount = allApplications.length
        const appliedCount = allApplications.filter(app => app.status === 'Applied').length
        const interviewCount = allApplications.filter(app => app.status === 'Interview').length
        const offerCount = allApplications.filter(app => app.status === 'Offer').length
        const rejectedCount = allApplications.filter(app => app.status === 'Rejected').length

        return [
            {
                title: "Total Applications",
                value: totalCount.toString(),
                icon: FileText,
                iconColor: "text-blue-500",
                bgColor: "bg-blue-50",
                filter: null,
                clickable: false
            },
            {
                title: "Applied",
                value: appliedCount.toString(),
                icon: FileText,
                iconColor: "text-blue-500",
                bgColor: "bg-blue-50",
                filter: "Applied",
                clickable: true
            },
            {
                title: "Interview",
                value: interviewCount.toString(),
                icon: Users,
                iconColor: "text-green-500",
                bgColor: "bg-green-50",
                filter: "Interview",
                clickable: true
            },
            {
                title: "Offer",
                value: offerCount.toString(),
                icon: Handshake,
                iconColor: "text-purple-500",
                bgColor: "bg-purple-50",
                filter: "Offer",
                clickable: true
            },
            {
                title: "Rejected",
                value: rejectedCount.toString(),
                icon: XCircle,
                iconColor: "text-red-500",
                bgColor: "bg-red-50",
                filter: "Rejected",
                clickable: true
            }
        ]
    }, [allApplications])

    const displayedApplications = useMemo(() => {
        if (selectedFilter) {
            return allApplications.filter(app => app.status === selectedFilter)
        }
        
        const today = new Date().toISOString().split('T')[0]
        const todaysApplications = allApplications.filter(app => app.dateApplied === today)
        
        if (todaysApplications.length > 0) {
            return todaysApplications
        }
        
        return allApplications
            .sort((a, b) => new Date(b.dateApplied).getTime() - new Date(a.dateApplied).getTime())
            .slice(0, 5)
    }, [allApplications, selectedFilter])

    const getSectionTitle = () => {
        if (selectedFilter) {
            return `${selectedFilter} Applications`
        }
        
        const today = new Date().toISOString().split('T')[0]
        const todaysCount = allApplications.filter(app => app.dateApplied === today).length
        
        if (todaysCount > 0) {
            return `Today's Applications (${todaysCount})`
        }
        
        return "Recent Applications (Last 5)"
    }

    const handleStatClick = (filter: string | null, clickable: boolean) => {
        if (!clickable) return
        setSelectedFilter(selectedFilter === filter ? null : filter)
    }

    const getStatusBadgeColor = (status: string) => {
        switch (status) {
            case 'Applied':
                return 'bg-blue-100 text-blue-800 hover:bg-blue-100'
            case 'Interview':
                return 'bg-green-100 text-green-800 hover:bg-green-100'
            case 'Offer':
                return 'bg-purple-100 text-purple-800 hover:bg-purple-100'
            case 'Rejected':
                return 'bg-red-100 text-red-800 hover:bg-red-100'
            default:
                return 'bg-gray-100 text-gray-800 hover:bg-gray-100'
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
                {stats.map((stat) => (
                    <Card 
                        key={stat.title} 
                        className={`p-4 sm:p-6 transition-all duration-200 ${
                            stat.clickable 
                                ? 'cursor-pointer hover:shadow-md hover:scale-105 active:scale-95' 
                                : ''
                        } ${
                            selectedFilter === stat.filter 
                                ? 'ring-2 ring-blue-500 shadow-lg' 
                                : ''
                        }`}
                        onClick={() => handleStatClick(stat.filter, stat.clickable)}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                                <p className="text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wide truncate">
                                    {stat.title}
                                </p>
                                <p className="text-2xl sm:text-3xl font-bold mt-1 sm:mt-2">{stat.value}</p>
                            </div>
                            <div className={`h-10 w-10 sm:h-12 sm:w-12 rounded-lg ${stat.bgColor} flex items-center justify-center flex-shrink-0 ml-3`}>
                                <stat.icon className={`h-5 w-5 sm:h-6 sm:w-6 ${stat.iconColor}`} />
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Applications Table */}
            <Card className="mt-6 sm:mt-8">
                <CardHeader className="pb-3 sm:pb-4 px-4 sm:px-6">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-lg sm:text-xl font-semibold">{getSectionTitle()}</CardTitle>
                        {selectedFilter && (
                            <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => setSelectedFilter(null)}
                                className="text-xs"
                            >
                                Clear Filter
                            </Button>
                        )}
                    </div>
                </CardHeader>
                <CardContent className="px-0">
                    {/* Mobile Card View */}
                    <div className="block lg:hidden">
                        <div className="space-y-3 px-4 sm:px-6">
                            {displayedApplications.length === 0 ? (
                                <div className="py-12 text-center">
                                    <div className="flex flex-col items-center justify-center space-y-3 text-gray-500">
                                        <FileText className="h-12 w-12" />
                                        <p className="text-lg">No applications found</p>
                                        <p className="text-sm">Get started by adding your first job application</p>
                                    </div>
                                </div>
                            ) : (
                                displayedApplications.map((app: JobApplication, index: number) => (
                                    <Card key={index} className="p-4 border border-gray-200">
                                        <div className="space-y-3">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-medium text-gray-900 truncate">{app.jobTitle}</h3>
                                                    <p className="text-sm text-gray-600 truncate">{app.company}</p>
                                                </div>
                                                <Badge 
                                                    className={`${getStatusBadgeColor(app.status)} ml-2 flex-shrink-0`}
                                                >
                                                    {app.status}
                                                </Badge>
                                            </div>
                                            <div className="flex items-center justify-between text-sm text-gray-500">
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
                                {displayedApplications.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="px-6 py-16 text-center">
                                            <div className="flex flex-col items-center justify-center space-y-3 text-gray-500">
                                                <FileText className="h-12 w-12" />
                                                <p className="text-lg">No applications found</p>
                                                <p className="text-sm">Get started by adding your first job application</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    displayedApplications.map((app: JobApplication, index: number) => (
                                        <TableRow key={index} className="border-b border-border hover:bg-muted/50 transition-colors">
                                            <TableCell className="px-6 py-4 font-medium">{app.jobTitle}</TableCell>
                                            <TableCell className="px-6 py-4">{app.company}</TableCell>
                                            <TableCell className="px-6 py-4">{app.location}</TableCell>
                                            <TableCell className="px-6 py-4">
                                                <Badge 
                                                    className={getStatusBadgeColor(app.status)}
                                                >
                                                    {app.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="px-6 py-4 text-gray-500">{app.dateApplied}</TableCell>
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