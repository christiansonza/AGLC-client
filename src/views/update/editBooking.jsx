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

    if (!voyNo || !voy || !no || !courierId || !brokerId || !vesselId || !shipperId || !destinationId) {
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

        {/* Booking Detail Modal */}
        {openDetailModal && (
          <div className={style.modalOverlay}>
            <div className={style.modal}>
              <div className={style.modalHeader}>
                <h3>Add Booking Detail</h3>
                <button className={style.closeButton} onClick={() => setOpenDetailModal(false)}>X</button>
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

      </div>
      <ToastContainer />
    </main>
  );
}

export default EditBooking;