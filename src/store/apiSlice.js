// RTK Query API slice centralizing all endpoints
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Note: Insert endpoint is on a different host than the GET endpoints.
// We expose three endpoints with full URLs (override baseUrl per request) to match your infrastructure.
export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/' }), // Not used for absolute URLs, kept for completeness
  tagTypes: ['Patients', 'Departments'],
  endpoints: (builder) => ({
    // 1) Insert Patient Details (POST)
    insertPatient: builder.mutation({
      query: (body) => ({
        url: 'http://192.168.15.3/Internal/Development/api/HIS/Insert_patientdetails',
        method: 'POST',
        body
      })
    }),

    // 2) Get Department Details (GET)
    getDepartments: builder.query({
      query: () =>
        'https://api.relainstitute.in/Global/Development/api/HIS/Get_Department_Dtls',
      providesTags: ['Departments']
    }),

    // 3) Get Patient Details (GET)
    getPatients: builder.query({
      query: () =>
        'https://api.relainstitute.in/Global/Development/api/HIS/Get_PatientDtls',
      providesTags: ['Patients']
    })
  })
});

export const {
  useInsertPatientMutation,
  useGetDepartmentsQuery,
  useGetPatientsQuery
} = api;