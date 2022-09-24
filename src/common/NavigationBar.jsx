/* eslint-disable */
import React, { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function NavigationBar(props) {
  const [user, setUser] = useState();

  const logout = () => {
    localStorage.removeItem("token");
    this.props.setUser(null);
  };
  useEffect(() => {
    console.log("nav props", props.user);
    setUser(props.user);
  }, []);
  return (
    <div>
      <nav className="navbar navbar-expand-lg bg-light">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            Expense Manager
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarText"
            aria-controls="navbarText"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="navbarText">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <a className="nav-link active" aria-current="page" href="#"></a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#"></a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#"></a>
              </li>
            </ul>
            {user && user ? (
              <span className="navbar-text">
                <button className="btn btn-outline-success" type="submit">
                  <Link
                    className="nav-link"
                    to="/"
                    onClick={() => logout()}
                    style={{ color: "red" }}
                  >
                    Logout
                  </Link>
                </button>
              </span>
            ) : (
              <span className="navbar-text">
                <button className="btn btn-outline-success" type="submit">
                  <Link className="nav-link" to="/">
                    Login
                  </Link>
                </button>
                &nbsp;
                <button className="btn btn-outline-success" type="submit">
                  <Link className="nav-link" to="/register">
                    Register
                  </Link>
                </button>
              </span>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
}
