import { ToastContainer } from "react-toastify";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <>
      <AppRoutes />
      <ToastContainer position="top-right" autoClose={2500} />
    </>
  );
}

export default App;
