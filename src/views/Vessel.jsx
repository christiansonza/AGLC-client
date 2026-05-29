import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  useGetVesselQuery,
  useCreateVesselMutation,
} from '../features/vesselSlice'

import { ToastContainer, toast } from 'react-toastify'
import style from '../views/css/page.module.css'

function Vessel() {
  const navigate = useNavigate()
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({ vesselName: '' })
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 7

  const { data = [], isError, error } = useGetVesselQuery()
  const [addVessel] = useCreateVesselMutation()


  const filteredVessel = data.filter(
    (v) =>
      v.vesselName &&
      v.vesselName.toLowerCase().includes(search.toLowerCase())
  )

  const totalPages = Math.ceil(filteredVessel.length / itemsPerPage)
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentVessel = filteredVessel.slice(indexOfFirstItem, indexOfLastItem)

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await addVessel(formData).unwrap()
      toast.success(response.message || 'Created Successfully.')
      setFormData({ vesselName: '' })
      setShowModal(false)
      if (response?.data?.id) {
        navigate(`/editVessel/${response.data.id}`)
      }
    } catch (err) {
      toast.error(err?.data?.message || 'Something went wrong')
    }
  }


  if (isError) {
    return <p>Error: {error?.data?.message || 'Something went wrong'}</p>
  }

  return (
    <main className="main-container">
      <div className={style.ListContainer}>
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
              <h3 className={style.headerLaber}>Vessel</h3>
            </div>
            <p className={style.headerSubtitle}>View and manage vessels.</p>
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
              title="Add Vessel"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M11 13H6q-.425 0-.712-.288T5 12t.288-.712T6 11h5V6q0-.425.288-.712T12 5t.713.288T13 6v5h5q.425 0 .713.288T19 12t-.288.713T18 13h-5v5q0 .425-.288.713T12 19t-.712-.288T11 18z"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* MODAL */}
        {showModal && (
          <div className={style.modalOverlay}>
            <div className={style.modal}>
              <div className={style.modalHeader}>
                <h3>Add Vessel</h3>
                <button
                  className={style.closeButton}
                  onClick={() => setShowModal(false)}
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
                <label className={style.modalLabel}>Vessel:</label>
                <input
                  type="text"
                  value={formData.vesselName}
                  onChange={(e) =>
                    setFormData({ ...formData, vesselName: e.target.value })
                  }
                  required
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
            <tr className={style.headAffiliateTable}>
              <th>Vessel</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {currentVessel.length === 0 ? (
              <tr>
                <td colSpan="2" style={{ textAlign: 'center' }}>
                  No vessel found
                </td>
              </tr>
            ) : (
              currentVessel.map((v) => (
                <tr key={v.id} className={style.bodyAffiliateTable}>
                  <td>{v.vesselName}</td>
                  <td>
                    <div className={style.actionWrapper}>
                     <button className={style.editBtn}>
                       <svg
                         className={style.svdEditIcon}
                         xmlns="http://www.w3.org/2000/svg"
                         width="1em"
                         height="1em"
                         viewBox="0 0 24 24"
                       >
                         <path d="M0 0h24v24H0z" fill="none" />
                         <g fill="currentColor">
                           <circle cx="6" cy="12" r="1.75" />
                           <circle cx="12" cy="12" r="1.75" />
                           <circle cx="18" cy="12" r="1.75" />
                         </g>
                       </svg>
                     </button>
                       <div className={style.dropdownMenu}>
                         <button
                           className={style.editPage} 
                          onClick={() => navigate(`/editVessel/${v.id}`)}
                        >
                        <svg className={style.editIconPage} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M21 12a1 1 0 0 0-1 1v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h6a1 1 0 0 0 0-2H5a3 3 0 0 0-3 3v14a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3v-6a1 1 0 0 0-1-1m-15 .76V17a1 1 0 0 0 1 1h4.24a1 1 0 0 0 .71-.29l6.92-6.93L21.71 8a1 1 0 0 0 0-1.42l-4.24-4.29a1 1 0 0 0-1.42 0l-2.82 2.83l-6.94 6.93a1 1 0 0 0-.29.71m10.76-8.35l2.83 2.83l-1.42 1.42l-2.83-2.83ZM8 13.17l5.93-5.93l2.83 2.83L10.83 16H8Z" />
                          </svg>
                             <p className={style.fontfamEditPage}>Manage</p>
                           </button>
                         </div>
                      </div>  
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className={style.paginationContainer}>
            <button
              className={style.pageButton}
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
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
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <button
              className={style.pageButton}
              onClick={() =>
                setCurrentPage((p) => Math.min(p + 1, totalPages))
              }
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

export default Vessel