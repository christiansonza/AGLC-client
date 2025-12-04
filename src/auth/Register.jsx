import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import toast, { Toaster } from 'react-hot-toast'
import { useRegisterUserMutation } from '../features/userSlice'
import authStyle from '../auth/auth.module.css'
import logo from '../assets/acestar.jpg'

export default function Login() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    firstName: '',
    middleName: '',
    lastName: '',
    role: ''
  })

  const [newUser, { isLoading }] = useRegisterUserMutation()

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await newUser(formData).unwrap()
      toast.success(response.message || 'Registered successfully!')
      navigate('/login')
    } catch (error) {
      const message =
        error?.data?.message || 
        error?.error ||          
        'Registration failed!'
      toast.error(message)
    }
  }

  return (
    <main className={authStyle.mainRegister}>
      <Toaster position="top-right" reverseOrder={false} />

      <form onSubmit={handleSubmit} className={authStyle.formRegister}>
        <div className={authStyle.logHeader}>
          <img className={authStyle.img} src={logo} alt="" />
          <h3 className={authStyle.title}>Welcome Back</h3>
          <p className={authStyle.subtitle}>Please enter your details below</p>
        </div>
        <div className={authStyle.flexInput}>
            <input className={authStyle.fieldRegister}
            type="text"
            value={formData.username}
            onChange={e => setFormData({ ...formData, username: e.target.value })}
            placeholder="username"
            required
          />
          <input className={authStyle.fieldRegister}
            type="email"
            value={formData.email}
            onChange={e => setFormData({ ...formData, email: e.target.value })}
            placeholder="email"
            required
          />
        </div>
        <input className={authStyle.fieldRegister}
          type="text"
          value={formData.firstName}
          onChange={e => setFormData({ ...formData, firstName: e.target.value })}
          placeholder="firstname"
          required
        />
        <input className={authStyle.fieldRegister}
          type="text"
          value={formData.middleName}
          onChange={e => setFormData({ ...formData, middleName: e.target.value })}
          placeholder="middlename"
        />
        <input className={authStyle.fieldRegister}
          type="text"
          value={formData.lastName}
          onChange={e => setFormData({ ...formData, lastName: e.target.value })}
          placeholder="lastname"
        />
        <input className={authStyle.fieldRegister}
          type="password"
          value={formData.password}
          onChange={e => setFormData({ ...formData, password: e.target.value })}
          placeholder="password"
          required
        />
        <select
          className={authStyle.selectRole}
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
        <button className={authStyle.btnLogin} type="submit" disabled={isLoading}>
          {isLoading ? 'Registering...' : 'Register'}
        </button>
        <p className={authStyle.linkRegister}>Already have an acconut? <Link className={authStyle.link} to='/login'>Login</Link></p>
      </form>
    </main>
  )
}
