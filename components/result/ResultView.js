"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

import styles from "../../styles/Result.module.css";
import {
  LocalPrintshopOutlined,
  PictureAsPdfOutlined,
} from "@mui/icons-material";

import ScoreCardSlider from "../../components/score/ScoreCardSlider";

import ScoreMaker from "../../lib/score";

export default function ResultPage({ isConnected, scoreArray }) {
  const epsonAuthRef = useRef();
  const scoreRef = useRef();
  const [result, setResult] = useState([]);

  useEffect(() => {
    const tmpArray = [];
    scoreArray.forEach((el) => {
      const scoreImg = ScoreMaker.run(scoreRef, el, "6/8");
      tmpArray.push(scoreImg);
    });
    setResult(
      tmpArray.map((el) => {
        return {
          url: el,
        };
      })
    );
  }, []);

  const delLIst = (index) => {
    setResult(
      result.filter((el, idx) => {
        if (idx == index) {
          return false;
        } else {
          return true;
        }
      })
    );
  };

  const handlePrint = async () => {
    const image = await fetch(imageLink).then((res) => res.blob());
    const images = [image, image];

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
      {/* 악보 */}
      <ScoreCardSlider scores={result} onDelete={delLIst} />

      <div className={styles.grid}>
        <button
          className={!isConnected ? styles.disabled : styles.blue_card}
          aria-disabled={!isConnected}
          onClick={handlePrint}
        >
          <LocalPrintshopOutlined style={{ marginRight: 0.5 }} />
          프린트하기
        </button>
        <a className={styles.grey_card} download>
          <PictureAsPdfOutlined />
          PDF로 저장하기
        </a>
      </div>
    </>
  );
}
