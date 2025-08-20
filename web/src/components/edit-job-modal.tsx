"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Edit, Loader2 } from "lucide-react"
import { useUpdateJobApplicationMutation, type JobApplication } from "@/store/api/generated/jobApplications"
import { jobApplicationSchema, type JobApplicationFormData } from "@/lib/validations/jobApplication"
import { z } from "zod"
import { formatDateForInput } from "@/lib/utils/date"

interface EditJobModalProps {
  job?: JobApplication;
  trigger?: React.ReactNode;
}

export function EditJobModal({ job, trigger }: EditJobModalProps) {
  const [open, setOpen] = useState(false)
  const [updateJobApplication, { isLoading }] = useUpdateJobApplicationMutation()
  const [errors, setErrors] = useState<Record<string, string>>({})
  
  const [formData, setFormData] = useState({
    jobTitle: job?.jobTitle || '',
    company: job?.company || '',
    location: job?.location || '',
    salary: job?.salary || '',
    status: job?.status || 'Applied',
    description: job?.description || '',
    jobUrl: job?.jobUrl || '',
    dateApplied: formatDateForInput(job?.dateApplied || new Date())
  })

  // Update form data when job prop changes
  useEffect(() => {
    if (job) {
      setFormData({
        jobTitle: job.jobTitle || '',
        company: job.company || '',
        location: job.location || '',
        salary: job.salary || '',
        status: job.status || 'Applied',
        description: job.description || '',
        jobUrl: job.jobUrl || '',
        dateApplied: job.dateApplied || new Date().toISOString().split('T')[0]
      })
      // Clear errors when job changes
      setErrors({})
    }
  }, [job])

  // Clear errors when modal opens/closes
  useEffect(() => {
    if (!open) {
      setErrors({})
    }
  }, [open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!job?.id) {
      console.error('No job ID provided for update')
      return
    }
    
    // Clear previous errors
    setErrors({})
    
    try {
      // Validate form data
      const validatedData = jobApplicationSchema.parse(formData)
      
      await updateJobApplication({
        id: job.id,
        updateJobApplicationCommand: {
          jobTitle: validatedData.jobTitle,
          company: validatedData.company,
          dateApplied: validatedData.dateApplied,
          status: validatedData.status,
          description: validatedData.description || null,
          jobUrl: validatedData.jobUrl || null,
          salary: validatedData.salary || null,
          location: validatedData.location || null,
        }
      }).unwrap()
      setOpen(false)
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Handle validation errors
        const fieldErrors: Record<string, string> = {}
        error.issues.forEach((issue) => {
          if (issue.path.length > 0) {
            fieldErrors[issue.path[0] as string] = issue.message
          }
        })
        setErrors(fieldErrors)
      } else {
        console.error('Failed to update job application:', error)
      }
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Clear the error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <Edit className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto mx-4">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">Edit Job Application</DialogTitle>
          <DialogDescription className="text-sm sm:text-base">
            Update your job application details.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="jobTitle" className="text-sm font-medium">Job Title *</Label>
                <Input
                  id="jobTitle"
                  value={formData.jobTitle}
                  onChange={(e) => handleInputChange("jobTitle", e.target.value)}
                  placeholder="e.g. Senior Frontend Developer"
                  required
                  className={`text-sm ${errors.jobTitle ? 'border-red-500 focus:border-red-500' : ''}`}
                />
                {errors.jobTitle && (
                  <p className="text-sm text-red-500 mt-1">{errors.jobTitle}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="company" className="text-sm font-medium">Company *</Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => handleInputChange("company", e.target.value)}
                  placeholder="e.g. Google"
                  required
                  className={`text-sm ${errors.company ? 'border-red-500 focus:border-red-500' : ''}`}
                />
                {errors.company && (
                  <p className="text-sm text-red-500 mt-1">{errors.company}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location" className="text-sm font-medium">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                  placeholder="e.g. San Francisco, CA"
                  className={`text-sm ${errors.location ? 'border-red-500 focus:border-red-500' : ''}`}
                />
                {errors.location && (
                  <p className="text-sm text-red-500 mt-1">{errors.location}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="salary" className="text-sm font-medium">Salary Range</Label>
                <Input
                  id="salary"
                  value={formData.salary}
                  onChange={(e) => handleInputChange("salary", e.target.value)}
                  placeholder="e.g. $120,000 - $150,000 or 50K"
                  className={`text-sm ${errors.salary ? 'border-red-500 focus:border-red-500' : ''}`}
                />
                {errors.salary && (
                  <p className="text-sm text-red-500 mt-1">{errors.salary}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  Examples: $120,000, 50K, $50k-$60k, 120000-150000
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status" className="text-sm font-medium">Status</Label>
                <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                  <SelectTrigger className={`text-sm ${errors.status ? 'border-red-500 focus:border-red-500' : ''}`}>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Applied">Applied</SelectItem>
                    <SelectItem value="Interview">Interview</SelectItem>
                    <SelectItem value="Offer">Offer</SelectItem>
                    <SelectItem value="Rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
                {errors.status && (
                  <p className="text-sm text-red-500 mt-1">{errors.status}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateApplied" className="text-sm font-medium">Date Applied *</Label>
                <Input
                  id="dateApplied"
                  type="date"
                  value={formData.dateApplied}
                  onChange={(e) => handleInputChange("dateApplied", e.target.value)}
                  required
                  className={`text-sm ${errors.dateApplied ? 'border-red-500 focus:border-red-500' : ''}`}
                />
                {errors.dateApplied && (
                  <p className="text-sm text-red-500 mt-1">{errors.dateApplied}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="jobUrl" className="text-sm font-medium">Job URL</Label>
              <Input
                id="jobUrl"
                type="url"
                value={formData.jobUrl}
                onChange={(e) => handleInputChange("jobUrl", e.target.value)}
                placeholder="https://company.com/jobs/..."
                className={`text-sm ${errors.jobUrl ? 'border-red-500 focus:border-red-500' : ''}`}
              />
              {errors.jobUrl && (
                <p className="text-sm text-red-500 mt-1">{errors.jobUrl}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium">Job Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange("description", e.target.value)}
                placeholder="Paste the job description here..."
                className={`min-h-[100px] sm:min-h-[120px] resize-none text-sm ${errors.description ? 'border-red-500 focus:border-red-500' : ''}`}
              />
              {errors.description && (
                <p className="text-sm text-red-500 mt-1">{errors.description}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Maximum 2000 characters ({formData.description.length}/2000)
              </p>
            </div>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0 sm:space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="w-full sm:w-auto text-sm">
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading || !job?.id}
              className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto text-sm text-white"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Application'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
