import React from "react";
import { ClimbingBoxLoader } from "react-spinners";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MdCancel } from "react-icons/md";
import group from "../assets/Group.png";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../utils/axiosInstance";
import { redirect, useParams } from "react-router-dom";

const VerifyEmail = () => {
  const redirect = useNavigate();
  const { token } = useParams();
  const [status, setStatus] = useState("verifying");
  const [errorMessage, setErrorMessage] = useState("");
  const [email, setEmail] = useState("");
  const [feedback, setFeedback] = useState("");

  //handle resendEmail if the email is not verified

  const handleResendEmail = async () => {
    try {
      const response = await axiosInstance.post(
        "/auth/resend-verification-email",
        { email }
      );
      if (response.status === 200) {
        setFeedback(
          "Email sent successfully, check your email for verification."
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  //handling token for verification
  const checkToken = async () => {
    try {
      const response = await axiosInstance.post(
        `/auth/verify-email/${token}   `,
        { token }
      );
      if (response.status === 200) {
        setStatus("success");
      }
    } catch (error) {
      setErrorMessage("Verification failed. Please try again.");
      setStatus("error" || "failed");
      setEmail(error?.response?.data?.email);
    }
  };

  useEffect(() => {
    checkToken();
  }, []);

  if (status === "verifying") {
    return (
      <div className="flex items-center justify-center h-screen bg-blue-950">
        <div className="max-w-[500px] w-full rounded-lg text-center py-[29px] px-[26px]  border-[4px] border-black">
          <ClimbingBoxLoader className="mx-auto my-3 font-white " />
          <h1 className="text-2xl font-semibold ">Email Verifying</h1>

          <p className="text-lg text-white mt-4">
            Please wait while verifying.......
          </p>
        </div>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="flex items-center justify-center h-screen bg-blue-950">
        <div className="max-w-[500px] w-full rounded-lg text-center py-[29px] px-[26px]">
          <img src={group} alt="...." />
          <h1>Email Verification Successfully</h1>
          <p className="mb-4">Your Account have been verified Successfully</p>
        </div>

        <Link to={"/login"}>
          <button className="w-full font-semibold rounded-lg bg-black text-white h-[56px]">
            Proceed to LogIn
          </button>
        </Link>
      </div>
    );
  }
  return (
    <div className="flex items-center justify-center h-screen bg-blue-950">
      <div className="max-w-[500px] w-full rounded-lg text-center py-[29px] px-[26px]">
        <MdCancel size={80} className="text-red-500 mx-auto" />
        <p className="bg-green-100 text-green-700 pt-1.5 px-3 rounded-lg">
          {feedback}
        </p>
        <h1>Email Verification Failed</h1>
        <p className="text-white mb-4">{errorMessage}</p>
        <Link to={""}>
          <button
            onClick={handleResendEmail}
            className="w-full font-semibold rounded-lg bg-black text-white h-[56px]"
          >
            Resend Verification Email
          </button>
        </Link>
      </div>
    </div>
  );
};

export default VerifyEmail;
