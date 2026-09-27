import { useState, useEffect } from "react";

import {
  FiAlertCircle,
  FiCalendar,
  FiCheckCircle,
  FiEdit3,
  FiMenu,
  FiPieChart,
  FiPlus,
  FiTarget,
  FiTrash2,
  FiX,
} from "react-icons/fi";

import Sidebar from "../components/Sidebar";

function Budget() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    category: "Food",
    amount: "",
  });

  // ======================================================
  // CURRENT MONTH
  // ======================================================

  const currentDate = new Date();

  const currentMonthKey = `${currentDate.getFullYear()}-${String(
    currentDate.getMonth() + 1
  ).padStart(2, "0")}`;

  const currentMonthLabel = currentDate.toLocaleDateString(
    "en-US",
    {
      month: "long",
      year: "numeric",
    }
  );

  // ======================================================
  // COLORS
  // ======================================================

  const colors = [
    "#527B5B",
    "#806BA7",
    "#C77868",
    "#B9785D",
    "#668B9E",
  ];

  // ======================================================
  // GET TOKEN
  // ======================================================

  const getToken = () => {
    return localStorage.getItem("token");
  };

  // ======================================================
  // FETCH BUDGETS
  // ======================================================

  const fetchBudgets = async () => {
    try {
      setLoading(true);
      setError("");

      const token = getToken();

      if (!token) {
        setError("Please login to view your budgets.");
        return;
      }

      const response = await fetch(
`${import.meta.env.VITE_API_URL}/budgets`,   
     {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch budgets."
        );
      }

      const formattedBudgets = (data.budgets || []).map(
        (budget, index) => ({
          id: budget._id,
          category: budget.category,
          budget: Number(budget.amount || 0),
          spent: Number(budget.spent || 0),
          month: budget.month,
          color: colors[index % colors.length],
        })
      );

      setBudgets(formattedBudgets);
    } catch (error) {
      console.error("Fetch budgets error:", error);

      setError(
        error.message ||
          "Unable to load your budgets."
      );
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // LOAD BUDGETS
  // ======================================================

  useEffect(() => {
    fetchBudgets();
  }, []);

  // ======================================================
  // TOTALS
  // ======================================================

  const totalBudget = budgets.reduce(
    (sum, item) =>
      sum + Number(item.budget || 0),
    0
  );

  const totalSpent = budgets.reduce(
    (sum, item) =>
      sum + Number(item.spent || 0),
    0
  );

  const totalRemaining =
    totalBudget - totalSpent;

  const overallPercentage =
    totalBudget > 0
      ? Math.min(
          Math.round(
            (totalSpent / totalBudget) * 100
          ),
          100
        )
      : 0;

  // ======================================================
  // FORM CHANGE
  // ======================================================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ======================================================
  // ADD BUDGET
  // ======================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.amount) {
      return;
    }

    try {
      const token = getToken();

      if (!token) {
        alert("Please login first.");
        return;
      }

      const response = await fetch(
`${import.meta.env.VITE_API_URL}/budgets`,        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            category: formData.category,
            amount: Number(formData.amount),
            month: currentMonthKey,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to create budget."
        );
      }

      const newBudget = {
        id: data.budget._id,
        category: data.budget.category,
        budget: Number(data.budget.amount || 0),
        spent: Number(data.budget.spent || 0),
        month: data.budget.month,
        color:
          colors[budgets.length % colors.length],
      };

      setBudgets((prev) => [
        ...prev,
        newBudget,
      ]);

      setFormData({
        category: "Food",
        amount: "",
      });

      setShowModal(false);
    } catch (error) {
      console.error(
        "Add budget error:",
        error
      );

      alert(
        error.message ||
          "Failed to create budget."
      );
    }
  };

  // ======================================================
  // DELETE BUDGET
  // ======================================================

  const deleteBudget = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this budget?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const token = getToken();

      if (!token) {
        alert("Please login first.");
        return;
      }

      const response = await fetch(
`${import.meta.env.VITE_API_URL}/budgets/${id}`,        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to delete budget."
        );
      }

      setBudgets((prev) =>
        prev.filter(
          (budget) => budget.id !== id
        )
      );
    } catch (error) {
      console.error(
        "Delete budget error:",
        error
      );

      alert(
        error.message ||
          "Failed to delete budget."
      );
    }
  };

  // ======================================================
  // PERCENTAGE
  // ======================================================

  const getPercentage = (spent, budget) => {
    if (!budget) {
      return 0;
    }

    return Math.min(
      Math.round(
        (Number(spent || 0) /
          Number(budget || 0)) *
          100
      ),
      100
    );
  };

  // ======================================================
  // STATUS
  // ======================================================

  const getStatus = (percentage) => {
    if (percentage >= 90) {
      return {
        label: "Almost full",
        icon: FiAlertCircle,
        className:
          "bg-[#FCEADF] text-[#C77868]",
      };
    }

    if (percentage >= 70) {
      return {
        label: "Watch spending",
        icon: FiAlertCircle,
        className:
          "bg-[#F8EFE5] text-[#B9785D]",
      };
    }

    return {
      label: "On track",
      icon: FiCheckCircle,
      className:
        "bg-[#E5F0E6] text-[#527B5B]",
    };
  };

  // ======================================================
  // RENDER
  // ======================================================

  return (
    <div className="min-h-screen bg-[#F7F8F4] text-[#26352B]">

      {/* SIDEBAR */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() =>
          setSidebarOpen(false)
        }
      />

      {/* MAIN */}
      <main className="min-h-screen lg:ml-72">

        {/* HEADER */}
        <header className="sticky top-0 z-30 border-b border-[#E8ECE7] bg-[#F7F8F4]/90 backdrop-blur-xl">

          <div className="flex h-20 items-center justify-between px-5 sm:px-8 lg:px-10">

            <div className="flex items-center gap-4">

              <button
                onClick={() =>
                  setSidebarOpen(true)
                }
                className="rounded-xl border border-[#E0E6E0] bg-white p-2.5 text-[#647068] lg:hidden"
              >
                <FiMenu size={20} />
              </button>

              <div>

                <h1 className="text-xl font-bold text-[#26352B] sm:text-2xl">
                  Budget
                </h1>

                <p className="mt-1 text-xs text-[#89938B]">
                  Plan your spending and stay in control
                </p>

              </div>

            </div>

            <button
              onClick={() =>
                setShowModal(true)
              }
              className="flex items-center gap-2 rounded-xl bg-[#527B5B] px-4 py-3 text-xs font-bold text-white shadow-[0_8px_20px_rgba(82,123,91,0.18)] transition hover:bg-[#456D4E]"
            >
              <FiPlus size={16} />

              <span className="hidden sm:inline">
                Add budget
              </span>
            </button>

          </div>

        </header>

        {/* CONTENT */}
        <div className="px-5 py-7 sm:px-8 lg:px-10">

          {/* ERROR */}
          {error && (
            <div className="mb-6 rounded-2xl border border-[#F0D7CF] bg-[#FFF5F1] px-5 py-4 text-sm text-[#B75F4D]">
              {error}
            </div>
          )}

          {/* LOADING */}
          {loading ? (
            <div className="flex min-h-[400px] items-center justify-center">

              <div className="text-sm font-semibold text-[#89938B]">
                Loading your budgets...
              </div>

            </div>
          ) : (
            <>
              {/* OVERVIEW */}
              <section className="grid gap-5 xl:grid-cols-[1.4fr_1fr]">

                {/* MAIN BUDGET CARD */}
                <div className="relative overflow-hidden rounded-[30px] bg-[#304B38] p-6 text-white shadow-[0_20px_50px_rgba(48,75,56,0.15)] sm:p-8">

                  <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/5" />

                  <div className="relative z-10">

                    <div className="flex items-center justify-between">

                      <div>

                        <p className="text-xs font-semibold text-[#CAD7CD]">
                          {currentMonthLabel}
                        </p>

                        <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
                          Monthly spending budget
                        </h2>

                      </div>

                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                        <FiPieChart size={22} />
                      </div>

                    </div>

                    <div className="mt-8 grid gap-6 sm:grid-cols-3">

                      <div>

                        <p className="text-xs text-[#B9C9BC]">
                          Total budget
                        </p>

                        <p className="mt-1 text-2xl font-bold">
                          ₹
                          {totalBudget.toLocaleString(
                            "en-IN"
                          )}
                        </p>

                      </div>

                      <div>

                        <p className="text-xs text-[#B9C9BC]">
                          Spent
                        </p>

                        <p className="mt-1 text-2xl font-bold">
                          ₹
                          {totalSpent.toLocaleString(
                            "en-IN"
                          )}
                        </p>

                      </div>

                      <div>

                        <p className="text-xs text-[#B9C9BC]">
                          Remaining
                        </p>

                        <p className="mt-1 text-2xl font-bold">
                          ₹
                          {Math.max(
                            totalRemaining,
                            0
                          ).toLocaleString(
                            "en-IN"
                          )}
                        </p>

                      </div>

                    </div>

                    <div className="mt-8">

                      <div className="mb-2 flex items-center justify-between">

                        <span className="text-xs text-[#B9C9BC]">
                          Overall progress
                        </span>

                        <span className="text-sm font-bold">
                          {overallPercentage}%
                        </span>

                      </div>

                      <div className="h-3 overflow-hidden rounded-full bg-white/10">

                        <div
                          className="h-full rounded-full bg-white transition-all"
                          style={{
                            width: `${overallPercentage}%`,
                          }}
                        />

                      </div>

                    </div>

                  </div>

                </div>

                {/* INSIGHT */}
                <div className="rounded-[30px] border border-[#E2E8E2] bg-white p-6 sm:p-8">

                  <div className="flex items-center gap-3">

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EEE9F7] text-[#806BA7]">
                      <FiTarget size={20} />
                    </div>

                    <div>

                      <p className="text-xs font-semibold text-[#89938B]">
                        SmartMoney insight
                      </p>

                      <h2 className="mt-1 text-lg font-bold text-[#344239]">
                        Your spending snapshot
                      </h2>

                    </div>

                  </div>

                  <div className="mt-7 rounded-2xl bg-[#F5F8F5] p-5">

                    <p className="text-sm font-semibold leading-6 text-[#536057]">

                      You have{" "}

                      <span className="text-[#527B5B]">
                        ₹
                        {Math.max(
                          totalRemaining,
                          0
                        ).toLocaleString(
                          "en-IN"
                        )}
                      </span>{" "}

                      left in your current budgets.

                    </p>

                    <p className="mt-2 text-xs leading-5 text-[#89938B]">
                      Keep an eye on your highest spending categories and
                      try to stay within your planned limits.
                    </p>

                  </div>

                  {budgets.some(
                    (budget) =>
                      getPercentage(
                        budget.spent,
                        budget.budget
                      ) >= 90
                  ) && (
                    <div className="mt-5 flex items-center gap-3 rounded-2xl bg-[#FCEADF] p-4">

                      <FiAlertCircle
                        size={19}
                        className="shrink-0 text-[#C77868]"
                      />

                      <p className="text-xs leading-5 text-[#8A665F]">
                        One of your budgets is close to its monthly limit.
                      </p>

                    </div>
                  )}

                </div>

              </section>

              {/* CATEGORY BUDGETS */}
              <section className="mt-6 rounded-3xl border border-[#E2E8E2] bg-white p-5 sm:p-6">

                <div className="flex items-center justify-between">

                  <div>

                    <h2 className="text-lg font-bold text-[#344239]">
                      Category budgets
                    </h2>

                    <p className="mt-1 text-xs text-[#89938B]">
                      Manage how much you want to spend in each category
                    </p>

                  </div>

                  <FiCalendar
                    size={20}
                    className="text-[#89938B]"
                  />

                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">

                  {budgets.map((budget) => {

                    const percentage =
                      getPercentage(
                        budget.spent,
                        budget.budget
                      );

                    const status =
                      getStatus(percentage);

                    const StatusIcon =
                      status.icon;

                    const remaining =
                      Number(budget.budget || 0) -
                      Number(budget.spent || 0);

                    return (
                      <div
                        key={budget.id}
                        className="rounded-3xl border border-[#E7EBE7] bg-[#FBFCFA] p-5 transition hover:-translate-y-0.5 hover:border-[#D4DFD5] hover:shadow-[0_12px_30px_rgba(50,70,55,0.06)]"
                      >

                        <div className="flex items-start justify-between">

                          <div className="flex items-center gap-3">

                            <div
                              className="flex h-11 w-11 items-center justify-center rounded-xl text-white"
                              style={{
                                backgroundColor:
                                  budget.color,
                              }}
                            >
                              <FiPieChart size={18} />
                            </div>

                            <div>

                              <p className="text-sm font-bold text-[#46534B]">
                                {budget.category}
                              </p>

                              <p className="mt-0.5 text-[10px] text-[#929B94]">
                                Monthly limit
                              </p>

                            </div>

                          </div>

                          <button
                            onClick={() =>
                              deleteBudget(
                                budget.id
                              )
                            }
                            className="rounded-lg p-2 text-[#A0A8A1] transition hover:bg-[#FCEADF] hover:text-[#C77868]"
                          >
                            <FiTrash2 size={15} />
                          </button>

                        </div>

                        <div className="mt-6 flex items-end justify-between">

                          <div>

                            <p className="text-xl font-bold text-[#344239]">
                              ₹
                              {Number(
                                budget.spent || 0
                              ).toLocaleString(
                                "en-IN"
                              )}
                            </p>

                            <p className="mt-1 text-[10px] text-[#929B94]">
                              of ₹
                              {Number(
                                budget.budget || 0
                              ).toLocaleString(
                                "en-IN"
                              )}
                            </p>

                          </div>

                          <span
                            className={`rounded-full px-2.5 py-1 text-[9px] font-bold ${status.className}`}
                          >
                            {percentage}%
                          </span>

                        </div>

                        <div className="mt-5 h-2 overflow-hidden rounded-full bg-[#E8EDE8]">

                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${percentage}%`,
                              backgroundColor:
                                budget.color,
                            }}
                          />

                        </div>

                        <div className="mt-4 flex items-center justify-between">

                          <div
                            className={`flex items-center gap-1.5 text-[10px] font-semibold ${
                              percentage >= 90
                                ? "text-[#C77868]"
                                : percentage >= 70
                                ? "text-[#B9785D]"
                                : "text-[#527B5B]"
                            }`}
                          >

                            <StatusIcon size={13} />

                            {status.label}

                          </div>

                          <p className="text-[10px] text-[#929B94]">
                            ₹
                            {Math.max(
                              remaining,
                              0
                            ).toLocaleString(
                              "en-IN"
                            )}{" "}
                            left
                          </p>

                        </div>

                        {/* EDIT BUTTON */}
                        <button
                          type="button"
                          disabled
                          className="mt-5 flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-[#E0E6E0] bg-white py-2.5 text-[10px] font-bold text-[#A0A8A1]"
                        >
                          <FiEdit3 size={13} />
                          Edit budget
                        </button>

                      </div>
                    );
                  })}

                  {/* ADD CARD */}
                  <button
                    onClick={() =>
                      setShowModal(true)
                    }
                    className="flex min-h-[260px] flex-col items-center justify-center rounded-3xl border border-dashed border-[#CBD8CC] bg-[#F8FAF7] p-5 text-center transition hover:border-[#9FBAA2] hover:bg-[#F1F6F1]"
                  >

                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E5F0E6] text-[#527B5B]">
                      <FiPlus size={21} />
                    </div>

                    <p className="mt-4 text-sm font-bold text-[#526057]">
                      Create another budget
                    </p>

                    <p className="mt-1 max-w-[190px] text-[10px] leading-5 text-[#929B94]">
                      Set a spending limit for another category.
                    </p>

                  </button>

                </div>

              </section>
            </>
          )}

        </div>
      </main>

      {/* ADD BUDGET MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#26352B]/30 px-5 backdrop-blur-sm">

          <div className="w-full max-w-md rounded-[30px] border border-[#E1E7E1] bg-white p-6 shadow-[0_30px_80px_rgba(40,60,45,0.20)] sm:p-8">

            <div className="flex items-start justify-between">

              <div>

                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#719477]">
                  Monthly planning
                </p>

                <h2 className="mt-2 text-2xl font-bold text-[#26352B]">
                  Create budget
                </h2>

              </div>

              <button
                onClick={() =>
                  setShowModal(false)
                }
                className="rounded-xl bg-[#F3F6F3] p-2 text-[#78837B] hover:bg-[#EAF0EA]"
              >
                <FiX size={18} />
              </button>

            </div>

            <form
              onSubmit={handleSubmit}
              className="mt-7 space-y-5"
            >

              {/* CATEGORY */}
              <div>

                <label className="mb-2 block text-xs font-bold text-[#536057]">
                  Category
                </label>

                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-[#DDE5DD] bg-[#FCFDFC] px-4 py-3.5 text-sm outline-none focus:border-[#91B497] focus:ring-4 focus:ring-[#E7F0E8]"
                >
                  <option>Food</option>
                  <option>Shopping</option>
                  <option>Transport</option>
                  <option>Bills</option>
                  <option>Entertainment</option>
                  <option>Health</option>
                  <option>Education</option>
                  <option>Other</option>
                </select>

              </div>

              {/* AMOUNT */}
              <div>

                <label className="mb-2 block text-xs font-bold text-[#536057]">
                  Monthly budget amount
                </label>

                <input
                  name="amount"
                  type="number"
                  min="1"
                  placeholder="₹ 10,000"
                  value={formData.amount}
                  onChange={handleChange}
                  required
                  className="w-full rounded-2xl border border-[#DDE5DD] bg-[#FCFDFC] px-4 py-3.5 text-sm outline-none focus:border-[#91B497] focus:ring-4 focus:ring-[#E7F0E8]"
                />

              </div>

              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#527B5B] py-3.5 text-sm font-bold text-white shadow-[0_10px_25px_rgba(82,123,91,0.18)] transition hover:bg-[#456D4E]"
              >
                <FiPlus size={17} />
                Create budget
              </button>

            </form>

          </div>

        </div>
      )}

    </div>
  );
}

export default Budget;
