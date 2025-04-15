import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../UserContext";
import * as Yup from "yup";
import { useFormik } from "formik";
import logo from "../assets/images/logo 1.png";
import Background from "../assets/images/BackGround.svg";
import grounp from "../assets/images/Group.svg";
import SignUp from "./SignUp";
import { FaEnvelope, FaLock } from "react-icons/fa";  // استيراد الأيقونات

export default function Login() {
  let navigate = useNavigate();
  let { setUserLogin } = useContext(UserContext);

  const [error, setError] = useState(null);
  const [showSignUp, setShowSignUp] = useState(false);

  const handleLogin = (formValues) => {
    const storedEmails = JSON.parse(localStorage.getItem("storedEmails")) || [];

    if (!storedEmails.includes(formValues.email)) {
      setError("The email is not registered. Please sign up first.");
      return;
    }

    axios
      .post("https://jsonplaceholder.typicode.com/users", formValues)
      .then((res) => {
        if (res.data) {
          localStorage.setItem("userToken", "success");
          localStorage.setItem("userName", res.data.name);
          setUserLogin("success");
          navigate("/users");
        }
      })
      .catch((err) => {
        console.error("Error during login:", err);
        setError("Invalid credentials");
      });
  };

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email address").required("Required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Required"),
  });

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      console.log("Form Data: ", values);
      handleLogin(values);
    },
  });

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="w-full h-full flex flex-col md:flex-row rounded-none overflow-hidden">
        <div className="w-full md:w-8/12 text-white flex flex-col justify-center items-center relative overflow-hidden">
          <img
            src={Background}
            alt="Background"
            className="w-full h-full object-cover absolute top-0 left-0 "
          />
          <div className="relative z-10 px-6 sm:px-8 ">
            <img src={logo} alt="Logo" className="mb-5" />
            <h2 className="font-medium text-[18px] mb-4 sm:text-lg">
              You will find comprehensive software solutions with us
            </h2>
            <button className="mt-4 mb-9 bg-[#0575E6] text-white font-medium py-2 px-7 rounded-full hover:bg-blue-100 transition sm:px-5">
              Read More
            </button>
          </div>
          <img
            src={grounp}
            alt="Group"
            className="z-50 absolute w-96 left-0 bottom-0 md:w-1/3"
          />
        </div>
        <div className="w-full md:w-4/12 flex flex-col justify-center items-center bg-white">
          <div className="w-[90%] sm:w-[95%] md:w-[400px] h-[327px] mt-10">
            <h2 className="text-3xl text-[#333] font-bold mb-2 sm:text-2xl text-left">
              Hello Again!
            </h2>
            <p className="mb-6 text-2xl text-[#333] sm:text-sm">Welcome Back</p>

            {error && <div className="text-red-500 text-sm mb-2">{error}</div>}

            <form onSubmit={formik.handleSubmit} className="space-y-4">
              <div className="relative">
                <FaEnvelope className="absolute top-5 left-5 text-[#EEEEEE]" />
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-full"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.email}
                />
                {formik.touched.email && formik.errors.email && (
                  <div className="text-red-500 text-sm mt-1">
                    {formik.errors.email}
                  </div>
                )}
              </div>

              <div className="relative">
                <FaLock className="absolute top-5 left-5 text-[#EEEEEE]" />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-full"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.password}
                />
                {formik.touched.password && formik.errors.password && (
                  <div className="text-red-500 text-sm mt-1">
                    {formik.errors.password}
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-[#0575E6] rounded-full py-4 text-white sm:py-3"
              >
                Login
              </button>
            </form>

            <p className="mt-4 text-sm text-gray-600 text-center">
              Don't have an account?
              <button
                className="text-blue-600 hover:text-blue-800 ml-1"
                onClick={() => setShowSignUp(true)}
              >
                Register
              </button>
            </p>
          </div>
        </div>
      </div>

      <SignUp isOpen={showSignUp} onClose={() => setShowSignUp(false)} />
    </div>
  );
}
