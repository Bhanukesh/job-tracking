"use client"

import { useState, useMemo, KeyboardEvent } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Edit, Trash2, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { EditJobModal } from "@/components/edit-job-modal"
import { AddJobModal } from "@/components/add-job-modal"

interface JobApplication {
    id: string;
    jobTitle: string;
    company: string;
    location: string;
    salary: string;
    status: 'Applied' | 'Interview' | 'Offer' | 'Rejected';
    dateApplied: string;
    description: string;
    jobUrl: string;
}

export default function ApplicationsPage() {
    const router = useRouter()
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 20
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [dateFilter, setDateFilter] = useState("")
    
    const applications: JobApplication[] = useMemo(() => [
        {
            id: "1",
            jobTitle: "Senior Frontend Developer",
            company: "TechCorp Solutions",
            location: "San Francisco, CA",
            salary: "$120,000 - $150,000",
            status: "Interview",
            dateApplied: "1/14/2024",
            description: "We are looking for a Senior Frontend Developer...",
            jobUrl: "https://techcorp.com/careers/senior-frontend"
        },
        {
            id: "2",
            jobTitle: "Full Stack Engineer",
            company: "StartupXYZ",
            location: "New York, NY",
            salary: "$100,000 - $130,000",
            status: "Offer",
            dateApplied: "1/11/2024",
            description: "Join our team as a Full Stack Engineer...",
            jobUrl: "https://startupxyz.com/jobs/fullstack"
        },
        {
            id: "3",
            jobTitle: "Software Engineer",
            company: "BigTech Inc",
            location: "Seattle, WA",
            salary: "$140,000 - $180,000",
            status: "Rejected",
            dateApplied: "1/9/2024",
            description: "Software Engineer position at BigTech...",
            jobUrl: "https://bigtech.com/careers/software-engineer"
        },
        {
            id: "4",
            jobTitle: "React Developer",
            company: "InnovateLab",
            location: "Austin, TX",
            salary: "$90,000 - $120,000",
            status: "Applied",
            dateApplied: "1/7/2024",
            description: "React Developer role focusing on modern web apps...",
            jobUrl: "https://innovatelab.com/jobs/react-dev"
        },
        {
            id: "5",
            jobTitle: "Backend Developer",
            company: "DevCo",
            location: "Remote",
            salary: "$110,000 - $140,000",
            status: "Offer",
            dateApplied: "1/4/2024",
            description: "Backend Developer position working with Node.js...",
            jobUrl: "https://devco.com/careers/backend"
        },
        // Adding more sample data for pagination testing
        ...Array.from({ length: 45 }, (_, i) => ({
            id: (i + 6).toString(),
            jobTitle: `${['Software Engineer', 'Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'DevOps Engineer', 'Data Scientist', 'Product Manager', 'UI/UX Designer', 'Mobile Developer', 'Cloud Engineer'][i % 10]} ${i + 6}`,
            company: `Company ${String.fromCharCode(65 + (i % 26))}${Math.floor(i / 26) + 1}`,
            location: `${['San Francisco, CA', 'New York, NY', 'Seattle, WA', 'Austin, TX', 'Remote', 'Boston, MA', 'Chicago, IL', 'Los Angeles, CA', 'Denver, CO', 'Miami, FL'][i % 10]}`,
            salary: `$${80 + (i * 5)},000 - $${120 + (i * 5)},000`,
            status: (['Applied', 'Interview', 'Offer', 'Rejected'] as const)[i % 4],
            dateApplied: `${Math.floor(Math.random() * 12) + 1}/${Math.floor(Math.random() * 28) + 1}/2024`,
            description: `Job description for ${['Software Engineer', 'Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'DevOps Engineer'][i % 5]} position...`,
            jobUrl: `https://company${String.fromCharCode(97 + (i % 26))}.com/jobs/${i + 6}`
        }))
    ], [])

    const filteredApplications = useMemo(() => {
        return applications.filter(app => {
            // Search filter - check job title, company, and location
            const matchesSearch = searchTerm === "" || 
                app.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                app.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                app.location.toLowerCase().includes(searchTerm.toLowerCase())
            
            // Status filter
            const matchesStatus = statusFilter === "all" || 
                app.status.toLowerCase() === statusFilter.toLowerCase()
            
            // Date filter
            const matchesDate = dateFilter === "" || app.dateApplied === new Date(dateFilter).toLocaleDateString('en-US', {
                month: 'numeric',
                day: 'numeric', 
                year: 'numeric'
            })
            
            return matchesSearch && matchesStatus && matchesDate
        })
    }, [applications, searchTerm, statusFilter, dateFilter])

    const totalPages = Math.ceil(filteredApplications.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const currentApplications = filteredApplications.slice(startIndex, endIndex)

    const goToPage = (page: number) => {
        setCurrentPage(page)
    }

    const handleSearchEnter = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            setCurrentPage(1) // Reset to first page when searching
        }
    }

    const handleStatusChange = (value: string) => {
        setStatusFilter(value)
        setCurrentPage(1) // Reset to first page when filtering
    }

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDateFilter(e.target.value)
        setCurrentPage(1) // Reset to first page when filtering
    }

    const goToPrevious = () => {
        setCurrentPage(prev => Math.max(prev - 1, 1))
    }

    const goToNext = () => {
        setCurrentPage(prev => Math.min(prev + 1, totalPages))
    }

    const getPageNumbers = () => {
        const pages = []
        const showPages = 5
        
        if (totalPages <= showPages) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i)
            }
        } else {
            const start = Math.max(1, currentPage - Math.floor(showPages / 2))
            const end = Math.min(totalPages, start + showPages - 1)
            
            if (start > 1) {
                pages.push(1)
                if (start > 2) pages.push('...')
            }
            
            for (let i = start; i <= end; i++) {
                pages.push(i)
            }
            
            if (end < totalPages) {
                if (end < totalPages - 1) pages.push('...')
                pages.push(totalPages)
            }
        }
        
        return pages
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

    return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground">All Applications</h1>
                <div className="flex justify-end">
