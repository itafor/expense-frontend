/* eslint-disable */
import React, { Component } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import NavBar from "./NavBar";
import AuthService from "../Components/Services/AuthService";
import Login from "../Components/Login";
import Register from "../Components/Register";
import Profile from "../Components/Profile";
import Expense from "../Components/Expense";
import AddExpense from "../Components/AddExpense";
import EditExpense from "../Components/EditExpense";

class Header extends Component {
  state = {
    user: {},
  };

  componentDidMount() {
    this.getUser();
  }

  getUser() {
    const token = localStorage.getItem("token");
    if (token) {
      AuthService.authUser().then((response) => {
        this.setUser(response.data.data);
      });
    }
  }

  setUser(user) {
    this.setState({ user: user });
  }

  render() {
    return (
      <React.Fragment>
        <Router>
          <NavBar user={this.state.user} setUser={this.setUser} />

          <Routes>
            <Route exact path="/" element={<Login />} />
            <Route exact path="/register" element={<Register />} />
            <Route exact path="/expense" element={<Expense />} />
            <Route exact path="/add-expense" element={<AddExpense />} />
            <Route exact path="/edit-expense/:id" element={<EditExpense />} />

            <Route
              exact
              path="/profile"
              element={<Profile user={this.state.user} />}
            />
          </Routes>
        </Router>
      </React.Fragment>
    );
  }
}

export default Header;
