import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProductTables.css';

const ProductTable = () => {
  const [products, setProducts] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch products from the server when the component mounts
    var MFG_ID = localStorage.getItem('id');
    console.log(MFG_ID);
    fetch(`http://localhost:3000/getAllProductsbyManufacturerID/${MFG_ID}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`, // Include the JWT token for authentication
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.products) {
          setProducts(data.products);
          setFilteredProducts(data.products); // Initially, display all products
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }, []); // The empty dependency array ensures that this effect runs once when the component mounts

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);

    const filtered = products.filter((product) =>
      product.P_ID.toString().includes(value)
    );
    setFilteredProducts(filtered);
  };

  const handleProductClick = (product) => {
    sessionStorage.setItem('selectedProduct', JSON.stringify(product));
    navigate('/DatakartTrace'); // Navigate to the DatakartTrace page
  };

  const handleSignOutClick = () => {
    localStorage.removeItem('id');
    localStorage.removeItem('token');
    sessionStorage.clear();
    navigate('/LoginTable');
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
          alt="gs1"
          width="170"
          height="70"
        />
        <div className="search-and-signout-container">
        <button className="signout-button" onClick={handleSignOutClick}>
  Sign Out
</button>
          <form id="searchForm" className="form-inline">
            <input
              id="searchInput"
              className="form-control mr-sm-2"
              type="search"
              placeholder="Search by Product ID"
              aria-label="Search"
              value={searchValue}
              onChange={handleSearchChange}
            />
            <button
              className="btn btn-outline-success my-2 my-sm-0"
              type="submit"
            >
              Search
            </button>
          </form>  
        </div>
        <h2>&nbsp;&nbsp;&nbsp;&nbsp;Product List</h2>
        <table className="table table-striped mt-3">
          <thead className="bg-info">
            <tr className='tr'>
              <th className="bg-warning">PRODUCTID</th>
              <th className="bg-warning">PRODUCTNAME</th>
              <th className="bg-warning">QUANTITY</th>
              <th className="bg-warning">MRP</th>
            </tr>
          </thead>
          <tbody id="myTable">
            {filteredProducts.map((product) => (
              <tr key={product.P_ID}>
                <td>{product.P_ID}</td>
                <td>
                  <a
                    href="javascript:void(0);"
                    onClick={() => handleProductClick(product)}
                  >
                    {product.P_NAME}
                  </a>
                </td>
                <td>{product.QUANTITY}</td>
                <td>{product.MRP}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductTable;
