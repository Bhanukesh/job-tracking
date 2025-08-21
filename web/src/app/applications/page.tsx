"use client"

import { useState, useMemo, KeyboardEvent, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Edit, Trash2, ChevronLeft, ChevronRight, Loader2, AlertCircle, FileText } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { EditJobModal } from "@/components/edit-job-modal"
import { AddJobModal } from "@/components/add-job-modal"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { useGetJobApplicationsQuery, useDeleteJobApplicationMutation } from "@/store/api/enhanced/jobApplications"
import { CompanyLogo } from "@/components/company-logo"

export default function ApplicationsPage() {
    const router = useRouter()
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 7
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [dateFilter, setDateFilter] = useState("")
    
    const { data: applications = [], isLoading, error } = useGetJobApplicationsQuery()
    const [deleteJobApplication, { isLoading: isDeleting }] = useDeleteJobApplicationMutation()

    // Reset to page 1 when applications data changes (new items added)
    useEffect(() => {
        setCurrentPage(1)
    }, [applications?.length])

    const handleDelete = async (id: number) => {
        try {
            await deleteJobApplication({ id }).unwrap()
        } catch (error) {
            console.error('Failed to delete application:', error)
        }
    }

    const filteredApplications = useMemo(() => {
        if (!applications || applications.length === 0) return []
        
        return applications
            .filter(app => {
                // Search filter - check job title, company, and location
                const matchesSearch = searchTerm === "" || 
                    app.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    app.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    (app.location && app.location.toLowerCase().includes(searchTerm.toLowerCase()))
                
                // Status filter
                const matchesStatus = statusFilter === "all" || 
                    app.status.toLowerCase() === statusFilter.toLowerCase()
                
                // Date filter - normalize and compare dates
                const matchesDate = dateFilter === "" || (() => {
                    try {
                        // Normalize the application date to YYYY-MM-DD format
                        const appDate = new Date(app.dateApplied);
                        if (isNaN(appDate.getTime())) {
                            // Try fallback string comparison
                            return app.dateApplied.startsWith(dateFilter) || 
                                   app.dateApplied.includes(dateFilter);
                        }
                        
                        // Format application date to YYYY-MM-DD for comparison
                        const year = appDate.getFullYear();
                        const month = String(appDate.getMonth() + 1).padStart(2, '0');
                        const day = String(appDate.getDate()).padStart(2, '0');
                        const normalizedAppDate = `${year}-${month}-${day}`;
                        
                        // Compare normalized dates
                        return normalizedAppDate === dateFilter;
                    } catch (error) {
                        // Fallback: try string comparison
                        return app.dateApplied.startsWith(dateFilter) || 
                               app.dateApplied.includes(dateFilter);
                    }
                })()
                
                return matchesSearch && matchesStatus && matchesDate
            })
            .sort((a, b) => {
                // Sort by date applied in descending order (newest first)
                const dateA = new Date(a.dateApplied);
                const dateB = new Date(b.dateApplied);
                
                // If dates are invalid, treat them as oldest
                const timeA = isNaN(dateA.getTime()) ? 0 : dateA.getTime();
                const timeB = isNaN(dateB.getTime()) ? 0 : dateB.getTime();
                
                const dateDiff = timeB - timeA;
                
                // If dates are the same, sort by ID descending (newer entries typically have higher IDs)
                if (dateDiff === 0) {
                    return (b.id || 0) - (a.id || 0);
                }
                
                return dateDiff;
            })
    }, [applications, searchTerm, statusFilter, dateFilter])

    const paginatedApplications = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage
        return filteredApplications.slice(startIndex, startIndex + itemsPerPage)
    }, [filteredApplications, currentPage, itemsPerPage])

    const totalPages = Math.ceil(filteredApplications.length / itemsPerPage)
    const totalItems = filteredApplications.length

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

    const handleSearchKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            setCurrentPage(1) // Reset to first page when searching
        }
    }

    // Reset to page 1 when filters change
    const handleStatusFilterChange = (value: string) => {
        setStatusFilter(value)
        setCurrentPage(1)
    }

    const handleDateFilterChange = (value: string) => {
        setDateFilter(value)
        setCurrentPage(1)
    }

    const handleSearchChange = (value: string) => {
        setSearchTerm(value)
        if (value === "") {
            setCurrentPage(1)
        }
    }

    if (error) {
        return (
            <div className="p-4 sm:p-6 lg:p-8 space-y-6">
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
                    <h2 className="text-xl font-semibold mb-2">Failed to load applications</h2>
                    <p className="text-muted-foreground">Please try refreshing the page</p>
                </div>
            </div>
        )
    }

    return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground">All Applications</h1>
                <div className="flex justify-end">
                    <AddJobModal />
                </div>
            </div>

            {/* Filters */}
            <Card className="p-4 sm:p-6">
                <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
                    {/* Search */}
                    <div className="relative flex-1 max-w-full lg:max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search applications..."
                            value={searchTerm}
                            onChange={(e) => handleSearchChange(e.target.value)}
                            onKeyDown={handleSearchKeyDown}
                            className="pl-10"
                        />
                    </div>

                    {/* Status Filter */}
                    <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
                        <SelectTrigger className="w-full sm:w-48">
                            <SelectValue placeholder="All Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="applied">Applied</SelectItem>
                            <SelectItem value="interview">Interview</SelectItem>
                            <SelectItem value="offer">Offer</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                        </SelectContent>
                    </Select>

                    {/* Date Filter */}
                    <Input
                        type="date"
                        placeholder="mm/dd/yyyy"
                        value={dateFilter}
                        onChange={(e) => handleDateFilterChange(e.target.value)}
                        className="w-full sm:w-48"
                    />
                </div>
            </Card>

            {/* Applications Table */}
            <Card className="overflow-hidden">
                <CardContent className="p-0">
                    {/* Mobile Card View */}
                    <div className="block xl:hidden">
                        <div className="space-y-4 p-4 sm:p-6">
                            {isLoading ? (
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
                                                <div className="h-8 bg-muted rounded w-20"></div>
                                            </div>
                                        </div>
                                    </Card>
                                ))
                            ) : paginatedApplications.length === 0 ? (
                                <div className="py-12 text-center">
                                    <div className="flex flex-col items-center justify-center space-y-3 text-muted-foreground">
                                        <FileText className="h-12 w-12" />
                                        <p className="text-lg">No applications found</p>
                                        <p className="text-sm">Try adjusting your search filters or add a new application</p>
                                    </div>
                                </div>
                            ) : (
                                paginatedApplications.map((app) => (
                                    <Card key={app.id} className="p-4 border border-border cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => router.push(`/applications/${app.id}`)}>
                                        <div className="space-y-3">
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-center flex-1 min-w-0 space-x-3">
                                                    <CompanyLogo company={app.company} />
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="font-medium text-foreground truncate">{app.jobTitle}</h3>
                                                        <p className="text-sm text-muted-foreground truncate">{app.company}</p>
                                                    </div>
                                                </div>
                                                <Badge 
                                                    variant="secondary"
                                                    className={`${getStatusBadgeColor(app.status)} ml-2 flex-shrink-0`}
                                                >
                                                    {app.status}
                                                </Badge>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-muted-foreground truncate">
                                                    {app.location || 'Location not specified'}
                                                </span>
                                                <div className="flex items-center space-x-2 flex-shrink-0 ml-2">
                                                    <EditJobModal 
                                                        job={app}
                                                        trigger={
                                                            <Button variant="outline" size="sm">
                                                                <Edit className="h-4 w-4" />
                                                            </Button>
                                                        } 
                                                    />
                                                    <ConfirmDialog
                                                        trigger={
                                                            <Button variant="outline" size="sm">
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        }
                                                        title="Delete Application"
                                                        description={`Are you sure you want to delete the application for ${app.jobTitle} at ${app.company}? This action cannot be undone.`}
                                                        confirmText="Delete"
                                                        onConfirm={() => handleDelete(app.id)}
                                                        variant="destructive"
                                                    />
                                                </div>
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                Applied: {new Date(app.dateApplied).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </Card>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Desktop Table View */}
                    <div className="hidden xl:block">
                        <Table>
                            <TableHeader>
                                <TableRow className="border-b bg-muted">
                                    <TableHead className="px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">JOB TITLE</TableHead>
                                    <TableHead className="px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">COMPANY</TableHead>
                                    <TableHead className="px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">LOCATION</TableHead>
                                    <TableHead className="px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">SALARY</TableHead>
                                    <TableHead className="px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">STATUS</TableHead>
                                    <TableHead className="px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">DATE APPLIED</TableHead>
                                    <TableHead className="px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">ACTIONS</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    Array.from({ length: 5 }).map((_, index) => (
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
                                                <div className="h-4 bg-muted rounded w-1/2 animate-pulse"></div>
                                            </TableCell>
                                            <TableCell className="px-6 py-4">
                                                <div className="h-6 bg-muted rounded w-16 animate-pulse"></div>
                                            </TableCell>
                                            <TableCell className="px-6 py-4">
                                                <div className="h-4 bg-muted rounded w-20 animate-pulse"></div>
                                            </TableCell>
                                            <TableCell className="px-6 py-4">
                                                <div className="h-8 bg-muted rounded w-20 animate-pulse"></div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : paginatedApplications.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="px-6 py-16 text-center">
                                            <div className="flex flex-col items-center justify-center space-y-3 text-muted-foreground">
                                                <FileText className="h-12 w-12" />
                                                <p className="text-lg">No applications found</p>
                                                <p className="text-sm">Try adjusting your search filters or add a new application</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    paginatedApplications.map((app) => (
                                        <TableRow key={app.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                                            <TableCell className="px-6 py-4">
                                                <Link href={`/applications/${app.id}`} className="font-medium hover:underline">
                                                    {app.jobTitle}
                                                </Link>
                                            </TableCell>
                                            <TableCell className="px-6 py-4">
                                                <div className="flex items-center space-x-2">
                                                    <CompanyLogo company={app.company} />
                                                    <span>{app.company}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-6 py-4">{app.location || 'Not specified'}</TableCell>
                                            <TableCell className="px-6 py-4">{app.salary || 'Not specified'}</TableCell>
                                            <TableCell className="px-6 py-4">
                                                <Badge 
                                                    variant="secondary"
                                                    className={getStatusBadgeColor(app.status)}
                                                >
                                                    {app.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="px-6 py-4 text-muted-foreground">
                                                {new Date(app.dateApplied).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell className="px-6 py-4">
                                                <div className="flex items-center space-x-2">
                                                    <EditJobModal 
                                                        job={app}
                                                        trigger={
                                                            <Button variant="outline" size="sm">
                                                                 <Edit className="h-4 w-4 mr-2 flex-shrink-0" />
                                                                Edit
                                                            </Button>
                                                        } 
                                                    />
                                                    <ConfirmDialog
                                                        trigger={
                                                            <Button variant="outline" size="sm" >
                                                                <Trash2 className="h-4 w-4 mr-2 flex-shrink-0" />
                                                                Delete
                                                            </Button>
                                                        }
                                                        title="Delete Application"
                                                        description={`Are you sure you want to delete the application for ${app.jobTitle} at ${app.company}? This action cannot be undone.`}
                                                        confirmText="Delete"
                                                        onConfirm={() => handleDelete(app.id)}
                                                        variant="destructive"
                                                    />
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            {/* Pagination */}
            {!isLoading && totalItems > 0 && (
                <Card className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                        <div className="text-sm text-muted-foreground">
                            Showing {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)} to{' '}
                            {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} results
                        </div>
                        <div className="flex items-center space-x-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                            >
                                <ChevronLeft className="h-4 w-4" />
                                Previous
                            </Button>
                            
                            {/* Page Numbers */}
                            <div className="flex items-center space-x-1">
                                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                                    let pageNum;
                                    if (totalPages <= 5) {
                                        pageNum = i + 1;
                                    } else if (currentPage <= 3) {
                                        pageNum = i + 1;
                                    } else if (currentPage > totalPages - 3) {
                                        pageNum = totalPages - 4 + i;
                                    } else {
                                        pageNum = currentPage - 2 + i;
                                    }
                                    
                                    return (
                                        <Button
                                            key={pageNum}
                                            variant={currentPage === pageNum ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => setCurrentPage(pageNum)}
                                            className="w-8 h-8 p-0 dark:bg-accent hover:bg-accent-hover dark:text-white"
                                        >
                                            {pageNum}
                                        </Button>
                                    );
                                })}
                            </div>
                            
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                            >
                                Next
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </Card>
            )}
        </div>
    )
}