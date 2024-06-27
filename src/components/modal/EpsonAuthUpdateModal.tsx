import React, { forwardRef } from "react";

interface EpsonAuthUpdateModalProps {
  handleModalToggle: (ref: React.RefObject<HTMLDialogElement>, action: "showModal" | "close") => void;
  handleOpenAuthModal: () => void;
}

const EpsonAuthUpdateModal = forwardRef<HTMLDialogElement, EpsonAuthUpdateModalProps>((props, ref) => {
  const { handleModalToggle, handleOpenAuthModal } = props;

  return (
    <dialog
      ref={ref}
      className="relative bg-white backdrop:bg-black/20 backdrop:backdrop-blur-sm rounded-lg shadow"
      onClick={(event) => {
        if (event.target === ref.current) {
          handleModalToggle(ref, "close");
        }
      }}
    >
      <div className="relative p-4 w-full max-w-md max-h-full">
        <button
          type="button"
          className="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
          onClick={() => ref.current && handleModalToggle(ref, "close")}
        >
          <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
            />
          </svg>
          <span className="sr-only">Close modal</span>
        </button>
        <div className="p-4 md:p-5 text-center">
          <svg className="mx-auto mb-4 text-gray-400 w-12 h-12" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
          <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
            기존 Epson Connect 제품 연동을
            <br />
            다시 하시겠습니까?
          </h3>
          <button
            type="button"
            className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5"
            onClick={() => {
              ref.current && handleModalToggle(ref, "close");
              handleOpenAuthModal();
            }}
          >
            재인증
          </button>
          <button
            type="button"
            className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100"
            onClick={() => ref.current && handleModalToggle(ref, "close")}
          >
            취소
          </button>
        </div>
      </div>
    </dialog>
  );
});

export default EpsonAuthUpdateModal;