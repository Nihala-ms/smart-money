import {
  FiArrowRight,
  FiBarChart2,
  FiCheck,
  FiChevronRight,
  FiCreditCard,
  FiShield,
  FiTarget,
  FiTrendingUp,
} from "react-icons/fi";

import { Link, useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  const handleExplore = () => {
    const token = localStorage.getItem("token");

    if (token) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen overflow-hidden bg-[#FCFCFA] text-[#18231D]">
      {/* ================= NAVBAR ================= */}
      <header className="relative z-20 border-b border-[#E8EDE8] bg-[#FCFCFA]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-10">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#DDEBDD]">
              <div className="flex h-6 w-6 items-end gap-[3px]">
                <span className="h-3 w-1.5 rounded-full bg-[#5D8B68]" />
                <span className="h-5 w-1.5 rounded-full bg-[#5D8B68]" />
                <span className="h-4 w-1.5 rounded-full bg-[#9BB89F]" />
              </div>
            </div>

            <div>
              <p className="text-lg font-bold tracking-tight text-[#24342A]">
                SmartMoney
              </p>

              <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-[#8B978E]">
                Money made simple
              </p>
            </div>
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden items-center gap-8 md:flex">
            <a
              href="#features"
              className="text-sm font-medium text-[#68736C] transition hover:text-[#4F7A5A]"
            >
              Features
            </a>

            <a
              href="#how-it-works"
              className="text-sm font-medium text-[#68736C] transition hover:text-[#4F7A5A]"
            >
              How it works
            </a>

            <a
              href="#about"
              className="text-sm font-medium text-[#68736C] transition hover:text-[#4F7A5A]"
            >
              About
            </a>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">

            <Link
              to="/login"
              className="hidden rounded-xl px-4 py-2.5 text-sm font-semibold text-[#526057] transition hover:bg-[#F0F4F0] sm:block"
            >
              Log in
            </Link>

            <Link
              to="/register"
              className="rounded-xl bg-[#527B5B] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_8px_25px_rgba(82,123,91,0.20)] transition hover:-translate-y-0.5 hover:bg-[#456D4E]"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* ================= HERO ================= */}
      <main>
        <section className="relative">

          {/* Decorative shapes */}
          <div className="pointer-events-none absolute left-[-100px] top-20 h-72 w-72 rounded-full bg-[#E7F0E5] blur-3xl" />

          <div className="pointer-events-none absolute right-[-120px] top-32 h-80 w-80 rounded-full bg-[#EEE9F8] blur-3xl" />

          <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 pb-24 pt-16 sm:px-8 lg:grid-cols-2 lg:px-10 lg:pb-28 lg:pt-24">

            {/* Left content */}
            <div>

              {/* Small badge */}
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#DCE8DD] bg-white px-4 py-2 shadow-sm">
                <span className="h-2 w-2 rounded-full bg-[#78A77E]" />

                <span className="text-xs font-semibold tracking-wide text-[#58715E]">
                  A calmer way to manage money
                </span>
              </div>

              <h1 className="max-w-2xl text-5xl font-bold leading-[1.05] tracking-[-0.04em] text-[#1E2A22] sm:text-6xl lg:text-[68px]">
                Your money.
                <br />

                <span className="text-[#5D8B68]">
                  Your plans.
                </span>

                <br />

                Your future.
              </h1>

              <p className="mt-7 max-w-xl text-base leading-8 text-[#6D776F] sm:text-lg">
                SmartMoney helps you understand your spending, create better
                budgets, track your goals, and feel more confident about every
                financial decision.
              </p>

              {/* Buttons */}
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">

                <Link
                  to="/register"
                  className="group flex items-center justify-center gap-3 rounded-2xl bg-[#527B5B] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(82,123,91,0.22)] transition hover:-translate-y-1 hover:bg-[#456D4E]"
                >
                  Start managing your money

                  <FiArrowRight
                    size={17}
                    className="transition group-hover:translate-x-1"
                  />
                </Link>

                <button
                  type="button"
                  onClick={handleExplore}
                  className="flex items-center justify-center gap-2 rounded-2xl border border-[#DDE4DD] bg-white px-6 py-3.5 text-sm font-semibold text-[#536158] shadow-sm transition hover:-translate-y-1 hover:border-[#BFD2C1] hover:bg-[#F8FBF8]"
                >
                  Explore SmartMoney

                  <FiChevronRight size={16} />
                </button>
              </div>

              {/* Trust points */}
              <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3">

                <div className="flex items-center gap-2 text-sm text-[#778178]">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#E4F0E5] text-[#5D8B68]">
                    <FiCheck size={12} />
                  </span>

                  Simple to use
                </div>

                <div className="flex items-center gap-2 text-sm text-[#778178]">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#EEE9F8] text-[#806BA7]">
                    <FiCheck size={12} />
                  </span>

                  Private & secure
                </div>

                <div className="flex items-center gap-2 text-sm text-[#778178]">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#FCE9DE] text-[#C17B55]">
                    <FiCheck size={12} />
                  </span>

                  Built for you
                </div>
              </div>
            </div>

            {/* ================= DASHBOARD PREVIEW ================= */}
            <div className="relative mx-auto w-full max-w-xl lg:ml-auto">

              {/* Main card */}
              <div className="relative rounded-[32px] border border-[#E2E8E2] bg-white p-5 shadow-[0_30px_80px_rgba(51,73,57,0.12)] sm:p-7">

                {/* Top row */}
                <div className="flex items-center justify-between">

                  <div>
                    <p className="text-xs font-medium text-[#909A92]">
                      Total balance
                    </p>

                    <h2 className="mt-1 text-3xl font-bold tracking-tight text-[#25342A]">
                      ₹52,450
                    </h2>

                    <div className="mt-2 flex items-center gap-2">
                      <span className="rounded-full bg-[#E4F0E5] px-2.5 py-1 text-[11px] font-semibold text-[#5D8B68]">
                        +8.4%
                      </span>

                      <span className="text-xs text-[#919B93]">
                        this month
                      </span>
                    </div>
                  </div>

                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E6F0E6] text-[#5D8B68]">
                    <FiBarChart2 size={22} />
                  </div>
                </div>

                {/* Chart */}
                <div className="mt-8 rounded-2xl bg-[#FAFBF9] p-4">

                  <div className="mb-4 flex items-center justify-between">
                    <p className="text-xs font-semibold text-[#657067]">
                      Spending overview
                    </p>

                    <span className="rounded-lg bg-white px-2.5 py-1 text-[10px] font-medium text-[#7E8881] shadow-sm">
                      Last 6 months
                    </span>
                  </div>

                  <div className="h-44 w-full">
                    <svg
                      viewBox="0 0 500 180"
                      className="h-full w-full"
                      preserveAspectRatio="none"
                    >
                      <defs>
                        <linearGradient
                          id="areaGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="0%"
                            stopColor="#9CBD9F"
                            stopOpacity="0.35"
                          />

                          <stop
                            offset="100%"
                            stopColor="#9CBD9F"
                            stopOpacity="0"
                          />
                        </linearGradient>
                      </defs>

                      <path
                        d="M0 135 C45 120 55 105 95 115 C135 125 150 80 190 92 C230 104 245 62 285 72 C325 82 345 48 375 57 C410 68 430 32 500 22 L500 180 L0 180 Z"
                        fill="url(#areaGradient)"
                      />

                      <path
                        d="M0 135 C45 120 55 105 95 115 C135 125 150 80 190 92 C230 104 245 62 285 72 C325 82 345 48 375 57 C410 68 430 32 500 22"
                        fill="none"
                        stroke="#6E9A74"
                        strokeWidth="4"
                        strokeLinecap="round"
                      />

                      <circle
                        cx="500"
                        cy="22"
                        r="6"
                        fill="#6E9A74"
                        stroke="white"
                        strokeWidth="4"
                      />
                    </svg>
                  </div>

                  <div className="mt-1 flex justify-between text-[10px] text-[#A0A8A1]">
                    <span>Apr</span>
                    <span>May</span>
                    <span>Jun</span>
                    <span>Jul</span>
                    <span>Aug</span>
                    <span>Sep</span>
                  </div>
                </div>

                {/* Income / Expense */}
                <div className="mt-5 grid grid-cols-2 gap-4">

                  <div className="rounded-2xl border border-[#E7EEE7] bg-[#FAFCFA] p-4">
                    <div className="flex items-center gap-2">
                      <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#E4F0E5] text-[#5D8B68]">
                        <FiTrendingUp size={15} />
                      </span>

                      <span className="text-xs font-medium text-[#8A938C]">
                        Income
                      </span>
                    </div>

                    <p className="mt-3 text-lg font-bold text-[#34443A]">
                      ₹35,000
                    </p>
                  </div>

                  <div className="rounded-2xl border border-[#EEE7E1] bg-[#FEFCFA] p-4">
                    <div className="flex items-center gap-2">
                      <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#FCE9DE] text-[#C17B55]">
                        <FiCreditCard size={15} />
                      </span>

                      <span className="text-xs font-medium text-[#8A938C]">
                        Expenses
                      </span>
                    </div>

                    <p className="mt-3 text-lg font-bold text-[#34443A]">
                      ₹18,750
                    </p>
                  </div>
                </div>
              </div>

              {/* Floating Goal Card */}
              <div className="absolute -bottom-8 -left-7 hidden w-52 rounded-2xl border border-[#E5EAE5] bg-white p-4 shadow-[0_18px_40px_rgba(54,74,58,0.13)] sm:block">

                <div className="flex items-center justify-between">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#EEE9F8] text-[#806BA7]">
                    <FiTarget size={17} />
                  </div>

                  <span className="text-[10px] font-semibold text-[#7E8A81]">
                    72%
                  </span>
                </div>

                <p className="mt-3 text-xs font-semibold text-[#48544C]">
                  Travel Fund
                </p>

                <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#EEEAF5]">
                  <div className="h-full w-[72%] rounded-full bg-[#9C88C4]" />
                </div>

                <p className="mt-2 text-[10px] text-[#929B94]">
                  ₹36,000 of ₹50,000
                </p>
              </div>

              {/* Floating Security Card */}
              <div className="absolute -right-5 -top-6 hidden rounded-2xl border border-[#E5EAE5] bg-white px-4 py-3 shadow-[0_18px_40px_rgba(54,74,58,0.13)] sm:block">

                <div className="flex items-center gap-3">

                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E7F0E8] text-[#5D8B68]">
                    <FiShield size={17} />
                  </div>

                  <div>
                    <p className="text-[11px] font-bold text-[#47534B]">
                      Protected
                    </p>

                    <p className="text-[9px] text-[#929A94]">
                      Your data is secure
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= FEATURES ================= */}
        <section
          id="features"
          className="border-y border-[#E9EDE9] bg-white py-24"
        >
          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">

            <div className="mx-auto max-w-2xl text-center">

              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#719477]">
                Everything in one place
              </span>

              <h2 className="mt-4 text-3xl font-bold tracking-tight text-[#26352B] sm:text-4xl">
                Make your money feel
                <span className="text-[#6B9270]">
                  {" "}simpler.
                </span>
              </h2>

              <p className="mt-4 text-sm leading-7 text-[#7A847D] sm:text-base">
                SmartMoney brings the essential tools you need to understand
                your finances without making money management complicated.
              </p>
            </div>

            <div className="mt-14 grid gap-5 md:grid-cols-3">

              {/* Feature 1 */}
              <div className="group rounded-[28px] border border-[#E5EBE5] bg-[#FBFCFA] p-7 transition duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-[0_20px_50px_rgba(64,86,68,0.08)]">

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E5F0E6] text-[#5D8B68] transition group-hover:scale-105">
                  <FiBarChart2 size={24} />
                </div>

                <h3 className="mt-6 text-xl font-bold text-[#2E3D33]">
                  Track your spending
                </h3>

                <p className="mt-3 text-sm leading-7 text-[#7A847D]">
                  See exactly where your money goes and understand your
                  spending habits with simple visual insights.
                </p>

                <button
                  type="button"
                  onClick={() => navigate("/register")}
                  className="mt-6 flex items-center gap-2 text-xs font-bold text-[#628568]"
                >
                  Smart tracking
                  <FiArrowRight size={14} />
                </button>
              </div>

              {/* Feature 2 */}
              <div className="group rounded-[28px] border border-[#E8E2F1] bg-[#FCFAFF] p-7 transition duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-[0_20px_50px_rgba(89,74,112,0.08)]">

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EEE9F7] text-[#806BA7] transition group-hover:scale-105">
                  <FiTarget size={24} />
                </div>

                <h3 className="mt-6 text-xl font-bold text-[#383044]">
                  Reach your goals
                </h3>

                <p className="mt-3 text-sm leading-7 text-[#817A89]">
                  Create meaningful financial goals and watch your progress
                  grow step by step.
                </p>

                <button
                  type="button"
                  onClick={() => navigate("/register")}
                  className="mt-6 flex items-center gap-2 text-xs font-bold text-[#806BA7]"
                >
                  Goal planning
                  <FiArrowRight size={14} />
                </button>
              </div>

              {/* Feature 3 */}
              <div className="group rounded-[28px] border border-[#F0E5DD] bg-[#FFFCFA] p-7 transition duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-[0_20px_50px_rgba(112,79,58,0.08)]">

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FCEADF] text-[#C17B55] transition group-hover:scale-105">
                  <FiTrendingUp size={24} />
                </div>

                <h3 className="mt-6 text-xl font-bold text-[#493A31]">
                  Understand your money
                </h3>

                <p className="mt-3 text-sm leading-7 text-[#877D76]">
                  Turn everyday transactions into clear insights that help
                  you make better financial decisions.
                </p>

                <button
                  type="button"
                  onClick={() => navigate("/register")}
                  className="mt-6 flex items-center gap-2 text-xs font-bold text-[#B16F4E]"
                >
                  Clear insights
                  <FiArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ================= HOW IT WORKS ================= */}
        <section
          id="how-it-works"
          className="bg-[#F5F8F4] py-24"
        >
          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">

            <div className="grid items-center gap-14 lg:grid-cols-2">

              <div>
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#719477]">
                  How it works
                </span>

                <h2 className="mt-4 max-w-xl text-3xl font-bold leading-tight tracking-tight text-[#26352B] sm:text-5xl">
                  Financial clarity,
                  <br />
                  one small step at a time.
                </h2>

                <p className="mt-5 max-w-xl text-sm leading-7 text-[#748078] sm:text-base">
                  No complicated spreadsheets. No confusing numbers. Just a
                  simple space to organize your money and build better habits.
                </p>
              </div>

              <div className="space-y-4">

                <div className="flex gap-5 rounded-3xl border border-[#E1E9E1] bg-white p-5 shadow-sm">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#E5F0E6] text-sm font-bold text-[#5D8B68]">
                    01
                  </div>

                  <div>
                    <h3 className="font-bold text-[#334239]">
                      Track
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-[#7D8780]">
                      Add your income and expenses and keep everything
                      organized.
                    </p>
                  </div>
                </div>

                <div className="flex gap-5 rounded-3xl border border-[#E8E2F0] bg-white p-5 shadow-sm">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#EEE9F7] text-sm font-bold text-[#806BA7]">
                    02
                  </div>

                  <div>
                    <h3 className="font-bold text-[#3B3347]">
                      Plan
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-[#7D8780]">
                      Set budgets and goals that match your lifestyle and
                      priorities.
                    </p>
                  </div>
                </div>

                <div className="flex gap-5 rounded-3xl border border-[#F0E4DC] bg-white p-5 shadow-sm">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#FCEADF] text-sm font-bold text-[#B97552]">
                    03
                  </div>

                  <div>
                    <h3 className="font-bold text-[#44372F]">
                      Grow
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-[#7D8780]">
                      Learn from your financial habits and move closer to your
                      goals.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= ABOUT / SECURITY ================= */}
        <section id="about" className="bg-white py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">

            <div className="overflow-hidden rounded-[36px] border border-[#E2E9E2] bg-[#F9FBF8]">

              <div className="grid items-center lg:grid-cols-2">

                <div className="p-8 sm:p-12 lg:p-16">

                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E5F0E6] text-[#5D8B68]">
                    <FiShield size={25} />
                  </div>

                  <h2 className="mt-7 text-3xl font-bold tracking-tight text-[#29382F] sm:text-4xl">
                    Your financial space,
                    <br />
                    designed with care.
                  </h2>

                  <p className="mt-5 max-w-lg text-sm leading-7 text-[#78827B] sm:text-base">
                    SmartMoney is designed to make personal finance feel less
                    stressful and more approachable. Keep your information
                    organized, understand your progress, and focus on the
                    things that matter to you.
                  </p>

                  <div className="mt-7 space-y-3">

                    <div className="flex items-center gap-3 text-sm text-[#566159]">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#E2EFE3] text-[#5D8B68]">
                        <FiCheck size={13} />
                      </span>
                      Clean and simple financial dashboard
                    </div>

                    <div className="flex items-center gap-3 text-sm text-[#566159]">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#E2EFE3] text-[#5D8B68]">
                        <FiCheck size={13} />
                      </span>
                      Easy budgeting and goal tracking
                    </div>

                    <div className="flex items-center gap-3 text-sm text-[#566159]">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#E2EFE3] text-[#5D8B68]">
                        <FiCheck size={13} />
                      </span>
                      Helpful financial insights
                    </div>
                  </div>
                </div>

                {/* Decorative visual */}
                <div className="relative hidden min-h-[430px] overflow-hidden bg-[#EAF2E9] lg:block">

                  <div className="absolute right-[-70px] top-[-80px] h-72 w-72 rounded-full bg-[#DCE9DD]" />

                  <div className="absolute bottom-[-90px] left-[-50px] h-72 w-72 rounded-full bg-[#EEE8F7]" />

                  <div className="absolute left-1/2 top-1/2 w-[330px] -translate-x-1/2 -translate-y-1/2 rounded-[28px] border border-white bg-white p-6 shadow-[0_25px_60px_rgba(57,78,61,0.12)]">

                    <div className="flex items-center justify-between">

                      <div>
                        <p className="text-xs text-[#8B948D]">
                          Savings goal
                        </p>

                        <p className="mt-1 text-2xl font-bold text-[#2F3D34]">
                          ₹75,000
                        </p>
                      </div>

                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#EEE9F7] text-[#806BA7]">
                        <FiTarget size={20} />
                      </div>
                    </div>

                    <div className="mt-7">

                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[#8A948D]">
                          Progress
                        </span>

                        <span className="font-bold text-[#65736A]">
                          68%
                        </span>
                      </div>

                      <div className="mt-2 h-3 rounded-full bg-[#ECE9F2]">
                        <div className="h-full w-[68%] rounded-full bg-[#9C88C4]" />
                      </div>
                    </div>

                    <div className="mt-7 grid grid-cols-2 gap-3">

                      <div className="rounded-2xl bg-[#F7FAF6] p-3">
                        <p className="text-[10px] text-[#939C95]">
                          Saved
                        </p>

                        <p className="mt-1 text-sm font-bold text-[#405047]">
                          ₹51,000
                        </p>
                      </div>

                      <div className="rounded-2xl bg-[#FFF9F5] p-3">
                        <p className="text-[10px] text-[#939C95]">
                          Remaining
                        </p>

                        <p className="mt-1 text-sm font-bold text-[#405047]">
                          ₹24,000
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= CTA ================= */}
        <section className="px-5 pb-24 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-7xl">

            <div className="relative overflow-hidden rounded-[36px] bg-[#304B38] px-7 py-16 text-center sm:px-12">

              <div className="absolute left-[-80px] top-[-100px] h-64 w-64 rounded-full bg-[#496953] opacity-40 blur-2xl" />

              <div className="absolute bottom-[-100px] right-[-70px] h-64 w-64 rounded-full bg-[#77698C] opacity-20 blur-2xl" />

              <div className="relative">

                <span className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#DCEBDD]">
                  Start today
                </span>

                <h2 className="mx-auto mt-6 max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-5xl">
                  A better relationship with your money starts here.
                </h2>

                <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-[#C6D3C9] sm:text-base">
                  Organize your finances, build better habits, and make
                  progress toward the life you want.
                </p>

                <Link
                  to="/register"
                  className="mt-8 inline-flex items-center gap-3 rounded-2xl bg-white px-6 py-3.5 text-sm font-bold text-[#3F6148] shadow-xl transition hover:-translate-y-1 hover:bg-[#F5F8F4]"
                >
                  Create your free account
                  <FiArrowRight size={17} />
                </Link>

              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ================= FOOTER ================= */}
      <footer className="border-t border-[#E8EDE8] bg-[#FCFCFA]">

        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-8 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-10">

          <Link to="/" className="flex items-center gap-3">

            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#DDEBDD]">
              <div className="flex items-end gap-[2px]">
                <span className="h-2.5 w-1 rounded-full bg-[#5D8B68]" />
                <span className="h-4 w-1 rounded-full bg-[#5D8B68]" />
                <span className="h-3 w-1 rounded-full bg-[#9BB89F]" />
              </div>
            </div>

            <div>
              <p className="text-sm font-bold text-[#344139]">
                SmartMoney
              </p>

              <p className="text-[9px] uppercase tracking-widest text-[#929A94]">
                Money made simple
              </p>
            </div>
          </Link>

          <p className="text-xs text-[#8A948D]">
            © 2026 SmartMoney. Built with care.
          </p>

          <div className="flex gap-5 text-xs font-medium text-[#7A857D]">

            <button
              type="button"
              onClick={() => navigate("/")}
              className="transition hover:text-[#527B5B]"
            >
              Privacy
            </button>

            <button
              type="button"
              onClick={() => navigate("/")}
              className="transition hover:text-[#527B5B]"
            >
              Terms
            </button>

            <button
              type="button"
              onClick={() => navigate("/")}
              className="transition hover:text-[#527B5B]"
            >
              Contact
            </button>

          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;
