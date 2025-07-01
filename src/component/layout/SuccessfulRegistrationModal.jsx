import React from 'react'
import cancel from "../../assets/cancel.png"
import { MdClose } from 'react-icons/md'

const SuccessfulRegistrationModal = ({setShowModal}) => {
  return (
    <div>
      <div className="fixed inset-0 z-50 p-3 bg-[#00000080] bg-opacity-40 flex items-center justify-center">
        <div className="bg-blue-900 rounded-xl shadow-lg p-6 max-w-[500px] h-[326px] w-full relative">
          {/* Close button */}
          <button
            onClick={() => setShowModal(false)}
            className="absolute top-3 right-3 text-gray-500 hover:text-black text-xl cursor-pointer"
          >
            <MdClose size={30} />
          </button>

          {/* Modal Content */}
          <div className="flex flex-col items-center justify-center">
            <img src={cancel} alt="done image" />
            <h2 className="text-3xl font-semibold mb-2 text-center my-3">
              Congratulations
            </h2>
            <p className="text-center text-[16px] text-whiten">
              Your Account have been successfully created.
              <br />
              kindly check your email for verification.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SuccessfulRegistrationModal