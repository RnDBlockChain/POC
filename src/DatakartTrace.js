import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './DatakartTraceStyles.css';

function DatakartTrace() {
  const [fetchedProduct, setFetchedProduct] = useState(null);
  const navigate = useNavigate(); // Get the navigate function from React Router DOM

  useEffect(() => {
    var storedValue = sessionStorage.getItem('selectedProduct');
    var parsedValue = JSON.parse(storedValue);

    if (!parsedValue) {
      console.error('Error: fetchedProduct is null or undefined');
      return;
    }

    console.log('Parsed Value:', parsedValue); // Add this line for debugging

    setFetchedProduct(parsedValue); // Value for fetched product
  }, []);

  const handleSignOutClick = () => {
    localStorage.removeItem('id');
    localStorage.removeItem('token');
    sessionStorage.clear();
    navigate('/LoginTable'); // Navigate to the sign-in page when signing out
  };

  return (
    <div className="parent">
      <div className="top-right-image">
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSi56r_HhwlL3PWI-SMAkw37E35euqtkSdi-g&usqp=CAU"
          alt="Datakart Trace"
          width="170"
          height="70"
        />
      </div>
      <div className="parent">
        <img
          src="https://www.gs1india.org/wp-content/uploads/2022/06/logo-600x402-1-600x402.png"
          alt="Datakart Trace"
          width="170"
          height="70"
        />
        <div className="parent">
          <h2 style={{width:'1000px',}}>&nbsp; &nbsp; &nbsp;DataKart</h2>
      
          
          <div>
            <h3>
              &nbsp; &nbsp; &nbsp;Product Name: {fetchedProduct ? fetchedProduct.P_NAME : ''} &emsp;
              Quantity: {fetchedProduct ? fetchedProduct.QUANTITY : ''} &emsp;
              MRP: {fetchedProduct ? fetchedProduct.MRP : ''}
            </h3>
            <table className="table1"  style={{ width: '1350px', height:'120px' }}>
              <tbody style={{ fontSize: '25px' }}>
                <tr>
                  <td className="manufacture-cell">Manufacture</td>
                  <td className="retailer-cell">Retailer</td>
                  <td className="distributor-cell">Distributor</td>
                  <td className="consumer-cell">Consumers</td>
                </tr>

                <tr>
                  <td className="manufacturer-cells">
                    {fetchedProduct ? fetchedProduct.Manufacturer : ''}
                  </td>
                  <td className="retailer-cells">
                    {fetchedProduct ? fetchedProduct.Retailer : ''}
                  </td>
                  <td className="distributor-cells">
                    {fetchedProduct ? fetchedProduct.Distributor : ''}
                  </td>
                  <td className="consumer-cells">
                    {fetchedProduct ? fetchedProduct.Consumers : ''}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <button className="btn btn-danger" onClick={handleSignOutClick}>
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}

export default DatakartTrace;
