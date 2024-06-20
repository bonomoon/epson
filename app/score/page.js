"use client";

import { useEffect, useState } from "react";
import { socket } from "../socket";
import ScoreHeader from "../../components/ScoreHeader";
import Container from "../../components/Container";

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
      <Container className="h-full flex flex-col pt-20">
        <div className="mb-5">
          <h3 className="font-extrabold text-3xl">정간보 &rarr; 오선보</h3>
          <label className="text-gray-500">
            * 현재 단소 악보 및 오선보 변환 지원
          </label>
        </div>
        <div className="h-full flex flex-col items-center justify-center">
          {scoreFiles.length === 0 ? (
            <div className="flex flex-col text-center justify-center items-center gap-3">
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
              <label for="file-input" className="w-64">
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
                class="hidden"
                onChange={handleFileInputChange}
              />
            </div>
          ) : (
            <>
              <div className="h-full">
                <div className="grid grid-cols-2 gap-3">
                  {scoreFiles.map((file, idx) => (
                    <div key={idx} class="py-3 px-5 bg-slate-300 rounded-md h-52">
                      <img src={file.url} className="object-cover" />
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-row text-center justify-center items-center gap-3 mb-10">
                <label for="file-input" className="">
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
                  class="hidden"
                  onChange={handleFileInputChange}
                />
                <button
                  id="file-select-btn"
                  className="w-56 bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-5 rounded-lg transition-colors duration-300"
                >
                  변환하기
                </button>
              </div>
            </>
          )}
        </div>
      </Container>
    </div>
  );
}

function displayImages(fileList) {
  selectedImages.innerHTML = "";
  for (const file of fileList) {
    const imageWrapper = document.createElement("div");
    imageWrapper.classList.add("relative", "mx-2", "mb-2");
    const image = document.createElement("img");
    image.src = URL.createObjectURL(file);
    image.classList.add("w-32", "h-32", "object-cover", "rounded-lg");
    const removeButton = document.createElement("button");
    removeButton.innerHTML = "&times;";
    removeButton.classList.add(
      "absolute",
      "top-1",
      "right-1",
      "h-6",
      "w-6",
      "bg-gray-700",
      "text-white",
      "text-xs",
      "rounded-full",
      "flex",
      "items-center",
      "justify-center",
      "opacity-50",
      "hover:opacity-100",
      "transition-opacity",
      "focus:outline-none"
    );

    removeButton.addEventListener("click", () => {
      imageWrapper.remove();
      updateSelectedFilesCount();
    });

    imageWrapper.appendChild(image);
    imageWrapper.appendChild(removeButton);
    selectedImages.appendChild(imageWrapper);
  }
  updateSelectedFilesCount();
}

function updateSelectedFilesCount() {
  const count = selectedImages.children.length;
  if (count > 0) {
    selectedFilesCount.textContent = `${count} file${
      count === 1 ? "" : "s"
    } selected`;
  } else {
    selectedFilesCount.textContent = "";
  }
}
