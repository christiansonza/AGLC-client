import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'

export const shipperApi = createApi({
    reducerPath:'shipperApi',
    baseQuery:fetchBaseQuery({baseUrl:'http://localhost:4000/shipper', credentials:'include'}),
    tagTypes:['shipper'],
    endpoints:(builder)=>({
        getShipper:builder.query({
            query:()=>({
                url:'/',
                method:'GET'
            }),
            providesTags:['shipper']
        }),
        getShipperById:builder.query({
            query:(id)=>({
                url:`/${id}`,
                method:'GET',
            }),
            providesTags:['shipper']
        }),
        createShipper: builder.mutation({
            query: (newData) => ({
                url: '/',
                method: 'POST',
                body: newData,
                headers: { 'Content-Type': 'application/json' },
            }),
            invalidatesTags: ['shipper'],
        }),
        updateShipper:builder.mutation({
            query:({id, ...updateData})=>({
                url:`/${id}`,
                method:'PUT',
                body:updateData
            }),
            invalidatesTags:['shipper']
        })
    })

})


export const {useGetShipperQuery, useGetShipperByIdQuery, useCreateShipperMutation, useUpdateShipperMutation} = shipperApi