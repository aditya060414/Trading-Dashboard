import Button from "@mui/material/Button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Auth";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { LoaderCircle } from "lucide-react";


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
        "https://trading-backend-tf3j.onrender.com/api/v1/auth/login",
        {
          ...inputValue,
        },
        { withCredentials: true },
      );
      setUser(data.user);
      const { success, message } = data;
      if (success) {
        handleSuccess(message);
        setTimeout(() => {
          navigate("/");
        }, 500);
      } else {
        handleError(message);
      }
    } catch (error) {
      handleError(error.response.data.message);
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
          <Button type="submit" variant="contained" className="auth-btn-login" >
            {loader ? <LoaderCircle className="spinner" /> : "Login"}
          </Button>
        </form>
        <ToastContainer />

      </div>
    </>
  );
}
