import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const vendorApi = createApi({
  reducerPath: 'vendorApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:4000',
    credentials: 'include',
  }),
  tagTypes: ['vendor'],
  endpoints: (builder) => ({
    fetchVendor: builder.query({
      query: () => ({
        url: '/vendor',
        method: 'GET',
      }),
      providesTags: ['vendor'],
    }),

    getVendorById: builder.query({
      query: (id) => ({
        url: `/vendor/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'vendor', id }],
    }),

    createVendor: builder.mutation({
      query: (newVendor) => ({
        url: '/vendor',
        method: 'POST',
        body: newVendor,
      }),
      invalidatesTags: ['vendor'],
    }),

    updateVendor: builder.mutation({
      query: ({ id, ...updatedData }) => ({
        url: `/vendor/${id}`,
        method: 'PUT',
        body: updatedData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'vendor', id },
        'vendor',
      ],
    }),
  }),
});

export const {
  useFetchVendorQuery,
  useGetVendorByIdQuery,
  useCreateVendorMutation,
  useUpdateVendorMutation,
} = vendorApi;
