export default function LoginPage() {
  return (
    <main className="w-96   max-h-96 border border-[#A78B71] rounded-lg absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 p-6 bg-white shadow-md">
      <h1 className="text-center text-2xl font-semibold mb-4 text-[#475569]">
        Admin Login
      </h1>
      <form className="flex flex-col gap-2">
        <label htmlFor="email" className="text-sm font-semibold">
          이메일
        </label>
        <input
          id="email"
          type="email"
          placeholder="이메일을 입력해주세요"
          className="w-full border px-3 py-2 rounded mb-3 focus:outline-none"
        />

        <label htmlFor="pw" className="text-sm font-semibold">
          비밀번호
        </label>
        <input
          id="pw"
          type="password"
          placeholder="비밀번호를 입력해주세요"
          className="w-full border px-3 py-2 mt-1 rounded focus:outline-none"
        />
        {/* <p className="text-sm text-[#502222]">
          아이디 또는 비밀번호를 확인해주세요.
        </p> */}

        <button
          type="submit"
          className="mt-3 bg-[#A78B71] text-white py-2 rounded hover:bg-opacity-90"
        >
          로그인
        </button>
      </form>
    </main>
  );
}
