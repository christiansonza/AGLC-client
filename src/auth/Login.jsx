import React, { useState } from 'react'
import { useNavigate, Link} from 'react-router-dom'
import toast, { Toaster } from 'react-hot-toast'
import { useLoginUserMutation } from '../features/userSlice'
// import styleLoader from '../auth/loading.module.css'
import authStyle from '../auth/auth.module.css'
import logo from '../assets/acestar.jpg'

export default function Login() {
  const navigate = useNavigate()
  const [showLoader, setShowLoader] = useState(false)

  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })

  const [logUser, { isLoading }] = useLoginUserMutation()

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
       await logUser(formData).unwrap()
      setShowLoader(true)
      navigate('/user')
    } catch (error) {
      const message =
        error?.data?.message ||
        error?.error ||
        'Login failed!'
      toast.error(message)
    }
  }

  if (showLoader) {
    return (
          <div></div>
    )
  }

  return (
    <main className={authStyle.mainLogin}>
      <Toaster position="top-right" reverseOrder={false} />

      <form onSubmit={handleSubmit} className={authStyle.formLogin}>
         <div className={authStyle.logHeader}>
          <img className={authStyle.img} src={logo} alt="" />
          <h3 className={authStyle.title}>Welcome Back</h3>
          <p className={authStyle.subtitle}>Please enter your details below</p>
        </div>
        <input className={authStyle.fieldLogin}
          type="text"
          value={formData.username}
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          placeholder="username"
          required
        />
        <input className={authStyle.fieldLogin}
          type="password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          placeholder="password"
          required
        />
        <button className={authStyle.btnLogin} type="submit" disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
        <p className={authStyle.linkLogin}>Don't have an acconut? <Link className={authStyle.link} to='/register'>Register</Link></p>
      </form>
    </main>
  )
}
