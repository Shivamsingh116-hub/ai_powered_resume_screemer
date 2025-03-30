import React, { useContext, useEffect } from 'react'
import Navbar from './components/Navbar'
import { Route, Routes } from 'react-router-dom'
import Home from './components/Home'
import JobDescription from './components/JobDescription'
import Results from './components/Results'
import Dashboard from './components/Dashboard'
import SignIn from './components/Signin'
import SignUp from './components/Signup'
import AdminRoute from './protectedRoute/AdminRoute'
import { Context } from './common/Context'


const App = () => {
  const { fetchData } = useContext(Context)
  useEffect(() => {
    fetchData()
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
        <Route path='/signin' element={<SignIn />} />
        <Route path='/signup' element={<SignUp />} />

      </Routes>
    </div>
  )
}

export default App