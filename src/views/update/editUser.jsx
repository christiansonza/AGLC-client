import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useGetUserByIdQuery, useUpdateUserMutation } from "../../features/userSlice";
import toast, { Toaster } from 'react-hot-toast';
import style from '../css/page.module.css'
import { Mosaic } from "react-loading-indicators";

function EditUser() {
  const { id } = useParams();
  // const navigate = useNavigate();

  const { data: user, isLoading, isError, error } = useGetUserByIdQuery(id);
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    firstName: '',
    middleName: '',
    lastName: '',
    role: '',
    isActive: false
  });

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        firstName: user.firstName || '',
        middleName: user.middleName || '',
        lastName: user.lastName || '',
        role: user.role || '',
        isActive: user.isActive ?? false,
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateUser({ id, ...formData }).unwrap();
      toast.success('Updated successfully!');
      // navigate('/user');
    } catch (err) {
      console.error(err);
      toast.error('Failed to update user.');
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
      <div className={style.editContainer}>
        <div className={style.flexTitleHeader}>
            <svg className={style.svgTitleHeader} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path fill="currentColor" d="M7.005 3.1a1 1 0 1 1 1.99 0l-.388 6.35a.61.61 0 0 1-1.214 0zM7 12a1 1 0 1 1 2 0a1 1 0 0 1-2 0"/></svg>
            <h3 className={style.headerLaber}>Edit Users</h3>
        </div>
       <form onSubmit={handleSubmit} className={style.editForm}>
          <div className={style.flexInput}>
            <div className={style.gridUserEdit}>
              <label className={style.editLabel}>Username: </label>
              <input
                className={style.editInput}
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                required
              />
            </div>
            <div className={style.gridUserEdit}>
              <label className={style.editLabel}>Email: </label>
              <input
                className={style.editInput}
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
          </div>

        <label className={style.editLabel}>First Name: </label>
        <input
          className={style.editInput}
          type="text"
          value={formData.firstName}
          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
          required
        />

        <label className={style.editLabel}>Middle Name: </label>
        <input
          className={style.editInput}
          type="text"
          value={formData.middleName}
          onChange={(e) => setFormData({ ...formData, middleName: e.target.value })}
        />

        <label className={style.editLabel}>Last Name: </label>
        <input
          className={style.editInput}
          type="text"
          value={formData.lastName}
          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
        />
        <label className={style.editLabel}>Role: </label>
        <select
            className={style.selectRole}
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            required
          >
            <option value="" disabled>Select Role</option>
            <option value="Power User">Power User</option>
            <option value="System Support">System Support</option>
            <option value="Operations">Operations</option>
            <option value="Accounting Manager">Accounting Manager</option>
            <option value="Accounting Staff">Accounting Staff</option>
        </select>  
        <div className={style.editUserActiveHolder}>
            <label>Active: </label>
            <input
              className={style.editActive}
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
            />
          </div>    
        <button
          className={style.editButton}
          type="submit"
          disabled={isUpdating}
        >
          {isUpdating ? 'Updating...' : 'Update'}
        </button>
      </form>
      </div>
    </main>
  );
}

export default EditUser;
