"use client";

import { useEffect, useState } from "react";
import { socket } from "../socket";
import ScoreHeader from "../../components/ScoreHeader";
import Container from "../../components/Container";
import ScoreCardSlider from "../../components/score/ScoreCardSlider";

export default function Score() {
  const [scoreFiles, setScoreFiles] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [transport, setTransport] = useState("N/A");

  useEffect(() => {
    if (socket.connected) {
      onConnect();
    }

    function onConnect() {
      setIsConnected(true);
      setTransport(socket.io.engine.transport.name);

      socket.io.engine.on("upgrade", (transport) => {
        setTransport(transport.name);
      });
    }

    function onDisconnect() {
      setIsConnected(false);
      setTransport("N/A");
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  const handleFileInputChange = async (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const scoreFile = {
      type: file.type,
      url: URL.createObjectURL(file),
    };

    setScoreFiles([...scoreFiles, scoreFile]);
  };

  return (
    <div className="h-full">
      <ScoreHeader className="absolute w-full z-30" />
      <div className="h-full flex flex-col pt-20">
        <Container>
          <h3 className="font-extrabold text-3xl">정간보 &rarr; 오선보</h3>
          <label className="text-gray-500">
            * 현재 단소 악보 및 오선보 변환 지원
          </label>
        </Container>
        <div className="h-full flex flex-col items-center justify-center">
          {scoreFiles.length === 0 ? (
            <Container className="flex flex-col text-center justify-center items-center gap-3">
              <div>
                <p>
                  Epson Scanner에 연결하여,
                  <br /> 자동으로 추가해보세요
                </p>
              </div>
              <button
                id="file-select-btn"
                className="w-64 bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-5 rounded-lg transition-colors duration-300"
              >
                Epson Connect 연결
              </button>
              <label htmlFor="file-input" className="w-64">
                <button
                  id="file-select-btn"
                  className="w-full bg-gray-300 hover:bg-gray-500 text-black font-bold py-3 px-5 rounded-lg transition-colors duration-300"
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
                <ScoreCardSlider scores={scoreFiles} />
              </div>
              <Container className="flex flex-row text-center justify-center items-center gap-3 mt-5 mb-10">
                <label htmlFor="file-input">
                  <button
                    id="file-select-btn"
                    className="w-full bg-gray-300 hover:bg-gray-500 text-black font-bold py-3 px-5 rounded-lg transition-colors duration-300"
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
                  id="file-select-btn"
                  className="w-56 bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-5 rounded-lg transition-colors duration-300"
                >
                  변환하기
                </button>
              </Container>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
