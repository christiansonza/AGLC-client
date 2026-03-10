import {createApi, fetchBaseQuery}  from '@reduxjs/toolkit/query/react'

export const brokerApi = createApi({
    reducerPath:'brokerApi',
    baseQuery:fetchBaseQuery({baseUrl:'http://localhost:4000/broker', credentials:'include'}),
    tagTypes:['broker'],
    endpoints:(builder)=>({
        getBroker:builder.query({
            query:()=>({
                url:'/',
                method:'GET'
            }),
            providesTags:['broker']
        }),
        getBrokerById:builder.query({
            query:(id)=>({
                url:`/${id}`,
                method:'GET'
            }),
            providesTags:['broker']
        }),
        postBroker:builder.mutation({
            query:(newData)=>({
                url:'/',
                method:'POST',
                body:newData
            }),
            invalidatesTags:['broker']
        }),
        updateBroker:builder.mutation({
            query:({id, ...updateData})=>({
                url:`/${id}`,
                method:'PUT',
                body:updateData
            }),
            invalidatesTags:['broker']
        })
    })
})

export const {useGetBrokerQuery, useGetBrokerByIdQuery, usePostBrokerMutation,useUpdateBrokerMutation} =  brokerApi