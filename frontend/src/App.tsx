import './App.css'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import LoginPage from "./pages/LoginPage.tsx";
import RegistrationPage from "./pages/RegistrationPage.tsx";
import MainPage from "./pages/MainPage.tsx";
import MainLayout from "./components/layout/MainLayout.tsx";
import NavbarOnlyLayout from "./components/layout/NavbarOnlyLayout.tsx";
import RecipePage from "./pages/RecipePage.tsx";
import {AuthProvider} from "./context/AuthContext.tsx";
import RequireAuth from "./components/auth/RequireAuth.tsx";

function App() {

  return (
      <Router>
          <AuthProvider>
              <Routes>
                  <Route element={<MainLayout/>}>
                      <Route path="/" element={<MainPage/>}/>
                      <Route path="/recipe" element={<RecipePage/>}/>

                      <Route element={<RequireAuth/>}>
                          <Route path={"/create"} element={<div>ADDRECIPE</div>}/>
                      </Route>
                  </Route>
                  <Route element={<NavbarOnlyLayout/>}>
                      <Route path="/login" element={<LoginPage/>}/>
                      <Route path="/register" element={<RegistrationPage/>}/>
                  </Route>
              </Routes>
          </AuthProvider>
      </Router>

  )
}

export default App
