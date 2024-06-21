"use-client";

import { useEffect } from "react";
import Link from "next/link";
import Container from "../Container";

export default function ScoreHeader({ className, auth }) {
  useEffect(() => {
    if (auth !== null) {
      fetchEpsonConnectDevice(auth);
    }
  }, [auth]);

  const fetchEpsonConnectDevice = async () => {
    const response = await fetch(`/api/epson/devices/${auth.subject_id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${auth.access_token}`,
      },
    });

    const data = await response.json();

    if (response.ok) {
      console.log("Authenticated successfully", data);
      setAuthToken(data);
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
        <button className="flex bg-slate-300 active:bg-slate-400 active:after:bg-slate-300 transform transition-colors rounded-lg px-5 py-1">
          <div>기기 연결 안됨</div>
        </button>
        <div></div>
      </Container>
    </header>
  );
}
