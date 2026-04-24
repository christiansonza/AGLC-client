import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'

export const branchApi = createApi({
  reducerPath: 'branchApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:4000',
    credentials: 'include'
  }),
  tagTypes: ['branch'],
  endpoints: (builder) => ({
    fetchBranch: builder.query({
      query: () => '/branch',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'branch', id })),
              { type: 'branch' }
            ]
          : [{ type: 'branch' }]
    }),

    fetchBranchById: builder.query({
      query: (id) => `/branch/${id}`,
      providesTags: (result, error, id) => [
        { type: 'branch', id }
      ]
    }),

    createBranch: builder.mutation({
      query: (newData) => ({
        url: '/branch',
        method: 'POST',
        body: newData
      }),
      invalidatesTags: [{ type: 'branch' }]
    }),

    updateBranch: builder.mutation({
      query: ({ id, ...updateData }) => ({
        url: `/branch/${id}`,
        method: 'PUT',
        body: updateData
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'branch', id },
        { type: 'branch' }
      ]
    })
  })
})

export const { useFetchBranchQuery, useFetchBranchByIdQuery, useCreateBranchMutation, useUpdateBranchMutation} = branchApi