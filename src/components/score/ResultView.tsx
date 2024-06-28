"use client";

import { useEffect, useRef, useState } from "react";

import ScoreCardSlider from "@components/score/ScoreCardSlider";
import ScoreMaker from "@lib/score";
import { EpsonAuthToken, ScoreFile } from "@types";
import Container from "@components/Container";

interface ResultPageProps {
  authToken: EpsonAuthToken | null;
  scoreArray: any[];
}

export default function ResultPage({ scoreArray, authToken }: ResultPageProps) {
  const scoreRef = useRef<HTMLCanvasElement>(null);
  const [result, setResult] = useState<ScoreFile[]>([]);

  useEffect(() => {
    const tmpArray: string[] = [];

    scoreArray.forEach((el) => {
      const scoreImg = ScoreMaker.run(scoreRef.current, el, "6/8");
      tmpArray.push(scoreImg);
    });

    setResult(
      tmpArray.map((el) => {
        return {
          url: el,
        };
      })
    );
  }, [scoreArray]);

  const delList = (index: number) => {
    setResult(result.filter((_, idx) => idx !== index));
  };

  const handlePrint = async () => {
    if (!authToken) return;
    
    const imageLink = result[0]?.url;
    if (!imageLink) return;

    const image = await fetch(imageLink).then((res) => res.blob());

    const res = await fetch(`/api/epson/print/${authToken.subject_id}`, {
      method: "POST",
      headers: {
        Authorization: `${authToken.token_type} ${authToken.access_token}`,
      },
      body: image,
    });

    const data = await res.json();

    if (data["code"] != null) {
      alert(data);
    }
  };

  return (
    <>
      <canvas id="id" ref={scoreRef} style={{ display: "none" }}></canvas>
      <ScoreCardSlider scores={result} onDelete={delList} />
      <Container className="flex flex-row w-full text-center justify-center items-center gap-3 mt-3 mb-5">
        <label htmlFor="file-input">
          <button
            id="file-select-btn"
            className="bg-gray-300 active:bg-gray-500 active:after:bg-gray-300 text-black font-bold py-3 px-5 rounded-lg transition-colors duration-300"
          >
            다운로드
          </button>
        </label>
        <input id="file-input" type="file" multiple className="hidden" />
        <button
          className="grow bg-blue-600 active:bg-blue-700 active:after:bg-blue-600 text-white font-bold py-3 px-5 rounded-lg transition-colors duration-300"
          onClick={handlePrint}
        >
          프린트하기
        </button>
      </Container>
    </>
  );
}
