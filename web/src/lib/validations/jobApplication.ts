import { z } from "zod";

export const jobApplicationSchema = z.object({
  jobTitle: z
    .string()
    .min(1, "Job title is required")
    .min(2, "Job title must be at least 2 characters")
    .max(100, "Job title must not exceed 100 characters"),
  
  company: z
    .string()
    .min(1, "Company is required")
    .min(2, "Company name must be at least 2 characters")
    .max(100, "Company name must not exceed 100 characters"),
  
  location: z
    .string()
    .max(100, "Location must not exceed 100 characters")
    .optional()
    .or(z.literal("")),
  
  salary: z
    .string()
    .max(50, "Salary range must not exceed 50 characters")
    .optional()
    .or(z.literal("")),
  
  status: z
    .enum(["Applied", "Interview", "Offer", "Rejected"], {
      required_error: "Status is required",
      invalid_type_error: "Please select a valid status",
    }),
  
  description: z
    .string()
    .max(2000, "Description must not exceed 2000 characters")
    .optional()
    .or(z.literal("")),
  
  jobUrl: z
    .string()
    .url("Please enter a valid URL")
    .optional()
    .or(z.literal("")),
  
  dateApplied: z
    .string()
    .min(1, "Date applied is required")
    .refine((val) => {
      const date = new Date(val);
      return !isNaN(date.getTime());
    }, "Please enter a valid date"),
});

export type JobApplicationFormData = z.infer<typeof jobApplicationSchema>;

// Transform the form data to match the API expected format
export const transformToCreateCommand = (data: JobApplicationFormData) => ({
  jobTitle: data.jobTitle,
  company: data.company,
  dateApplied: data.dateApplied,
  status: data.status,
  description: data.description || null,
  jobUrl: data.jobUrl || null,
  salary: data.salary || null,
  location: data.location || null,
});