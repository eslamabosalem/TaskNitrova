import axios from "axios";
import { useContext, useEffect } from "react";
import { useFormik } from "formik";
import React from "react";
import * as Yup from "yup";
import { UserContext } from "../UserContext";
import { FaPhoneAlt, FaLock, FaEnvelope, FaUser } from "react-icons/fa";

const validationSchema = Yup.object({
  name: Yup.string().required("Full name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  phone: Yup.string()
    .matches(/^[0-9]{11}$/, "Phone number must be exactly 11 digits")
    .required("Phone number is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
});

export default function SignUp({ isOpen, onClose }) {
  const { setUserLogin } = useContext(UserContext);

  const handleSignUp = (formValues) => {
    const storedEmails = JSON.parse(localStorage.getItem("storedEmails")) || [];

    if (storedEmails.includes(formValues.email)) {
      alert("Email already exists.");
      return;
    }

    storedEmails.push(formValues.email);
    localStorage.setItem("storedEmails", JSON.stringify(storedEmails));

    axios
      .post(`https://jsonplaceholder.typicode.com/users`, formValues)
      .then((res) => {
        if (res.data) {
          localStorage.setItem("userToken", "success");
          setUserLogin(res.data);
          console.log("Registration successful");
          onClose();
        }
      })
      .catch((err) => {
        console.error("Error during registration:", err);
        console.log("Registration failed");
      });
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
    },
    validationSchema,
    onSubmit: (values) => handleSignUp(values),
  });

  useEffect(() => {
    const handleClickOutside = (event) => {
      const modal = document.getElementById("sign-up-modal");
      if (modal && !modal.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        id="sign-up-modal"
        className="w-6/12 bg-white p-8 rounded-3xl shadow-lg relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-500 text-xl"
        >
          &times;
        </button>
        <h2 className="text-3xl font-bold mb-4 text-center">Create Account</h2>
        <p className="mb-6 text-center">Enter the following information</p>

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <div className="flex flex-col md:flex-row md:space-x-4">
            <div className="w-full md:w-1/2 relative mb-4 md:mb-0">
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                className="w-full px-10 py-4 border border-gray-300 rounded-full"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.name}
              />
              <FaUser className="absolute top-5 left-5 text-[#EEEEEE]" />
              {formik.touched.name && formik.errors.name && (
                <div className="text-red-500 text-sm mt-1">
                  {formik.errors.name}
                </div>
              )}
            </div>

            <div className="w-full md:w-1/2 relative">
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                className="w-full px-10 py-4 border border-gray-300 rounded-full"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
              />
              <FaEnvelope className="absolute top-5 left-5 text-[#EEEEEE]" />
              {formik.touched.email && formik.errors.email && (
                <div className="text-red-500 text-sm mt-1">
                  {formik.errors.email}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:space-x-4">
            <div className="w-full md:w-1/2 relative mb-4 md:mb-0">
              <input
                type="text"
                name="phone"
                placeholder="Phone Number"
                className="w-full px-10 py-4 border border-gray-300 rounded-full"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.phone}
              />
              <FaPhoneAlt className="absolute top-5 left-5 text-[#EEEEEE]" />
              {formik.touched.phone && formik.errors.phone && (
                <div className="text-red-500 text-sm mt-1">
                  {formik.errors.phone}
                </div>
              )}
            </div>

            <div className="w-full md:w-1/2 relative">
              <input
                type="password"
                name="password"
                placeholder="Password"
                className="w-full px-10 py-4 border border-gray-300 rounded-full"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
              />
              <FaLock className="absolute top-5 left-5 text-[#EEEEEE]" />
              {formik.touched.password && formik.errors.password && (
                <div className="text-red-500 text-sm mt-1">
                  {formik.errors.password}
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#0575E6] rounded-full py-4 text-white  transition"
          >
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
}