import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const companyApi = createApi({
  reducerPath: 'companyApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:4000/company',
    credentials: 'include'
  }),
  tagTypes: ['Company'],
  endpoints: (builder) => ({
    getCompany: builder.query({
      query: () => '/',
      providesTags: ['Company']
    }),

    getCompanyById: builder.query({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: 'Company', id }]
    }),

    addCompany: builder.mutation({
      query: (companyData) => ({
        url: '/',
        method: 'POST',
        body: companyData
      }),
      invalidatesTags: ['Company']
    }),

    updateCompany: builder.mutation({
      query: ({ id, ...updatedCompany }) => ({
        url: `/${id}`,
        method: 'PUT',
        body: updatedCompany
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Company', id },
        'Company'
      ]
    }),
  })
})

export const {
  useGetCompanyQuery,
  useGetCompanyByIdQuery,
  useAddCompanyMutation,
  useUpdateCompanyMutation
} = companyApi
