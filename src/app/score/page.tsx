"use client";

import { useEffect, useRef, useState } from "react";
import Container from "@components/Container";
import ScoreCardSlider from "@components/score/ScoreCardSlider";
import ScoreHeader from "@components/score/ScoreHeader";
import ProcessView from "@components/process/ProcessView";
import ResultView from "@components/result/ResultView";

import { AddCircleOutlineOutlined, Add as AddIcon } from "@mui/icons-material";
import { useSocket } from "@components/providers/socket-provider";
import EpsonAuthModal from "@components/modal/EpsonAuthModal";
import EpsonAuthUpdateModal from "@components/modal/EpsonAuthUpdateModal";

export default function Score() {
  const { socket } = useSocket();
  const epsonAuthRef = useRef<HTMLDialogElement>(null);
  const epsonAuthUpdateRef = useRef<HTMLDialogElement>(null);

  const [scoreFiles, setScoreFiles] = useState<ScoreFile[]>([]);
  const [authToken, setAuthToken] = useState<AuthToken | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(false);
  const [scoreArray, setScoreArray] = useState<any[][]>([[]]);
  const [progress, setProgress] = useState<number | null>(null);

  // 0: score, 1: process, 2: result
  const [status, setStatus] = useState<Status>(0);

  useEffect(() => {
    const onEpsonConnectScan = (files: any[]) => {
      const newFiles = files.map((file) => {
        const byteData = atob(file.data);
        const byteArray = Uint8Array.from(byteData, (char) =>
          char.charCodeAt(0)
        );

        return {
          name: file.name,
          type: file.type,
          url: URL.createObjectURL(new Blob([byteArray], { type: file.type })),
        };
      });

      setScoreFiles((prevFiles) => [...prevFiles, ...newFiles]);
    };

    socket?.on("epson-scan", onEpsonConnectScan);
    return () => {
      socket?.off("epson-scan", onEpsonConnectScan);
    };
  }, [socket]);

  useEffect(() => {
    if (authToken) {
      registerEpsonConnectScan();
    }
  }, [authToken]);

  const handleFileInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(event.target.files || []).map((file) => ({
      name: file.name,
      type: file.type,
      url: URL.createObjectURL(file),
    }));

    setScoreFiles((prevFiles) => [...prevFiles, ...files]);
  };

  const handleFileDelete = (index: number) => {
    setScoreFiles((prevFiles) => {
      const updatedFiles = [...prevFiles];
      URL.revokeObjectURL(updatedFiles[index].url);
      updatedFiles.splice(index, 1);
      return updatedFiles;
    });
  };

  const handleModalToggle = (
    ref: React.RefObject<HTMLDialogElement>,
    action: "showModal" | "close"
  ) => {
    if (ref.current) {
      ref.current[action]();
    }
  };

  const handleEpsonConnectAuth = async (email: string) => {
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
      setAuthToken(data);
      handleModalToggle(epsonAuthRef, "close");
    } else {
      console.error("Authentication failed", data);
    }
  };

  const registerEpsonConnectScan = async () => {
    if (!authToken) return;

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

    if (!res.ok) {
      console.error("Failed to register destination", data);
    }
  };

  const handleConvertFiles = async () => {
    setProgress(0);
    setStatus(1);

    const tmpArray: any[] = [];

    for (let i = 0; i < scoreFiles.length; ++i) {
      const formData = new FormData();
      const file = scoreFiles[i];
      const res = await fetch(file.url);
      const blob = await res.blob();

      formData.append("file", blob, file.name);

      try {
        const result = await fetch("http://219.250.98.46:8000/upload-image/", {
          method: "POST",
          body: formData,
        }).then((res) => res.json());

        tmpArray.push(result.notes);
      } catch (error) {
        console.error("Error converting files:", error);
      }
      setProgress((prevProgress) => (prevProgress || 0) + 1);
    }

    setScoreArray(tmpArray);
    setStatus(2);
  };

  return (
    <div className="h-full relative">
      <ScoreHeader
        className="absolute w-full m-auto left-0 right-0 z-30"
        auth={authToken}
        onAuthClick={() => handleModalToggle(epsonAuthRef, "showModal")}
        onAuthUpdateClick={() =>
          handleModalToggle(epsonAuthUpdateRef, "showModal")
        }
      />
      <div className="h-full flex flex-col pt-16">
        <Container>
          <h3 className="font-extrabold text-3xl">정간보 변환</h3>
          <label className="text-gray-500">
            * 현재 단소 악보 및 오선보 변환 지원
          </label>
        </Container>
        {status === 0 && (
          <div className="h-full flex flex-col items-center justify-center">
            {scoreFiles.length === 0 && !authToken ? (
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
                  onClick={() => handleModalToggle(epsonAuthRef, "showModal")}
                >
                  Epson Connect 연결
                </button>
                <label htmlFor="file-input" className="w-64">
                  <button
                    id="file-select-btn"
                    className="w-full bg-gray-300 active:bg-gray-500 active:after:bg-gray-300 text-black font-bold py-3 px-5 rounded-lg transition-colors duration-300"
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
        )}

        {status === 1 && (
          <Container className="flex flex-col text-center justify-center items-center gap-3 mb-24 h-full">
            <ProcessView length={scoreFiles.length} progress={progress} />
          </Container>
        )}

        {status === 2 && (
          <ResultView isConnected={authToken != null} scoreArray={scoreArray} />
        )}
      </div>

      <EpsonAuthModal
        ref={epsonAuthRef}
        isAuthLoading={isAuthLoading}
        onEpsonConnect={handleEpsonConnectAuth}
      />

      <EpsonAuthUpdateModal
        ref={epsonAuthUpdateRef}
        onCancel={}
      />
    </div>
  );
}
