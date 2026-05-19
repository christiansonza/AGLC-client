import React, { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { Mosaic } from "react-loading-indicators";

import {
  useFetchBookingByIdQuery,
  useUpdateBookingMutation,
  useFetchBookingDetailsQuery,
  useCreateBookingDetailMutation,
  useUpdateBookingDetailMutation
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
  const [updateBookingDetail] = useUpdateBookingDetailMutation();

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

  useEffect(() => {
    if (
      bookingDetails.length > 0 &&
      couriers.length > 0 &&
      brokers.length > 0 &&
      vessels.length > 0 &&
      shippers.length > 0 &&
      destinations.length > 0
    ) {
      const detail = bookingDetails[0];

      setDetailForm({
        voyNo: detail.voyNo || '',
        voy: detail.voy || '',
        no: detail.no || '',

        courierId:
          couriers.find(c => c.courier === detail.courier)?.id || null,

        brokerId:
          brokers.find(b => b.broker === detail.broker)?.id || null,

        vesselId:
          vessels.find(v => v.vesselName === detail.vesselName)?.id || null,

        shipperId:
          shippers.find(s => s.shipper === detail.shipper)?.id || null,

        destinationId:
          destinations.find(d => d.destinationName === detail.destinationName)?.id || null,
      });
    }
  }, [
    bookingDetails,
    couriers,
    brokers,
    vessels,
    shippers,
    destinations
  ]);

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

      const {
        voyNo,
        voy,
        no,
        courierId,
        brokerId,
        vesselId,
        shipperId,
        destinationId
      } = detailForm;

      if (
        voyNo || voy || no || courierId || brokerId || vesselId || shipperId || destinationId
      ) {
        if (
          !voyNo || !voy || !no ||
          courierId == null || brokerId == null ||
          vesselId == null || shipperId == null || destinationId == null
        ) {
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

        const existingDetail = bookingDetails?.[0];

        if (existingDetail?.id) {
          await updateBookingDetail({
            bookingId: id,
            detailId: existingDetail.id,
            ...payload
          }).unwrap();
        } else {
          await createBookingDetail({
            bookingId: id,
            ...payload
          }).unwrap();
        }
      }
        toast.success('Booking updated successfully!');
    } catch (err) {
      console.log("FULL ERROR", err);
      console.log("ERROR DATA", err?.data);
      console.log("ERROR STATUS", err?.status);

      toast.error(err?.data?.message || 'Update failed!');
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

        <form onSubmit={handleUpdate} className={style.editFormBookings}>
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

            <div className={style.flexVoyCour} style={{ marginTop:'4px'}}>
              <div style={{display:'flex', flexDirection:'column', width:'100%', gap:'4px'}}>
                  {/* Voy & No */}
                  <label className={style.modalLabel}>Voy #:</label>
                  <input
                    className={style.editInput}
                    type="text" value={detailForm.voy} onChange={e => setDetailForm(prev => ({ ...prev, voy: e.target.value }))} />
              </div>
              <div style={{display:'flex', flexDirection:'column', width:'100%', gap:'4px'}}>
                  <label className={style.modalLabel}>No.:</label>
                  <input 
                    className={style.editInput}
                    type="text" value={detailForm.no} onChange={e => setDetailForm(prev => ({ ...prev, no: e.target.value }))} />
                  </div>
              </div>

          <div className={style.flexVoyCour}>
                {/* Voy Number */}
                <div style={{display:'flex', flexDirection:'column',  width:'100%'}}>
                  <label className={style.modalLabel}>JPC Voy #:</label>
                  <input
                    style={{marginTop:'1px'}}
                    className={style.editInput}
                    type="text" value={detailForm.voyNo} onChange={e => setDetailForm(prev => ({ ...prev, voyNo: e.target.value }))} />
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
                  {/* Shipper */}
              <div style={{display:'flex', flexDirection:'column', width:'100%'}}>
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
                </div>

              <div style={{display:'flex', flexDirection:'column', width:'100%'}}>
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
              </div>
            </div>
              <label className={style.editLabel} style={{ marginTop:'12px',}}>Remarks: </label>
              <textarea
                style={{ marginBottom: "1rem" }}
                value={formData.remarks}
                onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                placeholder="Remarks"
              />
          <button className={style.editButton} type="submit">Update</button>
        </form>

      </div>
      <ToastContainer />
    </main>
  );
}

export default EditBooking;