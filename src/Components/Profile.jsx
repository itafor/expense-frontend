/* eslint-disable */
import React, { Component } from "react";
import { Link, Navigate } from "react-router-dom";
import Users from "./Users";

class Profile extends Component {
  render() {
    const { first_name, last_name, email } = this.props.user;

    if (!localStorage.getItem("token")) {
      return <Navigate to="/login" />;
    }
    return (
      <div>
        <span>
          <Link className="nav-link" to="/chat">
            Welcome {first_name} {last_name}
          </Link>
        </span>

        <Users />
      </div>
    );
  }
}

export default Profile;
