import React from "react";
import Nav from "../component/layout/Nav";
import { MdVpnKeyOff } from "react-icons/md";
import car from "../assets/car.avif";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { forgotPasswordSchema } from "../../utils/formValidator";
import { useState } from "react";

const ForgotPasswordPage = () => {
  const redirect = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  // Creating handle-form for form handling and validation

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(forgotPasswordSchema),
  });

  const handleFOrgotPassword = (data) => {
    setSubmitting(true);
    console.log(data);
    setSubmitting(false);
    reset(); // Reset the form fields
  };

  return (
    <div>
      <Nav />
      <div className="flex gap-10 justify-center">
        <div className=" border border-gray-300 rounded-lg shadow-lg p-5 w-[450px]  mt-40 ml-30">
          <h1 className="text-3xl text-center mt-">Forgot Password</h1>
          <div className="flex justify-center mt-5">
            <MdVpnKeyOff className="text-6xl text-gray-500" />
          </div>
          <p className="text-center mt-2">
            Enter your email address to reset your password.
          </p>
          <form
            onSubmit={handleSubmit(handleFOrgotPassword)}
            className="max-w-md mx-auto mt-5"
          >
            <label
              htmlFor="email"
              className="block mb-1 text-lg font-medium text-blue-800 mt-3"
            >
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your email address"
              className="w-full p-2 border border-gray-300 rounded"
              required
              {...register("email")}
            />
            <p className="text-red-500 text-sm mt-1">{errors.email?.message}</p>
            <button
              disabled={submitting}
              type="submit"
              className="w-full bg-blue-500 text-white font-bold p-2 rounded mt-3 cursor-pointer hover:bg-black transition-colors"
            >
              {submitting ? "Submitting..." : "Reset Password"}
            </button>
            <Link to="/login">
              <p className="mt-3 text-center">
                Remember password ?{" "}
                <span className="text-blue-600 font-bold">login</span>
              </p>
            </Link>
          </form>
        </div>

        <div>
          <img src={car} alt="..." className="mt-40 rounded-[10%]" />
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
