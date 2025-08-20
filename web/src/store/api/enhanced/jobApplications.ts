import { jobApplicationsApi } from "../generated/jobApplications";

export const enhancedJobApplicationsApi = jobApplicationsApi.enhanceEndpoints({
    addTagTypes: [
        'JobApplication', 
        'JobApplicationList',
        'JobApplicationStats'
    ],
    endpoints: {
        getJobApplications: {
            providesTags: (result) => [
                'JobApplicationList',
                'JobApplicationStats',
                ...(result || []).map(({ id }) => ({ type: 'JobApplication' as const, id }))
            ],
        },
        getJobApplication: {
            providesTags: (_, __, arg) => [
                { type: 'JobApplication', id: arg.id }
            ],
        },
        createJobApplication: {
            invalidatesTags: [
                'JobApplicationList', 
                'JobApplicationStats'
            ],
        },
        updateJobApplication: {
            invalidatesTags: (_, __, arg) => [
                { type: 'JobApplication', id: arg.id },
                'JobApplicationList',
                'JobApplicationStats'
            ],
        },
        deleteJobApplication: {
            invalidatesTags: (_, __, arg) => [
                { type: 'JobApplication', id: arg.id },
                'JobApplicationList',
                'JobApplicationStats'
            ],
        },
    }
});

export const {
  useGetJobApplicationsQuery,
  useGetJobApplicationQuery,
  useCreateJobApplicationMutation,
  useUpdateJobApplicationMutation,
  useDeleteJobApplicationMutation,
} = enhancedJobApplicationsApi;

// Export types from the generated API
export type {
  JobApplication,
  CreateJobApplicationCommand,
  UpdateJobApplicationCommand,
  GetJobApplicationsApiResponse,
  GetJobApplicationApiResponse,
  CreateJobApplicationApiResponse,
  UpdateJobApplicationApiResponse,
  DeleteJobApplicationApiResponse,
} from '../generated/jobApplications';