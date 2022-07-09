import React from 'react';
import Home from "./pages/Home"
import "./App.scss"
import DashBoard from "./pages/DashBoard"
import { BrowserRouter, Routes, Route} from "react-router-dom";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/' element={< Home />}></Route>
          <Route path='/DashBoard' element={< DashBoard />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
