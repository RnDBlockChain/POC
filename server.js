const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const path = require('path');

// Database configuration
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'root@123',
  database: 'products', // Your database name
};

// Create a MySQL pool to manage database connections
const pool = mysql.createPool(dbConfig);

// Middleware for handling JSON requests
app.use(express.json());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Secret key for JWT token generation
const secretKey =
  '8e40e110354d3e3f0d309c9612aab604bed6f15e959301e6a63e6278328bdd90ba16b28f35e67ebf64984cc5e73804589f5ae6faf147744e5a71b4de52fb90ec';

// API route for user login and JWT token generation
app.post('/login', (req, res) => {
  const { username, password, userRole } = req.body;

  // Fetch user credentials from the database based on the provided username and userRole
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to the database:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    // Execute a SQL query to fetch user credentials
    connection.query(
      'SELECT username, userRole, password, MFG_ID FROM login_credentials WHERE username = ? AND userRole = ?',
      [username, userRole],
      (error, results) => {
        connection.release(); // Release the connection back to the pool

        if (error) {
          console.error('Error executing SQL query:', error);
          return res.status(500).json({ error: 'Internal Server Error' });
        }

        // Check if user credentials match
        if (results.length === 1 && password === results[0].password) {
          const token = jwt.sign({ username, userRole }, secretKey, {
            expiresIn: '1h',
          });
          // Send the token as a response
          res.json({ sessiontoken:token, id:results[0].MFG_ID });
        } else {
          res.status(401).json({ error: 'Invalid username or password' });
        }
      }
    );
  });
});

// API route for fetching all products
app.get('/getAllProducts', verifyToken, (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to the database:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    const query = 'SELECT * FROM product_details';

    connection.query(query, (error, results) => {
      connection.release(); // Release the connection back to the pool

      if (error) {
        console.error('Error executing SQL query:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      // Send the fetched products as a response
      res.json({ products: results });
    });
  });
});
app.get('/getAllProductsbyManufacturerID/:MFG_ID', verifyToken, (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to the database:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    const MFG_ID = req.params.MFG_ID;
    
   connection.query('SELECT * FROM product_details WHERE MFG_ID= ?',
   [MFG_ID],
    (error, results) => {
      connection.release(); // Release the connection back to the pool

      if (error) {
        console.error('Error executing SQL query:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      // Send the fetched products as a response
      res.json({ products: results });
    });
  });
});


// API route for fetching product details by ID
app.get('/getProductById/:productId', verifyToken, (req, res) => {
  const productId = req.params.productId;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to the database:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    const query = 'SELECT * FROM product_details WHERE P_ID = ?';

    connection.query(query, [productId], (error, results) => {
      connection.release();

      if (error) {
        console.error('Error executing SQL query:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      if (results.length === 1) {
        res.json({ product: results[0] });
      } else {
        res.status(404).json({ error: 'Product not found' });
      }
    });
  });
});

// Middleware to verify JWT token for protected routes
function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    console.error('Authorization header not found in the request:', req.headers);
    return res.status(403).json({ error: 'Token not provided' });
  }

  const token = authHeader.split(' ')[1]; // Extract the token from the Authorization header

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      console.error('Error verifying token:', err);
      return res.status(401).json({ error: 'Failed to authenticate token' });
    }

    req.decoded = decoded;
    next();
  });
}

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
