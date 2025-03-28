import './App.css'
import AttractiveDataDisplay from './components/AttractiveDataDisplay '
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <>
      <Router>
        <ToastContainer />
        <Routes>
          <Route path='/' element={<AttractiveDataDisplay />}></Route>
        </Routes>
      </Router>
      
    </>
  )
}

export default App;
