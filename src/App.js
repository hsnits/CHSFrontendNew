import React, { useEffect } from "react";
import "./App.css";
import Routes from "./routes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <div className="main-wrapper">
        <Routes /> 
      </div>
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        style={{ 
          zIndex: 9999,
          fontSize: '14px'
        }}
        toastStyle={{
          borderRadius: '8px',
          padding: '12px',
        }}
      />
    </>
  );
}

export default App;
