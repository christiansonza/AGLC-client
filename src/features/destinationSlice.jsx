import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const destinationApi = createApi({
    reducerPath:'destinationApi',
    baseQuery:fetchBaseQuery({baseUrl:'http://localhost:4000/destination', credentials:'include'}),
    tagTypes:['destination'],
    endpoints:(builder)=>(({
        getDestination: builder.query({
            query: () => ({ url:'/', method:'GET' }),
            providesTags: ['destination']
        }),
        getDestinationById: builder.query({
            query: (id) => ({ url:`/${id}`, method:'GET' }),
            providesTags: ['destination']
        }),
        createDestination: builder.mutation({
            query: (newData) => ({
                url: '/',
                method: 'POST',
                body: newData,
                headers: { 'Content-Type': 'application/json' },
            }),
            invalidatesTags: ['destination'],
        }),
        updateDestination: builder.mutation({
            query: ({id, ...updateData}) => ({
                url: `/${id}`,
                method: 'PUT',
                body: updateData,
                headers: { 'Content-Type': 'application/json' }
            }),
            invalidatesTags: ['destination']
        })
    }))
})

export const { useGetDestinationQuery, useGetDestinationByIdQuery, useCreateDestinationMutation, useUpdateDestinationMutation } = destinationApi