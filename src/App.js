import React from 'react'; 
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; 
import Logintable from './LoginTable'; 
import ProductTable from './ProductTable'; 
import DatakartTrace from './DatakartTrace'; 

function App() { 
  return ( 
    <Router> 
      <Routes> 
        <Route path="/LoginTable" element={<Logintable />} /> 
        <Route path="/ProductTable" element={<ProductTable />} /> 
        <Route path="/DatakartTrace" element={<DatakartTrace />} /> 
      </Routes> 
    </Router> 
  ); 
} 
 
export default App;