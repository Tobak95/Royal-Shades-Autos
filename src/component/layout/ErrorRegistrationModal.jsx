import React from "react";
import download from "../../assets/download.png"
import { MdClose } from "react-icons/md";

const ErrorRegistrationModal = ({ setShowModal2 }) => {
  return (
    <div>
      <div className="fixed inset-0 z-50 p-3 bg-[#00000080] bg-opacity-40 flex items-center justify-center">
        <div className="bg-black rounded-xl shadow-lg p-6 max-w-[500px] h-[456px] w-full relative">
          {/* Close button */}
          <button
            onClick={() => setShowModal2(false)}
            className="absolute top-3 right-3 text-gray-500 hover:text-black text-xl cursor-pointer"
          >
            <MdClose size={30} />
          </button>

          {/* Modal Content */}
          <div className="flex flex-col items-center justify-center">
            <img src={download} alt="done image" className="w-[150px]"/>
            <h2 className="text-3xl font-semibold mb-2 text-center my-3 mt-10">
                Oops! Something went wrong
            </h2>
            <p className="text-center text-[16px] text-whiten">
                Your Account could not be created due to an error.
              <br />
                Please try again later or fill all inputs correctly
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorRegistrationModal;
