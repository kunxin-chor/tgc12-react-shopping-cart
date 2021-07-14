import { BrowserRouter as Router, Link, Switch, Route } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css"
import React, { useEffect, useState } from 'react';
import axios from 'axios'

import config from './config'

import LoginPage from './pages/LoginPage';
import UserProfile from './pages/UserProfile';

import ProductContext from './ProductContext';
import ProductListing from './pages/ProductListing';
import UserContext from './UserContext';

function App() {

  const [products, setProducts] = useState([]);
  const [user, setUser] = useState([]);

  useEffect(() => {
    async function fetch() {
      const response = await axios.get(config.API_URL + "/products");
      setProducts(response.data);
    }
    fetch();
  }, [])

  useEffect(() => {
    setInterval(async () => {
      let refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        const response = await axios.post(config.API_URL + '/users/refresh', {
          'refreshToken': refreshToken
        })
        localStorage.setItem('accessToken', response.data.accessToken)
      }
    }, config.REFRESH_INTERVAL)
  }, []);

  const productContext = {
    getProducts: () => {
      return products;
    },
    refreshProducts: async () => {
      const response = await axios.get(config.API_URL + "/products");
      setProducts(response.data);
    },
    addProduct: async (product_name, cost, description, category_id, tags) => {
      const response = await axios.post(config.API_URL + "/products", {
        product_name, cost, description, category_id, tags
      })

      let cloned = [...products, {
        'id': response.data.id,
        'product_name': product_name,
        'cost': cost,
        'description': description,
        'category_id': category_id,
        'tags': tags
      }];

      setProducts(cloned);
    }
  }

  const userContext = {
    getUser: () => { return user },
    setUser: (user) => { setUser(user) }
  }

  return (
    <React.Fragment>
      <div className="container">
        <Router>
          <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">
              <a className="navbar-brand" href="#">Navbar</a>
              <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
              </button>
              <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                  <li className="nav-item">
                    <a className="nav-link active" aria-current="page" href="#">Home</a>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/login">Login</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/profile">Profile</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/products">Products</Link>
                  </li>

                </ul>
              </div>
            </div>
          </nav>
          <ProductContext.Provider value={productContext}>
            <UserContext.Provider value={userContext}>
              <Switch>
                <Route exact path="/">
                  <h1>Home</h1>
                </Route>
                <Route exact path="/login">
                  <LoginPage />
                </Route>
                <Route exact path="/profile">
                  <UserProfile />
                </Route>
                <Route exact path="/products">
                  <ProductListing />
                </Route>
              </Switch>
            </UserContext.Provider>
          </ProductContext.Provider>
        </Router>
      </div>
    </React.Fragment>
  );
}

export default App;
