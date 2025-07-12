import React from "react";
import Nav from "../component/layout/Nav";
import car from "../assets/car.avif";
import { Link, useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from "../../utils/formValidator";
import { axiosInstance } from "../../utils/axiosInstance";
import { useAppContext } from "../../hooks/UseAppContext";

const LoginPage = () => {
  const redirect = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { login } = useAppContext;

  //creating handle-form for form handling and validation
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const handleLogin = async (data) => {
    setSubmitting(true);
    try {
      console.log("Login Data", data);
      const { data: mydata } = await axiosInstance.post("/auth/login", {
        email,
        password,
      });
      console.log(mydata);
      login(mydata.token, mydata.user);
      if (response.status === 200) {
        redirect("/car-listing");
      } else {
        redirect("/");
      }
      setErrorMessage("");
    } catch (error) {
      console.log(error);
      setErrorMessage(error?.response?.data?.message || "Login failed");
    } finally {
      setSubmitting(false);
      reset(); // Reset the form fields
    }
  };
  return (
    <div>
      <Nav />

      <div className="layout flex flex-row-reverse justify-between items-center gap-5">
        <div className="mt-8">
          <img src={car} alt="..." />
        </div>

        <div className="layout w-[500px] ">
          <form
            onSubmit={handleSubmit(handleLogin)}
            className="mt-8 border p-6 rounded-lg shadow-lg"
          >
            <h1 className="text-[45px] font-bold">Prime Autos</h1>
            <h1 className="text-[25px] font-semibold">Log in</h1>
            <p className="text-16px">Enter your details and get started</p>

            <div className="relative">
              <label
                htmlFor="Email"
                className="block mb-1 text-lg font-medium text-blue-800 mt-3"
              >
                Email
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                className="border border-black  w-full py-2.5 px-2"
                {...register("email")}
              />
              <p className="text-red-500 text-sm mt-1">
                {errors.email?.message}
              </p>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block mb-1 text-lg font-medium text-blue-800 mt-3"
              >
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="border border-black  w-full py-2.5 px-2"
                {...register("password")}
              />
              <span
                className="cursor-pointer relative left-[380px] bottom-7"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FiEye /> : <FiEyeOff />}
              </span>
              <p className="text-red-500 text-sm mt-1">
                {errors.password?.message}{" "}
              </p>
            </div>
            {errorMessage && (
              <p className="text-red-500 text-center mt-2">{errorMessage}</p>
            )}
            <button
              disabled={submitting}
              type="submit"
              className="bg-blue-800 text-white font-bold text-[20px] rounded-lg px-4 py-2 mt-4 hover:bg-blue-600 cursor-pointer w-full"
            >
              {submitting ? "Logging....." : "Login"}
            </button>

            <Link to="/forgot-password">
              <p className="mt-4">Forgot password?</p>
            </Link>
            <p className="text-center mt-4">
              Don't have an account?
              <Link to="/register">
                <span className="text-blue-600"> Sign-up</span>{" "}
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
