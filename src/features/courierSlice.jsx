import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'


export const courierApi = createApi({
    reducerPath:'courierApi',
    baseQuery:fetchBaseQuery({baseUrl:'http://localhost:4000/courier', credentials:'include'}),
    tagTypes:['courier'],
    endpoints:(builder)=>({
        getCourier:builder.query({
            query:()=>({
                url:'/',
                method:'GET'
            }),
            providesTags:['courier']
        }),
        getCourierById: builder.query({
            query: (id) => ({
                url: `/${id}`,
                method: 'GET'
            }),
            providesTags: ['courier']
            }),
        postCourier:builder.mutation({
            query:(newData)=>({
                url:'/',
                method:'POST',
                body:newData
            }),
            invalidatesTags:['courier']
        }),
        updateCourier:builder.mutation({
            query:({id, ...updateData})=>({
                url:`${id}`,
                method:'PUT',
                body:updateData
            }),
            invalidatesTags:['courier']
        }),
    })
})

export const {useGetCourierQuery, useGetCourierByIdQuery, usePostCourierMutation, useUpdateCourierMutation} = courierApi