/* eslint-disable */
import React, { useEffect, useState } from "react";
import { Navigate, Link } from "react-router-dom";
import AuthService from "./Services/AuthService";
import { DatePicker } from "react-datepicker";
//Bootstrap and jQuery libraries
import "bootstrap/dist/css/bootstrap.min.css";
import "jquery/dist/jquery.min.js";
//Datatable Modules
import "datatables.net-dt/js/dataTables.dataTables";
import "datatables.net-dt/css/jquery.dataTables.min.css";
import $, { event } from "jquery";

const initialFormState = {
  from: "",
  to: "",
  min_amount: "",
  max_amount: "",
  merchant: "",
  status: ["New", "Reimburse", "In Progress"],
};

const ExpenseCache = () => {
  const [getAllExpenses, setGetAllExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expense, setExpense] = useState(initialFormState);

  const [state, setState] = useState(initialFormState);

  useEffect(() => {
    fetchData();
  }, [state]);

  const fetchData = () => {
    return console.log("homeeee");
  };

  const handleInputChange = (event) => {
    event.preventDefault();
    getExpenses();

    const { name, value } = event.target;
    setExpense({
      [name]: value,
    });
  };

  const clearForm = () => {
    document.getElementById("expenseform").reset();
  };

  useEffect(() => {
    getExpenses();
  }, []);

  const getExpenses = () => {
    const data = {
      from: expense && expense.from,
      to: expense && expense.to,
      min_amount: expense && expense.min_amount,
      max_amount: expense && expense.max_amount,
      merchant: expense && expense.merchant,
      status: ["New", "Reimburse", "In Progress"],
    };
    console.log("initial values", expense);

    // console.log("data", data);
    AuthService.getExpenses(data)
      .then((response) => {
        setGetAllExpenses(response.data ? response.data.data : []);
        // console.log("xpenses", response.data.data);
        setLoading(true);
        $(document).ready(function () {
          $("#datatable").DataTable();
        });
      })
      .catch((error) => {});
  };

  const list_expenses =
    getAllExpenses &&
    getAllExpenses.map((expense, key) => {
      return (
        <React.Fragment key={key}>
          <tr>
            <td>{expense.date}</td>
            <td>{expense.merchant}</td>
            <td>{expense.total_amount}</td>
            <td>{expense.status}</td>
            <td>{expense.comment}</td>
          </tr>
        </React.Fragment>
      );
    });

  return (
    <div className="containerx">
      <div className="row">
        <div className="col-md-3">
          <div className="card">
            <div className="card-header">
              <span className="pull-left"> Filter expenses ccc</span>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <span
                onClick={() => clearForm()}
                className="pull-right"
                style={{ color: "blue", cursor: "pointer" }}
              >
                Clear filter
              </span>
            </div>
            <div className="card-body">
              <form id="expenseform" autoComplete="off">
                <div className="mb-3">
                  <label className="form-label text-uppercase">From</label>
                  <input
                    onChange={(event) => handleInputChange(event)}
                    className="form-control"
                    type="date"
                    name="from"
                    defaultValue={expense.from}
                  />
                  <small
                    className="text-danger"
                    style={{ color: "red" }}
                  ></small>
                </div>
                <div className="mb-3">
                  <label className="form-label text-uppercase">To</label>
                  <input
                    onChange={handleInputChange}
                    className="form-control"
                    type="date"
                    name="to"
                    defaultValue={expense.to}
                  />
                  <small
                    className="text-danger"
                    style={{ color: "red" }}
                  ></small>
                </div>
                <div className="mb-3">
                  <label className="form-label text-uppercase">Min</label>
                  <input
                    onChange={handleInputChange}
                    className="form-control"
                    type="number"
                    name="min_amount"
                  />
                  <small
                    className="text-danger"
                    style={{ color: "red" }}
                  ></small>
                </div>

                <div className="mb-3">
                  <label className="form-label text-uppercase">Max</label>
                  <input
                    onChange={handleInputChange}
                    className="form-control"
                    type="number"
                    name="max_amount"
                  />
                  <small
                    className="text-danger"
                    style={{ color: "red" }}
                  ></small>
                </div>
                <div className="form-group">
                  <label className="float-left">
                    Merchant
                    <span className="text-danger">*</span>
                  </label>
                  <select
                    className="form-control"
                    onChange={handleInputChange}
                    type="text"
                    name="category_id"
                    placeholder="Category Name"
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
                  <small
                    className="text-danger"
                    style={{ color: "red" }}
                  ></small>
                </div>

                <div className="mb-3">
                  <label className="float-left">
                    <input
                      onChange={handleInputChange}
                      type="checkbox"
                      name="new"
                      value="New"
                    />
                    &nbsp; New
                  </label>
                  &nbsp;&nbsp;
                  <label className="float-left">
                    <input
                      onChange={handleInputChange}
                      type="checkbox"
                      name="new"
                      value="In progress"
                    />
                    &nbsp; In Progress
                  </label>
                  &nbsp;&nbsp;
                  <label className="float-left">
                    <input
                      onChange={handleInputChange}
                      type="checkbox"
                      name="new"
                      value="Reimbursed"
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
            <div className="card-header">Expenses</div>
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
        <div className="col-md-2">3 of 3</div>
      </div>
    </div>
  );
};

export default ExpenseCache;
