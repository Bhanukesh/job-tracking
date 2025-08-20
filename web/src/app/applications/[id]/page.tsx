"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit, ExternalLink, MapPin, DollarSign, Calendar, Building } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"

interface JobApplicationDetail {
    id: string;
    jobTitle: string;
    company: string;
    location: string;
    salary: string;
    status: 'Applied' | 'Interview' | 'Offers' | 'Rejected';
    dateApplied: string;
    description: string;
    jobUrl: string;
}

export default function JobDetailPage() {
    const params = useParams()
    const jobId = params.id as string

    // Mock data - in real app this would come from API
    const jobDetails: JobApplicationDetail = {
        id: jobId,
        jobTitle: "Senior Frontend Developer",
        company: "TechCorp Solutions",
        location: "San Francisco, CA",
        salary: "$120,000 - $150,000",
        status: "Interview",
        dateApplied: "January 14, 2024",
        description: `We are looking for a Senior Frontend Developer to join our dynamic team. The ideal candidate will have extensive experience with React, TypeScript, and modern frontend technologies.

Key Responsibilities:
• Develop and maintain high-quality web applications using React and TypeScript
• Collaborate with designers and backend developers to implement user interfaces
• Optimize applications for maximum speed and scalability
• Write clean, maintainable, and well-documented code
• Participate in code reviews and mentor junior developers
• Stay up-to-date with the latest frontend technologies and best practices

Requirements:
• 5+ years of experience in frontend development
• Strong proficiency in React, TypeScript, HTML5, CSS3
• Experience with state management libraries (Redux, Zustand)
• Knowledge of modern build tools (Webpack, Vite)
• Understanding of responsive design principles
• Experience with testing frameworks (Jest, React Testing Library)
• Strong problem-solving skills and attention to detail

Benefits:
• Competitive salary and equity package
• Comprehensive health, dental, and vision insurance
• Flexible work arrangements (hybrid/remote options)
• Professional development budget
• Generous PTO policy`,
        jobUrl: "https://techcorp.com/careers/senior-frontend-developer"
    }

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
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                <div className="flex flex-col sm:flex-row sm:items-start space-y-3 sm:space-y-0 sm:space-x-4">
                    <Link href="/applications">
                        <Button variant="ghost" size="sm" className="flex items-center self-start">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Applications
                        </Button>
                    </Link>
                    <div className="min-w-0">
                        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 break-words">{jobDetails.jobTitle}</h1>
                        <p className="text-base sm:text-lg text-gray-600 truncate">{jobDetails.company}</p>
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-3">
                    <Badge 
                        variant="secondary"
                        className={`${getStatusBadgeColor(jobDetails.status)} text-sm px-3 py-1 self-start sm:self-auto`}
                    >
                        {jobDetails.status}
                    </Badge>
                    <Button className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Application
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="xl:col-span-2 space-y-6">
                    {/* Job Description */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg sm:text-xl">Job Description</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="prose max-w-none">
                                <div className="whitespace-pre-line text-gray-700 leading-relaxed text-sm sm:text-base">
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
                                <Building className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                                <div className="min-w-0">
                                    <p className="text-sm font-medium text-gray-500">Company</p>
                                    <p className="text-gray-900 break-words">{jobDetails.company}</p>
                                </div>
                            </div>
                            
                            <div className="flex items-start space-x-3">
                                <MapPin className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                                <div className="min-w-0">
                                    <p className="text-sm font-medium text-gray-500">Location</p>
                                    <p className="text-gray-900 break-words">{jobDetails.location}</p>
                                </div>
                            </div>
                            
                            <div className="flex items-start space-x-3">
                                <DollarSign className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                                <div className="min-w-0">
                                    <p className="text-sm font-medium text-gray-500">Salary Range</p>
                                    <p className="text-gray-900 break-words">{jobDetails.salary}</p>
                                </div>
                            </div>
                            
                            <div className="flex items-start space-x-3">
                                <Calendar className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                                <div className="min-w-0">
                                    <p className="text-sm font-medium text-gray-500">Date Applied</p>
                                    <p className="text-gray-900">{jobDetails.dateApplied}</p>
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
                                onClick={() => window.open(jobDetails.jobUrl, '_blank')}
                            >
                                <ExternalLink className="h-4 w-4 mr-2 flex-shrink-0" />
                                <span className="truncate">View Original Job Posting</span>
                            </Button>
                            
                            <Button 
                                variant="outline" 
                                className="w-full justify-start text-sm"
                            >
                                <Edit className="h-4 w-4 mr-2 flex-shrink-0" />
                                Update Status
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Application Timeline */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg sm:text-xl">Application Timeline</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-start space-x-3">
                                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-medium">Interview Scheduled</p>
                                        <p className="text-xs text-gray-500">January 18, 2024</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-medium">Application Submitted</p>
                                        <p className="text-xs text-gray-500">January 14, 2024</p>
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
