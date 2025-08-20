/* eslint-disable -- Auto Generated File */
import { emptySplitApi as api } from "../empty-api";
export const addTagTypes = ["JobApplications"] as const;
const injectedRtkApi = api
  .enhanceEndpoints({
    addTagTypes,
  })
  .injectEndpoints({
    endpoints: (build) => ({
      getJobApplications: build.query<
        GetJobApplicationsApiResponse,
        GetJobApplicationsApiArg
      >({
        query: () => ({ url: `/api/JobApplications` }),
        providesTags: ["JobApplications"],
      }),
      createJobApplication: build.mutation<
        CreateJobApplicationApiResponse,
        CreateJobApplicationApiArg
      >({
        query: (queryArg) => ({
          url: `/api/JobApplications`,
          method: "POST",
          body: queryArg.createJobApplicationCommand,
        }),
        invalidatesTags: ["JobApplications"],
      }),
      getJobApplication: build.query<
        GetJobApplicationApiResponse,
        GetJobApplicationApiArg
      >({
        query: (queryArg) => ({ url: `/api/JobApplications/${queryArg.id}` }),
        providesTags: ["JobApplications"],
      }),
      updateJobApplication: build.mutation<
        UpdateJobApplicationApiResponse,
        UpdateJobApplicationApiArg
      >({
        query: (queryArg) => ({
          url: `/api/JobApplications/${queryArg.id}`,
          method: "PUT",
          body: queryArg.updateJobApplicationCommand,
        }),
        invalidatesTags: ["JobApplications"],
      }),
      deleteJobApplication: build.mutation<
        DeleteJobApplicationApiResponse,
        DeleteJobApplicationApiArg
      >({
        query: (queryArg) => ({
          url: `/api/JobApplications/${queryArg.id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["JobApplications"],
      }),
    }),
    overrideExisting: false,
  });
export { injectedRtkApi as jobApplicationsApi };
export type GetJobApplicationsApiResponse =
  /** status 200 Successful Response */ JobApplication[];
export type GetJobApplicationsApiArg = void;
export type CreateJobApplicationApiResponse =
  /** status 200 Successful Response */ number;
export type CreateJobApplicationApiArg = {
  createJobApplicationCommand: CreateJobApplicationCommand;
};
export type GetJobApplicationApiResponse =
  /** status 200 Successful Response */ JobApplication;
export type GetJobApplicationApiArg = {
  id: number;
};
export type UpdateJobApplicationApiResponse =
  /** status 200 Successful Response */ any;
export type UpdateJobApplicationApiArg = {
  id: number;
  updateJobApplicationCommand: UpdateJobApplicationCommand;
};
export type DeleteJobApplicationApiResponse =
  /** status 200 Successful Response */ any;
export type DeleteJobApplicationApiArg = {
  id: number;
};
export type JobApplication = {
  id: number;
  jobTitle: string;
  company: string;
  dateApplied: string;
  status: string;
  description?: string | null;
  jobUrl?: string | null;
  salary?: string | null;
  location?: string | null;
};
export type ValidationError = {
  loc: (string | number)[];
  msg: string;
  type: string;
};
export type HttpValidationError = {
  detail?: ValidationError[];
};
export type CreateJobApplicationCommand = {
  jobTitle: string;
  company: string;
  dateApplied: string;
  status: string;
  description?: string | null;
  jobUrl?: string | null;
  salary?: string | null;
  location?: string | null;
};
export type UpdateJobApplicationCommand = {
  jobTitle: string;
  company: string;
  dateApplied: string;
  status: string;
  description?: string | null;
  jobUrl?: string | null;
  salary?: string | null;
  location?: string | null;
};
export const {
  useGetJobApplicationsQuery,
  useCreateJobApplicationMutation,
  useGetJobApplicationQuery,
  useUpdateJobApplicationMutation,
  useDeleteJobApplicationMutation,
} = injectedRtkApi;
