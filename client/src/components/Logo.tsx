import React from "react";
import Image from "next/image";

export default function Logo() {
  return (
    <Image
      src="/images/logo.svg"
      alt="클래스보드 로고"
      width={192}
      height={48}
      priority={true}
      style={{ cursor: "pointer", objectFit: "contain" }}
    />
  );
}
