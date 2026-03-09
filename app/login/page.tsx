"use client";

import LoginForm from "@/components/dashboard/LoginForm/LoginForm";
import Image from "next/image";
import "./login.css";

export default function LoginPage() {
  return (
    <div className="login-page">
      <div className="taxi-bg">
        <Image src="/car.png" alt="" className="taxi-car-bg" width={60} height={80} />
        <Image src="/car.png" alt="" className="taxi-car-bg" width={60} height={75} />
        <Image src="/car.png" alt="" className="taxi-car-bg" width={60} height={75} />
        <Image src="/car.png" alt="" className="taxi-car-bg" width={50} height={75} />
        <Image src="/car.png" alt="" className="taxi-car-bg" width={60} height={85} />
        <Image src="/car.png" alt="" className="taxi-car-bg" width={70} height={92} />
      </div>
      <div className="login-container">
        <div className="login-logo">
          <Image src="/logo.png" alt="مشوار مصر" width={200} height={100} />
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