<AddJobModal />
                </div>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
                <div className="relative flex-1 max-w-full lg:max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                        placeholder="Search applications..." 
                        className="pl-10 w-full"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={handleSearchEnter}
                    />
                </div>
                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                    <Select value={statusFilter} onValueChange={handleStatusChange}>
                        <SelectTrigger className="w-full sm:w-48">
                            <SelectValue placeholder="All Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="applied">Applied</SelectItem>
                            <SelectItem value="interview">Interview</SelectItem>
                            <SelectItem value="offer">Offers</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                        </SelectContent>
                    </Select>
                    <Input 
                        type="date"
                        placeholder="mm/dd/yyyy"
                        className="w-full sm:w-48"
                        value={dateFilter}
                        onChange={handleDateChange}
                    />
                </div>
            </div>

            {/* Applications Table */}
            <Card className="overflow-hidden">
                <CardContent className="p-0">
                    {/* Mobile Card View */}
                    <div className="block xl:hidden">
                        <div className="space-y-4 p-4 sm:p-6">
                            {currentApplications.map((app) => (
                                <Card key={app.id} className="p-4 border border-border hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push(`/applications/${app.id}`)}>
                                    <div className="space-y-4">
                                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-3 sm:space-y-0">
                                            <div className="flex-1 min-w-0 space-y-1">
                                                <Link 
                                                    href={`/applications/${app.id}`}
                                                    className="font-semibold text-lg text-foreground hover:text-primary hover:underline block"
                                                >
                                                    {app.jobTitle}
                                                </Link>
                                                <p className="text-base text-muted-foreground font-medium">{app.company}</p>
                                                <p className="text-sm text-muted-foreground">{app.location}</p>
                                            </div>
                                            <Badge 
                                                variant="secondary"
                                                className={`${getStatusBadgeColor(app.status)} flex-shrink-0 text-sm px-3 py-1`}
                                            >
                                                {app.status}
                                            </Badge>
                                        </div>
                                        
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                                            <div>
                                                <span className="text-muted-foreground">Salary:</span>
                                                <p className="font-medium text-foreground">{app.salary}</p>
                                            </div>
                                            <div>
                                                <span className="text-muted-foreground">Applied:</span>
                                                <p className="font-medium text-foreground">{app.dateApplied}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center justify-end space-x-2 pt-3 border-t border-border" onClick={(e) => e.stopPropagation()}>
                                            <EditJobModal 
                                                job={app}
                                                trigger={
                                                    <Button variant="ghost" size="sm" className="h-8 px-3">
                                                        <Edit className="h-4 w-4 text-primary mr-1" />
                                                        <span className="text-xs">Edit</span>
                                                    </Button>
                                                }
                                            />
                                            <Button variant="ghost" size="sm" className="h-8 px-3">
                                                <Trash2 className="h-4 w-4 text-destructive mr-1" />
                                                <span className="text-xs">Delete</span>
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>

                    {/* Desktop Table View */}
                    <div className="hidden xl:block overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="border-b bg-muted/50">
                                    <TableHead className="px-4 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Job Title</TableHead>
                                    <TableHead className="px-4 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Company</TableHead>
                                    <TableHead className="px-4 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Location</TableHead>
                                    <TableHead className="px-4 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Salary</TableHead>
                                    <TableHead className="px-4 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</TableHead>
                                    <TableHead className="px-4 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Date Applied</TableHead>
                                    <TableHead className="px-4 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {currentApplications.map((app) => (
                                    <TableRow key={app.id} className="border-b border-border hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => router.push(`/applications/${app.id}`)}>
                                        <TableCell className="px-4 py-4">
                                            <Link 
                                                href={`/applications/${app.id}`}
                                                className="font-semibold text-foreground hover:text-primary hover:underline transition-colors"
                                            >
                                                {app.jobTitle}
                                            </Link>
                                        </TableCell>
                                        <TableCell className="px-4 py-4 text-foreground font-medium">{app.company}</TableCell>
                                        <TableCell className="px-4 py-4 text-muted-foreground">{app.location}</TableCell>
                                        <TableCell className="px-4 py-4 text-foreground font-medium">{app.salary}</TableCell>
                                        <TableCell className="px-4 py-4">
                                            <Badge 
                                                variant="secondary"
                                                className={getStatusBadgeColor(app.status)}
                                            >
                                                {app.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="px-4 py-4 text-muted-foreground">{app.dateApplied}</TableCell>
                                        <TableCell className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                                            <div className="flex items-center justify-end space-x-1">
                                                <EditJobModal 
                                                    job={app}
                                                    trigger={
                                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                            <Edit className="h-4 w-4 text-primary" />
                                                        </Button>
                                                    }
                                                />
                                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                    <Trash2 className="h-4 w-4 text-destructive" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 pt-4">
                <p className="text-sm text-gray-600 text-center sm:text-left">
                    Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                    <span className="font-medium">{Math.min(endIndex, filteredApplications.length)}</span> of{' '}
                    <span className="font-medium">{filteredApplications.length}</span> results
                </p>
                <div className="flex items-center justify-center space-x-1">
                    <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={goToPrevious}
                        disabled={currentPage === 1}
                        className="px-3 py-2 text-sm flex items-center gap-1"
                    >
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                    </Button>
                    
                    <div className="flex space-x-1">
                        {getPageNumbers().map((page, index) => (
                            <span key={index}>
                                {page === '...' ? (
                                    <span className="px-2 py-2 text-sm text-gray-500">...</span>
                                ) : (
                                    <Button 
                                        variant={currentPage === page ? "default" : "outline"}
                                        size="sm" 
                                        onClick={() => goToPage(page as number)}
                                        className={`px-3 py-2 text-sm ${
                                            currentPage === page 
                                                ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                                                : ''
                                        }`}
                                    >
                                        {page}
                                    </Button>
                                )}
                            </span>
                        ))}
                    </div>
                    
                    <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={goToNext}
                        disabled={currentPage === totalPages}
                        className="px-3 py-2 text-sm flex items-center gap-1"
                    >
                        Next
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}