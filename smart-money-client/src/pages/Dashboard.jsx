import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import {
  FiArrowDownLeft,
  FiArrowUpRight,
  FiCalendar,
  FiChevronRight,
  FiCreditCard,
  FiMenu,
  FiPlus,
  FiTarget,
  FiTrendingUp,
} from "react-icons/fi";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import Sidebar from "../components/Sidebar";

function Dashboard() {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [goals, setGoals] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ======================================================
  // FETCH DASHBOARD DATA
  // ======================================================

  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login", { replace: true });
        return;
      }

      try {
        setLoading(true);
        setError("");

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const [
          transactionsResponse,
          budgetsResponse,
          goalsResponse,
        ] = await Promise.all([
          axios.get(
            `${import.meta.env.VITE_API_URL}/transactions`,
            config
          ),

          axios.get(
            `${import.meta.env.VITE_API_URL}/budgets`,
            config
          ),

          axios.get(
            `${import.meta.env.VITE_API_URL}/goals`,
            config
          ),
        ]);

        setTransactions(
          transactionsResponse.data.transactions || []
        );

        setBudgets(
          budgetsResponse.data.budgets || []
        );

        setGoals(
          goalsResponse.data.goals || []
        );
      } catch (error) {
        console.error(
          "Dashboard fetch error:",
          error
        );

        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");

          navigate("/login", {
            replace: true,
          });

          return;
        }

        setError(
          error.response?.data?.message ||
            "Failed to load dashboard data."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  // ======================================================
  // CALCULATIONS
  // ======================================================

  const totalIncome = useMemo(() => {
    return transactions
      .filter(
        (transaction) =>
          transaction.type === "Income"
      )
      .reduce(
        (total, transaction) =>
          total + Number(transaction.amount || 0),
        0
      );
  }, [transactions]);

  const totalExpense = useMemo(() => {
    return transactions
      .filter(
        (transaction) =>
          transaction.type === "Expense"
      )
      .reduce(
        (total, transaction) =>
          total + Number(transaction.amount || 0),
        0
      );
  }, [transactions]);

  const balance = totalIncome - totalExpense;

  const savings = Math.max(balance, 0);

  const totalBudget = useMemo(() => {
    return budgets.reduce(
      (total, budget) =>
        total + Number(budget.amount || 0),
      0
    );
  }, [budgets]);

  const totalSpent = useMemo(() => {
    return budgets.reduce(
      (total, budget) =>
        total + Number(budget.spent || 0),
      0
    );
  }, [budgets]);

  const budgetPercentage =
    totalBudget > 0
      ? Math.min(
          Math.round(
            (totalSpent / totalBudget) * 100
          ),
          100
        )
      : 0;

  const currentGoal = goals[0] || null;

  const goalPercentage = currentGoal
    ? Math.min(
        Math.round(
          (Number(currentGoal.savedAmount || 0) /
            Number(currentGoal.targetAmount || 1)) *
            100
        ),
        100
      )
    : 0;

  // ======================================================
  // MONTHLY CHART
  // ======================================================

  const chartData = useMemo(() => {
    const months = [];

    const now = new Date();

    for (let i = 5; i >= 0; i--) {
      const date = new Date(
        now.getFullYear(),
        now.getMonth() - i,
        1
      );

      months.push({
        key: `${date.getFullYear()}-${String(
          date.getMonth() + 1
        ).padStart(2, "0")}`,

        month: date.toLocaleString("en-US", {
          month: "short",
        }),

        income: 0,
        expense: 0,
      });
    }

    transactions.forEach((transaction) => {
      const transactionDate = new Date(
        transaction.date
      );

      if (Number.isNaN(transactionDate.getTime())) {
        return;
      }

      const key = `${transactionDate.getFullYear()}-${String(
        transactionDate.getMonth() + 1
      ).padStart(2, "0")}`;

      const monthData = months.find(
        (item) => item.key === key
      );

      if (!monthData) {
        return;
      }

      if (transaction.type === "Income") {
        monthData.income += Number(
          transaction.amount || 0
        );
      }

      if (transaction.type === "Expense") {
        monthData.expense += Number(
          transaction.amount || 0
        );
      }
    });

    return months;
  }, [transactions]);

  // ======================================================
  // RECENT TRANSACTIONS
  // ======================================================

  const recentTransactions = useMemo(() => {
    return [...transactions]
      .sort(
        (a, b) =>
          new Date(b.date) -
          new Date(a.date)
      )
      .slice(0, 5);
  }, [transactions]);

  // ======================================================
  // FORMAT CURRENCY
  // ======================================================

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(Number(amount || 0));
  };

  // ======================================================
  // FORMAT DATE
  // ======================================================

  const formatDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // ======================================================
  // LOADING
  // ======================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F8F5]">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() =>
            setSidebarOpen(false)
          }
        />

        <main className="min-h-screen lg:ml-72">
          <div className="flex min-h-screen items-center justify-center">
            <div className="text-center">
              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#DDEBDD] border-t-[#527B5B]" />

              <p className="mt-4 text-sm font-medium text-[#718078]">
                Loading your dashboard...
              </p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ======================================================
  // MAIN UI
  // ======================================================

  return (
    <div className="min-h-screen bg-[#F7F8F5] text-[#26352B]">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() =>
          setSidebarOpen(false)
        }
      />

      <main className="min-h-screen lg:ml-72">
        {/* ==================================================
            TOP BAR
        ================================================== */}

        <header className="sticky top-0 z-30 border-b border-[#E7EBE6] bg-[#F7F8F5]/95 px-5 py-4 backdrop-blur-xl sm:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() =>
                  setSidebarOpen(true)
                }
                className="rounded-xl border border-[#E4E9E3] bg-white p-2.5 text-[#627068] shadow-sm lg:hidden"
              >
                <FiMenu size={19} />
              </button>

              <div>
                <p className="text-xs font-medium text-[#929A94]">
                  Overview
                </p>

                <h1 className="text-xl font-bold tracking-tight text-[#26352B] sm:text-2xl">
                  Dashboard
                </h1>
              </div>
            </div>

            <Link
              to="/transactions"
              className="flex items-center gap-2 rounded-2xl bg-[#527B5B] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(82,123,91,0.18)] transition hover:bg-[#466C4F]"
            >
              <FiPlus size={17} />
              <span className="hidden sm:inline">
                Add Transaction
              </span>
            </Link>
          </div>
        </header>

        <div className="px-5 py-6 sm:px-8 lg:px-10">
          {/* ==================================================
              ERROR
          ================================================== */}

          {error && (
            <div className="mb-6 rounded-2xl border border-[#F0D8D4] bg-[#FFF5F3] px-5 py-4 text-sm font-medium text-[#A65D55]">
              {error}
            </div>
          )}

          {/* ==================================================
              WELCOME
          ================================================== */}

          <section className="overflow-hidden rounded-[28px] bg-[#527B5B] p-6 text-white shadow-[0_18px_45px_rgba(82,123,91,0.16)] sm:p-8">
            <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
              <div>
                <p className="text-sm font-medium text-white/70">
                  Your financial overview
                </p>

                <h2 className="mt-2 max-w-xl text-3xl font-bold tracking-tight sm:text-4xl">
                  Stay in control of your money.
                </h2>

                <p className="mt-3 max-w-lg text-sm leading-6 text-white/75">
                  Track your spending, manage your
                  budget, and keep moving toward your
                  financial goals.
                </p>
              </div>

              <div className="rounded-3xl bg-white/10 p-5 backdrop-blur-sm">
                <p className="text-xs font-medium text-white/65">
                  Available balance
                </p>

                <p className="mt-1 text-3xl font-bold tracking-tight">
                  {formatCurrency(balance)}
                </p>

                <div className="mt-3 flex items-center gap-2 text-xs text-white/75">
                  <FiTrendingUp size={14} />
                  <span>
                    {balance >= 0
                      ? "You're on track"
                      : "Review your spending"}
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* ==================================================
              STAT CARDS
          ================================================== */}

          <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {/* Income */}
            <div className="rounded-3xl border border-[#E5EAE5] bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#E8F3E9] text-[#527B5B]">
                  <FiArrowDownLeft size={19} />
                </div>

                <span className="rounded-full bg-[#E8F3E9] px-2.5 py-1 text-[10px] font-bold text-[#527B5B]">
                  INCOME
                </span>
              </div>

              <p className="mt-5 text-xs font-medium text-[#929A94]">
                Total income
              </p>

              <p className="mt-1 text-2xl font-bold text-[#26352B]">
                {formatCurrency(totalIncome)}
              </p>
            </div>

            {/* Expense */}
            <div className="rounded-3xl border border-[#E5EAE5] bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F8ECE9] text-[#B05E55]">
                  <FiArrowUpRight size={19} />
                </div>

                <span className="rounded-full bg-[#F8ECE9] px-2.5 py-1 text-[10px] font-bold text-[#B05E55]">
                  EXPENSE
                </span>
              </div>

              <p className="mt-5 text-xs font-medium text-[#929A94]">
                Total expenses
              </p>

              <p className="mt-1 text-2xl font-bold text-[#26352B]">
                {formatCurrency(totalExpense)}
              </p>
            </div>

            {/* Savings */}
            <div className="rounded-3xl border border-[#E5EAE5] bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#EEE9F7] text-[#806BA7]">
                  <FiTrendingUp size={19} />
                </div>

                <span className="rounded-full bg-[#EEE9F7] px-2.5 py-1 text-[10px] font-bold text-[#806BA7]">
                  SAVINGS
                </span>
              </div>

              <p className="mt-5 text-xs font-medium text-[#929A94]">
                Current savings
              </p>

              <p className="mt-1 text-2xl font-bold text-[#26352B]">
                {formatCurrency(savings)}
              </p>
            </div>

            {/* Budget */}
            <div className="rounded-3xl border border-[#E5EAE5] bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#FDF0E5] text-[#C77B45]">
                  <FiCreditCard size={19} />
                </div>

                <span className="rounded-full bg-[#FDF0E5] px-2.5 py-1 text-[10px] font-bold text-[#C77B45]">
                  BUDGET
                </span>
              </div>

              <p className="mt-5 text-xs font-medium text-[#929A94]">
                Budget used
              </p>

              <p className="mt-1 text-2xl font-bold text-[#26352B]">
                {budgetPercentage}%
              </p>
            </div>
          </section>

          {/* ==================================================
              CHART + BUDGET
          ================================================== */}

          <section className="mt-6 grid gap-6 xl:grid-cols-[1.7fr_1fr]">
            {/* Chart */}
            <div className="rounded-3xl border border-[#E5EAE5] bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-[#929A94]">
                    Financial activity
                  </p>

                  <h3 className="mt-1 text-lg font-bold text-[#26352B]">
                    Income vs expenses
                  </h3>
                </div>

                <div className="flex items-center gap-3 text-[10px] font-semibold">
                  <div className="flex items-center gap-1.5 text-[#527B5B]">
                    <span className="h-2 w-2 rounded-full bg-[#527B5B]" />
                    Income
                  </div>

                  <div className="flex items-center gap-1.5 text-[#B05E55]">
                    <span className="h-2 w-2 rounded-full bg-[#B05E55]" />
                    Expense
                  </div>
                </div>
              </div>

              <div className="mt-6 h-[280px] w-full">
                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient
                        id="incomeGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor="#527B5B"
                          stopOpacity={0.2}
                        />

                        <stop
                          offset="100%"
                          stopColor="#527B5B"
                          stopOpacity={0}
                        />
                      </linearGradient>

                      <linearGradient
                        id="expenseGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor="#B05E55"
                          stopOpacity={0.16}
                        />

                        <stop
                          offset="100%"
                          stopColor="#B05E55"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>

                    <CartesianGrid
                      stroke="#EEF1ED"
                      vertical={false}
                    />

                    <XAxis
                      dataKey="month"
                      axisLine={false}
                      tickLine={false}
                      tick={{
                        fill: "#929A94",
                        fontSize: 11,
                      }}
                    />

                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{
                        fill: "#929A94",
                        fontSize: 11,
                      }}
                      tickFormatter={(value) =>
                        `₹${value}`
                      }
                    />

                    <Tooltip
                      contentStyle={{
                        borderRadius: "16px",
                        border: "1px solid #E5EAE5",
                        boxShadow:
                          "0 10px 30px rgba(38,53,43,0.08)",
                      }}
                      formatter={(value) =>
                        formatCurrency(value)
                      }
                    />

                    <Area
                      type="monotone"
                      dataKey="income"
                      stroke="#527B5B"
                      strokeWidth={2.5}
                      fill="url(#incomeGradient)"
                    />

                    <Area
                      type="monotone"
                      dataKey="expense"
                      stroke="#B05E55"
                      strokeWidth={2.5}
                      fill="url(#expenseGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Budget */}
            <div className="rounded-3xl border border-[#E5EAE5] bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-[#929A94]">
                    Monthly overview
                  </p>

                  <h3 className="mt-1 text-lg font-bold text-[#26352B]">
                    Budget
                  </h3>
                </div>

                <Link
                  to="/budget"
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F0F5F0] text-[#527B5B] transition hover:bg-[#E5EEE5]"
                >
                  <FiChevronRight size={17} />
                </Link>
              </div>

              <div className="mt-8 flex items-center justify-center">
                <div
                  className="relative flex h-40 w-40 items-center justify-center rounded-full"
                  style={{
                    background: `conic-gradient(
                      #527B5B ${budgetPercentage}%,
                      #E8EDE8 ${budgetPercentage}% 100%
                    )`,
                  }}
                >
                  <div className="flex h-32 w-32 flex-col items-center justify-center rounded-full bg-white">
                    <span className="text-3xl font-bold text-[#26352B]">
                      {budgetPercentage}%
                    </span>

                    <span className="text-[10px] font-medium text-[#929A94]">
                      used
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-7 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#7B857E]">
                    Spent
                  </span>

                  <span className="font-bold text-[#26352B]">
                    {formatCurrency(totalSpent)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#7B857E]">
                    Budget
                  </span>

                  <span className="font-bold text-[#26352B]">
                    {formatCurrency(totalBudget)}
                  </span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-[#E8EDE8]">
                  <div
                    className="h-full rounded-full bg-[#527B5B] transition-all duration-500"
                    style={{
                      width: `${budgetPercentage}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* ==================================================
              RECENT TRANSACTIONS + GOAL
          ================================================== */}

          <section className="mt-6 grid gap-6 xl:grid-cols-[1.7fr_1fr]">
            {/* Recent Transactions */}
            <div className="rounded-3xl border border-[#E5EAE5] bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-[#EEF1ED] px-5 py-5 sm:px-6">
                <div>
                  <p className="text-xs font-medium text-[#929A94]">
                    Latest activity
                  </p>

                  <h3 className="mt-1 text-lg font-bold text-[#26352B]">
                    Recent transactions
                  </h3>
                </div>

                <Link
                  to="/transactions"
                  className="flex items-center gap-1 text-xs font-bold text-[#527B5B] hover:text-[#466C4F]"
                >
                  View all
                  <FiChevronRight size={14} />
                </Link>
              </div>

              {recentTransactions.length === 0 ? (
                <div className="px-6 py-12 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F0F5F0] text-[#527B5B]">
                    <FiCreditCard size={22} />
                  </div>

                  <p className="mt-4 text-sm font-bold text-[#344239]">
                    No transactions yet
                  </p>

                  <p className="mt-1 text-xs text-[#929A94]">
                    Add your first transaction to
                    start tracking your money.
                  </p>

                  <Link
                    to="/transactions"
                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#527B5B] px-4 py-2.5 text-xs font-bold text-white"
                  >
                    <FiPlus size={14} />
                    Add transaction
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-[#EEF1ED]">
                  {recentTransactions.map(
                    (transaction) => {
                      const isIncome =
                        transaction.type ===
                        "Income";

                      return (
                        <div
                          key={transaction._id}
                          className="flex items-center justify-between gap-4 px-5 py-4 sm:px-6"
                        >
                          <div className="flex min-w-0 items-center gap-3">
                            <div
                              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                                isIncome
                                  ? "bg-[#E8F3E9] text-[#527B5B]"
                                  : "bg-[#F8ECE9] text-[#B05E55]"
                              }`}
                            >
                              {isIncome ? (
                                <FiArrowDownLeft
                                  size={17}
                                />
                              ) : (
                                <FiArrowUpRight
                                  size={17}
                                />
                              )}
                            </div>

                            <div className="min-w-0">
                              <p className="truncate text-sm font-bold text-[#344239]">
                                {transaction.title}
                              </p>

                              <div className="mt-1 flex items-center gap-2 text-[10px] text-[#929A94]">
                                <span>
                                  {
                                    transaction.category
                                  }
                                </span>

                                <span>•</span>

                                <span>
                                  {formatDate(
                                    transaction.date
                                  )}
                                </span>
                              </div>
                            </div>
                          </div>

                          <p
                            className={`shrink-0 text-sm font-bold ${
                              isIncome
                                ? "text-[#527B5B]"
                                : "text-[#B05E55]"
                            }`}
                          >
                            {isIncome ? "+" : "-"}
                            {formatCurrency(
                              transaction.amount
                            )}
                          </p>
                        </div>
                      );
                    }
                  )}
                </div>
              )}
            </div>

            {/* Goal */}
            <div className="rounded-3xl bg-[#EEE9F7] p-6 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-[#847B8E]">
                    Financial goal
                  </p>

                  <h3 className="mt-1 text-lg font-bold text-[#4A4054]">
                    Your goal
                  </h3>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#806BA7]">
                  <FiTarget size={18} />
                </div>
              </div>

              {currentGoal ? (
                <>
                  <p className="mt-8 text-xl font-bold text-[#4A4054]">
                    {currentGoal.title}
                  </p>

                  <div className="mt-5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-[#847B8E]">
                        Saved
                      </span>

                      <span className="font-bold text-[#806BA7]">
                        {goalPercentage}%
                      </span>
                    </div>

                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/70">
                      <div
                        className="h-full rounded-full bg-[#9C88C4] transition-all duration-500"
                        style={{
                          width: `${goalPercentage}%`,
                        }}
                      />
                    </div>

                    <div className="mt-3 flex items-center justify-between text-xs">
                      <span className="font-bold text-[#4A4054]">
                        {formatCurrency(
                          currentGoal.savedAmount
                        )}
                      </span>

                      <span className="text-[#847B8E]">
                        of{" "}
                        {formatCurrency(
                          currentGoal.targetAmount
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="mt-7 flex items-center gap-2 text-xs text-[#847B8E]">
                    <FiCalendar size={14} />

                    <span>
                      Deadline:{" "}
                      {formatDate(
                        currentGoal.deadline
                      )}
                    </span>
                  </div>

                  <Link
                    to="/goals"
                    className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-xs font-bold text-[#806BA7] transition hover:bg-[#F8F5FC]"
                  >
                    Manage goal
                    <FiChevronRight size={14} />
                  </Link>
                </>
              ) : (
                <div className="mt-8 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-[#806BA7]">
                    <FiTarget size={22} />
                  </div>

                  <p className="mt-4 text-sm font-bold text-[#4A4054]">
                    No goal yet
                  </p>

                  <p className="mt-1 text-xs leading-5 text-[#847B8E]">
                    Create a savings goal and start
                    building toward it.
                  </p>

                  <Link
                    to="/goals"
                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#806BA7] px-4 py-2.5 text-xs font-bold text-white"
                  >
                    <FiPlus size={14} />
                    Create goal
                  </Link>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;