import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import style from '../views/css/nav.module.css';
import pfp from '../assets/userpfp.jpg';
import { useCurrentUserQuery, useLogoutUserMutation } from '../features/userSlice';
import { toast } from 'react-toastify';
import { Mosaic } from "react-loading-indicators";

import { useDispatch } from 'react-redux';
import { userApi } from '../features/userSlice'; 

function Nav() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [openUsers, setOpenUsers] = useState(false);
  const [openBusiness, setOpenBusiness] = useState(false);
  const [openTransactions, setOpenTransactions] = useState(false);

  const [logoutUser] = useLogoutUserMutation();
  const { data: user, isLoading } = useCurrentUserQuery();
  const dispatch = useDispatch();

  const toggleUsers = () => {
    setOpenUsers(prev => !prev);
    setOpenBusiness(false);
    setOpenTransactions(false);
  };

  const toggleBusiness = () => {
    setOpenBusiness(prev => !prev);
    setOpenUsers(false);
    setOpenTransactions(false);
  };

  const toggleTransactions = () => {
    setOpenTransactions(prev => !prev);
    setOpenUsers(false);
    setOpenBusiness(false);
  };

  const closeAllAccordions = () => {
    setOpenUsers(false);
    setOpenBusiness(false);
    setOpenTransactions(false);
  };
    const [loadingLogout, setLoadingLogout] = useState(false); 
    const handleLogout = async () => {
      setLoadingLogout(true);
      setTimeout(async () => { 
      try {
        await logoutUser().unwrap();
        toast.success('Logged out successfully');
        localStorage.clear();
        sessionStorage.clear();
        dispatch(userApi.util.resetApiState());
        window.location.href = '/login'; 
      } catch (err) {
        toast.error('Logout failed');
        console.error(err);
        setLoadingLogout(false);
      }
    }, 1000);
  };

  if (isLoading || loadingLogout) {
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
        zIndex: 9999
      }}>
        <Mosaic color={"#007bff"} size='small' />
      </div>
    );
  }
  if (!user) return null;

  return (
    <main className={style.main}>
      {/* Top Bar */}
      <div className={style.topBar}>
        <p className={style.welcomeText}>{user?.username || 'Guest'}</p>
        <div className={style.profileWrapper}>
          <img
            src={pfp}
            alt="profile"
            className={style.profileImg}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          />
          {isDropdownOpen && (
            <div className={style.dropdown}>
              <button className={style.dropdownItem} onClick={handleLogout}>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Sidebar */}
      <aside className={style.sideBar}>
        <div className={style.logoContainer}>
          <p className={style.logoHeader}>ACESTAR</p>
          <p className={style.logoSubHeader}>Global Logistics Corporation</p>
        </div>

        <hr className={style.hr} />

        <div className={style.menuList}>
          <small className={style.menuCaption}>MENU</small>

          <div className={style.accordionItem}>
            <div className={style.accordionHeader} onClick={toggleUsers}>
              <p>User Management</p>
              <span>
                {openUsers ? 
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path fill="currentColor" d="M18 12.998H6a1 1 0 0 1 0-2h12a1 1 0 0 1 0 2"/></svg>
                : 
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path fill="currentColor" d="M18 12.998h-5v5a1 1 0 0 1-2 0v-5H6a1 1 0 0 1 0-2h5v-5a1 1 0 0 1 2 0v5h5a1 1 0 0 1 0 2"/></svg>
                }
              </span>
            </div>

            {openUsers && (
              <div className={style.accordionContent}>
                <Link className={style.link} onClick={closeAllAccordions} to="/user"><p>Users</p></Link>
                <Link className={style.link} onClick={closeAllAccordions} to="/employee"><p>Employee</p></Link>
                <Link className={style.link} onClick={closeAllAccordions} to="/customer"><p>Customer</p></Link>
              </div>
            )}
          </div>

          <div className={style.accordionItem}>
            <div className={style.accordionHeader} onClick={toggleBusiness}>
              <p>Business</p>
              <span>
                {openBusiness ? 
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path fill="currentColor" d="M18 12.998H6a1 1 0 0 1 0-2h12a1 1 0 0 1 0 2"/></svg>
                : 
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path fill="currentColor" d="M18 12.998h-5v5a1 1 0 0 1-2 0v-5H6a1 1 0 0 1 0-2h5v-5a1 1 0 0 1 2 0v5h5a1 1 0 0 1 0 2"/></svg>
                }
              </span>
            </div>

            {openBusiness && (
              <div className={style.accordionContent}>
                <Link className={style.link} onClick={closeAllAccordions} to="/company"><p>Company</p></Link>
                <Link className={style.link} onClick={closeAllAccordions} to="/vendor"><p>Vendor</p></Link>
                <Link className={style.link} onClick={closeAllAccordions} to="/department"><p>Department</p></Link>
                <Link className={style.link} onClick={closeAllAccordions} to="/charge"><p>Charge</p></Link>
              </div>
            )}
          </div>

          <div className={style.accordionItem}>
            <div className={style.accordionHeader} onClick={toggleTransactions}>
              <p>Transactions</p>
              <span>
                {openTransactions ? 
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path fill="currentColor" d="M18 12.998H6a1 1 0 0 1 0-2h12a1 1 0 0 1 0 2"/></svg>
                : 
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path fill="currentColor" d="M18 12.998h-5v5a1 1 0 0 1-2 0v-5H6a1 1 0 0 1 0-2h5v-5a1 1 0 0 1 2 0v5h5a1 1 0 0 1 0 2"/></svg>
                }
              </span>
            </div>

            {openTransactions && (
              <div className={style.accordionContent}>
                <Link className={style.link} onClick={closeAllAccordions} to="/account"><p>Account</p></Link>
                <Link className={style.link} onClick={closeAllAccordions} to="/subAccount"><p>Sub Account</p></Link>
                <Link className={style.link} onClick={closeAllAccordions} to="/booking"><p>Booking</p></Link>
                <Link className={style.link} onClick={closeAllAccordions} to="/paymentRequest"><p>Payment Request</p></Link>
                {/* <Link className={style.link} onClick={closeAllAccordions} to="/paymentRequestDetail"><p>Payment Request Detail</p></Link> */}
              </div>
            )}
          </div>
        </div>
      </aside>
    </main>
  );
}

export default Nav;
