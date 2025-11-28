import React, { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useParams, useNavigate } from 'react-router-dom';
import {
  useGetVendorByIdQuery,
  useUpdateVendorMutation,
} from '../../features/vendorSlice';
import style from '../css/page.module.css'
import { Mosaic } from "react-loading-indicators";

function VendorEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: vendor, isLoading, isError, error } = useGetVendorByIdQuery(id);
  const [updateVendor] = useUpdateVendorMutation();

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    tin: '',
    isActive: false,
  });

  useEffect(() => {
    if (vendor) {
      setFormData({
        name: vendor.name,
        address: vendor.address,
        tin: vendor.tin,
        isActive: vendor.isActive,
      });
    }
  }, [vendor]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await updateVendor({ id, ...formData }).unwrap();
      toast.success(response.message || 'Updated successfully!');
      navigate('/vendor');
    } catch (err) {
      console.error(err);
      const message = err?.data?.message || err?.error || 'Update failed!';
      toast.error(message);
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
            <Mosaic color="#007bff" size="small" />
        </div>
      );
    }
    
  if (isError) return <p>Error: {error?.message || 'Something went wrong'}</p>;

  return (
    <main className='main-container'>
      <Toaster position="top-right" reverseOrder={false} />
      <div className="edit-container">
        <div className={style.flexTitleHeader} style={{marginBottom:"1.25rem"}}>
            <svg className={style.svgTitleHeader} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path fill="currentColor" d="M7.005 3.1a1 1 0 1 1 1.99 0l-.388 6.35a.61.61 0 0 1-1.214 0zM7 12a1 1 0 1 1 2 0a1 1 0 0 1-2 0"/></svg>
            <h3 className={style.headerLaber}>Edit Customer</h3>
        </div>
        <form onSubmit={handleSubmit} className={style.editForm}>
        <label className={style.editLabel}>Name: </label>
        <input
          className={style.editInput}
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Name"
          required
        />
        <label className={style.editLabel}>Name: </label>
        <input
          className={style.editInput}
          type="text"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          placeholder="Address"
        />
        <label className={style.editLabel}>Name: </label>
        <input
          className={style.editInput}
          type="text"
          value={formData.tin}
          onChange={(e) => setFormData({ ...formData, tin: e.target.value })}
          placeholder="TIN"
        />
        <div className={style.editActiveHolder}>
          <label>Active: </label>
          <input
            type="checkbox"
            checked={formData.isActive}
            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
          />
        </div>
        <button className={style.editButton} type="submit">Update</button>
      </form>
      </div>
    </main>
  );
}

export default VendorEdit;
