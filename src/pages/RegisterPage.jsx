import React, { useState } from "react";
import Nav from "../component/layout/Nav";
import car from "../assets/car.avif";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
//next import useform for form handling and validation and yup-reslover for validation schema and the schema exported from utils/formValidator.js
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { signUpSchema } from "../../utils/formValidator";

const RegisterPage = () => {
  const redirect = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  //set use state for error message and submitting state

  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  //creating handle-form for form handling and validation
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(signUpSchema),
  });

  //handle form submit
  const handleRegister = (data) => {
    setIsSubmitting(true);
    console.log(data);
    setIsSubmitting(false);
    // Simulate a successful registration
    reset(); // Reset the form fields
  };
  return (
    <div>
      <Nav />
      <div className="layout flex flex-row-reverse justify-center items-center  gap-5 ">
        <div className=" mt-8 ">
          <img src={car} alt="empty" className="h-[500px] rounded-xl" />
        </div>
        <div className="layout flex flex-col w-[400px] ">
          <form
            onSubmit={handleSubmit(handleRegister)}
            className="mt-8 border p-6 rounded-lg shadow-lg  "
          >
            <h1 className=" text-2xl text-center">Sign up to get started</h1>

            <div>
              <label
                htmlFor="FullName"
                className="block mb-1 text-lg font-medium text-blue-800 mt-3"
              >
                FullName
              </label>
              <input
                type="text"
                placeholder="Enter your name"
                className="text-white border border-black py-2 px-6 w-full"
                {...register("fullName")}
              />
              <p className="text-red-500 text-sm ">
                {errors.fullName?.message}
              </p>
            </div>

            <div>
              <label
                htmlFor="Email"
                className="block mb-1 text-lg font-medium text-blue-800 mt-3"
              >
                Email
              </label>
              <input
                type="text"
                placeholder="Enter your Email"
                className="text-white border border-black py-2 px-6 w-full"
                {...register("email")}
              />
              <p className="text-red-500 text-sm mt-1">
                {errors.email?.message}
              </p>
            </div>

            <div>
              <label
                htmlFor="tel"
                className="block mb-1 text-lg font-medium text-blue-800 mt-3"
              >
                Phone Number
              </label>
              <input
                type="tel"
                placeholder="Telephone Number"
                className="text-white border border-black py-2 px-6 w-full"
                {...register("phoneNumber")}
              />
              <p className="text-red-500 text-sm mt-1">
                {errors.phoneNumber?.message}
              </p>
            </div>

            <div className="relative">
              <label
                htmlFor="password"
                className="block mb-1 text-lg font-medium text-blue-800 mt-3"
              >
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Enter your password"
                className="text-white border border-black py-2 px-6 w-full"
                {...register("password")}
              />
              <span
                className="absolute right-4 top-[53%] cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </span>
              <p className="text-red-500 text-sm mt-1">
                {errors.password?.message}
              </p>
            </div>

            <div className="relative">
              <label
                htmlFor="confirm-password"
                className="block mb-1 text-lg font-medium text-blue-800 mt-3"
              >
                Confirm Password
              </label>
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirm-password"
                placeholder="Enter your password"
                className="text-gray-600 border border-black py-2 px-6 w-full"
                {...register("confirmPassword")}
              />
              <span
                className="absolute right-4 top-[53%] cursor-pointer"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
              </span>
              <p className="text-red-500 text-sm">
                {errors.confirmPassword?.message}
              </p>
            </div>

            <button
              disabled={isSubmitting}
              type="submit"
              className="border bg-black text-white w-full py-2 mt-6 cursor-pointer"
            >
              {isSubmitting ? "Registering..." : "Register"}
            </button>
            <Link to="/login">
              <p className="text-center mt-4">
                Already have an account?{" "}
                <span className="text-blue-500 hover:underline">Login</span>
              </p>
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
