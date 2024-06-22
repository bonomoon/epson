"use client";

import { useEffect, useRef, useState } from "react";
import Container from "../../components/Container";
import ScoreCardSlider from "../../components/score/ScoreCardSlider";
import ScoreHeader from "../../components/score/ScoreHeader";

import { AddCircleOutlineOutlined, Add as AddIcon } from "@mui/icons-material";
import { useSocket } from "../../components/providers/socket-provider";
import LoadingSpinner from "../../components/LoadingSpinner";

export default function Score() {
  const { socket } = useSocket();
  const epsonAuthRef = useRef();
  const epsonAuthUpdateRef = useRef();

  const [scoreFiles, setScoreFiles] = useState([]);
  const [authToken, setAuthToken] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(false);

  useEffect(() => {
    function onEpsonConnectScan(files) {
      const newFiles = files.map((file) => {
        const byteData = atob(file.data);
        const byteArray = new Uint8Array(byteData.length).map((_, i) =>
          byteData.charCodeAt(i)
        );

        return {
          name: file.name,
          type: file.type,
          url: URL.createObjectURL(new Blob([byteArray], { type: file.type })),
        };
      });

      setScoreFiles((prevFiles) => [...prevFiles, ...newFiles]);
    }

    socket?.on("epson-scan", onEpsonConnectScan);

    return () => {
      socket?.off("epson-scan", onEpsonConnectScan);
    };
  }, [socket]);

  useEffect(() => {
    if (authToken !== null) {
      registerEpsonConnectScan();
    }
  }, [authToken]);

  const handleFileInputChange = async (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const scoreFile = {
      name: file.name,
      type: file.type,
      url: URL.createObjectURL(file),
    };

    setScoreFiles([...scoreFiles, scoreFile]);
  };

  const handleFileDelete = (index) => {
    const updatedFiles = [...scoreFiles];
    const deletedFile = updatedFiles.splice(index, 1);
    setScoreFiles(updatedFiles);
    URL.revokeObjectURL(deletedFile.url);
  };

  const handleOpenAuthModal = () => {
    epsonAuthRef.current.showModal();
  };

  const handleCloseAuthModal = () => {
    epsonAuthRef.current.close();
  };

  const handleOpenAuthUpdateModal = () => {
    epsonAuthUpdateRef.current.showModal();
  };

  const handleCloseAuthUpdateModal = () => {
    epsonAuthUpdateRef.current.close();
  };

  const handleEpsonConnectAuth = async (event) => {
    event.preventDefault();
    setIsAuthLoading(true);

    const { email } = event.target;

    const res = await fetch("/api/epson/auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email.value, password: "" }),
    });

    const data = await res.json();

    setIsAuthLoading(false);

    if (res.ok) {
      console.log("Authenticated successfully", data);
      setAuthToken(data);
      handleCloseAuthModal();
    } else {
      console.error("Authentication failed", data);
    }
  };

  const registerEpsonConnectScan = async () => {
    const res = await fetch(
      `/api/epson/devices/${authToken.subject_id}/destinations`,
      {
        method: "POST",
        headers: {
          Authorization: `${authToken.token_type} ${authToken.access_token}`,
        },
      }
    );

    const data = await res.json();

    if (res.ok) {
      console.log("Registered this destination successfully", data);
    }

    // TODO: Register에 실패하면 될 때까지 계속 등록??
  };

  const handleConvertFiles = async () => {
    const formData = new FormData();

    for (let i = 0; i < scoreFiles.length; ++i) {
      const file = scoreFiles[i];
      const res = await fetch(file.url);
      const blob = await res.blob();
      formData.append(`file-${i}`, blob, file.name);
    }

    try {
      const res = await fetch("/api/scores/convert?from=jungganbo&to=staff", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();
      console.log("Conversion result:", result);

      scoreFiles.forEach((file) => {
        URL.revokeObjectURL(file.url);
      });
    } catch (error) {
      console.error("Error converting files:", error);
    }
  };

  return (
    <div className="h-full relative">
      <ScoreHeader
        className="absolute w-full m-auto left-0 right-0 z-30"
        auth={authToken}
        onAuthClick={handleOpenAuthModal}
        onAuthUpdateClick={handleOpenAuthUpdateModal}
      />
      <div className="h-full flex flex-col pt-16">
        <Container>
          <h3 className="font-extrabold text-3xl">정간보 변환</h3>
          <label className="text-gray-500">
            * 현재 단소 악보 및 오선보 변환 지원
          </label>
        </Container>
        <div className="h-full flex flex-col items-center justify-center">
          {scoreFiles.length === 0 && authToken === null ? (
            <Container className="flex flex-col text-center justify-center items-center gap-3 mb-24">
              <div className="mb-10">
                <AddCircleOutlineOutlined
                  sx={{ fontSize: "120px" }}
                  className="text-gray-400"
                />
                <p>
                  Epson Scanner에 연결하여,
                  <br /> 자동으로 추가해보세요
                </p>
              </div>
              <button
                className="w-64 bg-blue-600 active:bg-blue-700 active:after:bg-blue-600 text-white font-bold py-3 px-5 rounded-lg transition-colors duration-300"
                onClick={handleOpenAuthModal}
              >
                Epson Connect 연결
              </button>
              <label htmlFor="file-input" className="w-64">
                <button
                  id="file-select-btn"
                  className="w-full bg-gray-300 active:bg-gray-500 active:after:bg-gray-300 text-black font-bold py-3 px-5 rounded-lg transition-colors duration-300"
                  onClick={() => document.getElementById("file-input").click()}
                >
                  파일 가져오기
                </button>
              </label>
              <input
                id="file-input"
                type="file"
                multiple
                className="hidden"
                onChange={handleFileInputChange}
              />
            </Container>
          ) : (
            <>
              <div className="w-full h-full">
                {scoreFiles.length === 0 ? (
                  <div className="flex flex-col justify-center items-center w-full h-full overflow-hidden gap-5 py-5">
                    <div
                      className={`flex items-center justify-center active:bg-gray-200 active:after:bg-inherit w-2/3 h-2/3 border-2 border-dashed border-gray-400 rounded-lg shadow`}
                      onClick={() =>
                        document.getElementById("file-input").click()
                      }
                    >
                      <AddIcon
                        sx={{ fontSize: "4rem" }}
                        className="text-gray-400"
                      />
                    </div>
                    <p className="text-sm text-center text-gray-700">
                      등록된 기기에서 스캔하면, 자동으로 추가됩니다.
                    </p>
                  </div>
                ) : (
                  <ScoreCardSlider
                    scores={scoreFiles}
                    onDelete={handleFileDelete}
                  />
                )}
              </div>
              <Container className="flex flex-row w-full text-center justify-center items-center gap-3 mt-3 mb-5">
                <label htmlFor="file-input">
                  <button
                    id="file-select-btn"
                    className="bg-gray-300 active:bg-gray-500 active:after:bg-gray-300 text-black font-bold py-3 px-5 rounded-lg transition-colors duration-300"
                    onClick={() =>
                      document.getElementById("file-input").click()
                    }
                  >
                    파일 가져오기
                  </button>
                </label>
                <input
                  id="file-input"
                  type="file"
                  multiple
                  className="hidden"
                  onChange={handleFileInputChange}
                />
                <button
                  className="grow bg-blue-600 active:bg-blue-700 active:after:bg-blue-600 text-white font-bold py-3 px-5 rounded-lg transition-colors duration-300"
                  onClick={handleConvertFiles}
                >
                  변환하기
                </button>
              </Container>
            </>
          )}
        </div>
      </div>

      <dialog
        ref={epsonAuthRef}
        className="relative bg-white backdrop:bg-black/20 backdrop:backdrop-blur-sm rounded-lg shadow"
        onClick={(event) => {
          if (event.target === epsonAuthRef.current) {
            handleCloseAuthModal();
          }
        }}
      >
        <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
          <h3 className="text-xl font-semibold text-blue-800">EPSON CONNECT</h3>
          <button
            type="button"
            className="end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
            onClick={handleCloseAuthModal}
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
          <form className="w-80" onSubmit={handleEpsonConnectAuth}>
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
              className="w-full mt-7 mb-12 items-center justify-center flex text-white bg-blue-600 active:bg-blue-700 active:after:bg-blue-600 focus:ring-4 focus:outline-none font-medium rounded-lg text-md px-5 py-2.5 text-center"
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

      <dialog
        ref={epsonAuthUpdateRef}
        tabindex="-1"
        className="relative bg-white backdrop:bg-black/20 backdrop:backdrop-blur-sm rounded-lg shadow"
        onClick={(event) => {
          if (event.target === epsonAuthUpdateRef.current) {
            handleCloseAuthUpdateModal();
          }
        }}
      >
        <div class="relative p-4 w-full max-w-md max-h-full">
          <button
            type="button"
            class="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
            onClick={handleCloseAuthUpdateModal}
          >
            <svg
              class="w-3 h-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 14"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
              />
            </svg>
            <span class="sr-only">Close modal</span>
          </button>
          <div class="p-4 md:p-5 text-center">
            <svg
              class="mx-auto mb-4 text-gray-400 w-12 h-12"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
            <h3 class="mb-5 text-lg font-normal text-base text-gray-500 dark:text-gray-400">
              기존 Epson Connect 제품 연동을<br/>다시 하시겠습니까?
            </h3>
            <button
              data-modal-hide="popup-modal"
              type="button"
              class="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center"
              onClick={() => {
                handleCloseAuthUpdateModal();
                handleOpenAuthModal();
              }}
            >
              재인증
            </button>
            <button
              data-modal-hide="popup-modal"
              type="button"
              class="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100"
              onClick={handleCloseAuthUpdateModal}
            >
              취소
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
}
