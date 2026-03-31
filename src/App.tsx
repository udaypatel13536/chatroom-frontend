
import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom'
import './App.css'
import { Login } from './pages/login'
import { Home } from './pages/home'
import { RecoilRoot } from 'recoil'
import { WSProvider } from './contextAPI/wsContex'
import type { ReactNode } from 'react'
import { AuthProvider, useAuth } from './contextAPI/Auth'

function App() {
 function AuthenticatedApp({ children }: { children: ReactNode }) {
  const { token, Loading }  = useAuth()
  if (Loading)  return <div>Loading...</div>
  if (!token)   return <Navigate to="/login" replace />

  return <WSProvider token={token}>{children}</WSProvider>
 }

  return (
  <>
  <BrowserRouter>
    <AuthProvider>
    <RecoilRoot>
    <Routes>
      <Route path='/login' element={<Login/>}/>
        <Route element ={<AuthenticatedApp> <Outlet/> </AuthenticatedApp>}>
          <Route path='/Home' element={<Home/>}/>
        </Route>
    </Routes>
    </RecoilRoot>
    </AuthProvider>
  </BrowserRouter>

  </>)
}

export default App
