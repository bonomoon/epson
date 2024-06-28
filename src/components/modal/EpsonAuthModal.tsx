import LoadingSpinner from "@components/LoadingSpinner";
import { forwardRef } from "react";
import EpsonAuthUpdateModal from "./EpsonAuthUpdateModal";

interface EpsonAuthModalProps {
  isAuthLoading: boolean;
  onSubmit: (email: string) => void;
  onCancel: () => void;
}

const EpsonAuthModal = forwardRef<HTMLDialogElement, EpsonAuthModalProps>(
  (props, ref) => {
    const { isAuthLoading, onSubmit, onCancel } = props;

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const form = event.target as HTMLFormElement;
      const emailInput = form.elements.namedItem("email") as HTMLInputElement;
      onSubmit(emailInput.value);
    };

    return (
      <dialog
        ref={ref}
        className="relative bg-white backdrop:bg-black/20 backdrop:backdrop-blur-sm rounded-lg shadow"
        onClick={(event) => {
          if (typeof ref !== 'function' && event.target === ref?.current) {
            onCancel();
          }
        }}
      >
        <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
          <h3 className="text-xl font-semibold text-blue-800">EPSON CONNECT</h3>
          <button
            type="button"
            className="end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
            onClick={onCancel}
          >
            <svg
              className="w-3 h-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 14"
            >
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
        </div>
        <div className="py-5 px-8 flex flex-wrap">
          <form className="w-80" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Epson 제품에 연결된 이메일 ID
              </label>
              <input
                type="email"
                name="email"
                id="email"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="name@print.epsonconnect.com"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full mt-7 mb-12 items-center justify-center flex text-white bg-blue-600 active:bg-blue-700 focus:ring-4 focus:outline-none font-medium rounded-lg text-md px-5 py-2.5"
            >
              {isAuthLoading ? <LoadingSpinner className="w-6 h-6" /> : "인증"}
            </button>
            <div className="text-sm font-medium text-center text-gray-500">
              미등록 제품인가요?{" "}
              <a
                href="https://www.epsonconnect.com/guide/ko/html/p01.htm"
                target="_blank"
                className="text-blue-500 hover:underline"
              >
                Epson Connect 계정 연동
              </a>
            </div>
          </form>
        </div>
      </dialog>
    );
  }
);

export default EpsonAuthModal;
