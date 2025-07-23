"use client";
import React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/api/auth/login";
import { useAuthStore } from "@/store/useAuthStore";
import { useLoadingStore } from "@/store/useLoadingStore";
import { AxiosError } from "axios";
export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const isLoading = useLoadingStore((state) => state.isLoading);
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(false);
      const response = await login(email, password);
      const accessToken = response.data.accessToken;
      setAccessToken(accessToken);
      router.push("/dashboard");
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      setError(true);

      const message =
        error.response?.data?.message || "로그인 중 문제가 발생했습니다.";
      setErrorMessage(message);
    }
  };

  return (
    <main className="w-96   max-h-96 border border-[#A78B71] rounded-lg absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 p-6 bg-white shadow-md">
      <h1 className="text-center text-2xl font-semibold mb-4 text-[#475569]">
        Admin Login
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <label htmlFor="email" className="text-sm font-semibold">
          이메일
        </label>
        <input
          id="email"
          type="email"
          placeholder="이메일을 입력해주세요"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border px-3 py-2 rounded mb-3 focus:outline-none"
          required
        />

        <label htmlFor="pw" className="text-sm font-semibold">
          비밀번호
        </label>
        <input
          id="pw"
          type="password"
          placeholder="비밀번호를 입력해주세요"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border px-3 py-2 mt-1 rounded focus:outline-none"
          required
        />
        {error && <p className="text-sm text-[#502222]">{errorMessage}</p>}

        <button
          type="submit"
          disabled={isLoading}
          className={`mt-3 py-2 rounded text-white transition-colors ${
            isLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#A78B71] hover:bg-opacity-90"
          }`}
        >
          {isLoading ? "로그인 중..." : "로그인"}
        </button>
      </form>
    </main>
  );
}
