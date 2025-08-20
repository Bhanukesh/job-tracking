"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Edit, Trash2, Plus } from "lucide-react"
import Link from "next/link"
import { EditJobModal } from "@/components/edit-job-modal"

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
    const applications: JobApplication[] = [
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
        }
    ]

    const getStatusBadgeColor = (status: string) => {
        switch (status) {
            case 'Applied':
                return 'bg-blue-100 text-blue-800 hover:bg-blue-100'
            case 'Interview':
                return 'bg-green-100 text-green-800 hover:bg-green-100'
            case 'Offers':
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
                <h1 className="text-xl sm:text-2xl font-bold">All Applications</h1>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                <div className="relative flex-1 max-w-full sm:max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input 
                        placeholder="Search applications..." 
                        className="pl-10 w-full"
                    />
                </div>
                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                    <Select defaultValue="all">
                        <SelectTrigger className="w-full sm:w-48">
                            <SelectValue placeholder="All Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="applied">Applied</SelectItem>
                            <SelectItem value="interview">Interview</SelectItem>
                            <SelectItem value="offers">Offers</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                        </SelectContent>
                    </Select>
                    <Input 
                        type="date"
                        placeholder="mm/dd/yyyy"
                        className="w-full sm:w-48"
                    />
                </div>
            </div>

            {/* Applications Table */}
            <Card>
                <CardContent className="p-0">
                    {/* Mobile Card View */}
                    <div className="block lg:hidden">
                        <div className="space-y-3 p-4 sm:p-6">
                            {applications.map((app) => (
                                <Card key={app.id} className="p-4 border border-gray-200 hover:shadow-md transition-shadow">
                                    <div className="space-y-3">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1 min-w-0">
                                                <Link 
                                                    href={`/applications/${app.id}`}
                                                    className="font-medium text-gray-900 hover:text-blue-600 hover:underline block truncate"
                                                >
                                                    {app.jobTitle}
                                                </Link>
                                                <p className="text-sm text-gray-600 truncate">{app.company}</p>
                                            </div>
                                            <Badge 
                                                variant="secondary"
                                                className={`${getStatusBadgeColor(app.status)} ml-2 flex-shrink-0`}
                                            >
                                                {app.status}
                                            </Badge>
                                        </div>
                                        <div className="grid grid-cols-1 gap-2 text-sm text-gray-500">
                                            <div className="flex items-center justify-between">
                                                <span className="truncate">{app.location}</span>
                                                <span className="flex-shrink-0 ml-2">{app.dateApplied}</span>
                                            </div>
                                            <div className="truncate font-medium text-gray-900">{app.salary}</div>
                                        </div>
                                        <div className="flex items-center justify-end space-x-2 pt-2 border-t border-gray-100">
                                            <EditJobModal 
                                                job={app}
                                                trigger={
                                                    <Button variant="ghost" size="sm" className="h-8 px-2">
                                                        <Edit className="h-4 w-4 text-blue-600 mr-1" />
                                                        <span className="text-xs">Edit</span>
                                                    </Button>
                                                }
                                            />
                                            <Button variant="ghost" size="sm" className="h-8 px-2">
                                                <Trash2 className="h-4 w-4 text-red-600 mr-1" />
                                                <span className="text-xs">Delete</span>
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>

                    {/* Desktop Table View */}
                    <div className="hidden lg:block">
                        <Table>
                            <TableHeader>
                                <TableRow className="border-b bg-gray-50">
                                    <TableHead className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">JOB TITLE</TableHead>
                                    <TableHead className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">COMPANY</TableHead>
                                    <TableHead className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">LOCATION</TableHead>
                                    <TableHead className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">SALARY</TableHead>
                                    <TableHead className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">STATUS</TableHead>
                                    <TableHead className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">DATE APPLIED</TableHead>
                                    <TableHead className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">ACTIONS</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {applications.map((app) => (
                                    <TableRow key={app.id} className="border-b border-gray-100 hover:bg-gray-50">
                                        <TableCell className="px-6 py-4">
                                            <Link 
                                                href={`/applications/${app.id}`}
                                                className="font-medium text-gray-900 hover:text-blue-600 hover:underline"
                                            >
                                                {app.jobTitle}
                                            </Link>
                                        </TableCell>
                                        <TableCell className="px-6 py-4 text-gray-900">{app.company}</TableCell>
                                        <TableCell className="px-6 py-4 text-gray-500">{app.location}</TableCell>
                                        <TableCell className="px-6 py-4 text-gray-900">{app.salary}</TableCell>
                                        <TableCell className="px-6 py-4">
                                            <Badge 
                                                variant="secondary"
                                                className={getStatusBadgeColor(app.status)}
                                            >
                                                {app.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="px-6 py-4 text-gray-500">{app.dateApplied}</TableCell>
                                        <TableCell className="px-6 py-4">
                                            <div className="flex items-center space-x-2">
                                                <EditJobModal 
                                                    job={app}
                                                    trigger={
                                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                            <Edit className="h-4 w-4 text-blue-600" />
                                                        </Button>
                                                    }
                                                />
                                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                    <Trash2 className="h-4 w-4 text-red-600" />
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
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                <p className="text-sm text-gray-700 text-center sm:text-left">
                    Showing 1 to 10 of 24 results
                </p>
                <div className="flex items-center justify-center space-x-1 sm:space-x-2">
                    <Button variant="outline" size="sm" disabled className="px-2 sm:px-3">
                        Previous
                    </Button>
                    <Button variant="default" size="sm" className="bg-blue-600 px-2 sm:px-3">
                        1
                    </Button>
                    <Button variant="outline" size="sm" className="px-2 sm:px-3">
                        2
                    </Button>
                    <Button variant="outline" size="sm" className="px-2 sm:px-3">
                        3
                    </Button>
                    <Button variant="outline" size="sm" className="px-2 sm:px-3">
                        Next
                    </Button>
                </div>
            </div>
        </div>
    );
}