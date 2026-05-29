import React, { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';

import { useFetchPaymentRequestQuery, usePostPaymentRequestMutation } from "../features/paymentRequest";
import { useFetchVendorQuery } from "../features/vendorSlice";
import { useFetchDepartmentQuery } from "../features/departmentSlice";
import style from "../views/css/page.module.css";

function PaymentRequestPage() {

  const [openVendor, setOpenVendor] = useState(false);
  const vendorRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (vendorRef.current && !vendorRef.current.contains(event.target)) {
        setOpenVendor(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  const [openDepartment, setOpenDepartment] = useState(false);
  const departmentRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (departmentRef.current && !departmentRef.current.contains(event.target)) {
        setOpenDepartment(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  const [openRequestType, setOpenRequestType] = useState(false);
  const requestTypeRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (requestTypeRef.current && !requestTypeRef.current.contains(event.target)) {
        setOpenRequestType(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const requestTypes = ["Check", "Manager's Check", "Petty Cash"];

  const navigate = useNavigate();

  const { data, isError, error } = useFetchPaymentRequestQuery();
  const paymentRequests = data ?? [];

  const { data: vendors = [] } = useFetchVendorQuery();
  const { data: departments = [] } = useFetchDepartmentQuery();

  const activeVendors = vendors.filter((v) => v.isActive);
  const activeDepartments = departments.filter((d) => d.isActive);

  const [addPayment] = usePostPaymentRequestMutation();

  const [formData, setFormData] = useState({
    vendorId: "",
    costCenterId: "",
    dateNeeded: "",
    requestType:'',
    requestNumber:'',
    chargeTo: "",
    remarks: "",
    status: "Open",
  });

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;
  const [showModal, setShowModal] = useState(false);

  const filteredRequests = paymentRequests.filter(
    (pr) =>
      pr.remarks?.toLowerCase().includes(search.toLowerCase()) ||
      pr.chargeTo?.toLowerCase().includes(search.toLowerCase()) ||
      pr.requestType?.toLowerCase().includes(search.toLowerCase()) ||
      pr.requestNumber?.toLowerCase().includes(search.toLowerCase()) ||
      pr.status?.toLowerCase().includes(search.toLowerCase()) ||
      activeVendors.find((v) => v.id === pr.vendorId)?.name?.toLowerCase().includes(search.toLowerCase()) ||
      activeDepartments.find((d) => d.id === pr.costCenterId)?.name?.toLowerCase().includes(search.toLowerCase())
  );

  const chargeToOptions = ["AGLC", "Employee", "Subcon", "Client"];
  const [openChargeTo, setOpenChargeTo] = useState(false);
  const chargeToRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (chargeToRef.current && !chargeToRef.current.contains(event.target)) {
        setOpenChargeTo(false);
      }
    };

  document.addEventListener("mousedown", handleClickOutside);
  return () => document.removeEventListener("mousedown", handleClickOutside);
}, []);

  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
  const currentRequests = filteredRequests.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);
  const handleNext = () => currentPage < totalPages && setCurrentPage((p) => p + 1);
  const handlePrevious = () => currentPage > 1 && setCurrentPage((p) => p - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await addPayment(formData).unwrap();
      toast.success(response.message || 'Created Successfully.');
      setFormData({ vendorId: "", costCenterId: "", dateNeeded: "", chargeTo: "", requestType: "", requestNumber: "", remarks: ""});
      setShowModal(false);
      navigate(`/editPaymentRequest/${response.data.id}`);
    } catch (err) {
      toast.error(err?.data?.message || 'Something went wrong');
    }
  };


 
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
                  <g fill="none" fill-rule="evenodd">
                    <path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" />
                    <path fill="currentColor" d="m12.67 2.217l8.5 4.75A1.5 1.5 0 0 1 22 8.31v1.44c0 .69-.56 1.25-1.25 1.25H20v8h1a1 1 0 1 1 0 2H3a1 1 0 1 1 0-2h1v-8h-.75C2.56 11 2 10.44 2 9.75V8.31c0-.522.27-1.002.706-1.274l8.623-4.819a1.5 1.5 0 0 1 1.342 0ZM17 11H7v8h2v-6h2v6h2v-6h2v6h2zm-5-5a1 1 0 1 0 0 2a1 1 0 0 0 0-2" />
                  </g>
                </svg>
              <h3 className={style.headerLaber}>Payment Request</h3>
              </div>
              <p className={style.headerSubtitle}>View and manage payment requests.</p>
            </div>
            <div className={style.flexHeader}>
              <divd className={style.SrchContainer}>
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
              </divd>
              <button className={style.addBtn} onClick={() => setShowModal(true)} title="Add Payment Request">
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
          {/* <hr className={style.hrLine} /> */}
        {showModal && (
          <div className={style.modalOverlay}>
            <div className={style.modal}>
              <div className={style.modalHeader}>
                <h3>Add Payment Request</h3>
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
                <div style={{
                  display:'flex',
                  width:'100%',
                  gap: '1rem'
                }}>
                <div style={{
                  display:'flex',
                  flexDirection:'column',
                  width:'100%',
                }}>
              <label className={style.modalLabel}>Vendor: </label>
               <div className={style.customSelectWrapper} ref={vendorRef} >
                  <div
                    className={style.customSelectInput}
                    onClick={() => setOpenVendor(!openVendor)}
                  >
                    {formData.vendorId
                      ? activeVendors.find((v) => v.id === formData.vendorId)?.name
                      : "Select Vendor"}
                    <span className={style.selectArrow}>▾</span>
                  </div>

                  {openVendor && (
                    <div className={style.customSelectDropdown}>
                      {activeVendors.length === 0 ? (
                        <div className={style.customSelectOption} style={{ cursor: "default" }}>
                          No vendors
                        </div>
                      ) : (
                        activeVendors.map((v) => (
                          <div
                            key={v.id}
                            className={style.customSelectOption}
                            onClick={() => {
                              setFormData({ ...formData, vendorId: v.id });
                              setOpenVendor(false);
                            }}
                          >
                            {v.name}
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              </div>
                <div style={{
                  display:'flex',
                  flexDirection:'column',
                  width:'100%',
                }}>
              <label className={style.modalLabel}>Date: </label>
              <input
                style={{color:"#000"}}
                  type="date"
                  value={formData.dateNeeded}
                  onChange={(e) => setFormData({ ...formData, dateNeeded: e.target.value })}
                  required
                />
              </div>
            </div>

            <div style={{
                  display:'flex',
                  width:'100%',
                  gap: '1rem'
                }}>
                <div style={{
                  display:'flex',
                  flexDirection:'column',
                  width:'100%',
                }}>
              <label className={style.modalLabel}>Department: </label>
              <div className={style.customSelectWrapper} ref={departmentRef}>
                <div
                  className={style.customSelectInput}
                  onClick={() => setOpenDepartment(!openDepartment)}
                >
                  {formData.costCenterId
                    ? activeDepartments.find((d) => d.id === formData.costCenterId)?.name
                    : "Select Department"}
                  <span className={style.selectArrow}>▾</span>
                </div>

                {openDepartment && (
                  <div className={style.customSelectDropdown}>
                    {activeDepartments.length === 0 ? (
                      <div className={style.customSelectOption} style={{ cursor: "default" }}>
                        No departments
                      </div>
                    ) : (
                      activeDepartments.map((d) => (
                        <div
                          key={d.id}
                          className={style.customSelectOption}
                          onClick={() => {
                            setFormData({ ...formData, costCenterId: d.id });
                            setOpenDepartment(false);
                          }}
                        >
                          {d.name}
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
            <div style={{
                display:'flex',
                flexDirection:'column',
                width:'100%',
              }}>
              <label className={style.modalLabel}>Department Type: </label>
               <input
                  type="text"
                  value={
                    formData.costCenterId
                      ? activeDepartments.find((d) => d.id === formData.costCenterId)?.type || ""
                      : ""
                  }
                  readOnly
                  style={{
                    cursor: "not-allowed",
                    outline: "none",
                    color: "#000",
                    // background: "#f2f2f2",
                  }}
                />
                </div>
              </div>
              
            <label className={style.modalLabel}>Request Type: </label>
            <div className={style.customSelectWrapper} ref={requestTypeRef} style={{ marginBottom: ".75rem" }}>
              <div
                className={style.customSelectInput}
                onClick={() => setOpenRequestType(!openRequestType)}
              >
                {formData.requestType || "Select Request Type"}
                <span className={style.selectArrow}>▾</span>
              </div>

              {openRequestType && (
                <div className={style.customSelectDropdown}>
                  {requestTypes.map((type) => (
                    <div
                      key={type}
                      className={style.customSelectOption}
                      onClick={() => {
                        let prefix = "";
                        if (type === "Check") prefix = "CR";
                        else if (type === "Manager's Check") prefix = "MCR";
                        else if (type === "Petty Cash") prefix = "PCR";

                        const year = new Date().getFullYear();
                        setFormData({
                          ...formData,
                          requestType: type,
                          requestNumber: `${prefix}${year}`,
                        });
                        setOpenRequestType(false);
                      }}
                    >
                      {type}
                    </div>
                  ))}
                </div>
              )}
            </div>
                {/* <input
                  type="text"
                  placeholder="Request Number"
                  value={formData.requestNumber}
                  readOnly 
                  style={{cursor:"not-alowed", outline:"none", color:"#000"}}
                /> */}
                  <label className={style.modalLabel}>Charge To: </label>
                  <div
                    className={style.customSelectWrapper}
                    ref={chargeToRef}
                    style={{ marginBottom: ".75rem" }}
                  >
                    <div
                      className={style.customSelectInput}
                      onClick={() => setOpenChargeTo(!openChargeTo)}
                    >
                      {formData.chargeTo || "Select Charge To"}
                      <span className={style.selectArrow}>▾</span>
                    </div>

                    {openChargeTo && (
                      <div className={style.customSelectDropdown}>
                        {chargeToOptions.map((option) => (
                          <div
                            key={option}
                            className={style.customSelectOption}
                            onClick={() => {
                              setFormData({ ...formData, chargeTo: option });
                              setOpenChargeTo(false);
                            }}
                          >
                            {option}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                <label className={style.modalLabel}>Remarks: </label>
                <textarea
                  type="text"
                  value={formData.remarks}
                  onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                >
                </textarea>                

                <div className={style.modalActions}>
                  <button type="button" className={style.cancelButton} onClick={() => setShowModal(false)}>
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

        <table>
          <thead>
            <tr className={style.headTablePayment}>
              <th>Request Number</th>
              <th>Vendor</th>
              <th>Department</th>
              <th>Charge To</th>
              <th>Request Type</th>
              <th>Remarks</th>
              <th>Date Needed</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {currentRequests.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: "center" }}>
                  No payment requests found
                </td>
              </tr>
            ) : (
              currentRequests.map((pr) => (
                <tr key={pr.id} className={style.bodyTablePayment}>
                  <td>{pr.requestNumber}</td>
                  <td>{activeVendors.find((v) => v.id === pr.vendorId)?.name || "--"}</td>
                  <td>{activeDepartments.find((d) => d.id === pr.costCenterId)?.name || "--"}</td>
                  <td>{pr.chargeTo}</td>
                  <td>{pr.requestType}</td>
                  <td>{pr.remarks}</td>
                  <td>
                    {pr.dateNeeded
                      ? new Date(pr.dateNeeded).toLocaleDateString() : "--"}
                  </td>
                    <td>
                      <span
                        className={`${style.badge} ${
                          pr.status === "Open"
                            ? style.open
                            : pr.status === "Released"
                            ? style.released
                            : pr.status === "Canceled"
                            ? style.cancelled
                            : ""
                        }`}
                      >
                        {pr.status}
                      </span>
                    </td>
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
                          onClick={() => navigate(`/editPaymentRequest/${pr.id}`)}
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
         {/* Pagination */}
          {totalPages > 1 && (
            <div className={style.paginationContainer}>
              <button className={style.pageButton} onClick={handlePrevious} disabled={currentPage === 1}>
                Prev
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  className={`${style.pageButton} ${currentPage === i + 1 ? style.activePage : ""}`}
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

export default PaymentRequestPage;
