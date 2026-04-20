import React, { useState, useEffect } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import { Mosaic } from "react-loading-indicators"
import { useNavigate } from 'react-router-dom'
import style from '../views/css/page.module.css'

import {
  useFetchPettyCashFundQuery,
  useCreatePettyCashFundMutation
} from '../features/pettyCashFundSlice'

function PettyCashFund() {

  const { data, isLoading, isError, error } = useFetchPettyCashFundQuery()
  const funds = data ?? []
  const navigate = useNavigate()

  const [createFund] = useCreatePettyCashFundMutation()
  const handlePageChange = (page) => setCurrentPage(page)

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    branch: '',
    department: '',
    fund: ''
  })

  const [showModal, setShowModal] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const res = await createFund(formData).unwrap()

      toast.success(res.message || 'Created successfully')

      setFormData({
        code: '',
        name: '',
        branch: '',
        department: '',
        fund: 0
      })

      setShowModal(false)
      navigate(`/editPettyCashFund/${res.data.id}`);


    } catch (err) {
      console.log(err)
      toast.error(err?.data?.message || 'Something went wrong')
    }
  }

  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 7

  const safeText = (val) => String(val ?? '').toLowerCase()

  const filtered = funds.filter((f) =>
    safeText(f.code).includes(search.toLowerCase()) ||
    safeText(f.name).includes(search.toLowerCase()) ||
    safeText(f.branch).includes(search.toLowerCase()) ||
    safeText(f.fund).includes(search.toLowerCase()) ||
    safeText(f.department).includes(search.toLowerCase())

  )

  const totalPages = Math.ceil(filtered.length / itemsPerPage)
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentData = filtered.slice(indexOfFirstItem, indexOfLastItem)

  const handleNext = () => currentPage < totalPages && setCurrentPage(p => p + 1)
  const handlePrevious = () => currentPage > 1 && setCurrentPage(p => p - 1)


  const [showLoader, setShowLoader] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setShowLoader(false), 800)
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
    return <p>Error: {error?.data?.message || 'Something went wrong'}</p>
  }

  return (
    <main className="main-container">
      <div className={style.ListContainer}>

        {/* HEADER */}
        <div className={style.pageHeaderContainer}>
          <div className={style.flexTitleHeader}>
            <div className={style.flexheaderTitle}>
            <svg className={style.svgManageVendors} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                  <defs>
                    <path id="SVGS9q3IkIf" d="M21.5 11v10h-19V11z" />
                  </defs>
                  <g fill="none">
                    <use href="#SVGS9q3IkIf" />
                    <path d="M12 13.5a2.5 2.5 0 1 1 0 5a2.5 2.5 0 0 1 0-5m5.136-7.209L19 5.67l1.824 5.333H3.002L3 11.004L14.146 2.1z" />
                    <path stroke="currentColor" stroke-linecap="square" stroke-width="2" d="M21 11.003h-.176L19.001 5.67L3.354 11.003L3 11m-.5.004H3L14.146 2.1l2.817 3.95" />
                    <g stroke="currentColor" stroke-linecap="square" stroke-width="2">
                      <path d="M14.5 16a2.5 2.5 0 1 1-5 0a2.5 2.5 0 0 1 5 0Z" />
                      <use href="#SVGS9q3IkIf" />
                      <path d="M2.5 11h2a2 2 0 0 1-2 2zm19 0h-2a2 2 0 0 0 2 2zm-19 10h2.002A2 2 0 0 0 2.5 18.998zm19 0h-2a2 2 0 0 1 2-2z" />
                    </g>
                  </g>
                </svg>
              <h3 className={style.headerLaber}>Petty Cash Fund</h3>
            </div>
            <p className={style.headerSubtitle}>View and Manage petty cash funds.</p>
          </div>

          <div className={style.flexHeader}>

            {/* SEARCH */}
                <div className={style.SrchContainer}>
                  <input
                    type="text"
                    className={style.inputSrch}
                    required
                    placeholder="Type to search..."
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setCurrentPage(1);
                    }}
                  />
                <div className={style.icon}>
                  <svg style={{color:'#3a3a3a'}} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
                      <path d="m21 21l-4.34-4.34" />
                      <circle cx="11" cy="11" r="8" />
                    </g>
                  </svg>
                </div>
            </div>

            {/* ADD BUTTON */}
            <button
                  className={style.addBtn}
                  onClick={() => setShowModal(true)}
                  title='Add Employee'
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M11 13H6q-.425 0-.712-.288T5 12t.288-.712T6 11h5V6q0-.425.288-.712T12 5t.713.288T13 6v5h5q.425 0 .713.288T19 12t-.288.713T18 13h-5v5q0 .425-.288.713T12 19t-.712-.288T11 18z"/></svg>
            </button>
          </div>
        </div>

        {/* MODAL */}
        {showModal && (
          <div className={style.modalOverlay}>
            <div className={style.modal}>

              <div className={style.modalHeader}>
                <h3>Add Petty Cash</h3>
                <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className={style.closeButton}
                    >
                    <svg
                        className={style.closeBtn}
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                    >
                    <path
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d="m11.25 4.75-6.5 6.5m0-6.5 6.5 6.5"
                        />
                    </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className={style.formContainer}>
                <label className={style.modalLabel}>Code:</label>
                <input
                  value={formData.code}
                  onChange={(e) =>
                    setFormData({ ...formData, code: e.target.value })
                  }
                />
                <label className={style.modalLabel}>Name:</label>
                <input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
                <label className={style.modalLabel}>Branch:</label>
                <input
                  value={formData.branch}
                  onChange={(e) =>
                    setFormData({ ...formData, branch: e.target.value })
                  }
                />
                <label className={style.modalLabel}>Department:</label>
                <input
                  value={formData.department}
                  onChange={(e) =>
                    setFormData({ ...formData, department: e.target.value })
                  }
                />
                <label className={style.modalLabel}>Fund:</label>
                <input
                  type="number"
                  value={formData.fund}
                  onChange={(e) =>
                    setFormData({ ...formData, fund: Number(e.target.value) })
                  }
                />
                <div className={style.modalActions}>
                  <button
                    type="button"
                    className={style.cancelButton}
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>

                  <button type="submit" className={style.submitButton}>
                    Submit
                  </button>
                </div>

              </form>
            </div>
          </div>
        )}

        {/* TABLE */}
        <table>
          <thead>
            <tr className={style.headTableFund}>
              <th>Code</th>
              <th>Name</th>
              <th>Branch</th>
              <th>Department</th>
              <th>Fund</th>
              <th></th>
            </tr>
          </thead>
            <tbody>
            {currentData.length === 0 ? (
              <tr><td colSpan="9" style={{ textAlign: "center" }}>No records found.</td></tr>
            ) : (
                currentData.map((f) => (
                <tr className={style.bodyTableFund} key={f.id}>
                    <td>{f.code}</td>
                    <td>{f.name}</td>
                    <td>{f.branch}</td>
                    <td>{f.department}</td>
                    <td>{f.fund}</td>
                    <td>
                    <button
                        className={style.editBtn}
                        onClick={() => navigate(`/editPettyCashFund/${f.id}`)}
                        title="Edit"
                    >
                        <svg
                            className={style.svdEditIcon}
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                        >
                        <path
                            fill="currentColor"
                            d="M16.14 2.25a5.61 5.61 0 0 0-5.327 7.376L2.77 17.671a1.774 1.774 0 0 0 0 2.508l1.052 1.052a1.773 1.773 0 0 0 2.509 0l8.044-8.045a5.61 5.61 0 0 0 7.19-6.765c-.266-1.004-1.442-1.104-2.032-.514L17.81 7.629a1.017 1.017 0 1 1-1.438-1.438l1.722-1.723c.59-.59.49-1.766-.515-2.032a5.6 5.6 0 0 0-1.438-.186"
                        />
                        </svg>
                    </button>
                    </td>
                </tr>
                ))
            )}
            </tbody>
        </table>

        {totalPages > 1 && (
            <div className={style.paginationContainer}>
                <button
                     className={style.pageButton}
                     onClick={handlePrevious}
                     disabled={currentPage === 1}
                   >
                     Prev
                </button>
       
                {[...Array(totalPages)].map((_, i) => (
                    <button
                       key={i + 1}
                       className={`${style.pageButton} ${
                         currentPage === i + 1 ? style.activePage : ''
                       }`}
                       onClick={() => handlePageChange(i + 1)}
                     >
                       {i + 1}
                    </button>
                ))}
       
                <button
                     className={style.pageButton}
                     onClick={handleNext}
                     disabled={currentPage === totalPages}
                   >
                     Next
                </button>
            </div>
        )}
        </div>

      <ToastContainer />
    </main>
  )
}

export default PettyCashFund