import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mosaic } from 'react-loading-indicators'
import { ToastContainer, toast } from 'react-toastify'
import style from '../views/css/page.module.css'

import {
  useGetDestinationQuery,
  useCreateDestinationMutation
} from '../features/destinationSlice'

function Destination() {
  const navigate = useNavigate()

  const [showLoader, setShowLoader] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({ destinationName: '' })
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 7

  const { data = [], isLoading, isError, error } = useGetDestinationQuery()
  const [addDestination] = useCreateDestinationMutation()

  useEffect(() => {
    const timer = setTimeout(() => setShowLoader(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  // SEARCH
  const filteredDestinations = data.filter(
    (d) =>
      d.destinationName &&
      d.destinationName.toLowerCase().includes(search.toLowerCase())
  )

  // PAGINATION
  const totalPages = Math.ceil(filteredDestinations.length / itemsPerPage)
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentDestinations = filteredDestinations.slice(indexOfFirstItem, indexOfLastItem)

  // CREATE
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await addDestination(formData).unwrap()
      toast.success(response.message || 'Created Successfully.')
      setFormData({ destinationName: '' })
      setShowModal(false)
      if (response?.data?.id) {
        navigate(`/editDestination/${response.data.id}`)
      }
    } catch (err) {
      toast.error(err?.data?.message || 'Something went wrong')
    }
  }

  // LOADER
  if (showLoader || isLoading) {
    return (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#fff',
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
                <svg
                  className={style.svgManageVendors}
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="M3 8h18V5.5q0-.625-.437-1.062T19.5 4h-15q-.625 0-1.062.438T3 5.5zm0 6h18v-4H3zm1.5 6h15q.625 0 1.063-.437T21 18.5V16H3v2.5q0 .625.438 1.063T4.5 20M4.287 6.712Q4 6.425 4 6t.288-.712T5 5t.713.288T6 6t-.288.713T5 7t-.712-.288m0 6Q4 12.426 4 12t.288-.712T5 11t.713.288T6 12t-.288.713T5 13t-.712-.288m0 6Q4 18.426 4 18t.288-.712T5 17t.713.288T6 18t-.288.713T5 19t-.712-.288"
                  />
                </svg>
              <h3 className={style.headerLaber}>Destination</h3>
            </div>
            <p className={style.headerSubtitle}>View and manage destinations.</p>
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
                  setSearch(e.target.value)
                  setCurrentPage(1)
                }}
              />

              <div className={style.icon}>
                <svg
                  style={{ color: '#3a3a3a' }}
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <g
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  >
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
              title="Add Destination"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M11 13H6q-.425 0-.712-.288T5 12t.288-.712T6 11h5V6q0-.425.288-.712T12 5t.713.288T13 6v5h5q.425 0 .713.288T19 12t-.288.713T18 13h-5v5q0 .425-.288.713T12 19t-.712-.288T11 18z" />
              </svg>
            </button>
          </div>
        </div>

        {/* MODAL */}
        {showModal && (
          <div className={style.modalOverlay}>
            <div className={style.modal}>
              <div className={style.modalHeader}>
                <h3>Add Destination</h3>
                <button className={style.closeButton} onClick={() => setShowModal(false)}>
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
                <label className={style.modalLabel}>Destination:</label>
                <input
                  type="text"
                  value={formData.destinationName}
                  onChange={(e) => setFormData({ ...formData, destinationName: e.target.value })}
                  placeholder="Destination name"
                  required
                />
                <div className={style.modalActions}>
                  <button type="button" className={style.cancelButton} onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className={style.submitButton}>Submit</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* TABLE */}
        <table>
          <thead>
            <tr className={style.headAffiliateTable}>
              <th>Destination</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {currentDestinations.length === 0 ? (
              <tr>
                <td colSpan="2" style={{ textAlign: 'center' }}>No destination found</td>
              </tr>
            ) : (
              currentDestinations.map((d) => (
                <tr key={d.id} className={style.bodyAffiliateTable}>
                  <td>{d.destinationName}</td>
                  <td>
                    <button
                      className={style.editBtn}
                      onClick={() => navigate(`/editDestination/${d.id}`)}
                    >
                      <svg
                        className={style.svdEditIcon}
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M16.14 2.25a5.61 5.61 0 0 0-5.327 7.376L2.77 17.671a1.774 1.774 0 0 0 0 2.508l1.052 1.052a1.773 1.773 0 0 0 2.509 0l8.044-8.045a5.61 5.61 0 0 0 7.19-6.765c-.266-1.004-1.442-1.104-2.032-.514L17.81 7.629a1.017 1.017 0 1 1-1.438-1.438l1.722-1.723c.59-.59.49-1.766-.515-2.032a5.6 5.6 0 0 0-1.438-.186" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className={style.paginationContainer}>
            <button className={style.pageButton} onClick={() => setCurrentPage(p => Math.max(p-1,1))} disabled={currentPage===1}>Prev</button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i+1}
                className={`${style.pageButton} ${currentPage===i+1 ? style.activePage : ''}`}
                onClick={() => setCurrentPage(i+1)}
              >
                {i+1}
              </button>
            ))}
            <button className={style.pageButton} onClick={() => setCurrentPage(p => Math.min(p+1,totalPages))} disabled={currentPage===totalPages}>Next</button>
          </div>
        )}

      </div>
      {/* <ToastContainer /> */}
    </main>
  )
}

export default Destination