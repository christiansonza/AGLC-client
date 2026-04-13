import React, { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { Mosaic } from "react-loading-indicators";

import {
  useFetchBookingByIdQuery,
  useUpdateBookingMutation,
  useFetchBookingDetailsQuery,
  useCreateBookingDetailMutation
} from '../../features/bookingSlice';

import { useFetchCustomerQuery } from '../../features/customerSlice';
import { useGetCourierQuery } from '../../features/courierSlice';
import { useGetBrokerQuery } from '../../features/brokerSlice';
import { useGetVesselQuery } from '../../features/vesselSlice';
import { useGetShipperQuery } from '../../features/shipperSlice';
import { useGetDestinationQuery } from '../../features/destinationSlice';

import {
  useFetchJournalBookingQuery,
  useCreateJournalBookingMutation,
} from '../../features/bookingSlice';
import { useFetchAccountQuery } from '../../features/accountTitleSlice';
import { useFetchSubAccountQuery } from '../../features/subAccountTitleSlice';
import { useFetchDepartmentQuery } from '../../features/departmentSlice';

import { useFetchAffiliateQuery } from '../../features/affiliateSlice';
import { useFetchAgentQuery } from '../../features/agentSlice';
import { useFetchBankQuery } from '../../features/bankSlice';
import { useFetchEmployeeQuery } from '../../features/employeeSlice';
import { useFetchLocalGovernmentAgencyQuery } from '../../features/localGovernmentAgencySlice';
import { useFetchVendorQuery } from '../../features/vendorSlice';

import style from '../css/page.module.css';

function EditBooking() {
  const { id } = useParams();

  const { data: bookingData, isLoading, isError, error } = useFetchBookingByIdQuery(id);
  const [updateBooking] = useUpdateBookingMutation();

  const { data: bookingDetails = [] } = useFetchBookingDetailsQuery(id);
  const [createBookingDetail] = useCreateBookingDetailMutation();

  const [formData, setFormData] = useState({ customerId: '', remarks: '' });

  useEffect(() => {
    if (bookingData) {
      setFormData({
        customerId: bookingData.customerId || '',
        remarks: bookingData.remarks || '',
      });
    }
  }, [bookingData]);

  const { data: customers = [] } = useFetchCustomerQuery();
  const activeCustomers = customers.filter(c => c.isActive);

  const { data: couriers = [] } = useGetCourierQuery();
  const { data: brokers = [] } = useGetBrokerQuery();
  const { data: vessels = [] } = useGetVesselQuery();
  const { data: shippers = [] } = useGetShipperQuery();
  const { data: destinations = [] } = useGetDestinationQuery();

  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [detailForm, setDetailForm] = useState({
    voyNo: '',
    courierId: null,
    brokerId: null,
    vesselId: null,
    voy: '',
    no: '',
    shipperId: null,
    destinationId: null,
  });

  const [openCustomer, setOpenCustomer] = useState(false);
  const [openCourier, setOpenCourier] = useState(false);
  const [openBroker, setOpenBroker] = useState(false);
  const [openVessel, setOpenVessel] = useState(false);
  const [openShipper, setOpenShipper] = useState(false);
  const [openDestination, setOpenDestination] = useState(false);

  const customerRef = useRef(null);
  const courierRef = useRef(null);
  const brokerRef = useRef(null);
  const vesselRef = useRef(null);
  const shipperRef = useRef(null);
  const destinationRef = useRef(null);

  const [detailList, setDetailList] = useState([]);

  useEffect(() => {
    if (bookingDetails) {
      setDetailList(bookingDetails);
    }
  }, [bookingDetails]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (customerRef.current && !customerRef.current.contains(event.target)) setOpenCustomer(false);
      if (courierRef.current && !courierRef.current.contains(event.target)) setOpenCourier(false);
      if (brokerRef.current && !brokerRef.current.contains(event.target)) setOpenBroker(false);
      if (vesselRef.current && !vesselRef.current.contains(event.target)) setOpenVessel(false);
      if (shipperRef.current && !shipperRef.current.contains(event.target)) setOpenShipper(false);
      if (destinationRef.current && !destinationRef.current.contains(event.target)) setOpenDestination(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  const { data: journalData = [] } = useFetchJournalBookingQuery(id);
  const [createJournal] = useCreateJournalBookingMutation();
  const [journalList, setJournalList] = useState([]);
  const [openJournalModal, setOpenJournalModal] = useState(false);

  const [journalForm, setJournalForm] = useState({
    accountTitleId: null,
    subAccountTitleId: null,
    departmentId: null,
    listItemType: '',
    listItemId: '',
    credit:'',
    debit:''
  });

  const { data: accounts = [] } = useFetchAccountQuery();
  const { data: subAccounts = [] } = useFetchSubAccountQuery();
  const { data: departments = [] } = useFetchDepartmentQuery();

  const accountRef = useRef(null);
  const subAccountRef = useRef(null);
  const departmentRef = useRef(null);
  const listTypeRef = useRef(null);
  const listItemRef = useRef(null);

  const [openAccount, setOpenAccount] = useState(false);
  const [openSubAccount, setOpenSubAccount] = useState(false);
  const [openDepartment, setOpenDepartment] = useState(false);
  const [openListType, setOpenListType] = useState(false);
  const [openListItem, setOpenListItem] = useState(false);

  const { data: affiliates = [] } = useFetchAffiliateQuery();
  const { data: agents = [] } = useFetchAgentQuery();
  const { data: banks = [] } = useFetchBankQuery();
  const { data: employees = [] } = useFetchEmployeeQuery();
  const { data: lgas = [] } = useFetchLocalGovernmentAgencyQuery();
  const { data: vendors = [] } = useFetchVendorQuery();

  const getListItemNameFromJournal = (j) => {
  const id = Number(j.listItemId); 

    switch (j.listItemType) {
      case "Affiliate":
        return affiliates.find(a => Number(a.id) === id)?.name || "-";

      case "Agent":
        return agents.find(a => Number(a.id) === id)?.name || "-";

      case "Bank":
        return banks.find(b => Number(b.id) === id)?.name || "-";

      case "Customer":
        return customers.find(c => Number(c.id) === id)?.name || "-";

      case "Employee": {
        const emp = employees.find(e => Number(e.id) === id);
        return emp
          ? `${emp.firstName} ${emp.middleName || ""} ${emp.lastName}`.trim()
          : "-";
      }

      case "Local Government Agency":
        return lgas.find(l => Number(l.id) === id)?.name || "-";

      case "Vendor":
        return vendors.find(v => Number(v.id) === id)?.name || "-";

      default:
        return "-";
    }
  };

  const getListItemSource = () => {
    switch (journalForm.listItemType) {
      case "Affiliate":
        return affiliates || [];
      case "Agent":
        return agents || [];
      case "Bank":
        return banks || [];
      case "Customer":
        return customers || [];
      case "Employee":
        return employees || [];
      case "Local Government Agency":
        return lgas || [];
      case "Vendor":
        return vendors || [];
      default:
        return [];
    }
  };

  useEffect(() => {
    if (journalData) setJournalList(journalData);
  }, [journalData]);

  const handleSaveJournal = async () => {
  const { accountTitleId, subAccountTitleId, departmentId, listItemType, listItemId, credit, debit } = journalForm;

  if (!accountTitleId) {
    toast.error("Account Title is required");
    return;
  }

    try {
      const payload = {
        accountTitleId,
        subAccountTitleId,
        departmentId,
        listItemType,
        listItemId,
        credit: Number(credit) || 0,
        debit: Number(debit) || 0
      };

      const newJournal = await createJournal({ bookingId: id, ...payload }).unwrap();
      setJournalList(prev => [...prev, newJournal]);
      setJournalForm({
        accountTitleId: null,
        subAccountTitleId: null,
        departmentId: null,
        listItemType: '',
        listItemId: '',
        credit:'',
        debit:''
      });
      setOpenJournalModal(false);
      toast.success("Journal Entry added!");
    } catch (error) {
      console.error(error);
      toast.error(error?.data?.message || "Failed to add journal entry");
    }
  };

  const [showLoader, setShowLoader] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setShowLoader(false), 1000);
    return () => clearTimeout(timer);
  }, []);

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
  const totalDebit = journalList.reduce((sum, j) => {
    const value = parseFloat(j.debit);
    return sum + (isNaN(value) ? 0 : value);
  }, 0);

  const totalCredit = journalList.reduce((sum, j) => {
    const value = parseFloat(j.credit);
    return sum + (isNaN(value) ? 0 : value);
  }, 0);

  if (isError) {
    const status = error?.status;
    if (status === 401) {
      return (
        <div className={style.unauthorizedWrapper}>
          <p className={style.error1}>401</p>
          <p className={style.error2}>Page Not Found.</p>
          <Link to={'/login'}>
            <button className={style.errorLogin}>Unauthorized. Please log in to proceed.</button>
          </Link>
        </div>
      );
    }
    return <p>Error: {error?.data?.message || 'Something went wrong'}</p>;
  }

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateBooking({ id, ...formData }).unwrap();
      toast.success('Booking updated successfully!');
    } catch (err) {
      console.error(err);
      toast.error(err?.data?.message || 'Update failed!');
    }
  };

  const handleSaveDetail = async () => {
    const { voyNo, voy, no, courierId, brokerId, vesselId, shipperId, destinationId } = detailForm;

  if (!voyNo || !voy || !no ||
      courierId == null || brokerId == null || vesselId == null || 
      shipperId == null || destinationId == null) {
    toast.error("Please complete all booking detail fields");
    return;
  }
    const payload = {
      voyNo,
      voy,
      no,
      courier: couriers.find(c => c.id === courierId)?.courier || '',
      broker: brokers.find(b => b.id === brokerId)?.broker || '',
      vesselName: vessels.find(v => v.id === vesselId)?.vesselName || '',
      shipper: shippers.find(s => s.id === shipperId)?.shipper || '',
      destinationName: destinations.find(d => d.id === destinationId)?.destinationName || '',
    };

    try {
      const newDetail = await createBookingDetail({ bookingId: id, ...payload }).unwrap();
      setDetailList(prev => [...prev, newDetail]);
      setDetailForm({
        voyNo: '',
        courierId: null,
        brokerId: null,
        vesselId: null,
        voy: '',
        no: '',
        shipperId: null,
        destinationId: null,
      });
      setOpenDetailModal(false);
      toast.success("Booking detail added");
    } catch (err) {
      console.error(err);
      toast.error(err?.data?.message || "Failed to add booking detail");
    }
  };
  

  return (
    <main className="main-container">
      <div className={style.editBooking}>
        {/* Booking Form */}
        <div className={style.EditflexTitleHeader}>
          <div className={style.flexheaderTitle}>
            <svg className={style.EditsvgExclamation} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path fill="currentColor" d="M21 12a1 1 0 0 0-1 1v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h6a1 1 0 0 0 0-2H5a3 3 0 0 0-3 3v14a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3v-6a1 1 0 0 0-1-1m-15 .76V17a1 1 0 0 0 1 1h4.24a1 1 0 0 0 .71-.29l6.92-6.93L21.71 8a1 1 0 0 0 0-1.42l-4.24-4.29a1 1 0 0 0-1.42 0l-2.82 2.83l-6.94 6.93a1 1 0 0 0-.29.71m10.76-8.35l2.83 2.83l-1.42 1.42l-2.83-2.83ZM8 13.17l5.93-5.93l2.83 2.83L10.83 16H8Z" />
              </svg>
            <h3 className={style.headerLaber}>Update Booking</h3>
          </div>
          <p className={style.headerSubtitle}>View and manage bookings.</p>
        </div>

        <form onSubmit={handleUpdate} className={style.editFormCustomer}>
          <label className={style.editLabel}>Customer: </label>
          <div className={style.customSelectWrapper} ref={customerRef}>
            <div className={style.customSelectInput} onClick={() => setOpenCustomer(!openCustomer)}>
              {formData.customerId ? activeCustomers.find(c => c.id === formData.customerId)?.name : "-- Select Customer --"}
              <span className={style.selectArrow}>▾</span>
            </div>
            {openCustomer && (
              <div className={style.customSelectDropdown}>
                {activeCustomers.map(c => (
                  <div key={c.id} className={style.customSelectOption} onClick={() => { setFormData({ ...formData, customerId: c.id }); setOpenCustomer(false); }}>
                    {c.name}
                  </div>
                ))}
              </div>
            )}
          </div>

          <label className={style.editLabel}>Remarks: </label>
          <textarea
            style={{ marginBottom: "1rem" }}
            value={formData.remarks}
            onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
            placeholder="Remarks"
          />

          <button className={style.editButton} type="submit">Update</button>
        </form>

        {/* Booking Details Table */}
        <div className={style.flexheaderTitleJournal} style={{ marginTop: "2rem" }}>
          <div className={style.bookingContainer}>
            <p className={style.bookingPaymentTitle}>Booking Details</p>
            <p className={style.bookingPaymentSubtitle}>Add and view booking details.</p>
          </div>
          <button className={style.addBtnJournal} onClick={() => setOpenDetailModal(true)}>
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

        <table className={style.tableJournal}>
          <thead>
            <tr className={style.journalHeaderTableBookingDetails}>
              <th>JPC Voy #</th>
              <th>S/L Courier</th>
              <th>Broker</th>
              <th>Vessel Name</th>
              <th>Voy #</th>
              <th>No.</th>
              <th>Shipper</th>
              <th>Destination</th>
            </tr>
          </thead>
          <tbody>
            {detailList.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: "center", padding: "12px" }}>No booking details.</td>
              </tr>
            ) : (
              detailList.map((d, index) => (
                <tr className={style.journalBodyTableBookingDetails} key={index}>
                  <td>{d.voyNo}</td>
                  <td>{d.courier}</td>
                  <td>{d.broker}</td>
                  <td>{d.vesselName}</td>
                  <td>{d.voy}</td>
                  <td>{d.no}</td>
                  <td>{d.shipper}</td>
                  <td>{d.destinationName}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Booking Details Modal */}
        {openDetailModal && (
          <div className={style.modalOverlay}>
            <div className={style.modal}>
              <div className={style.modalHeader}>
                <h3>Add Booking Detail</h3>
                <button className={style.closeButton} onClick={() => setOpenDetailModal(false)}>
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
              <form className={style.formContainer} onSubmit={(e) => { e.preventDefault(); handleSaveDetail(); }}>
                
              <div className={style.flexVoyCour}>
                {/* Voy Number */}
                <div style={{display:'flex', flexDirection:'column',  width:'100%'}}>
                  <label className={style.modalLabel}>JPC Voy #:</label>
                  <input type="text" value={detailForm.voyNo} onChange={e => setDetailForm(prev => ({ ...prev, voyNo: e.target.value }))} />
                </div>

              <div style={{display:'flex', flexDirection:'column', width:'100%'}}>
                  {/* Courier */}
                  <label className={style.modalLabel}>S/L Courier:</label>
                  <div className={style.customSelectWrapper} ref={courierRef}>
                    <div className={style.customSelectInput} onClick={() => setOpenCourier(!openCourier)}>
                      {detailForm.courierId ? couriers.find(c => c.id === detailForm.courierId)?.courier : "Select Courier"}
                      <span className={style.selectArrow}>▾</span>
                    </div>
                    {openCourier && (
                      <div className={style.customSelectDropdown}>
                        {couriers.map(c => (
                          <div key={c.id} className={style.customSelectOption} onClick={() => { setDetailForm(prev => ({ ...prev, courierId: Number(c.id) })); setOpenCourier(false); }}>
                            {c.courier}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

            <div className={style.flexVoyCour}>
              <div style={{display:'flex', flexDirection:'column', width:'100%'}}>
                  {/* Broker */}
                  <label className={style.modalLabel}>Broker:</label>
                  <div className={style.customSelectWrapper} ref={brokerRef}>
                    <div className={style.customSelectInput} onClick={() => setOpenBroker(!openBroker)}>
                      {detailForm.brokerId ? brokers.find(b => b.id === detailForm.brokerId)?.broker : "Select Broker"}
                      <span className={style.selectArrow}>▾</span>
                    </div>
                    {openBroker && (
                      <div className={style.customSelectDropdown}>
                        {brokers.map(b => (
                          <div key={b.id} className={style.customSelectOption} onClick={() => { setDetailForm(prev => ({ ...prev, brokerId: Number(b.id) })); setOpenBroker(false); }}>
                            {b.broker}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

              <div style={{display:'flex', flexDirection:'column', width:'100%'}}>
                  {/* Vessel */}
                  <label className={style.modalLabel}>Vessel Name:</label>
                  <div className={style.customSelectWrapper} ref={vesselRef}>
                    <div className={style.customSelectInput} onClick={() => setOpenVessel(!openVessel)}>
                      {detailForm.vesselId ? vessels.find(v => v.id === detailForm.vesselId)?.vesselName : "Select Vessel"}
                      <span className={style.selectArrow}>▾</span>
                    </div>
                    {openVessel && (
                      <div className={style.customSelectDropdown}>
                        {vessels.map(v => (
                          <div key={v.id} className={style.customSelectOption} onClick={() => { setDetailForm(prev => ({ ...prev, vesselId: Number(v.id) })); setOpenVessel(false); }}>
                            {v.vesselName}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

            <div className={style.flexVoyCour}>
              <div style={{display:'flex', flexDirection:'column', width:'100%'}}>
                  {/* Voy & No */}
                  <label className={style.modalLabel}>Voy #:</label>
                  <input type="text" value={detailForm.voy} onChange={e => setDetailForm(prev => ({ ...prev, voy: e.target.value }))} />
              </div>
              <div style={{display:'flex', flexDirection:'column', width:'100%'}}>
                  <label className={style.modalLabel}>No.:</label>
                  <input type="text" value={detailForm.no} onChange={e => setDetailForm(prev => ({ ...prev, no: e.target.value }))} />
                  </div>
              </div>
                  {/* Shipper */}
                  <label className={style.modalLabel}>Shipper:</label>
                  <div className={style.customSelectWrapper} ref={shipperRef}>
                    <div className={style.customSelectInput} onClick={() => setOpenShipper(!openShipper)}>
                      {detailForm.shipperId ? shippers.find(s => s.id === detailForm.shipperId)?.shipper : "Select Shipper"}
                      <span className={style.selectArrow}>▾</span>
                    </div>
                    {openShipper && (
                      <div className={style.customSelectDropdown}>
                        {shippers.map(s => (
                          <div key={s.id} className={style.customSelectOption} onClick={() => { setDetailForm(prev => ({ ...prev, shipperId: Number(s.id) })); setOpenShipper(false); }}>
                            {s.shipper}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                {/* Destination */}
                <label className={style.modalLabel}>Destination:</label>
                <div className={style.customSelectWrapper} ref={destinationRef}>
                  <div className={style.customSelectInput} onClick={() => setOpenDestination(!openDestination)}>
                    {detailForm.destinationId ? destinations.find(d => d.id === detailForm.destinationId)?.destinationName : "Select Destination"}
                    <span className={style.selectArrow}>▾</span>
                  </div>
                  {openDestination && (
                    <div className={style.customSelectDropdown}>
                      {destinations.map(d => (
                        <div key={d.id} className={style.customSelectOption} onClick={() => { setDetailForm(prev => ({ ...prev, destinationId: Number(d.id) })); setOpenDestination(false); }}>
                          {d.destinationName}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className={style.modalActions}>
                  <button type="button" className={style.cancelButton} onClick={() => setOpenDetailModal(false)}>Cancel</button>
                  <button type="submit" className={style.submitButton}>Save</button>
                </div>
              </form>
            </div>
          </div>
        )}

      {/* Journal Entries Table */}
      <div className={style.flexheaderTitleJournal} style={{ marginTop: "2rem" }}>
        <div className={style.bookingContainer}>
          <p className={style.bookingPaymentTitle}>Journal Entry</p>
          <p className={style.bookingPaymentSubtitle}>Create and review journal entry history. </p>
        </div>
        <button className={style.addBtnJournal} onClick={() => setOpenJournalModal(true)}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path fill="currentColor" d="M11 13H6q-.425 0-.712-.288T5 12t.288-.712T6 11h5V6q0-.425.288-.712T12 5t.713.288T13 6v5h5q.425 0 .713.288T19 12t-.288.713T18 13h-5v5q0 .425-.288.713T12 19t-.712-.288T11 18z"/>
          </svg>
        </button>
      </div>

        {totalDebit !== totalCredit && (
          <div className={style.notifJounalEntry}>
            <svg className={style.svgNotifJournal} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path fill="currentColor" d="m21.171 15.398l-5.912-9.854C14.483 4.251 13.296 3.511 12 3.511s-2.483.74-3.259 2.031l-5.912 9.856c-.786 1.309-.872 2.705-.235 3.83C3.23 20.354 4.472 21 6 21h12c1.528 0 2.77-.646 3.406-1.771s.551-2.521-.235-3.831M12 17.549c-.854 0-1.55-.695-1.55-1.549c0-.855.695-1.551 1.55-1.551s1.55.696 1.55 1.551c0 .854-.696 1.549-1.55 1.549m1.633-7.424c-.011.031-1.401 3.468-1.401 3.468c-.038.094-.13.156-.231.156s-.193-.062-.231-.156l-1.391-3.438a1.8 1.8 0 0 1-.129-.655c0-.965.785-1.75 1.75-1.75a1.752 1.752 0 0 1 1.633 2.375" />
            </svg>
             Total Debit and Credit are not equal!
          </div>
        )}
        
      <table className={style.tableJournal} style={{marginBottom:'4rem'}}>
        <thead>
          <tr className={style.journalHeaderTable}>
            <th>Account Title</th>
            <th>Sub Account</th>
            <th>Department</th>
            <th>List Item type</th>
            <th>List Item</th>
            <th>Credit</th>
            <th>Debit</th>
          </tr>
        </thead>
        <tbody>
          {journalList.length === 0 ? (
            <tr>
              <td className={style.journalBodyTable}>No journal entries.</td>
            </tr>
          ) : (
            journalList.map((j, index) => (
              <tr  className={style.journalBodyTable} key={index}>
                <td>{accounts.find(a => a.id === j.accountTitleId)?.name || j.accountTitleId}</td>
                <td>{subAccounts.find(s => s.id === j.subAccountTitleId)?.name || j.subAccountTitleId}</td>
                <td>{departments.find(d => d.id === j.departmentId)?.name || j.departmentId}</td>
                <td>{j.listItemType}</td>
                <td>{getListItemNameFromJournal(j)}</td>
                <td>
                  {Number(j.credit || 0).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </td>
                <td>
                  {Number(j.debit || 0).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </td>
              </tr>
            ))
          )}

          <tr className={style.journalTotalRow}>
            <td colSpan={5} style={{ textAlign: "right", fontWeight: "bold" }}>Total:</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td style={{ fontWeight: "bold" }}>{totalCredit.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
            <td style={{ fontWeight: "bold" }}>{totalDebit.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
          </tr>
        </tbody>
      </table>

        {openJournalModal && (
          <div className={style.modalOverlay}>
            <div className={style.modal}>
              <div className={style.modalHeader}>
                <h3>Add Journal Entry</h3>
                <button className={style.closeButton} onClick={() => setOpenJournalModal(false)}>
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
              <form className={style.formContainer} onSubmit={(e) => { e.preventDefault(); handleSaveJournal(); }}>

               {/* Account Title */}
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
                <label className={style.modalLabel}>Account Title:</label>
                <div className={style.customSelectWrapper} ref={accountRef}>
                  <div
                    className={style.customSelectInput}
                    onClick={() => setOpenAccount(!openAccount)}
                  >
                    {journalForm.accountTitleId
                      ? accounts.find(a => a.id === journalForm.accountTitleId)?.name
                      : "Select Account"}
                    <span className={style.selectArrow}>▾</span>
                  </div>

                  {openAccount && (
                    <div className={style.customSelectDropdown}>
                      {accounts.map(a => (
                        <div
                          key={a.id}
                          className={style.customSelectOption}
                          onClick={() => {
                            setJournalForm(prev => ({ ...prev, accountTitleId: a.id }));
                            setOpenAccount(false);
                          }}
                        >
                          {a.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

                {/* Sub Account */}
              <div style={{
                  display:'flex',
                  flexDirection:'column',
                  width:'100%',
                }}>
                <label className={style.modalLabel}>Sub Account:</label>
                <div className={style.customSelectWrapper} ref={subAccountRef}>
                  <div
                    className={style.customSelectInput}
                    onClick={() => setOpenSubAccount(!openSubAccount)}
                  >
                    {journalForm.subAccountTitleId
                      ? subAccounts.find(s => s.id === journalForm.subAccountTitleId)?.name
                      : "Select Sub Account"}
                    <span className={style.selectArrow}>▾</span>
                  </div>

                  {openSubAccount && (
                    <div className={style.customSelectDropdown}>
                      {subAccounts.map(s => (
                        <div
                          key={s.id}
                          className={style.customSelectOption}
                          onClick={() => {
                            setJournalForm(prev => ({ ...prev, subAccountTitleId: s.id }));
                            setOpenSubAccount(false);
                          }}
                        >
                          {s.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

                {/* Department */}
                <label className={style.modalLabel}>Department:</label>
                <div className={style.customSelectWrapper} ref={departmentRef}>
                  <div
                    className={style.customSelectInput}
                    onClick={() => setOpenDepartment(!openDepartment)}
                  >
                    {journalForm.departmentId
                      ? departments.find(d => d.id === journalForm.departmentId)?.name
                      : "Select Department"}
                    <span className={style.selectArrow}>▾</span>
                  </div>

                  {openDepartment && (
                    <div className={style.customSelectDropdown}>
                      {departments.map(d => (
                        <div
                          key={d.id}
                          className={style.customSelectOption}
                          onClick={() => {
                            setJournalForm(prev => ({ ...prev, departmentId: d.id }));
                            setOpenDepartment(false);
                          }}
                        >
                          {d.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* List Item Type */}
                <label className={style.modalLabel}>List Item Type:</label>
                <div className={style.customSelectWrapper} ref={listTypeRef}>
                  <div className={style.customSelectInput} onClick={() => setOpenListType(!openListType)}>
                    {journalForm.listItemType || "Select Type"}
                    <span className={style.selectArrow}>▾</span>
                  </div>
                  {openListType && (
                    <div className={style.customSelectDropdown}>
                      {["Affiliate","Agent","Bank","Customer","Employee","Local Government Agency","Vendor"].map(type => (
                        <div
                          key={type}
                          className={style.customSelectOption}
                          onClick={() => {
                            setJournalForm(prev => ({ ...prev, listItemType: type, listItemId: '' }));
                            setOpenListType(false);
                          }}
                        >
                          {type}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* List Item */}
                <label className={style.modalLabel}>List Item:</label>
                <div className={style.customSelectWrapper} ref={listItemRef}>
                  <div
                    className={style.customSelectInput}
                    onClick={() => journalForm.listItemType && setOpenListItem(!openListItem)}
                  >
                {journalForm.listItemId
                  ? (() => {
                      const item = getListItemSource().find(i => i.id === journalForm.listItemId);
                      return item ? item.name || `${item.firstName || ""} ${item.lastName || ""}`.trim() : "";
                    })()
                  : "Select Item"}
                    <span className={style.selectArrow}>▾</span>
                  </div>
                  {openListItem && (
                    <div className={style.customSelectDropdown}>
                      {getListItemSource().map(item => (
                        <div
                          key={item.id}
                          className={style.customSelectOption}
                          onClick={() => {
                            setJournalForm(prev => ({ ...prev, listItemId: item.id }));
                            setOpenListItem(false);
                          }}
                        >
                          {item.name || `${item.firstName || ""} ${item.lastName || ""}`.trim()}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <label className={style.modalLabel}>Credit:</label>
                <input
                  type="number"
                  value={journalForm.credit}
                  onChange={(e) =>
                    setJournalForm(prev => ({
                      ...prev,
                      credit: e.target.value
                    }))
                  }
                  placeholder="0.00"
                />

                <label className={style.modalLabel}>Debit:</label>
                <input
                  type="number"
                  value={journalForm.debit}
                  onChange={(e) =>
                    setJournalForm(prev => ({
                      ...prev,
                      debit: e.target.value
                    }))
                  }
                  placeholder="0.00"
                />

              <div className={style.modalActions}>
                <button type="button" className={style.cancelButton} onClick={() => setOpenJournalModal(false)}>Cancel</button>
                <button type="submit" className={style.submitButton}>Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
      </div>
      <ToastContainer />
    </main>
  );
}

export default EditBooking;