import './App.css'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import LoginPage from "./pages/LoginPage.tsx";
import RegistrationPage from "./pages/RegistrationPage.tsx";
import MainPage from "./pages/MainPage.tsx";
import MainLayout from "./components/layout/MainLayout.tsx";
import NavbarOnlyLayout from "./components/layout/NavbarOnlyLayout.tsx";

function App() {

  return (
    <Router>
        <Routes>
            <Route element={<MainLayout/>}>
                <Route path="/" element={<MainPage/>}/>
            </Route>
            <Route element={<NavbarOnlyLayout/>}>
                <Route path="/login" element={<LoginPage/>}/>
                <Route path="/register" element={<RegistrationPage/>}/>
            </Route>
        </Routes>
    </Router>
  )
}

export default App
