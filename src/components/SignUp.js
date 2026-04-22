import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Button from "@mui/material/Button";
import { LoaderCircle } from "lucide-react";
export default function SignUp() {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState({
    email: "",
    password: "",
    username: "",
    contact: "",
  });
  const [loader, setLoader] = useState(false);
  const { email, password, username, contact } = inputValue;
  const handleOnchange = (e) => {
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
        "https://trading-backend-tf3j.onrender.com/api/v1/auth/signUp",
        {
          ...inputValue,
        },
        { withCredentials: true },
      );

      const { success, message } = data;
      if (success) {
        handleSuccess(message);
        setTimeout(() => {
          navigate("/");
        }, 1000);
      } else {
        handleError(message);
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || (typeof err.response?.data === 'string' ? err.response.data : null) || err.message || "An error occurred during registration";
      handleError(errorMsg);
    } finally {
      setLoader(false);
    }
  };

  return (
    <>
      <div className="auth-container">
        <h3>Create Your Account</h3>
        <p>Join Our Trading Platform</p>
        <form className="auth-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            value={username}
            placeholder="Enter Your Fullname"
            onChange={handleOnchange}
            required
          />
          <input
            type="email"
            name="email"
            value={email}
            placeholder="Enter Your Email"
            onChange={handleOnchange}
            required
          />
          <input
            type="number"
            name="contact"
            value={contact}
            placeholder="Enter Your Phone Number"
            onChange={handleOnchange}
            required
          />
          <input
            type="password"
            name="password"
            value={password}
            placeholder="Enter Your Password"
            onChange={handleOnchange}
            required
          />
          <Button type="submit" variant="contained" className="auth-btn">
            {loader ? <LoaderCircle className="spinner" /> : "SignUp"}
          </Button>
        </form>
      </div>
    </>
  );
}
