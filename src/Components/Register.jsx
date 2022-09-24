/* eslint-disable */
import React, { Component } from "react";
import { Link, Navigate } from "react-router-dom";
import AuthService from "./Services/AuthService";

class Register extends Component {
  state = {
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    message: "",
    error_message: "",
    errors: "",
    loggedIn: false,
    loading: false,
  };

  handleInputChange(event) {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  }

  registerUser = (event) => {
    event.preventDefault();

    const data = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      password_confirmation: this.state.password_confirmation,
    };
    this.setState({ loading: true });

    AuthService.register(data)
      .then((response) => {
        window.location.reload(false);
        localStorage.setItem("token", response.data.data.access_token);
        this.setState({ message: response.data.message, loggedIn: true });
        this.props.setUserx(response.data.user);
        this.setState({ loading: false });
      })
      .catch((error) => {
        if (error.response) {
          this.setState({
            error_message: error.response.data.message,
            loading: false,
          });

          let error_lists = "";

          for (let key in error.response.data.errors) {
            error_lists += error.response.data.errors[key];
          }

          this.setState({
            errors: error_lists,
          });
        }
      });
  };

  goToGoogle = (event) => {
    event.preventDefault();
    AuthService.redirectToGoogle()
      .then((response) => {
        console.log("redirectToGoogle", response);
      })
      .catch((error) => {
        console.log("redirectToGoogle error", error.response);
      });
  };

  render() {
    const { message, error_message, errors, loggedIn, loading } = this.state;

    if (localStorage.getItem("token")) {
      return <Navigate to="/expense" />;
    }

    return (
      <div>
        <br />
        <div className="row">
          <div className="jumbotron col-lg-4 offset-lg-4">
            {message ? (
              <div
                className="alert alert-success alert-dismissible fade show"
                role="alert"
              >
                <strong>{message}</strong>.
                <button
                  type="button"
                  className="close"
                  data-dismiss="alert"
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
            ) : (
              ""
            )}

            {error_message ? (
              <div
                className="alert alert-danger alert-dismissible fade show"
                role="alert"
              >
                <strong>{error_message}</strong>.
                <button
                  type="button"
                  className="close"
                  data-dismiss="alert"
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
            ) : (
              ""
            )}

            {errors ? (
              <div
                className="alert alert-danger alert-dismissible fade show"
                role="alert"
              >
                <strong>{errors}</strong>.
                <button
                  type="button"
                  className="close"
                  data-dismiss="alert"
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
            ) : (
              ""
            )}
            <h3 className="text-center">Register here</h3>

            <form onSubmit={this.registerUser}>
              <div className="form-group">
                <label className="float-left">Name</label>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  defaultValue={this.state.name}
                  onChange={(event) => this.handleInputChange(event)}
                />
              </div>
              <div className="form-group">
                <label className="float-left">Email address</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  onChange={(event) => this.handleInputChange(event)}
                />
              </div>
              <div className="form-group">
                <label className="float-left">Password</label>
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  onChange={(event) => this.handleInputChange(event)}
                />
              </div>
              <div className="form-group">
                <label className="float-left">Password Confirmation</label>
                <input
                  type="password"
                  name="password_confirmation"
                  className="form-control"
                  onChange={(event) => this.handleInputChange(event)}
                />
              </div>
              <br />
              <button
                type="submit"
                className="btn btn-primary btn-block"
                disabled={loading}
              >
                {loading ? "Please wait..." : "Register"}
              </button>
              <br />
              Already have an account? <Link to="/">Login</Link>
              <br />
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default Register;
