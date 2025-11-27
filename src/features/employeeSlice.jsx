import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const employeeApi = createApi({
  reducerPath: 'employeeApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:4000', credentials: 'include' }),
  tagTypes: ['employee'],
  endpoints: (builder) => ({
    fetchEmployee: builder.query({
      query: () => ({
        url: '/employee',
        method: 'GET'
      }),
      providesTags: ['employee']
    }),

    getEmployeeById: builder.query({
      query: (id) => ({
        url: `/employee/${id}`,
        method: 'GET'
      }),
      providesTags: ['employee']
    }),

    createEmployee: builder.mutation({
      query: (newEmployee) => ({
        url: '/employee',
        method: 'POST',
        body: newEmployee
      }),
      invalidatesTags: ['employee']
    }),

    updateEmployee: builder.mutation({
      query: ({ id, ...updatedData }) => ({
        url: `/employee/${id}`,
        method: 'PUT',
        body: updatedData
      }),
      invalidatesTags: ['employee']
    })
  })
})

export const {
  useFetchEmployeeQuery,
  useGetEmployeeByIdQuery,
  useCreateEmployeeMutation,
  useUpdateEmployeeMutation
} = employeeApi
