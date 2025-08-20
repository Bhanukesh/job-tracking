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
    .or(z.literal(""))
    .refine((val) => {
      if (!val || val === "") return true;
      // Basic location validation - allow letters, numbers, spaces, commas, periods, hyphens
      const locationPattern = /^[a-zA-Z0-9\s,.\-()]+$/;
      return locationPattern.test(val);
    }, "Location contains invalid characters"),
  
  salary: z
    .string()
    .max(50, "Salary range must not exceed 50 characters")
    .optional()
    .or(z.literal(""))
    .refine((val) => {
      if (!val || val === "") return true;
      // Allow patterns like: 50000, $50000, $50,000, 50K, $50K, $50k-$60k, 50000-60000, etc.
      const salaryPattern = /^[\$]?[\d,]+(?:[kK])?(?:\s*[-–—]\s*[\$]?[\d,]+(?:[kK])?)?(?:\s*(?:per|\/)\s*(?:year|yr|month|mo|hour|hr))?$/;
      return salaryPattern.test(val.trim());
    }, "Please enter a valid salary (e.g., $50,000, 50K, $50k-$60k)")
    .refine((val) => {
      if (!val || val === "") return true;
      // Ensure no invalid characters
      const cleanVal = val.replace(/[\$,\s\-–—kK]/g, '');
      return /^\d+(?:\d+)?$/.test(cleanVal);
    }, "Salary must contain only numbers, currency symbols, and valid separators"),
  
  status: z
    .enum(["Applied", "Interview", "Offer", "Rejected"], {
      message: "Please select a valid status",
    }),
  
  description: z
    .string()
    .max(2000, "Description must not exceed 2000 characters")
    .optional()
    .or(z.literal("")),
  
  jobUrl: z
    .string()
    .optional()
    .or(z.literal(""))
    .refine((val) => {
      if (!val || val === "") return true;
      // Enhanced URL validation
      const urlPattern = /^https?:\/\/(?:[-\w.])+(?:\:[0-9]+)?(?:\/(?:[\w\/_.])*(?:\?(?:[\w&=%\-.])*)?(?:\#(?:[\w\-.])*)?)?$/;
      return urlPattern.test(val);
    }, "Please enter a valid URL (e.g., https://company.com/jobs/position)")
    .refine((val) => {
      if (!val || val === "") return true;
      try {
        const url = new URL(val);
        return url.protocol === 'http:' || url.protocol === 'https:';
      } catch {
        return false;
      }
    }, "URL must be a valid web address with http:// or https://"),
  
  dateApplied: z
    .string()
    .min(1, "Date applied is required")
    .refine((val) => {
      const date = new Date(val);
      return !isNaN(date.getTime());
    }, "Please enter a valid date")
    .refine((val) => {
      const date = new Date(val);
      const today = new Date();
      return date <= today;
    }, "Date applied cannot be in the future")
    .refine((val) => {
      const date = new Date(val);
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 5); // Allow up to 5 years ago
      return date >= oneYearAgo;
    }, "Date applied cannot be more than 5 years ago"),
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