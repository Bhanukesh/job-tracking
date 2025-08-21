"use client"

import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
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
import { Plus, Loader2, Check } from "lucide-react"
import { jobApplicationSchema, transformToCreateCommand, type JobApplicationFormData } from "@/lib/validations/jobApplication"
import { useCreateJobApplicationMutation } from "@/store/api/generated/jobApplications"
import { getCurrentDateString } from "@/lib/utils/date"
import { toast } from "sonner"
import { CompanyLogo } from "@/components/company-logo"

interface AddJobModalProps {
  trigger?: React.ReactNode;
}

export function AddJobModal({ trigger }: AddJobModalProps) {
  const [open, setOpen] = useState(false)
  const [createJobApplication, { isLoading }] = useCreateJobApplicationMutation()

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    watch,
  } = useForm<JobApplicationFormData>({
    resolver: zodResolver(jobApplicationSchema),
    defaultValues: {
      jobTitle: "",
      company: "",
      location: "",
      salary: "",
      status: "Applied",
      description: "",
      jobUrl: "",
      dateApplied: "", // No default date
    },
  })

  const watchedCompany = watch("company")

  const onSubmit = async (data: JobApplicationFormData) => {
    try {
      const createCommand = transformToCreateCommand(data)
      await createJobApplication({ createJobApplicationCommand: createCommand }).unwrap()
      
      // Show success toast with check icon
      toast.success("Job application added successfully!", {
        icon: <Check className="h-4 w-4" />,
        description: `${data.jobTitle} at ${data.company}`,
      })
      
      setOpen(false)
      reset()
    } catch (error) {
      console.error('Failed to create job application:', error)
      
      // Show error toast
      toast.error("Failed to add job application", {
        description: "Please try again later.",
      })
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (!newOpen) {
      reset()
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="mr-2 h-4 w-4" />
            Add New Job
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto mx-4">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">Add New Job Application</DialogTitle>
          <DialogDescription className="text-sm sm:text-base">
            Add a new job application to track your progress.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="jobTitle" className="text-sm font-medium">Job Title *</Label>
                <Input
                  id="jobTitle"
                  {...register("jobTitle")}
                  placeholder="e.g. Senior Frontend Developer"
                  className={`text-sm ${errors.jobTitle ? 'border-red-500 focus:border-red-500' : ''}`}
                />
                {errors.jobTitle && (
                  <p className="text-sm text-red-500">{errors.jobTitle.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="company" className="text-sm font-medium">Company *</Label>
                <div className="relative">
                  <Input
                    id="company"
                    {...register("company")}
                    placeholder="e.g. Google"
                    className={`text-sm ${errors.company ? 'border-red-500 focus:border-red-500' : ''} ${watchedCompany ? 'pl-10' : ''}`}
                  />
                  {watchedCompany && (
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                      <CompanyLogo company={watchedCompany} />
                    </div>
                  )}
                </div>
                {errors.company && (
                  <p className="text-sm text-red-500">{errors.company.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location" className="text-sm font-medium">Location</Label>
                <Input
                  id="location"
                  {...register("location")}
                  placeholder="e.g. San Francisco, CA"
                  className={`text-sm ${errors.location ? 'border-red-500 focus:border-red-500' : ''}`}
                />
                {errors.location && (
                  <p className="text-sm text-red-500">{errors.location.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="salary" className="text-sm font-medium">Salary Range</Label>
                <Input
                  id="salary"
                  {...register("salary")}
                  placeholder="e.g. $120,000 - $150,000 or 50K"
                  className={`text-sm ${errors.salary ? 'border-red-500 focus:border-red-500' : ''}`}
                />
                {errors.salary && (
                  <p className="text-sm text-red-500">{errors.salary.message}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  Examples: $120,000, 50K, $50k-$60k, 120000-150000
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status" className="text-sm font-medium">Status *</Label>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
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
                  )}
                />
                {errors.status && (
                  <p className="text-sm text-red-500">{errors.status.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateApplied" className="text-sm font-medium">Date Applied *</Label>
                <Input
                  id="dateApplied"
                  type="date"
                  {...register("dateApplied")}
                  className={`text-sm ${errors.dateApplied ? 'border-red-500 focus:border-red-500' : ''}`}
                />
                {errors.dateApplied && (
                  <p className="text-sm text-red-500">{errors.dateApplied.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="jobUrl" className="text-sm font-medium">Job URL</Label>
              <Input
                id="jobUrl"
                type="url"
                {...register("jobUrl")}
                placeholder="https://company.com/jobs/..."
                className={`text-sm ${errors.jobUrl ? 'border-red-500 focus:border-red-500' : ''}`}
              />
              {errors.jobUrl && (
                <p className="text-sm text-red-500">{errors.jobUrl.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium">Job Description</Label>
              <Textarea
                id="description"
                {...register("description")}
                placeholder="Paste the job description here..."
                className={`min-h-[100px] sm:min-h-[120px] resize-none text-sm ${errors.description ? 'border-red-500 focus:border-red-500' : ''}`}
              />
              {errors.description && (
                <p className="text-sm text-red-500">{errors.description.message}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Maximum 2000 characters
              </p>
            </div>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0 sm:space-x-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)} 
              className="w-full sm:w-auto text-sm"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto text-sm text-white"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                'Add New Job'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
