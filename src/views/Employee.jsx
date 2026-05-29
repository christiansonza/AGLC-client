import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { useCreateEmployeeMutation, useFetchEmployeeQuery } from '../features/employeeSlice';
import { useNavigate, Link } from 'react-router-dom';
import style from '../views/css/page.module.css';


function Employee() {
  const navigate = useNavigate();
  const { data, isError, error } = useFetchEmployeeQuery();
  const employees = data ?? [];

  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    contactNumber: '',
    userId: '',
    isActive: true,
  });

  const [addEmployee] = useCreateEmployeeMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await addEmployee(formData).unwrap();
      toast.success(response.message || 'Created Successfully.');
      setFormData({
        firstName: '',
        middleName: '',
        lastName: '',
        contactNumber: '',
        userId: '',
        isActive: false,
      });
      navigate(`/editEmployee/${response.data.id}`);
    } catch (error) {
      console.log(error);
      toast.error(error?.data?.message || 'Something went wrong');
    }
  };

  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  const filteredEmployees = employees.filter((emp) =>
    emp.firstName.toLowerCase().includes(search.toLowerCase()) ||
    emp.middleName.toLowerCase().includes(search.toLowerCase()) ||
    emp.lastName.toLowerCase().includes(search.toLowerCase()) ||
    emp.contactNumber.toLowerCase().includes(search.toLowerCase()) ||
    emp.userId?.toString().includes(search)
  );
  const [showModal, setShowModal] = useState(false);

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEmployees = filteredEmployees.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);
  const handleNext = () => currentPage < totalPages && setCurrentPage((prev) => prev + 1);
  const handlePrevious = () => currentPage > 1 && setCurrentPage((prev) => prev - 1);

 

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
        {/* Header  */}
        <div className={style.pageHeaderContainer}>
          <div className={style.flexTitleHeader}>
            <div className={style.flexheaderTitle}>
              <svg svg className={style.svgManageVendors} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M16 17v2H2v-2s0-4 7-4s7 4 7 4m-3.5-9.5A3.5 3.5 0 1 0 9 11a3.5 3.5 0 0 0 3.5-3.5m3.44 5.5A5.32 5.32 0 0 1 18 17v2h4v-2s0-3.63-6.06-4M15 4a3.4 3.4 0 0 0-1.93.59a5 5 0 0 1 0 5.82A3.4 3.4 0 0 0 15 11a3.5 3.5 0 0 0 0-7" />
              </svg>
              <h3 className={style.headerLaber}>Employee</h3>
              </div>
              <p className={style.headerSubtitle}>View and manage employees.</p>
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
                <button
                  className={style.addBtn}
                  onClick={() => setShowModal(true)}
                  title='Add Employee'
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M11 13H6q-.425 0-.712-.288T5 12t.288-.712T6 11h5V6q0-.425.288-.712T12 5t.713.288T13 6v5h5q.425 0 .713.288T19 12t-.288.713T18 13h-5v5q0 .425-.288.713T12 19t-.712-.288T11 18z"/></svg>
                </button>
          </div>
        </div>

      {/* Modal */}
      {showModal && ( <div className={style.modalOverlay}> 
        <div className={style.modal}> 
          <div className={style.modalHeader}> 
            <h3>Add Employee</h3>
      <button
          className={style.closeButton}
          onClick={() => setShowModal(false)}
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
            <label className={style.modalLabel}>Firstname: </label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              required
            />
            <label className={style.modalLabel}>Middlename: </label>
            <input
              type="text"
              value={formData.middleName}
              onChange={(e) => setFormData({ ...formData, middleName: e.target.value })}
            />
            <label className={style.modalLabel}>Lastname: </label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            />
            <label className={style.modalLabel}>Contact #: </label>
            <input
              type="text"
              value={formData.contactNumber}
              onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
            />
            <label className={style.modalLabel}>User ID: </label>
            <input
              type="number"
              value={formData.userId}
              onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
            />
            <div className={style.activeWrap}>
                  <div className={style.toggleRow}>
                    <span className={style.labelText}>Active: &nbsp;</span>
                    <label className={style.switch}>
                      <input
                        type="checkbox"
                        checked={formData.isActive}
                        onChange={(e) =>
                          setFormData({ ...formData, isActive: e.target.checked })
                        }
                      />
                      <span className={style.slider}></span>
                    </label>
                  </div>
            </div>

            <div className={style.modalActions}>
              <button
                type="button"
                className={style.cancelButton}
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button type="submit" className={style.submitButton}>Submit</button>
            </div>
          </form>
        </div>
      </div>
    )}
      {/* Employee Table */}
        <table>
          <thead>
            <tr className={style.headTable}>
              <th>Firstname</th>
              <th>Middlename</th>
              <th>Lastname</th>
              <th>Contact #</th>
              <th>User ID</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {currentEmployees.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center' }}>
                  No employees found
                </td>
              </tr>
            ) : (
              currentEmployees.map((emp) => (
                <tr className={style.bodyTable} key={emp.id}>
                  <td>{emp.firstName}</td>
                  <td>{emp.middleName}</td>
                  <td>{emp.lastName}</td>
                  <td>{emp.contactNumber}</td>
                  <td>{emp.userId}</td>
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
                      onClick={() => navigate(`/editEmployee/${emp.id}`)}
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
        {totalPages > 1 && (
          <div className={style.paginationContainer}>
            <button
              className={style.pageButton}
              onClick={handlePrevious}
              disabled={currentPage === 1}
            >
              Prev
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                className={`${style.pageButton} ${
                  currentPage === i + 1 ? style.activePage : ''
                }`}
                onClick={() => handlePageChange(i + 1)}
              >
                {i + 1}
              </button>
            ))}

            <button
              className={style.pageButton}
              onClick={handleNext}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

export default Employee;
