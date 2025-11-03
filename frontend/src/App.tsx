import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegistrationPage from "./pages/RegistrationPage";
import MainPage from "./pages/MainPage";
import MainLayout from "./components/layout/MainLayout";
import RecipePage from "./pages/RecipePage";
import { AuthProvider } from "./context/AuthContext";
import RequireAuth from "./components/auth/RequireAuth";
import AddRecipePage from "./pages/AddRecipePage";
import ProfilePage from "./pages/ProfilePage";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const theme = createTheme();

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <AuthProvider>
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" element={<MainPage />} />
              <Route path="/recipe/:recipeId" element={<RecipePage />} />
              <Route path="/user/:userId" element={<ProfilePage />} />
              <Route element={<RequireAuth />}>
                <Route path={"/create"} element={<AddRecipePage />} />
              </Route>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegistrationPage />} />
            </Route>
          </Routes>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
