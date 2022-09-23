/* eslint-disable */
import http from "../Util";
import AuthHeader from "./AuthHeader";

class AuthService {
  loginUser(data) {
    return http.post("/user/auth/login", data);
  }

  getExpenses(data) {
    return http.post("/user/expense/filter", data, {
      headers: AuthHeader(),
    });
  }

  CreateExpense(data) {
    return http.post("/user/expense/add", data, {
      headers: AuthHeader(),
    });
  }

  updateExpense(data) {
    return http.post("/user/expense/update", data, {
      headers: AuthHeader(),
    });
  }

  importExpense(data) {
    return http.post("/user/expense/import", data, {
      headers: AuthHeader(),
    });
  }

  register(data) {
    return http.post("/user/auth/signup", data);
  }

  authUser() {
    return http.get("/user/profile", { headers: AuthHeader() });
  }

  getExpense(expenseId) {
    return http.get(`/user/expense/show/${expenseId}`, {
      headers: AuthHeader(),
    });
  }

  getUserById(userId) {
    return http.get(`/user/get/user/${userId}`, {
      headers: AuthHeader(),
    });
  }

  getAllUsers() {
    return http.get("/user/get/all-users", { headers: AuthHeader() });
  }
}

export default new AuthService();
