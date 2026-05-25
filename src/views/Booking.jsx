import React, { useState, useRef, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { useCreateBookingMutation, useFetchBookingQuery } from '../features/bookingSlice';
import { useNavigate, Link } from 'react-router-dom';
import style from '../views/css/page.module.css';
import {useFetchCustomerQuery} from '../features/customerSlice'
import { Mosaic } from "react-loading-indicators";



function Booking() {
  const [openCustomer, setOpenCustomer] = useState(false);
  const customerRef = useRef(null);

  const { data: customers = [] } = useFetchCustomerQuery();
  const activeCustomers = customers.filter(c => c.isActive);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (customerRef.current && !customerRef.current.contains(event.target)) {
        setOpenCustomer(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navigate = useNavigate();
  const { data, isError, error, isLoading } = useFetchBookingQuery();
  const bookings = data ?? [];
  
  const [formData, setFormData] = useState({
    customerId: '',
    remarks: '',
  });

  const [addBooking] = useCreateBookingMutation();
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;
  const [showModal, setShowModal] = useState(false);
  
  const getCustomerName = (id) => {
    const customer = customers.find(c => c.id === id);
    return customer?.name?.toLowerCase() || "";
  };
  

 
  const filteredBookings = bookings.filter(b => {
    const query = search.toLowerCase();
    return (
      b.bookingNumber?.toLowerCase().includes(query) ||
      getCustomerName(b.customerId).includes(query) ||
      b.remarks?.toLowerCase().includes(query)
    );
  });


  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBookings = filteredBookings.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);
  const handleNext = () => currentPage < totalPages && setCurrentPage(prev => prev + 1);
  const handlePrevious = () => currentPage > 1 && setCurrentPage(prev => prev - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await addBooking(formData).unwrap();
      toast.success(response.message || 'Created Successfully.');
      setFormData({ customerId: '', remarks: '' });
      setShowModal(false);
      navigate(`/editBooking/${response.data.id}`);
    } catch (err) {
      console.log(err);
      toast.error(err?.data?.message || 'Something went wrong');
    }
  };

  const [showLoader, setShowLoader] = useState(true);
   
  useEffect(() => {
    const timer = setTimeout(() => setShowLoader(false), 1000);
    return () => clearTimeout(timer);
    }, []);
     
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
      );
    }

  if (isError) {
    const status = error?.status;

 if (status === 401) {
      return (
        <div className={style.unauthorizedWrapper}>
          <p className={style.error1}>401</p>
          <p className={style.error2}>Page Not Found.</p>
          <Link to={'/login'}>
            <button className={style.errorLogin}>
             Unauthorized. Please log in to proceed.
            </button>
          </Link>
        </div>
      );
    }

    return <p>Error: {error?.data?.message || 'Something went wrong'}</p>;
  }

  return (
    <main className="main-container">
        <div className={style.ListContainer}>
          {/* Header */}
          <div className={style.pageHeaderContainer}>
            <div className={style.flexTitleHeader}>
             <div className={style.flexheaderTitle}>
              <svg className={style.svgManageVendors} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M11.669 2.282c.218-.043.443-.043.662 0c.251.048.479.167.691.277l.053.028l8.27 4.28a.75.75 0 0 1 .405.666v7.898c0 .283.002.583-.093.862a1.8 1.8 0 0 1-.395.652c-.205.214-.473.351-.723.48l-.063.033l-8.131 4.208a.75.75 0 0 1-.69 0l-8.131-4.208l-.063-.033c-.25-.129-.518-.266-.723-.48a1.8 1.8 0 0 1-.395-.652c-.095-.28-.094-.58-.093-.863V7.533a.75.75 0 0 1 .405-.666l8.269-4.28l.053-.027c.213-.111.44-.23.692-.278m.226 1.496a7 7 0 0 0-.282.141L4.668 7.514l2.827 1.384l7.356-3.703l-2.465-1.276a7 7 0 0 0-.282-.141l-.058-.024m4.45 2.292l-7.31 3.68L12 11.102l7.332-3.588zm-5.246 13.72v-7.36l-3-1.469v1a.75.75 0 0 1-1.5 0v-1.734l-3-1.468v6.624c0 .187 0 .294.005.375l.009.078a.3.3 0 0 0 .057.095c.005.004.021.017.064.042c.068.042.163.09.328.176zm.645-15.988l.06-.024z" />
                </svg>
              <h3 className={style.headerLaber}>Booking</h3>
              </div>
              <p className={style.headerSubtitle}>View and manage bookings.</p>
            </div>
              <div className={style.flexHeader}>
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
                <button className={style.addBtn} onClick={() => setShowModal(true)} title="Add Booking">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M11 13H6q-.425 0-.712-.288T5 12t.288-.712T6 11h5V6q0-.425.288-.712T12 5t.713.288T13 6v5h5q.425 0 .713.288T19 12t-.288.713T18 13h-5v5q0 .425-.288.713T12 19t-.712-.288T11 18z"/></svg>
                </button>
              </div>
            </div>

            {/* Modal */}
            {showModal && (
              <div className={style.modalOverlay}>
                <div className={style.modal}>
                  <div className={style.modalHeader}>
                    <h3>Add Booking</h3>
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
                  <label className={style.modalLabel}>Customer: </label>
                  <div className={style.customSelectWrapper} ref={customerRef}>
                  <div
                    className={style.customSelectInput}
                    onClick={() => setOpenCustomer(!openCustomer)}
                  >
                    {formData.customerId
                      ? activeCustomers.find((c) => c.id === formData.customerId)?.name
                      : "Select Customer"}
                      <span className={style.selectArrow}>▾</span>
                  </div>

                  {openCustomer && (
                    <div className={style.customSelectDropdown}>
                      {activeCustomers.map((c) => (
                        <div
                          key={c.id}
                          className={style.customSelectOption}
                          onClick={() => {
                            setFormData({ ...formData, customerId: c.id });
                            setOpenCustomer(false);
                          }}
                        >
                          {c.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <label className={style.modalLabel}>Remarks: </label>
                <textarea name="" id=""
                  type="text"
                  value={formData.remarks}
                  onChange={e => setFormData({ ...formData, remarks: e.target.value })}
                >
                </textarea>
                
                <div className={style.modalActions}>
                  <button type="button" className={style.cancelButton} onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className={style.submitButton}>Submit</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Booking Table */}
        <table>
          <thead>
            <tr className={style.headBookingTable}>
              <th>Booking Number</th>
              <th>Customer Name</th>
              <th>Remarks</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {currentBookings.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center' }}>No bookings found</td>
              </tr>
            ) : (
              currentBookings.map(booking => (
                <tr className={style.bodyBookingTable} key={booking.id}>
                  <td>{booking.bookingNumber}</td>
                  <td>
                    {customers.find(c => c.id === booking.customerId)?.name || 'N/A'}
                  </td>
                  <td>{booking.remarks}</td>
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
                          className={style.editPage} onClick={() => navigate(`/editBooking/${booking.id}`)}>
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
        {/* Pagination */}
          {totalPages > 1 && (
            <div className={style.paginationContainer}>
              <button className={style.pageButton} onClick={handlePrevious} disabled={currentPage === 1}>
                Prev
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  className={`${style.pageButton} ${currentPage === i + 1 ? style.activePage : ''}`}
                  onClick={() => handlePageChange(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
              <button className={style.pageButton} onClick={handleNext} disabled={currentPage === totalPages}>
                Next
              </button>
            </div>
          )}
      </div>
    </main>
  );
}

export default Booking;
