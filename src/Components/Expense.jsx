/* eslint-disable */
import React, { Component } from "react";
import { Navigate, Link } from "react-router-dom";
import AuthService from "./Services/AuthService";
//Bootstrap and jQuery libraries
import "bootstrap/dist/css/bootstrap.min.css";
import "jquery/dist/jquery.min.js";
//Datatable Modules
import "datatables.net-dt/js/dataTables.dataTables";
import "datatables.net-dt/css/jquery.dataTables.min.css";
import $, { event } from "jquery";
import Moment from "moment";
import AddExpense from "./AddExpense";
import EditExpense from "./EditExpense";

class Expense extends Component {
  constructor(props) {
    super(props);
    this.getExpenses = this.getExpenses.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.importExcelFile = this.importExcelFile.bind(this);
    this.onChangeImportField = this.onChangeImportField.bind(this);

    this.state = {
      from: "",
      to: "",
      min_amount: "",
      max_amount: "",
      merchant: "",
      new: "",
      status: ["New", "Reimburse", "In Progress"],
      loading: false,
      loadingimport: false,
      errorMessages: "",
      successReg: "",
      getAllExpenses: "",
      expensesFile: "",
      show: false,
      showEditExpense: false,
      expenseId: "",
      retrievedExpenses: [],
      user: "",
    };
  }

  componentDidMount() {
    this.getExpenses();
    this.getUser();
  }

  getUser() {
    AuthService.authUser().then((response) => {
      this.setState({ user: response.data.data });
    });
  }

  componentDidUpdate(prevProps, prevState) {
    let refresh =
      prevState.from !== this.state.from ||
      prevState.to !== this.state.to ||
      prevState.min_amount !== this.state.min_amount ||
      prevState.max_amount !== this.state.max_amount ||
      prevState.new !== this.state.new ||
      prevState.merchant !== this.state.merchant ||
      prevState.status.length !== this.state.status.length ||
      prevState.status.toString() !== this.state.status.toString();

    if (refresh) {
      this.getExpenses();
      console.log("statussss");
    }
  }

  handleInputChange = (e) => {
    // e.preventDefault();
    // this.getExpenses();

    switch (e.target.name) {
      case "from":
        this.setState({
          ...this.state,
          from: e.target.value,
        });

        break;
      case "to":
        this.setState({
          ...this.state,

          to: e.target.value,
        });
        break;
      case "min_amount":
        this.setState({
          ...this.state,

          min_amount: e.target.value,
        });
        break;

      case "max_amount":
        this.setState({
          ...this.state,

          max_amount: e.target.value,
        });
        break;

      case "merchant":
        this.setState({
          ...this.state,

          merchant: e.target.value,
        });
        break;

      case "new":
        let statuses = this.state.status;
        let index = statuses.indexOf("New");
        if (index > -1) {
          statuses.splice(index, 1);
        } else {
          statuses.push("New");
        }

        this.setState({
          ...this.state,

          status: statuses,
        });
        // console.log("statuses 1", this.state.status);
        break;

      case "reimburse":
        let statuses2 = this.state.status;
        let reimbursedIndex = statuses2.indexOf("Reimburse");
        if (reimbursedIndex > -1) {
          statuses2.splice(reimbursedIndex, 1);
        } else {
          statuses2.push("Reimburse");
        }
        this.setState({
          ...this.state,
          status: statuses2,
        });

        // console.log("statuses 2", this.state.status);
        break;

      case "inprogress":
        let statuses3 = this.state.status;
        let inprogressIndex = statuses3.indexOf("In Progress");
        if (inprogressIndex > -1) {
          statuses3.splice(inprogressIndex, 1);
        } else {
          statuses3.push("In Progress");
        }

        this.setState({
          ...this.state,

          status: statuses3,
        });
        // console.log("statuses 3", this.state.status);
        break;
      default:
        break;
    }
    // console.log(this.state);
  };

  onChangeImportField = (e) => {
    this.setState({
      expensesFile: e.target.files[0],
    });
  };

  clearForm = () => {
    document.getElementById("expenseform").reset();
  };

