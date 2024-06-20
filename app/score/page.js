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
    <div>
      <ScoreHeader />
      <Container>
        <p>Status: {isConnected ? "connected" : "disconnected"}</p>
        <p>Transport: {transport}</p>
        <div>
          {scoreFiles.map((file, idx) => (
            <div key={idx}>
              <img src={file.url} />
            </div>
          ))}
        </div>
        <label
          for="file-input"
          class="mb-2 font-medium flex justify-between items-center"
        >
          <button
            id="file-select-btn"
            class=" bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full transition-colors duration-300"
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
