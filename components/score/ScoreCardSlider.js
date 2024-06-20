"use-client";

import { useState, useEffect } from "react";
import styles from "./ScoreCardSlider.module.css";

export default function ScoreCardSlider({ scores }) {
  const [active, setActive] = useState(0);

  const loadShow = () => {
    let stt = 0;
    scores.forEach((item, index) => {
      const itemElement = document.getElementById(`item-${index}`);
      if (index === active) {
        itemElement.style.transform = "none";
        itemElement.style.zIndex = 1;
        itemElement.style.filter = "none";
        itemElement.style.opacity = 1;
      } else if (index > active) {
        stt++;
        itemElement.style.transform = `translateX(${120 * stt}px) scale(${
          1 - 0.2 * stt
        }) perspective(16px) rotateY(-1deg)`;
        itemElement.style.zIndex = -stt;
        itemElement.style.filter = "blur(5px)";
        itemElement.style.opacity = stt > 2 ? 0 : 0.6;
      } else {
        stt++;
        itemElement.style.transform = `translateX(${-120 * stt}px) scale(${
          1 - 0.2 * stt
        }) perspective(16px) rotateY(1deg)`;
        itemElement.style.zIndex = -stt;
        itemElement.style.filter = "blur(5px)";
        itemElement.style.opacity = stt > 2 ? 0 : 0.6;
      }
    });
  };

  useEffect(() => {
    loadShow();
  }, [active]);

  useEffect(() => {
    setActive(scores.length - 1);
  }, [scores]);

  return (
    <div className="relative w-full h-full overflow-hidden">
      {scores.map((item, index) => (
        <div
          key={index}
          id={`item-${index}`}
          className={`absolute m-auto top-0 bottom-0 left-0 right-0 text-justify bg-white w-10/12 border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 ${styles.item}`}
        >
            <img src={item.url} className="w-full h-full object-cover rounded-lg" />
        </div>
      ))}
      {active < scores.length - 1 && (
        <button
          id="next"
          className="absolute top-1/2 right-4 text-3xl font-extrabold text-gray-600 z-40"
          onClick={() =>
            setActive(active + 1 < scores.length ? active + 1 : active)
          }
        >
          &rarr;
        </button>
      )}
      {active > 0 && (
        <button
          id="prev"
          className="absolute left-4 top-1/2 text-3xl font-extrabold text-gray-600 z-40"
          onClick={() => setActive(active - 1 >= 0 ? active - 1 : active)}
        >
          &larr;
        </button>
      )}
      <div className="absolute bottom-6 mx-auto left-0 right-0 text-center font-bold text-gray-500">
        {active + 1} / {scores.length}
      </div>
    </div>
  );
}
