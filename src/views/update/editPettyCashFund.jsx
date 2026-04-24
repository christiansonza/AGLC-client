import React, { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import { Mosaic } from "react-loading-indicators"

import style from '../css/page.module.css'

import {
  useFetchPettyCashFundByIdQuery,
  useUpdatePettyCashFundMutation
} from '../../features/pettyCashFundSlice'

import { useFetchBranchQuery } from '../../features/branchSlice'
import { useFetchDepartmentQuery } from '../../features/departmentSlice'

function EditPettyCashFund() {

  const { id } = useParams()

  const { data: pettyCashFund, isLoading, isError, error } =
    useFetchPettyCashFundByIdQuery(id)

  const [updatePettyCashFund, { isLoading: isUpdating }] =
    useUpdatePettyCashFundMutation()

  const { data: branches = [] } = useFetchBranchQuery()
  const { data: departments = [] } = useFetchDepartmentQuery()

  const [openBranch, setOpenBranch] = useState(false)
  const [openDepartment, setOpenDepartment] = useState(false)

  const branchRef = useRef(null)
  const departmentRef = useRef(null)

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    branchId: '',
    departmentId: '',
    fund: ''
  })

  useEffect(() => {
    if (pettyCashFund) {
      setFormData({
        code: pettyCashFund.code || '',
        name: pettyCashFund.name || '',
        branchId: pettyCashFund.branchId || '',
        departmentId: pettyCashFund.departmentId || '',
        fund: pettyCashFund.fund || ''
      })
    }
  }, [pettyCashFund])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (branchRef.current && !branchRef.current.contains(e.target)) {
        setOpenBranch(false)
      }
      if (departmentRef.current && !departmentRef.current.contains(e.target)) {
        setOpenDepartment(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      await updatePettyCashFund({ id, ...formData }).unwrap()
      toast.success('Updated successfully!')
    } catch (err) {
      console.error(err)
      toast.error(err?.data?.message || 'Failed to update Petty Cash Fund')
    }
  }

  const [showLoader, setShowLoader] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setShowLoader(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  if (showLoader || isLoading) {
    return (
      <div
        style={{
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
        }}
      >
        <Mosaic color="#0D254C" size="small" />
      </div>
    )
  }

  if (isError) {
    const status = error?.status

    if (status === 401) {
      return (
        <div className={style.unauthorizedWrapper}>
          <p className={style.error1}>401</p>
          <p className={style.error2}>Unauthorized Access</p>

          <Link to="/login">
            <button className={style.errorLogin}>
              Please log in to continue
            </button>
          </Link>
        </div>
      )
    }

    return (
      <p>
        Error: {error?.data?.message || 'Something went wrong'}
      </p>
    )
  }

  return (
    <main className="main-container">

      <div className={style.editContainer}>

        {/* HEADER */}
        <div className={style.EditflexTitleHeader}>
          <div className={style.flexheaderTitle}>

            <svg className={style.EditsvgExclamation} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path fill="currentColor" d="M21 12a1 1 0 0 0-1 1v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h6a1 1 0 0 0 0-2H5a3 3 0 0 0-3 3v14a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3v-6a1 1 0 0 0-1-1m-15 .76V17a1 1 0 0 0 1 1h4.24a1 1 0 0 0 .71-.29l6.92-6.93L21.71 8a1 1 0 0 0 0-1.42l-4.24-4.29a1 1 0 0 0-1.42 0l-2.82 2.83l-6.94 6.93a1 1 0 0 0-.29.71m10.76-8.35l2.83 2.83l-1.42 1.42l-2.83-2.83ZM8 13.17l5.93-5.93l2.83 2.83L10.83 16H8Z" />
            </svg>

            <h3 className={style.headerLaber}>Update Petty Cash Fund</h3>
          </div>

          <p className={style.headerSubtitle}>
            View and manage petty cash funds.
          </p>
        </div>

        <form onSubmit={handleSubmit} className={style.editForm}>

          <label className={style.editLabel}>Code:</label>
          <input
            className={style.editInput}
            type="text"
            value={formData.code}
            onChange={(e) =>
              setFormData({ ...formData, code: e.target.value })
            }
            required
          />

          <label className={style.editLabel}>Name:</label>
          <input
            className={style.editInput}
            type="text"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            required
          />

<label className={style.editLabel}>Branch:</label>

<div className={style.customSelectWrapper} ref={branchRef}>
  <div
    className={style.customSelectInput}
    onClick={() => setOpenBranch(!openBranch)}
  >
    {formData.branchId
      ? branches.find(b => b.id == formData.branchId)?.name
      : "Select Branch"}
    <span>▾</span>
  </div>

  {openBranch && (
    <div className={style.customSelectDropdown}>
      {branches
        .filter(b => b.id != formData.branchId) // remove selected
        .map(b => (
          <div
            key={b.id}
            className={style.customSelectOption}
            onClick={() => {
              setFormData({ ...formData, branchId: b.id })
              setOpenBranch(false)
            }}
          >
            {b.name}
          </div>
        ))}
    </div>
  )}
</div>

<label className={style.editLabel}>Department:</label>

<div className={style.customSelectWrapper} ref={departmentRef}>
  <div
    className={style.customSelectInput}
    onClick={() => setOpenDepartment(!openDepartment)}
  >
    {formData.departmentId
      ? departments.find(d => d.id == formData.departmentId)?.name
      : "Select Department"}
    <span>▾</span>
  </div>

  {openDepartment && (
    <div className={style.customSelectDropdown}>
      {departments
        .filter(d => d.id != formData.departmentId) // remove selected
        .map(d => (
          <div
            key={d.id}
            className={style.customSelectOption}
            onClick={() => {
              setFormData({ ...formData, departmentId: d.id })
              setOpenDepartment(false)
            }}
          >
            {d.name}
          </div>
        ))}
    </div>
  )}
</div>

          <label className={style.editLabel}>Fund:</label>
          <input
            className={style.editInput}
            type="number"
            step="0.01"
            value={formData.fund}
            onChange={(e) =>
              setFormData({ ...formData, fund: e.target.value })
            }
            required
          />

          {/* BUTTON */}
          <button
            className={style.editButton}
            type="submit"
            disabled={isUpdating}
          >
            {isUpdating ? 'Updating...' : 'Update'}
          </button>

        </form>

      </div>

      <ToastContainer />
    </main>
  )
}

export default EditPettyCashFund
