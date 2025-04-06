import React, { useContext, useEffect } from 'react'
import Navbar from './components/Navbar.jsx'
import { Route, Routes } from 'react-router-dom'
import Home from './components/Home.jsx'
import JobDescription from './components/JobDescription.jsx'
import Results from './components/Results.jsx'
import Dashboard from './components/Dashboard.jsx'
import AdminRoute from './protectedRoute/AdminRoute.jsx'
import { Context } from './common/Context.jsx'
import Signin from './components/Signin.jsx'
import Signup from './components/Signup.jsx'
import Loading from './common/Loading.jsx'
const pythonUrl = import.meta.env.VITE_PYTHON_API_URL
const App = () => {
  const { fetchData, fetchResume, loading } = useContext(Context)
  useEffect(() => {
    fetch(`${pythonUrl}/wakeup`)
      .then((res) => console.log("Backend wake-up signal sent!"))
      .catch((err) => console.error("Backend wake-up failed", err));
  }, []);
  useEffect(() => {
    fetchData()
    fetchResume()
  }, [])
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/jobdescription' element={<JobDescription />} />
        <Route path='/results' element={<Results />} />
        <Route element={<AdminRoute />}>
          <Route path='/dashboard' element={<Dashboard />} />
        </Route>
        <Route path='/signin' element={<Signin />} />
        <Route path='/signup' element={<Signup />} />
      </Routes>
      {loading && <Loading />}
    </div>
  )
}

export default App