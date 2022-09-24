/* eslint-disable */
import React, { Component } from "react";
import { Link } from "react-router-dom";

class NavBar extends Component {
  constructor(props) {
    super(props);
    this.logout = this.logout.bind(this);
    this.state = {
      access_token: "",
    };
  }
  logout = () => {
    localStorage.removeItem("token");
    this.props.setUser(null);
  };

  componentDidMount() {
    if (this.props) {
      this.setState({ access_token: localStorage.getItem("token") });
    }
  }

  render() {
    let button;
    let profile;
    if (this.state.access_token) {
      button = (
        <div>
          <Link
            className="nav-link"
            to="/"
            onClick={this.logout}
            style={{ color: "red" }}
          >
            LOGOUT
          </Link>
        </div>
      );
    } else {
      button = (
        <div className="">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item active">
              <Link className="nav-link" to="/">
                Login
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/register">
                Register
              </Link>
            </li>
          </ul>
        </div>
      );
    }
    return (
      <React.Fragment>
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
          <span className="navbar-brand float-start">Expense Manager</span>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarText"
            aria-controls="navbarText"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="navbarText">
            <ul className="navbar-nav mr-auto">
              <li className="nav-item active"></li>

              <li className="nav-item">{profile}</li>
            </ul>
            <span className="navbar-text float-end">{button}</span>
          </div>
        </nav>
      </React.Fragment>
    );
  }
}

export default NavBar;
