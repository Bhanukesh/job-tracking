import type { ConfigFile } from '@rtk-query/codegen-openapi'

const config: ConfigFile = {
  schemaFile: '../PythonApi/openapi.json',
  apiFile: './src/store/api/empty-api.ts',
  apiImport: 'emptySplitApi',
  outputFiles: {
    './src/store/api/generated/jobApplications.ts': {
      filterEndpoints: [/JobApplication/]
    },
    './src/store/api/generated/jobApplications.ts': {
      filterEndpoints: [/JobApplication/]
    },
  },
  exportName: 'jobApplicationsApi',
  hooks: true,
  tag: true,
}

export default config