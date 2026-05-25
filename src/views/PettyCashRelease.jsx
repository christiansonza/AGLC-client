import React, { useState, useRef, useEffect } from "react";
import { ToastContainer, toast } from 'react-toastify';

import { useGetPettyCashQuery, useCreatePettyCashMutation } from "../features/pettyCashReleaseSlice";
import { useFetchPaymentRequestQuery } from "../features/paymentRequest";
import { useGetPaymentRequestDetailsByRequestIdQuery } from "../features/paymentRequestDetailSlice";
import { useFetchEmployeeQuery } from "../features/employeeSlice";
import style from "../views/css/page.module.css";
import { Mosaic } from "react-loading-indicators";
import { useNavigate, Link } from "react-router-dom";

import { useFetchJournalEntryQuery } from "../features/journalEntrySlice";

function PettyCashRelease() {
  const { data, isLoading, isError, error } = useGetPettyCashQuery();
  const pettyCashes = data ?? [];
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    paymentRequestId: null,
    receivedById: null,
    vendor: "",
    remarks: "",
  });


  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const itemsPerPage = 7;

  const [createPettyCash] = useCreatePettyCashMutation();

  const { data: paymentRequests = [], isLoading: isLoadingPayReq } = useFetchPaymentRequestQuery();
  const { data: employees = [], isLoading: isLoadingEmp } = useFetchEmployeeQuery();

  const [openPayReq, setOpenPayReq] = useState(false);
  const [openEmp, setOpenEmp] = useState(false);
  const payReqRef = useRef(null);
  const empRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (payReqRef.current && !payReqRef.current.contains(event.target)) setOpenPayReq(false);
      if (empRef.current && !empRef.current.contains(event.target)) setOpenEmp(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const { data: journalEntries = [] } = useFetchJournalEntryQuery();

  const pettyCashesWithBalance = pettyCashes.map(pc => {
    const relatedJournals = journalEntries.filter(
      j =>
        j.belongsToType?.toLowerCase().replace(/\s/g,'') === "pettycashrelease" &&
        Number(j.belongsToId) === Number(pc.id)
    );

  const totalDebit = relatedJournals.reduce((sum, j) => sum + (Number(j.debit) || 0), 0);
  const totalCredit = relatedJournals.reduce((sum, j) => sum + (Number(j.credit) || 0), 0);

    return {
      ...pc,
      isBalanced: Math.abs(totalDebit - totalCredit) < 0.01 
    };
  });

    const getPaymentRequestLabel = (id) => {
    const pr = paymentRequests.find(p => p.id === id);
    return pr ? `${pr.requestNumber || pr.code || ""}`.toLowerCase() : "";
  };

  const getEmployeeName = (id) => {
    const emp = employees.find(e => e.id === id);
    return emp
      ? `${emp.firstName || ""} ${emp.middleName || ""} ${emp.lastName || ""}`
          .toLowerCase()
      : "";
  };


  const filteredPettyCash = pettyCashesWithBalance.filter((pc) => {
    const query = search.toLowerCase();
    return (
      getPaymentRequestLabel(pc.paymentRequestId).includes(query) ||
      getEmployeeName(pc.receivedById).includes(query)
    );
  });

  const totalPages = Math.ceil(filteredPettyCash.length / itemsPerPage);
  const currentPettyCash = filteredPettyCash.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);
  const handleNext = () => currentPage < totalPages && setCurrentPage((p) => p + 1);
  const handlePrevious = () => currentPage > 1 && setCurrentPage((p) => p - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.paymentRequestId || !formData.receivedById) {
      toast.error("Invalid Action");
      return;
    }
    try {
      const response = await createPettyCash(formData).unwrap();
      toast.success(response.message || 'Created Successfully.');

      setFormData({ paymentRequestId: null, receivedById: null });
      setShowModal(false);
      navigate(`/editPettyCashRelease/${response.data.id}`);

    } catch (err) {
      toast.error(err?.data?.message || 'Something went wrong');
    }
  };

  const [showLoader, setShowLoader] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setShowLoader(false), 1000);
    return () => clearTimeout(timer);
  }, []);

    const { data: paymentRequestDetails = [] } = useGetPaymentRequestDetailsByRequestIdQuery(
    formData.paymentRequestId,
    { skip: !formData.paymentRequestId }
  );

  const totalAmount = paymentRequestDetails.length > 0
    ? paymentRequestDetails
        .reduce((sum, d) => sum + d.amount * d.quantity, 0)
        .toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : (0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });


  if (showLoader || isLoading) {
    return (
      <div style={{
        position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
        display: "flex", justifyContent: "center", alignItems: "center",
        backgroundColor: "#fff", zIndex: 9999
      }}>
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
        <div className={style.pageHeaderContainerAccount}>
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
              <h3 className={style.headerLaber}>Petty Cash Release</h3>
              </div>
              <p className={style.headerSubtitle}>View and manage petty cash release.</p>
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
            <button className={style.addBtn} onClick={() => setShowModal(true)}  title="Add Petty Cash Release">
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

        {/* Modal */}
        {showModal && (
          <div className={style.modalOverlay}>
            <div className={style.modal}>
              <div className={style.modalHeader}>
                <h3>Add Petty Cash</h3>
                    <button
                      className={style.closeButton}
                      onClick={() => {
                        setFormData({
                          paymentRequestId: null,
                          receivedById: null,
                          vendor: "",
                          remarks: "",
                        });
                        setShowModal(false);
                      }}
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
              <label className={style.modalLabel}>Payment Request: </label>
               <div className={style.customSelectWrapper} ref={payReqRef}>
                <div
                    className={style.customSelectInput}
                    onClick={() => setOpenPayReq(!openPayReq)}
                  >
                    {formData.paymentRequestId
                      ? (() => {
                          const pr = paymentRequests.find(p => p.id === formData.paymentRequestId);
                          return pr ? pr.requestNumber || pr.code || pr.id : formData.paymentRequestId;
                        })()
                      : "Select Payment Request"}
                    <span className={style.selectArrow}>▾</span>
                  </div>

                {openPayReq && (
                  <div className={style.customSelectDropdown}>
                    {isLoadingPayReq ? (
                      <div className={style.customSelectOption}>Loading...</div>
                    ) : paymentRequests.filter(pr => pr.status === 'Open' && pr.requestType === 'Petty Cash').length === 0 ? (
                      <div className={style.customSelectOption}>No Payment Requests</div>
                    ) : (
                      paymentRequests
                        .filter(pr => pr.status === 'Open' && pr.requestType === 'Petty Cash')
                        .map((pr) => (
                          <div
                            key={pr.id}
                            className={style.customSelectOption}
                            onClick={() => {
                            setFormData({
                              ...formData,
                              paymentRequestId: pr.id,
                              vendor: pr.vendor?.name || "",
                              remarks: pr.remarks || "",
                            });
                            setOpenPayReq(false);
                          }}
                          >
                            {pr.requestNumber || pr.code || pr.id} 
                          </div>
                        ))
                    )}
                  </div>
                )}
                </div>

                <label className={style.modalLabel}>Vendor:</label>
                <input
                  style={{outline:"none", cursor:'not-allowed'}}
                  type="text"
                  className={style.modalInput}
                  value={formData.vendor}
                  readOnly
                />

                <label className={style.modalLabel}>Remarks:</label>
                <textarea
                  style={{outline:"none", cursor:'not-allowed'}}
                  className={style.modalTextarea}
                  value={formData.remarks}
                  readOnly
                />

                <label className={style.modalLabel}>Amount:</label>
                <input
                  style={{outline:"none", cursor:'not-allowed'}}
                  type="text"
                  className={style.modalInput}
                  value={totalAmount}
                  readOnly
                />

              <label className={style.modalLabel}>Received By: </label>
                <div className={style.customSelectWrapper} ref={empRef}>
                <div
                    className={style.customSelectInput}
                    onClick={() => setOpenEmp(!openEmp)}
                >
                    {formData.receivedById
                    ? (() => {
                        const emp = employees.find(e => e.id === formData.receivedById);
                        return emp
                            ? `${emp.firstName || ''} ${emp.middleName || ''} ${emp.lastName || ''}`.trim()
                            : formData.receivedById;
                        })()
                    : "Select Employee"}
                    <span className={style.selectArrow}>▾</span>
                </div>

                {openEmp && (
                    <div className={style.customSelectDropdown}>
                    {isLoadingEmp ? (
                        <div className={style.customSelectOption}>Loading...</div>
                    ) : employees.length === 0 ? (
                        <div className={style.customSelectOption}>No Employees</div>
                    ) : (
                        employees.map((emp) => (
                        <div
                            key={emp.id}
                            className={style.customSelectOption}
                            onClick={() => {
                            setFormData({ ...formData, receivedById: emp.id });
                            setOpenEmp(false);
                            }}
                        >
                            {`${emp.firstName || ''} ${emp.middleName || ''} ${emp.lastName || ''}`.trim()}
                        </div>
                        ))
                    )}
                    </div>
                )}
                </div>

                <div className={style.modalActions}>
                  <button type="button" className={style.cancelButton} onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className={style.submitButton}>Submit</button>
                </div>
              </form>
            </div>
          </div>
        )}

        <table>
          <thead>
            <tr className={style.headPettyCashTable}>
              <th></th>
              <th>Request Number</th>
              <th>Received By</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {currentPettyCash.length === 0 ? (
              <tr><td colSpan="2" style={{ textAlign: "center" }}>No records found</td></tr>
            ) : currentPettyCash.map((pc) => (
              <tr className={style.bodyPettyCashTable} key={pc.id}>
                <td>
                  {!pc.isBalanced && (
                    <span className={style.warningIcon} data-tooltip="Total Debit and Credit are not equal" style={{ color: "orange" }}>
                      <svg className={style.warningIconPettyCash} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M12 20a8 8 0 1 0 0-16a8 8 0 0 0 0 16M10.756 8.4C10.686 7.65 11.264 7 12 7s1.313.649 1.244 1.4l-.494 4.15a.76.76 0 0 1-.75.7a.76.76 0 0 1-.75-.7zm2.494 7.35a1.25 1.25 0 1 1-2.5 0a1.25 1.25 0 0 1 2.5 0" />
                      </svg>
                    </span>
                  )}
                </td>
                  <td>
                    {(() => {
                      const pr = paymentRequests.find(
                        (pr) =>
                          pr.id === pc.paymentRequestId &&
                          pr.requestType === "Petty Cash"
                      );

                      return pr
                        ? pr.requestNumber || pr.code || pr.id
                        : pc.paymentRequestId;
                    })()}
                  </td>
                    <td>
                    {(() => {
                        const emp = employees.find(e => e.id === pc.receivedById);
                        return emp
                        ? `${emp.firstName || ''} ${emp.middleName || ''} ${emp.lastName || ''}`.trim()
                        : pc.receivedById;
                    })()}
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
                          onClick={()=> navigate(`/editPettyCashRelease/${pc.id}`)}
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
            ))}
          </tbody>
        </table>

        {totalPages > 1 && (
          <div className={style.paginationContainer}>
            <button className={style.pageButton} onClick={handlePrevious} disabled={currentPage === 1}>Prev</button>
            {[...Array(totalPages)].map((_, i) => (
              <button key={i + 1} className={`${style.pageButton} ${currentPage === i + 1 ? style.activePage : ''}`} onClick={() => handlePageChange(i + 1)}>{i + 1}</button>
            ))}
            <button className={style.pageButton} onClick={handleNext} disabled={currentPage === totalPages}>Next</button>
          </div>
        )}
      </div>
    </main>
  );
}

export default PettyCashRelease;
