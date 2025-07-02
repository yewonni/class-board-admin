export default function OverviewSection() {
  return (
    <section className="bg-white w-full rounded-md p-6 shadow-sm">
      <h2 className="font-bold text-lg mb-2">현황 요약</h2>
      <div className="flex justify-around gap-6">
        {/* 전체 수강생 */}
        <article
          className="rounded-lg p-6 text-white flex-1"
          style={{
            backgroundImage:
              "url('/images/all-students.svg'), linear-gradient(90deg, #7A5ADD 0%, #B8B8FF 100%)",
            backgroundRepeat: "no-repeat, no-repeat",
            backgroundPosition: "calc(100% - 1rem) center, center",
            backgroundSize: "55px, 100% 100%",
          }}
        >
          <h3 className="mb-2 font-semibold">전체 수강생</h3>
          <p className="text-2xl font-bold">200명</p>
        </article>

        {/* 총 강의 수 */}
        <article
          className="rounded-lg p-6 text-white flex-1"
          style={{
            backgroundImage:
              "url('/images/all-courses.svg'), linear-gradient(90deg, #5694B1 0%, #CBF3F0 100%)",
            backgroundRepeat: "no-repeat, no-repeat",
            backgroundPosition: "calc(100% - 1rem) center, center",
            backgroundSize: "55px, 100% 100%",
          }}
        >
          <h3 className="mb-2 font-semibold">총 강의 수</h3>
          <p className="text-2xl font-bold">15개</p>
        </article>

        {/* 오늘 출석률 */}
        <article
          className="rounded-lg p-6 text-white flex-1"
          style={{
            backgroundImage:
              "url('/images/today-attendance.svg'), linear-gradient(90deg, #E36B94 0%, #FDCFE8 100%)",
            backgroundRepeat: "no-repeat, no-repeat",
            backgroundPosition: "calc(100% - 1rem) center, center",
            backgroundSize: "55px, 100% 100%",
          }}
        >
          <h3 className="mb-2 font-semibold">오늘 출석률</h3>
          <p className="text-2xl font-bold">80%</p>
        </article>

        {/* 미확인 알림 수 */}
        <article
          className="rounded-lg p-6 text-white flex-1"
          style={{
            backgroundImage:
              "url('/images/unconfirmed-noti.svg'), linear-gradient(90deg, #EE6565 0%, #FFD6A5 100%)",
            backgroundRepeat: "no-repeat, no-repeat",
            backgroundPosition: "calc(100% - 1rem) center, center",
            backgroundSize: "55px, 100% 100%",
          }}
        >
          <h3 className="mb-2 font-semibold">미확인 알림 수</h3>
          <p className="text-2xl font-bold">4건</p>
        </article>
      </div>
    </section>
  );
}
