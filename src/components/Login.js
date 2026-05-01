import Button from "@mui/material/Button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Auth";
import axios from "axios";
import { toast } from "react-toastify";
import { LoaderCircle } from "lucide-react";
import { api } from "../API";

export default function Login() {
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);
  const { setUser } = useAuth();
  const [inputValue, setInputValue] = useState({
    email: "",
    password: "",
  });
  const { email, password } = inputValue;
  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setInputValue({
      ...inputValue,
      [name]: value,
    });
  };

  const handleError = (err) =>
    toast.error(err, {
      position: "top-right",
    });
  const handleSuccess = (msg) =>
    toast.success(msg, {
      position: "top-right",
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoader(true);
      const { data } = await axios.post(
        `${api}auth/login`,
        {
          ...inputValue,
        },
        { withCredentials: true },
      );
      const { success, message } = data;
      if (success) {
        handleSuccess(message);
        setTimeout(() => {
          setUser(data.user);
          navigate("/");
        }, 1000);
      } else {
        handleError(message);
      }
    } catch (error) {
      console.log(error.response?.data?.message || error.response?.data);
      const errorMsg =
        error.response?.data?.message ||
        (typeof error.response?.data === "string"
          ? error.response.data
          : null) ||
        error.message ||
        "An error occurred during login";
      handleError(errorMsg);
    } finally {
      setLoader(false);
    }
    setInputValue({
      ...inputValue,
      email: "",
      password: "",
    });
  };
  return (
    <>
      <div className="auth-container">
        <h3>Welcome Back!</h3>
        <p>Enter Your Credentials To Restart Your Trading Journey</p>
        <form className="auth-form" onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            value={email}
            placeholder="Email"
            onChange={handleOnChange}
            required
          />
          <input
            type="password"
            name="password"
            value={password}
            placeholder="Enter Password"
            onChange={handleOnChange}
            required
          />
          <Button type="submit" variant="contained" className="auth-btn-login">
            {loader ? <LoaderCircle className="spinner" /> : "Login"}
          </Button>
        </form>
      </div>
    </>
  );
}
