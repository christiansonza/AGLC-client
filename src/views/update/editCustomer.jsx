import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useGetCustomerByIdQuery, useUpdateCustomerMutation } from '../../features/customerSlice';
import toast, { Toaster } from 'react-hot-toast';
import style from '../css/page.module.css'
import { Mosaic } from "react-loading-indicators";

function EditCustomer() {
  const { id } = useParams();
  // const navigate = useNavigate();

  const { data: customer, isLoading, isError, error } = useGetCustomerByIdQuery(id);
  const [updateCustomer, { isLoading: isUpdating }] = useUpdateCustomerMutation();

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    tin: '',
    isActive: false,
  });

  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.name || '',
        address: customer.address || '',
        tin: customer.tin || '',
        isActive: customer.isActive ?? false,
      });
    }
  }, [customer]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateCustomer({ id, ...formData }).unwrap();
      toast.success('Updated successfully!');
      // navigate('/customer');
    } catch (err) {
      console.error(err);
      toast.error('Failed to update customer.');
    }
  };

  if (isLoading){
    return (
          <div style={{
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
          }}>
                <Mosaic color={"#007bff"} size="small" />
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
            placeholder="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <label className={style.editLabel}>Address: </label>
          <input
            className={style.editInput}
            type="text"
            placeholder="Address"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          />
          <label className={style.editLabel}>TIN: </label>
          <input
            className={style.editInput}
            type="text"
            placeholder="TIN"
            value={formData.tin}
            onChange={(e) => setFormData({ ...formData, tin: e.target.value })}
          />
         <div className={style.editActiveHolder}>
            <label>Active: </label>
            <input
              className={style.editActive}
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
            />
          </div>
          <button className={style.editButton} type="submit" disabled={isUpdating}>
            {isUpdating ? 'Updating...' : 'Update'}
          </button>
        </form>
      </div>
    </main>
  );
}

export default EditCustomer;
