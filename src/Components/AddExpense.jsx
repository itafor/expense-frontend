/* eslint-disable */
import React, { Component } from "react";
import { Navigate, Link, useNavigate } from "react-router-dom";
import ReactFormInputValidation from "react-form-input-validation";
import AuthService from "./Services/AuthService";
//Bootstrap and jQuery libraries
import "bootstrap/dist/css/bootstrap.min.css";
import "jquery/dist/jquery.min.js";
//Datatable Modules
import "datatables.net-dt/js/dataTables.dataTables";
import "datatables.net-dt/css/jquery.dataTables.min.css";
import $, { event } from "jquery";
// const navigate = useNavigate();

class AddExpense extends Component {
  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
    this.onChangeReceipt = this.onChangeReceipt.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);

    // this.getCategories = this.getCategories.bind(this);

    this.state = {
      merchant: "",
      total_amount: "",
      date: "",
      receipt: "",
      comment: "",
      loading: false,
      errorMessages: "",
      successReg: "",
      receiptFile: "",
      allCurrentExpenses: [],
      fields: [
        {
          merchant: "",
          total_amount: "",
          date: "",
          receipt: "",
          comment: "",
        },
      ],
      errors: [{}],
    };
    this.form = new ReactFormInputValidation(this);
    this.form.useRules({
      merchant: "required",
      total_amount: "required",
      date: "required",
    });
  }

  componentDidMount() {
    // this.getCategories();
    console.log("props", this.props);
    // this.retrieveExpenses(this.state.allCurrentExpenses);
  }

  // handle input change
  handleInputChange = (e, index) => {
    let files = e.target.files || e.dataTransfer.files;
    if (!files.length) return;
    let reader = new FileReader();
    reader.onload = (ev) => {
      const { name, value } = ev.target.result;
      const list = [...this.state.inputList];
      list[index] = ev.target.result;
      this.setState({ inputList: list });
    };
    reader.readAsDataURL(files[0]);
  };

  onChangeReceipt = (e) => {
    this.setState({
      receipt: e.target.files[0],
      receiptFile: URL.createObjectURL(e.target.files[0]),
    });
  };

  onChangeMerchant = (e) => {
    this.setState({
      merchant: e.target.value,
    });
  };

  onChangePostData = (e) => {
    switch (e.target.name) {
      case "merchant":
        this.setState({
          merchant: e.target.value,
        });
        break;
      case "total_amount":
        this.setState({
          total_amount: e.target.value,
        });
        break;
      case "date":
        this.setState({
          date: e.target.value,
        });
        break;
      case "receipt":
        this.setState({
          receipt: e.target.value,
        });
        break;
      case "comment":
        this.setState({
          comment: e.target.value,
        });
        break;

      default:
        break;
    }
  };

  fetchAllExpenses = () => {
    const newData = {
      from: "",
      to: "",
      min_amount: "",
      max_amount: "",
      merchant: "",
      status: ["New", "Reimburse", "In Progress"],
    };
    AuthService.getExpenses(newData)
      .then((response) => {
        console.log("all current expense", response.data.data);
        this.props.parentCallback(response.data.data);
        this.setState({
          ...this.state,
          allCurrentExpenses: response.data ? response.data.data : [],
        });
      })
      .catch((error) => {});
  };

  onSubmit(e) {
    e.preventDefault();

    var formdata = new FormData();
    formdata.append("merchant", this.state.merchant);
    formdata.append("total_amount", this.state.total_amount);
    formdata.append("date", this.state.date);
    formdata.append("receipt", this.state.receipt);
    formdata.append("comment", this.state.comment);

    this.setState({ loading: true });
    AuthService.CreateExpense(formdata)
      .then((response) => {
        this.fetchAllExpenses();

        this.setState({
          successReg: response.data.message,
          loading: false,
          errorMessages: "",
          submitted: true,
        });
        document.getElementById("add-expense-form").reset();
      })
      .catch((error) => {
        if (error.response && error.response.data.message) {
          this.setState({ loading: false, successReg: "" });

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
      errorMessages,
      successReg,
      blogCategories,
      loading,
      inputList,
      authUser,
      initialFormValues,
      receiptFile,
    } = this.state;

    return (
      <div className="position-absolute  end-0  top-0 w-100 h-100">
        <div className="container ">
          <div className="row">
            <div className="col-md-10">
              <div className="card">
                <div className="card-header">
                  <div className="float-start ">Add Expense</div>
                  <div className="float-end ">
                    <button
                      className="nav-link"
                      onClick={() => {
                        this.props.onClose();
                      }}
                    >
                      Back to list
                    </button>
                  </div>
                </div>
                <div className="card-body">
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

                  <form id="add-expense-form" role="form">
                    <div className="card-body">
                      <div className="form-group">
                        <label className="float-left">
                          Merchant
                          <span className="text-danger">*</span>
                        </label>
                        <select
                          className="form-control"
                          id="category_id"
                          name="merchant"
                          defaultValue={this.state.merchant}
                          ref={(input) => (this.merchant = input)}
                          onChange={this.onChangePostData}
                          // onBlur={this.form.handleBlurEvent}
                          required
                        >
                          <>
                            <option value={true}>Select Merchant</option>
                            <option value="Rental car">Rental car</option>
                            <option value="Airline">Airline</option>
                            <option value="Shuttle">Shuttle</option>
                            <option value="Taxi">Taxi</option>
                            <option value="Ride sharing">Ride sharing</option>
                            <option value="Fast food">Fast food</option>
                            <option value="Electronics">Electronics</option>
                            <option value="Restaurant">Restaurant</option>
                            <option value="Office supplies">
                              Office supplies
                            </option>
                            <option value="Hotel">Hotel</option>
                            <option value="Parking">Parking</option>
                            <option value="Breakfast">Breakfast</option>
                          </>
                        </select>
                      </div>
                      <div className="form-group">
                        <label className="float-left">
                          Total <span className="text-danger">*</span>{" "}
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          placeholder="Enter total"
                          name="total_amount"
                          defaultValue={this.state.total_amount}
                          ref={(input) => (this.total_amount = input)}
                          onChange={this.onChangePostData}
                          // onBlur={this.form.handleBlurEvent}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label className="float-left">
                          Date <span className="text-danger">*</span>{" "}
                        </label>
                        <input
                          type="date"
                          className="form-control"
                          placeholder="Enter date"
                          name="date"
                          defaultValue={this.state.date}
                          ref={(input) => (this.date = input)}
                          onChange={this.onChangePostData}
                          // onBlur={this.form.handleBlurEvent}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label className="float-left">Drop receipt here</label>
                        <input
                          type="file"
                          className="form-control"
                          placeholder="Enter Category"
                          required
                          name="receipt"
                          onChange={this.onChangeReceipt}
                        />
                        {/* {receiptFile && <img src="{this.state.receiptFile}" />} */}
                      </div>
                      <div className="form-group">
                        <label className="float-left">Comment</label>
                        <textarea
                          rows="6"
                          placeholder="Comment"
                          className="form-control"
                          name="comment"
                          defaultValue={this.state.comment}
                          ref={(input) => (this.comment = input)}
                          onChange={this.onChangePostData}
                          onBlur={this.form.handleBlurEvent}
                        ></textarea>
                      </div>
                      <div className="form-group mt-5 mb-0">
                        <button
                          onClick={(e) => {
                            this.onSubmit(e);
                            this.props.onClose();
                          }}
                          className="btn btn-primary mt-2 mt-md-3 mt-lg-4 float-start"
                          disabled={loading}
                        >
                          {loading ? "Saving Expense..." : "Save"}
                        </button>

                        <button
                          onClick={(e) => {
                            this.props.onClose();
                          }}
                          className="btn btn-danger mt-2 mt-md-3 mt-lg-4 float-end"
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* <ToastContainer /> */}
      </div>
    );
  }
}

export default AddExpense;
