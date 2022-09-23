/* eslint-disable */
export default function AuthHeader() {
  const token = localStorage.getItem("token");
  if (token) {
    return {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    };
  }
}
