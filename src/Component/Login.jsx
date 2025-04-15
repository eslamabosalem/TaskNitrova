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
import { FaEnvelope, FaLock } from "react-icons/fa";

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
    <div>
     <div className="flex flex-col md:flex-row h-screen">
  {/* الجزء الأيسر - للخلفية والصورة */}
  <div className="md:w-8/12 w-full flex flex-col justify-center items-center relative bg-blue-500 min-h-[300px] md:min-h-auto">
    <img
      src={Background}
      alt="Background"
      className="absolute top-0 left-0 w-full h-full object-cover"
    />
    
    <div className="relative px-6 sm:px-8 z-10 md:mr-28 w-full md:w-auto text-center md:text-left">
      <div className="flex justify-center md:block">
        <img src={logo} alt="Logo" className="mb-5 w-32 md:w-auto" />
      </div>
      <h2 className="font-medium text-white text-lg mb-4 md:text-xl lg:text-2xl">
        You will find comprehensive software solutions with us
      </h2>
      <div className="flex justify-center md:block">
        <button className="mb-10 md:mb-20 md:mr-8 bg-[#0575E6] text-white font-medium py-2 px-7 rounded-full hover:bg-blue-100 transition">
          Read More
        </button>
      </div>
    </div>
    
    <img
      src={grounp}
      alt="Group"
      className="absolute bottom-0 left-0  w-[150px]  xl:[400px] md:w-[300px] 2xl:w-[430px] "
    />
  </div>

  {/* الجزء الأيمن - للنموذج */}
  <div className="w-full md:w-4/12 flex flex-col justify-center items-center bg-white p-6">
    <div className="w-full max-w-[400px] mt-5 md:mt-10 px-4">
      <h2 className="text-2xl md:text-3xl text-[#333] font-bold mb-2 text-center md:text-left">
        Hello Again!
      </h2>
      <p className="mb-6 text-xl md:text-2xl text-[#333] text-center md:text-left">
        Welcome Back
      </p>

      {error && <div className="text-red-500 text-sm mb-2 text-center md:text-left">{error}</div>}

      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <div className="relative">
          <FaEnvelope className="absolute top-4 left-4 text-[#EEEEEE]" />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-full text-sm md:text-base"
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
          <FaLock className="absolute top-4 left-4 text-[#EEEEEE]" />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-full text-sm md:text-base"
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
          className="w-full bg-[#0575E6] rounded-full py-3 md:py-4 text-white text-sm md:text-base"
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
