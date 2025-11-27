import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const subAccountApi = createApi({
  reducerPath: 'subAccountApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:4000/subAccount',
    credentials: 'include',
  }),
  tagTypes: ['subAccount'],
  endpoints: (builder) => ({
    fetchSubAccount: builder.query({
      query: () => '/',
      providesTags: ['subAccount'],
    }),

    fetchSubAccountById: builder.query({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: 'subAccount', id }],
    }),

    postSubAccount: builder.mutation({
      query: (newSub) => ({
        url: '/',
        method: 'POST',
        body: newSub,
      }),
      invalidatesTags: ['subAccount'],
    }),

    updateSubAccount: builder.mutation({
      query: ({ id, ...updatedData }) => ({
        url: `/${id}`,
        method: 'PUT',
        body: updatedData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'subAccount', id },
        'subAccount',
      ],
    }),

    importSubAccountExcel: builder.mutation({
      query: (formData) => ({
        url: '/import',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['subAccount'],
    }),
  }),
});

export const {
  useFetchSubAccountQuery,
  useFetchSubAccountByIdQuery,
  usePostSubAccountMutation,
  useUpdateSubAccountMutation,
  useImportSubAccountExcelMutation, 
} = subAccountApi;
