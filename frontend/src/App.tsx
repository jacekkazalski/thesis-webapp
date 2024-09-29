import './App.css'
import LoginPage from "./pages/LoginPage.tsx";
import RegistrationPage from "./pages/RegistrationPage.tsx";
import NavBar from "./components/layout/NavBar.tsx";

function App() {

  return (
    <>
        <NavBar></NavBar>
        <LoginPage></LoginPage>
        <RegistrationPage></RegistrationPage>
    </>
  )
}

export default App
