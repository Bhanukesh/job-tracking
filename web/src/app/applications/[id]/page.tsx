"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Edit, ExternalLink, MapPin, DollarSign, Calendar, Building } from "lucide-react"
import Link from "next/link"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { EditJobModal } from "@/components/edit-job-modal"
import { useGetJobApplicationsQuery } from "@/store/api/enhanced/jobApplications"
import { useMemo, useEffect, useState } from "react"
import { CompanyLogo } from "@/components/company-logo"

export default function JobDetailPage() {
    const params = useParams()
    const router = useRouter()
    const searchParams = useSearchParams()
    const jobId = params.id as string
    
    // Determine back URL based on search parameter
    const fromParam = searchParams.get('from')
    const backUrl = fromParam === 'dashboard' ? '/' : '/applications'

    // Fetch applications and find the specific job
    const { data: applications = [], isLoading, error } = useGetJobApplicationsQuery()
    
    // Find the specific job application by ID
    const jobDetails = useMemo(() => {
        return applications.find(app => app.id.toString() === jobId)
    }, [applications, jobId])

    // If loading, show loading state
    if (isLoading) {
        return (
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                        <p className="mt-2 text-muted-foreground">Loading job details...</p>
                    </div>
                </div>
            </div>
        )
    }

    // If job not found, show not found state
    if (!jobDetails) {
        return (
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-foreground">Job Not Found</h1>
                        <p className="mt-2 text-muted-foreground">The job application you're looking for doesn't exist.</p>
                        <Link href={backUrl} className="mt-4 inline-block">
                            <Button variant="outline">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                {backUrl === '/' ? 'Back to Dashboard' : 'Back to Applications'}
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        )
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
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                <div className="flex flex-col sm:flex-row sm:items-start space-y-3 sm:space-y-0 sm:space-x-4">
                    <Link href={backUrl}>
                        <Button variant="ghost" size="sm" className="flex items-center self-start">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            {backUrl === '/' ? 'Back to Dashboard' : 'Back to Applications'}
                        </Button>
                    </Link>
                    
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-3">
                    <EditJobModal 
                        job={jobDetails}
                        trigger={
                            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground w-full sm:w-auto">
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Job Details
                            </Button>
                        }
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="xl:col-span-2 space-y-6">
                    {/* Job Description */}
                    <Card>
                        <CardHeader>
                            <div className="min-w-0">
                        <h1 className="text-xl sm:text-2xl font-bold text-foreground break-words">{jobDetails.jobTitle}</h1>
                        <div className="flex items-center space-x-2 mt-1">
                            <CompanyLogo company={jobDetails.company} size={24} />
                            <p className="text-base sm:text-lg text-muted-foreground">{jobDetails.company}</p>
                        </div>
                        <Badge 
                        variant="secondary"
                        className={`${getStatusBadgeColor(jobDetails.status)} text-sm px-3 py-1 my-2 self-start sm:self-auto`}
                    >
                        {jobDetails.status}
                    </Badge>
                    </div>
                    <Separator className="my-4" />

                            <CardTitle className="text-lg sm:text-xl">Job Description</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="prose max-w-none">
                                <div className="whitespace-pre-line text-foreground leading-relaxed text-sm sm:text-base">
                                    {jobDetails.description}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Job Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg sm:text-xl">Job Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-start space-x-3">
                                <Building className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                                <div className="min-w-0">
                                    <p className="text-sm font-medium text-muted-foreground">Company</p>
                                    <div className="flex items-center space-x-2">
                                        <CompanyLogo company={jobDetails.company} />
                                        <p className="text-foreground break-words">{jobDetails.company}</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex items-start space-x-3">
                                <MapPin className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                                <div className="min-w-0">
                                    <p className="text-sm font-medium text-muted-foreground">Location</p>
                                    <p className="text-foreground break-words">{jobDetails.location}</p>
                                </div>
                            </div>
                            
                            <div className="flex items-start space-x-3">
                                <DollarSign className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                                <div className="min-w-0">
                                    <p className="text-sm font-medium text-muted-foreground">Salary Range</p>
                                    <p className="text-foreground break-words">{jobDetails.salary}</p>
                                </div>
                            </div>
                            
                            <div className="flex items-start space-x-3">
                                <Calendar className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                                <div className="min-w-0">
                                    <p className="text-sm font-medium text-muted-foreground">Date Applied</p>
                                    <p className="text-foreground">{new Date(jobDetails.dateApplied).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Actions */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg sm:text-xl">Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Button 
                                variant="outline" 
                                className="w-full justify-start text-sm"
                                onClick={() => jobDetails.jobUrl && window.open(jobDetails.jobUrl, '_blank')}
                                disabled={!jobDetails.jobUrl}
                            >
                                <ExternalLink className="h-4 w-4 mr-2 flex-shrink-0" />
                                <span className="truncate">View Original Job Posting</span>
                            </Button>
                            
                            <EditJobModal 
                                job={jobDetails}
                                trigger={
                                    <Button 
                                        variant="outline" 
                                        className="w-full justify-start text-sm"
                                    >
                                        <Edit className="h-4 w-4 mr-2 flex-shrink-0" />
                                        Update Status
                                    </Button>
                                }
                            />
                        </CardContent>
                    </Card>

                    {/* Application Timeline */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg sm:text-xl">Application Timeline</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {/* Show timeline based on status */}
                                {(jobDetails.status === 'Interview' || jobDetails.status === 'Offer') && (
                                    <div className="flex items-start space-x-3">
                                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-medium text-foreground">
                                                {jobDetails.status === 'Interview' ? 'Interview Scheduled' : 'Offer Received'}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                )}
                                <div className="flex items-start space-x-3">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-medium text-foreground">Application Submitted</p>
                                        <p className="text-xs text-muted-foreground">{new Date(jobDetails.dateApplied).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