  getExpenses = () => {
    const newData = {
      from: this.state.from,
      to: this.state.to,
      min_amount: this.state.min_amount,
      max_amount: this.state.max_amount,
      merchant: this.state.merchant,
      status: this.state.status,
    };
    AuthService.getExpenses(newData)
      .then((response) => {
        this.setState({
          ...this.state,
          getAllExpenses: response.data ? response.data.data : [],
          loading: true,
        });
        // console.log("exp", response.data.data);
        $(document).ready(function () {
          $("#datatable").DataTable();
        });
      })
      .catch((error) => {});
  };

  handleCallback = (childData) => {
    this.setState({ getAllExpenses: childData });
    this.getExpenses(this.state);
  };

  importExcelFile(e) {
    e.preventDefault();

    var formdata = new FormData();
    formdata.append("expenses", this.state ? this.state.expensesFile : "");

    this.setState({ loadingimport: true });
    AuthService.importExpense(formdata)
      .then((response) => {
        if (response.data.message) {
          this.getExpenses(this.state);
        }

        this.setState({
          successReg: response.data.message,
          loadingimport: false,
          errorMessages: "",
          submitted: true,
        });
        document.getElementById("importexpense-form").reset();
      })
      .catch((error) => {
        this.setState({ loadingimport: false, successReg: "" });
        if (error.response && error.response.data.message) {
          this.setState({
            errorMessages: error.response.data.message,
            successReg: "",
          });
        }
        if (error.response && error.responsedata.errors) {
          let errors = error.response.data.errors;
          let errorlist = "";
          for (let [key, value] of Object.entries(errors)) {
            errorlist += value + ", ";
          }
          this.setState({
            errorMessages: errorlist,
            successReg: "",
          });
        }
      });
  }

