import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useGetEmployeeByIdQuery, useUpdateEmployeeMutation } from '../../features/employeeSlice'
import toast, { Toaster } from 'react-hot-toast'
import style from '../css/page.module.css'
import { Mosaic } from "react-loading-indicators";

function EditEmployee() {
  const { id } = useParams()
  // const navigate = useNavigate()

  const { data: employee, isLoading, isError, error } = useGetEmployeeByIdQuery(id)
  const [updateEmployee, { isLoading: isUpdating }] = useUpdateEmployeeMutation()

  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    contactNumber: '',
    userId: '',
    isActive: false
  })

  useEffect(() => {
    if (employee) {
      setFormData({
        firstName: employee.firstName || '',
        middleName: employee.middleName || '',
        lastName: employee.lastName || '',
        contactNumber: employee.contactNumber || '',
        userId: employee.userId || '',
        isActive: employee.isActive ?? false
      })
    }
  }, [employee])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await updateEmployee({ id, ...formData }).unwrap()
      toast.success('Updated successfully!')
      // navigate('/employee')
    } catch (err) {
      console.error(err)
      toast.error('Failed to update employee.')
    }
  }

  if (isLoading){
    return (
      <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
        zIndex: 9999,
      }}>
        <Mosaic color={"#007bff"} size="small" />
    </div>
    );
  }
  if (isError) return <p>Error: {error?.message || 'Something went wrong'}</p>

  return (
    <main className='main-container'>
      <Toaster position="top-right" reverseOrder={false} />
     <div className={style.editContainer}>
        <div className={style.flexTitleHeader}>
            <svg className={style.svgTitleHeader} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path fill="currentColor" d="M7.005 3.1a1 1 0 1 1 1.99 0l-.388 6.35a.61.61 0 0 1-1.214 0zM7 12a1 1 0 1 1 2 0a1 1 0 0 1-2 0"/></svg>
            <h3 className={style.headerLaber}>Edit Employee</h3>
        </div>
        <form onSubmit={handleSubmit} className={style.editForm}>
          <label className={style.editLabel}>Firstname: </label>
          <input
            className={style.editInput}
            type="text"
            placeholder="First Name"
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            required
          />
          <label className={style.editLabel}>Middlename: </label>
          <input
            className={style.editInput}
            type="text"
            placeholder="Middle Name"
            value={formData.middleName}
            onChange={(e) => setFormData({ ...formData, middleName: e.target.value })}
          />
          <label className={style.editLabel}>Lastname: </label>
          <input
            className={style.editInput}
            type="text"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            required
          />
          <label className={style.editLabel}>Contact #: </label>
          <input
            className={style.editInput}
            type="text"
            placeholder="Contact Number"
            value={formData.contactNumber}
            onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
          />
          <label className={style.editLabel}>User ID: </label>
          <input
            className={style.editInput}
            type="number"
            placeholder="User ID"
            value={formData.userId}
            onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
            required
          />
           <div className={style.editActiveHolder}>
            <label>Active: </label>
            <input
              className={style.editActive}
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
            />
            </div>
          <button className={style.editButton} type="submit" disabled={isUpdating}>
            {isUpdating ? 'Updating...' : 'Update'}
          </button>
        </form>
      </div>
    </main>
  )
}

export default EditEmployee
