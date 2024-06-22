"use-client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Container from "../Container";

export default function ScoreHeader({ className, auth }) {
  const [epsonDeviceInfo, setEpsonDeviceInfo] = useState(null);

  useEffect(() => {
    if (auth !== null) {
      fetchEpsonConnectDevice();
    }
  }, [auth]);

  const fetchEpsonConnectDevice = async () => {
    const res = await fetch(`/api/epson/devices/${auth.subject_id}`, {
      method: "GET",
      headers: {
        Authorization: `${auth.token_type} ${auth.access_token}`,
      },
    });

    const data = await res.json();

    if (res.ok) {
      console.log("Authenticated successfully", data);
      setEpsonDeviceInfo(data);
    } else {
      console.error("Authentication failed", data);
    }
  };

  return (
    <header className={`text-center sm:text-left py-2 ${className}`}>
      <Container className="flex flex-row justify-between items-center">
        <h1>
          <Link href="/">
            <img src="/logo.svg" alt="Haneum AI" className="h-8 w-auto" />
          </Link>
        </h1>
        <div className="absolute mx-auto left-0 right-0 w-1/2 text-xs">
          {epsonDeviceInfo === null ? (
            <button className="flex justify-center items-center text-xs w-full bg-slate-200 active:bg-slate-300 active:after:bg-slate-200 border border-gray-300 transform transition-colors rounded-2xl px-2 py-2 duration-300">
              <div className="absolute left-2 w-3 h-3 rounded-full bg-gray-500"></div>
              <div className="text-center">Epson Connect 연결하기</div>
            </button>
          ) : (
            <button className="flex justify-center items-center w-full bg-slate-200 active:bg-slate-300 active:after:bg-slate-200 border border-gray-300 transform transition-colors rounded-2xl px-2 py-2 duration-300">
              {epsonDeviceInfo.ec_connected ? (
                <div className="absolute left-2 w-3 h-3 rounded-full bg-green-500"></div>
              ) : (
                <div className="absolute left-2 w-3 h-3 rounded-full bg-red-500"></div>
              )}
              <div className="text-center">{`${epsonDeviceInfo.printer_name}-${epsonDeviceInfo.serial_no}`}</div>
            </button>
          )}
        </div>
        <div></div>
      </Container>
    </header>
  );
}