  render() {
    const {
      from,
      to,
      min_amount,
      max_amount,
      merchant,
      loading,
      loadingimport,
      status,
      getAllExpenses,
      errorMessages,
      successReg,
      user,
    } = this.state;

    const list_expenses =
      getAllExpenses &&
      getAllExpenses.map((expense, key) => {
        return (
          <tr key={key}>
            <td>{Moment(expense.date).format("DD/MM/YYYY")}</td>
            <td>{expense.merchant}</td>
            <td>{expense.total_amount}</td>
            <td
              style={
                expense.status == "New"
                  ? { color: "red" }
                  : expense.status == "In Progress"
                  ? { color: "blue" }
                  : { color: "gray" }
              }
            >
              {expense.status}
            </td>
            <td>{expense.comment}</td>
            <td>
              <button
                className="btn btn-sm"
                onClick={() => {
                  this.setState({
                    ...this.state,
                    showEditExpense: true,
                    expenseId: expense.id,
                  });
                }}
              >
                Edit
              </button>
            </td>
          </tr>
        );
      });

    return (
      <div className="poition-relative  w-100">
        <div className="row">
          <div className="col-md-3">
            <div className="card">
              <div className="card-header">
                <span className="float-start"> Filter expenses</span>
                <span
                  onClick={() => this.clearForm()}
                  className="float-end"
                  style={{ color: "blue", cursor: "pointer" }}
                >
                  Clear filter
                </span>
              </div>
              <div className="card-body">
                <form id="expenseform" autoComplete="off">
                  <div className="mb-3">
                    <label className="form-label text-uppercase">
                      From: {this.state.from}
                    </label>
                    <input
                      onChange={this.handleInputChange}
                      className="form-control"
                      type="date"
                      name="from"
                      value={this.state.from}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label text-uppercase">
                      To : {this.state.to}
                    </label>
                    <input
                      onChange={this.handleInputChange}
                      className="form-control"
                      type="date"
                      name="to"
                      value={this.state.to}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label text-uppercase">
                      Min: {this.state.min_amount}
                    </label>
                    <input
                      onChange={this.handleInputChange}
                      className="form-control"
                      type="number"
                      name="min_amount"
                      value={this.state.min_amount}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label text-uppercase">
                      Max: {this.state.max_amount}
                    </label>
                    <input
                      onChange={this.handleInputChange}
                      className="form-control"
                      type="number"
                      name="max_amount"
                      value={this.state.max_amount}
                    />
                  </div>
                  <div className="form-group">
                    <label className="float-left">
                      Merchant : {this.state.merchant}
                      <span className="text-danger">*</span>
                    </label>
                    <select
                      className="form-control"
                      onChange={this.handleInputChange}
                      type="text"
                      name="merchant"
                      value={this.state.merchant}
                      required
                    >
                      <option value="">Select Merchant</option>
                      <option value="Rental car">Rental car</option>
                      <option value="Airline">Airline</option>
                      <option value="Shuttle">Shuttle</option>
                      <option value="Taxi">Taxi</option>
                      <option value="Ride sharing">Ride sharing</option>
                      <option value="Fast food">Fast food</option>
                      <option value="Electronics">Electronics</option>
                      <option value="Restaurant">Restaurant</option>
                      <option value="Office supplies">Office supplies</option>
                      <option value="Hotel">Hotel</option>
                      <option value="Parking">Parking</option>
                      <option value="Breakfast">Breakfast</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="float-left">
                      <input
                        onChange={this.handleInputChange}
                        type="checkbox"
                        name="new"
                        id="new"
                        value={this.state.new}
                        defaultChecked
                      />
                      &nbsp; New
                    </label>
                    &nbsp;&nbsp;
                    <label className="float-left">
                      <input
                        onChange={this.handleInputChange}
                        type="checkbox"
                        name="inprogress"
                        value="In progress"
                        id="inprogress"
                        defaultChecked
                      />
                      &nbsp; In Progress
                    </label>
                    &nbsp;&nbsp;
                    <label className="float-left">
                      <input
                        onChange={this.handleInputChange}
                        type="checkbox"
                        name="reimburse"
                        value="Reimburse"
                        id="reimbursed"
                        defaultChecked
                      />
                      &nbsp; Reimbursed
                    </label>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="col-md-7">
            <div className="card">
              <div className="card-header">
                <div className="float-start ">Expenses</div>
                <div className="float-end">
                  <button
                    className="nav-link"
                    onClick={() => {
                      this.setState({
                        ...this.state,
                        show: true,
                      });
                    }}
                  >
                    Add Expense
                  </button>
                </div>
              </div>
              {loading === false ? (
                "Fetching Expenses. Please wait...!"
              ) : (
                <div className="card-body">
                  {getAllExpenses && (
                    <div className="row table-responsive">
                      <table id="datatable" className="display">
                        <thead>
                          <tr>
                            <th>Date</th>
                            <th>Merchant</th>
                            <th>Total</th>
                            <th>Status</th>
                            <th>Comment</th>
                            <th>Action</th>
                          </tr>
                        </thead>

                        <tbody>{list_expenses}</tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="col-md-2">
            {/* 3 of 3 */}
            <form id="importexpense-form" autoComplete="off">
              {errorMessages ? (
                <div className="alert alert-danger" role="alert">
                  {" "}
                  {errorMessages}{" "}
                </div>
              ) : (
                ""
              )}
              {successReg ? (
                <div className="alert alert-success" role="alert">
                  {" "}
                  {successReg}{" "}
                </div>
              ) : (
                ""
              )}
              <div className="mb-3">
                <label className="form-label text-uppercase">
                  Import expenses
                </label>
                <input
                  onChange={this.onChangeImportField}
                  type="file"
                  name="expensesFile"
                  required
                />
              </div>
              <div className="form-group mb-0">
                <button
                  onClick={this.importExcelFile}
                  className="btn btn-primary mt-2 mt-md-3 mt-lg-4"
                  disabled={loadingimport}
                >
                  {loadingimport ? "Importing Expenses..." : "Import"}
                </button>
              </div>
            </form>
          </div>
        </div>
        {this.state.show && (
          <AddExpense
            onClose={() => {
              this.setState({
                ...this.state,
                show: false,
              });
            }}
            parentCallback={this.handleCallback}
          />
        )}
        {this.state.showEditExpense && (
          <EditExpense
            onClose={() => {
              this.setState({ ...this.state, showEditExpense: false });
            }}
            expenseId={this.state.expenseId}
            parentCallback={this.handleCallback}
            user={this.state.user}
          />
        )}
      </div>
    );
  }
}

export default Expense;
