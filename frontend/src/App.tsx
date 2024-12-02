import './App.css'
import LoginPage from "./pages/LoginPage.tsx";
import RegistrationPage from "./pages/RegistrationPage.tsx";
import NavBar from "./components/layout/NavBar.tsx";
import Sidebar from "./components/layout/Sidebar.tsx";

function App() {

  return (
    <>
        <NavBar></NavBar>
        <Sidebar/>
        <LoginPage></LoginPage>
        <RegistrationPage></RegistrationPage>
    </>
  )
}

export default App
