import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { ThemeProvider, createTheme } from "@mui/material/styles";

// const theme = createTheme({
//   palette: {
//     primary: {
//       main: '#5b9658',
//       dark: '#477344',
//       light: '#78b278',
//       contrastText: '#ffffff',
//     },
//     secondary: {
//       main: '#945896',
//       dark: '#773e7e',
//       light: '#c098c1',
//       contrastText: '#44403c4',
//     },
//     background: {
//       default: '#f1ece7',
//       paper: '#f6f6f6',
//     }
//   },
// });

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
