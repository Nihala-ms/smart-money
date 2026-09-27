import { useEffect, useState } from "react";
import axios from "axios";

import {
  FiCalendar,
  FiFlag,
  FiMenu,
  FiPlus,
  FiTarget,
  FiTrash2,
  FiX,
  FiEdit3,
} from "react-icons/fi";

import Sidebar from "../components/Sidebar";

function Goals() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // UPDATE SAVED AMOUNT
  const [editingGoal, setEditingGoal] = useState(null);
  const [savedAmountInput, setSavedAmountInput] = useState("");
  const [updatingGoal, setUpdatingGoal] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    targetAmount: "",
    savedAmount: "",
    deadline: "",
    description: "",
  });

  // ======================================================
  // GET GOALS
  // ======================================================

  const fetchGoals = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please login again.");
        return;
      }

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/goals`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setGoals(response.data.goals || []);
    } catch (error) {
      console.error("Error fetching goals:", error);

      setError(
        error.response?.data?.message ||
          "Unable to load your goals."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  // ======================================================
  // FORM CHANGE
  // ======================================================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setError("");
  };

  // ======================================================
  // ADD GOAL
  // ======================================================

  const handleAddGoal = async (e) => {
    e.preventDefault();

    setError("");

    if (
      !formData.title ||
      !formData.targetAmount ||
      !formData.deadline
    ) {
      setError("Please fill in the required fields.");
      return;
    }

    if (
      Number(formData.targetAmount) <= 0
    ) {
      setError(
        "Target amount must be greater than 0."
      );
      return;
    }

    if (
      Number(formData.savedAmount || 0) >
      Number(formData.targetAmount)
    ) {
      setError(
        "Saved amount cannot be greater than the target amount."
      );
      return;
    }

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please login again.");
        return;
      }

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/goals`,
        {
          title: formData.title,
          targetAmount: Number(
            formData.targetAmount
          ),
          savedAmount:
            Number(formData.savedAmount) || 0,
          deadline: formData.deadline,
          description: formData.description,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setGoals((prev) => [
        response.data.goal,
        ...prev,
      ]);

      setFormData({
        title: "",
        targetAmount: "",
        savedAmount: "",
        deadline: "",
        description: "",
      });

      setShowModal(false);
      setError("");
    } catch (error) {
      console.error("Error adding goal:", error);

      setError(
        error.response?.data?.message ||
          "Unable to add goal."
      );
    }
  };

  // ======================================================
  // OPEN UPDATE MODAL
  // ======================================================

  const handleOpenUpdate = (goal) => {
    setEditingGoal(goal);

    setSavedAmountInput(
      goal.savedAmount !== undefined &&
        goal.savedAmount !== null
        ? String(goal.savedAmount)
        : ""
    );

    setError("");
  };

  // ======================================================
  // UPDATE SAVED AMOUNT
  // ======================================================

  const handleUpdateSavedAmount = async (e) => {
    e.preventDefault();

    if (!editingGoal) {
      return;
    }

    setError("");

    const savedAmount = Number(
      savedAmountInput
    );

    if (
      savedAmount < 0 ||
      Number.isNaN(savedAmount)
    ) {
      setError(
        "Please enter a valid saved amount."
      );
      return;
    }

    if (
      savedAmount >
      Number(editingGoal.targetAmount)
    ) {
      setError(
        "Saved amount cannot be greater than the target amount."
      );
      return;
    }

    try {
      setUpdatingGoal(true);

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please login again.");
        return;
      }

      // IMPORTANT:
      // Use editingGoal._id here.
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/goals/${editingGoal._id}`,
        {
          savedAmount,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log(
        "Goal updated successfully:",
        response.data
      );

      // Update the goal in the UI
      setGoals((prev) =>
        prev.map((goal) =>
          goal._id === editingGoal._id
            ? response.data.goal
            : goal
        )
      );

      // Close modal
      setEditingGoal(null);
      setSavedAmountInput("");
      setError("");
    } catch (error) {
      console.error(
        "Error updating saved amount:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to update saved amount."
      );
    } finally {
      setUpdatingGoal(false);
    }
  };

  // ======================================================
  // DELETE GOAL
  // ======================================================

  const handleDeleteGoal = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this goal?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please login again.");
        return;
      }

      // IMPORTANT:
      // Use the id received by this function.
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/goals/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setGoals((prev) =>
        prev.filter(
          (goal) => goal._id !== id
        )
      );
    } catch (error) {
      console.error(
        "Error deleting goal:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to delete goal."
      );
    }
  };

  // ======================================================
  // CALCULATIONS
  // ======================================================

  const totalTarget = goals.reduce(
    (sum, goal) =>
      sum + Number(goal.targetAmount || 0),
    0
  );

  const totalSaved = goals.reduce(
    (sum, goal) =>
      sum + Number(goal.savedAmount || 0),
    0
  );

  const overallProgress =
    totalTarget > 0
      ? Math.min(
          Math.round(
            (totalSaved / totalTarget) * 100
          ),
          100
        )
      : 0;

  const getProgress = (goal) => {
    if (!goal.targetAmount) {
      return 0;
    }

    return Math.min(
      Math.round(
        (Number(goal.savedAmount || 0) /
          Number(goal.targetAmount)) *
          100
      ),
      100
    );
  };

  const getRemainingAmount = (goal) => {
    return Math.max(
      Number(goal.targetAmount || 0) -
        Number(goal.savedAmount || 0),
      0
    );
  };

  const formatAmount = (amount) => {
    return Number(amount || 0).toLocaleString(
      "en-IN"
    );
  };

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  return (
    <div className="min-h-screen bg-[#F7F8F4] text-[#26352B]">

      {/* ==================================================
          SIDEBAR
      ================================================== */}

      <Sidebar
        isOpen={sidebarOpen}
        onClose={() =>
          setSidebarOpen(false)
        }
      />

      {/* ==================================================
          MAIN
      ================================================== */}

      <main className="min-h-screen lg:ml-72">

        {/* ==================================================
            TOP BAR
        ================================================== */}

        <div className="sticky top-0 z-30 flex items-center justify-between border-b border-[#E4E8E2] bg-[#F7F8F4]/90 px-5 py-4 backdrop-blur-md sm:px-8">

          <div className="flex items-center gap-3">

            <button
              type="button"
              onClick={() =>
                setSidebarOpen(true)
              }
              className="rounded-xl border border-[#DDE4DC] bg-white p-2.5 lg:hidden"
            >
              <FiMenu size={20} />
            </button>

            <div>
              <h1 className="text-xl font-bold sm:text-2xl">
                Savings Goals
              </h1>

              <p className="mt-1 text-sm text-[#718078]">
                Turn your plans into achievable goals.
              </p>
            </div>

          </div>

          <button
            type="button"
            onClick={() => {
              setError("");
              setShowModal(true);
            }}
            className="flex items-center gap-2 rounded-xl bg-[#6F8F79] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#5F7E69]"
          >
            <FiPlus />

            <span className="hidden sm:inline">
              Add Goal
            </span>
          </button>

        </div>

        {/* ==================================================
            CONTENT
        ================================================== */}

        <div className="p-5 sm:p-8">

          {/* ERROR */}

          {error && (
            <div className="mb-6 flex items-center justify-between rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">

              <span>{error}</span>

              <button
                type="button"
                onClick={() => setError("")}
                className="ml-4"
              >
                <FiX size={17} />
              </button>

            </div>
          )}

          {/* ==================================================
              OVERVIEW
          ================================================== */}

          <div className="mb-8 grid gap-5 md:grid-cols-3">

            <div className="rounded-3xl bg-[#DCEBDD] p-6">

              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-[#5E8068]">
                <FiTarget size={22} />
              </div>

              <p className="text-sm text-[#64766A]">
                Total Target
              </p>

              <h2 className="mt-1 text-2xl font-bold">
                ₹{formatAmount(totalTarget)}
              </h2>

            </div>

            <div className="rounded-3xl bg-[#EAE4F7] p-6">

              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-[#806FA3]">
                <FiFlag size={22} />
              </div>

              <p className="text-sm text-[#756A87]">
                Total Saved
              </p>

              <h2 className="mt-1 text-2xl font-bold">
                ₹{formatAmount(totalSaved)}
              </h2>

            </div>

            <div className="rounded-3xl bg-[#FCE8D9] p-6">

              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-[#C27E52]">
                <FiTarget size={22} />
              </div>

              <p className="text-sm text-[#8C7566]">
                Overall Progress
              </p>

              <h2 className="mt-1 text-2xl font-bold">
                {overallProgress}%
              </h2>

              <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/70">

                <div
                  className="h-full rounded-full bg-[#C98A62] transition-all duration-500"
                  style={{
                    width: `${overallProgress}%`,
                  }}
                />

              </div>

            </div>

          </div>

          {/* ==================================================
              SECTION TITLE
          ================================================== */}

          <div className="mb-5">

            <h2 className="text-xl font-bold">
              Your Goals
            </h2>

            <p className="mt-1 text-sm text-[#718078]">
              Keep saving a little every day.
            </p>

          </div>

          {/* ==================================================
              LOADING
          ================================================== */}

          {loading ? (

            <div className="rounded-3xl border border-[#E4E8E2] bg-white p-12 text-center">

              <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-[#DCEBDD] border-t-[#6F8F79]" />

              <p className="text-sm text-[#718078]">
                Loading your goals...
              </p>

            </div>

          ) : goals.length === 0 ? (

            /* EMPTY STATE */

            <div className="rounded-3xl border border-dashed border-[#CBD6CC] bg-white p-12 text-center">

              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#E8F0E8] text-[#6F8F79]">
                <FiTarget size={28} />
              </div>

              <h3 className="text-lg font-bold">
                No savings goals yet
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm text-[#718078]">
                Create your first goal and start tracking
                your progress.
              </p>

              <button
                type="button"
                onClick={() => {
                  setError("");
                  setShowModal(true);
                }}
                className="mt-5 rounded-xl bg-[#6F8F79] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#5F7E69]"
              >
                Create Your First Goal
              </button>

            </div>

          ) : (

            /* ==================================================
               GOAL CARDS
            ================================================== */

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

              {goals.map((goal) => {

                const progress =
                  getProgress(goal);

                const remaining =
                  getRemainingAmount(goal);

                return (
                  <div
                    key={goal._id}
                    className="rounded-3xl border border-[#E4E8E2] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                  >

                    {/* CARD HEADER */}

                    <div className="flex items-start justify-between gap-4">

                      <div className="flex items-center gap-3">

                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E7F0E7] text-[#6F8F79]">
                          <FiTarget size={22} />
                        </div>

                        <div>

                          <h3 className="font-bold">
                            {goal.title}
                          </h3>

                          <p className="mt-1 text-xs text-[#8A968E]">
                            Goal
                          </p>

                        </div>

                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          handleDeleteGoal(
                            goal._id
                          )
                        }
                        className="rounded-xl p-2 text-[#9AA59E] transition hover:bg-red-50 hover:text-red-500"
                        title="Delete goal"
                      >
                        <FiTrash2 size={17} />
                      </button>

                    </div>

                    {/* AMOUNTS */}

                    <div className="mt-6 flex items-end justify-between">

                      <div>

                        <p className="text-xs text-[#8A968E]">
                          Saved
                        </p>

                        <p className="mt-1 text-xl font-bold">
                          ₹
                          {formatAmount(
                            goal.savedAmount
                          )}
                        </p>

                      </div>

                      <div className="text-right">

                        <p className="text-xs text-[#8A968E]">
                          Target
                        </p>

                        <p className="mt-1 text-sm font-semibold">
                          ₹
                          {formatAmount(
                            goal.targetAmount
                          )}
                        </p>

                      </div>

                    </div>

                    {/* REMAINING */}

                    <div className="mt-3 flex items-center justify-between rounded-xl bg-[#F7F8F4] px-3 py-2">

                      <span className="text-xs text-[#7C8880]">
                        Remaining
                      </span>

                      <span className="text-xs font-bold text-[#5F7E69]">
                        ₹
                        {formatAmount(
                          remaining
                        )}
                      </span>

                    </div>

                    {/* PROGRESS */}

                    <div className="mt-5">

                      <div className="mb-2 flex justify-between text-xs">

                        <span className="text-[#718078]">
                          Progress
                        </span>

                        <span className="font-semibold text-[#5F7E69]">
                          {progress}%
                        </span>

                      </div>

                      <div className="h-2.5 overflow-hidden rounded-full bg-[#EDF0EC]">

                        <div
                          className="h-full rounded-full bg-[#6F8F79] transition-all duration-500"
                          style={{
                            width: `${progress}%`,
                          }}
                        />

                      </div>

                    </div>

                    {/* UPDATE BUTTON */}

                    <button
                      type="button"
                      onClick={() =>
                        handleOpenUpdate(goal)
                      }
                      className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-[#DDE4DC] px-4 py-2.5 text-sm font-semibold text-[#5F7E69] transition hover:bg-[#EEF3EE]"
                    >
                      <FiEdit3 size={15} />

                      Update Saved Amount
                    </button>

                    {/* DEADLINE */}

                    <div className="mt-5 flex items-center gap-2 border-t border-[#EEF1ED] pt-4 text-xs text-[#718078]">

                      <FiCalendar size={14} />

                      <span>
                        Target date:{" "}
                        <strong className="text-[#4C5B51]">
                          {formatDate(
                            goal.deadline
                          )}
                        </strong>
                      </span>

                    </div>

                    {/* DESCRIPTION */}

                    {goal.description && (
                      <p className="mt-3 text-xs leading-5 text-[#7C8880]">
                        {goal.description}
                      </p>
                    )}

                  </div>
                );
              })}

            </div>
          )}

        </div>
      </main>

      {/* ======================================================
          ADD GOAL MODAL
      ====================================================== */}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl sm:p-8">

            {/* HEADER */}

            <div className="mb-6 flex items-start justify-between">

              <div>

                <h2 className="text-xl font-bold">
                  Create New Goal
                </h2>

                <p className="mt-1 text-sm text-[#718078]">
                  Set a target and start saving.
                </p>

              </div>

              <button
                type="button"
                onClick={() =>
                  setShowModal(false)
                }
                className="rounded-xl p-2 text-[#7D8981] hover:bg-[#F1F3EF]"
              >
                <FiX size={20} />
              </button>

            </div>

            <form
              onSubmit={handleAddGoal}
              className="space-y-5"
            >

              {/* TITLE */}

              <div>

                <label className="mb-2 block text-sm font-semibold">
                  Goal Name
                </label>

                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. New Laptop"
                  className="w-full rounded-xl border border-[#DDE4DC] bg-[#FAFBF9] px-4 py-3 text-sm outline-none transition focus:border-[#6F8F79] focus:ring-2 focus:ring-[#6F8F79]/10"
                />

              </div>

              {/* AMOUNTS */}

              <div className="grid gap-4 sm:grid-cols-2">

                <div>

                  <label className="mb-2 block text-sm font-semibold">
                    Target Amount
                  </label>

                  <input
                    type="number"
                    name="targetAmount"
                    value={formData.targetAmount}
                    onChange={handleChange}
                    placeholder="50000"
                    min="0"
                    className="w-full rounded-xl border border-[#DDE4DC] bg-[#FAFBF9] px-4 py-3 text-sm outline-none focus:border-[#6F8F79] focus:ring-2 focus:ring-[#6F8F79]/10"
                  />

                </div>

                <div>

                  <label className="mb-2 block text-sm font-semibold">
                    Already Saved
                  </label>

                  <input
                    type="number"
                    name="savedAmount"
                    value={formData.savedAmount}
                    onChange={handleChange}
                    placeholder="10000"
                    min="0"
                    className="w-full rounded-xl border border-[#DDE4DC] bg-[#FAFBF9] px-4 py-3 text-sm outline-none focus:border-[#6F8F79] focus:ring-2 focus:ring-[#6F8F79]/10"
                  />

                </div>

              </div>

              {/* DEADLINE */}

              <div>

                <label className="mb-2 block text-sm font-semibold">
                  Target Date
                </label>

                <input
                  type="date"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-[#DDE4DC] bg-[#FAFBF9] px-4 py-3 text-sm outline-none focus:border-[#6F8F79] focus:ring-2 focus:ring-[#6F8F79]/10"
                />

              </div>

              {/* DESCRIPTION */}

              <div>

                <label className="mb-2 block text-sm font-semibold">
                  Description
                  <span className="ml-1 font-normal text-[#9AA59E]">
                    (optional)
                  </span>
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  placeholder="What are you saving for?"
                  className="w-full resize-none rounded-xl border border-[#DDE4DC] bg-[#FAFBF9] px-4 py-3 text-sm outline-none focus:border-[#6F8F79] focus:ring-2 focus:ring-[#6F8F79]/10"
                />

              </div>

              {/* BUTTONS */}

              <div className="flex gap-3 pt-2">

                <button
                  type="button"
                  onClick={() =>
                    setShowModal(false)
                  }
                  className="flex-1 rounded-xl border border-[#DDE4DC] px-4 py-3 text-sm font-semibold text-[#536159] hover:bg-[#F5F7F4]"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-[#6F8F79] px-4 py-3 text-sm font-semibold text-white hover:bg-[#5F7E69]"
                >
                  Add Goal
                </button>

              </div>

            </form>

          </div>
        </div>
      )}

      {/* ======================================================
          UPDATE SAVED AMOUNT MODAL
      ====================================================== */}

      {editingGoal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4">

          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl sm:p-8">

            {/* HEADER */}

            <div className="mb-6 flex items-start justify-between">

              <div>

                <h2 className="text-xl font-bold">
                  Update Savings
                </h2>

                <p className="mt-1 text-sm text-[#718078]">
                  Update how much you have saved for this goal.
                </p>

              </div>

              <button
                type="button"
                onClick={() => {
                  setEditingGoal(null);
                  setSavedAmountInput("");
                  setError("");
                }}
                className="rounded-xl p-2 text-[#7D8981] hover:bg-[#F1F3EF]"
              >
                <FiX size={20} />
              </button>

            </div>

            {/* GOAL INFO */}

            <div className="mb-5 rounded-2xl bg-[#F0F5F0] p-4">

              <p className="text-xs text-[#7B877F]">
                Goal
              </p>

              <p className="mt-1 font-bold text-[#344239]">
                {editingGoal.title}
              </p>

              <div className="mt-3 flex justify-between text-xs">

                <span className="text-[#7B877F]">
                  Target
                </span>

                <span className="font-semibold text-[#526158]">
                  ₹
                  {formatAmount(
                    editingGoal.targetAmount
                  )}
                </span>

              </div>

            </div>

            <form
              onSubmit={handleUpdateSavedAmount}
              className="space-y-5"
            >

              <div>

                <label className="mb-2 block text-sm font-semibold">
                  Current Saved Amount
                </label>

                <input
                  type="number"
                  value={savedAmountInput}
                  onChange={(e) => {
                    setSavedAmountInput(
                      e.target.value
                    );
                    setError("");
                  }}
                  min="0"
                  max={editingGoal.targetAmount}
                  placeholder="Enter saved amount"
                  autoFocus
                  className="w-full rounded-xl border border-[#DDE4DC] bg-[#FAFBF9] px-4 py-3 text-sm outline-none transition focus:border-[#6F8F79] focus:ring-2 focus:ring-[#6F8F79]/10"
                />

                <p className="mt-2 text-xs text-[#89958D]">
                  Maximum: ₹
                  {formatAmount(
                    editingGoal.targetAmount
                  )}
                </p>

              </div>

              <div className="flex gap-3">

                <button
                  type="button"
                  onClick={() => {
                    setEditingGoal(null);
                    setSavedAmountInput("");
                    setError("");
                  }}
                  className="flex-1 rounded-xl border border-[#DDE4DC] px-4 py-3 text-sm font-semibold text-[#536159] hover:bg-[#F5F7F4]"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={updatingGoal}
                  className="flex-1 rounded-xl bg-[#6F8F79] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#5F7E69] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {updatingGoal
                    ? "Updating..."
                    : "Update Savings"}
                </button>

              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}

export default Goals;
