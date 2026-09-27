import { useState, useEffect, useMemo } from "react";
import axios from "axios";

import {
  FiArrowDownLeft,
  FiArrowUpRight,
  FiCalendar,
  FiEdit2,
  FiFilter,
  FiMenu,
  FiPlus,
  FiSearch,
  FiTrash2,
  FiX,
  FiCreditCard,
} from "react-icons/fi";

import { useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";

function Transactions() {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] =
    useState(false);

  const [editingTransaction, setEditingTransaction] =
    useState(null);

  const [transactionToDelete, setTransactionToDelete] =
    useState(null);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const [transactions, setTransactions] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [error, setError] = useState("");

  const emptyForm = {
    title: "",
    category: "Food",
    amount: "",
    type: "Expense",
    date: "",
    description: "",
  };

  const [formData, setFormData] = useState(emptyForm);

  // ======================================================
  // FETCH TRANSACTIONS
  // ======================================================

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login", {
          replace: true,
        });
        return;
      }

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/transactions`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTransactions(
        response.data.transactions || []
      );
    } catch (error) {
      console.error(
        "Error fetching transactions:",
        error.response?.data || error.message
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
          "Unable to load transactions."
      );
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // LOAD TRANSACTIONS
  // ======================================================

  useEffect(() => {
    fetchTransactions();
  }, []);

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
  // OPEN ADD MODAL
  // ======================================================

  const openAddModal = () => {
    setEditingTransaction(null);
    setFormData(emptyForm);
    setError("");
    setShowModal(true);
  };

  // ======================================================
  // OPEN EDIT MODAL
  // ======================================================

  const openEditModal = (transaction) => {
    setEditingTransaction(transaction);

    setFormData({
      title: transaction.title || "",
      category: transaction.category || "Food",
      amount: transaction.amount || "",
      type: transaction.type || "Expense",
      date: transaction.date
        ? new Date(transaction.date)
            .toISOString()
            .split("T")[0]
        : "",
      description: transaction.description || "",
    });

    setError("");
    setShowModal(true);
  };

  // ======================================================
  // CLOSE MODAL
  // ======================================================

  const closeModal = () => {
    if (saving) return;

    setShowModal(false);
    setEditingTransaction(null);
    setFormData(emptyForm);
  };

  // ======================================================
  // ADD / UPDATE TRANSACTION
  // ======================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (
      !formData.title.trim() ||
      !formData.amount ||
      !formData.date
    ) {
      setError(
        "Please fill in all required fields."
      );
      return;
    }

    if (Number(formData.amount) <= 0) {
      setError(
        "Amount must be greater than zero."
      );
      return;
    }

    try {
      setSaving(true);

      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login", {
          replace: true,
        });
        return;
      }

      const data = {
        type: formData.type,
        title: formData.title.trim(),
        category: formData.category,
        amount: Number(formData.amount),
        date: formData.date,
        description: formData.description.trim(),
      };

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };

      // UPDATE
      if (editingTransaction) {
        const response = await axios.put(
          `${import.meta.env.VITE_API_URL}/transactions/${editingTransaction._id}`,
          data,
          config
        );

        setTransactions((prev) =>
          prev.map((transaction) =>
            transaction._id ===
            editingTransaction._id
              ? response.data.transaction
              : transaction
          )
        );
      }

      // ADD
      else {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/transactions`,
          data,
          config
        );

        setTransactions((prev) => [
          response.data.transaction,
          ...prev,
        ]);
      }

      setFormData(emptyForm);
      setEditingTransaction(null);
      setShowModal(false);
    } catch (error) {
      console.error(
        "Transaction save error:",
        error.response?.data || error.message
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
          "Failed to save transaction."
      );
    } finally {
      setSaving(false);
    }
  };

  // ======================================================
  // OPEN DELETE CONFIRMATION
  // ======================================================

  const openDeleteModal = (transaction) => {
    setTransactionToDelete(transaction);
    setShowDeleteModal(true);
  };

  // ======================================================
  // DELETE TRANSACTION
  // ======================================================

  const handleDelete = async () => {
    if (!transactionToDelete) return;

    try {
      setDeleting(true);

      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login", {
          replace: true,
        });
        return;
      }

      await axios.delete(
        `${import.meta.env.VITE_API_URL}/transactions/${transactionToDelete._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTransactions((prev) =>
        prev.filter(
          (transaction) =>
            transaction._id !==
            transactionToDelete._id
        )
      );

      setTransactionToDelete(null);
      setShowDeleteModal(false);
    } catch (error) {
      console.error(
        "Delete transaction error:",
        error.response?.data || error.message
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
          "Failed to delete transaction."
      );

      setShowDeleteModal(false);
    } finally {
      setDeleting(false);
    }
  };

  // ======================================================
  // SEARCH + FILTER
  // ======================================================

  const filteredTransactions = useMemo(() => {
    return [...transactions]
      .sort(
        (a, b) =>
          new Date(b.date) -
          new Date(a.date)
      )
      .filter((transaction) => {
        const searchText =
          search.toLowerCase().trim();

        const matchesSearch =
          transaction.title
            ?.toLowerCase()
            .includes(searchText) ||
          transaction.category
            ?.toLowerCase()
            .includes(searchText) ||
          transaction.description
            ?.toLowerCase()
            .includes(searchText);

        const matchesFilter =
          filter === "All" ||
          transaction.type === filter;

        return (
          matchesSearch &&
          matchesFilter
        );
      });
  }, [transactions, search, filter]);

  // ======================================================
  // TOTAL INCOME
  // ======================================================

  const totalIncome = useMemo(() => {
    return transactions
      .filter(
        (item) => item.type === "Income"
      )
      .reduce(
        (sum, item) =>
          sum + Number(item.amount || 0),
        0
      );
  }, [transactions]);

  // ======================================================
  // TOTAL EXPENSE
  // ======================================================

  const totalExpense = useMemo(() => {
    return transactions
      .filter(
        (item) => item.type === "Expense"
      )
      .reduce(
        (sum, item) =>
          sum + Number(item.amount || 0),
        0
      );
  }, [transactions]);

  // ======================================================
  // BALANCE
  // ======================================================

  const totalBalance =
    totalIncome - totalExpense;

  // ======================================================
  // GET TRANSACTION ICON
  // ======================================================

  const getTransactionIcon = (type) => {
    return type === "Income"
      ? FiArrowDownLeft
      : FiArrowUpRight;
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
  // FORMAT MONEY
  // ======================================================

  const formatAmount = (amount) => {
    return Number(
      amount || 0
    ).toLocaleString("en-IN");
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
                type="button"
                onClick={() =>
                  setSidebarOpen(true)
                }
                className="rounded-xl border border-[#E0E6E0] bg-white p-2.5 text-[#647068] lg:hidden"
              >
                <FiMenu size={20} />
              </button>

              <div>

                <h1 className="text-xl font-bold text-[#26352B] sm:text-2xl">
                  Transactions
                </h1>

                <p className="mt-1 text-xs text-[#89938B]">
                  Track and manage your money activity
                </p>

              </div>

            </div>

            <button
              type="button"
              onClick={openAddModal}
              className="flex items-center gap-2 rounded-xl bg-[#527B5B] px-4 py-3 text-xs font-bold text-white shadow-[0_8px_20px_rgba(82,123,91,0.18)] transition hover:bg-[#456D4E]"
            >
              <FiPlus size={16} />

              <span className="hidden sm:inline">
                Add transaction
              </span>
            </button>

          </div>

        </header>

        {/* CONTENT */}

        <div className="px-5 py-7 sm:px-8 lg:px-10">

          {/* ERROR */}

          {error && (
            <div className="mb-6 flex items-center justify-between gap-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">

              <span>{error}</span>

              <button
                type="button"
                onClick={() => setError("")}
                className="shrink-0"
              >
                <FiX size={16} />
              </button>

            </div>
          )}

          {/* SUMMARY */}

          <section className="grid gap-4 sm:grid-cols-3">

            {/* INCOME */}

            <div className="rounded-3xl border border-[#E2E8E2] bg-white p-5">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E5F0E6] text-[#527B5B]">
                <FiArrowDownLeft size={18} />
              </div>

              <p className="mt-4 text-xs text-[#89938B]">
                Total Income
              </p>

              <p className="mt-1 text-2xl font-bold text-[#344239]">
                ₹{formatAmount(totalIncome)}
              </p>

            </div>

            {/* EXPENSE */}

            <div className="rounded-3xl border border-[#E2E8E2] bg-white p-5">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FCEADF] text-[#C77868]">
                <FiArrowUpRight size={18} />
              </div>

              <p className="mt-4 text-xs text-[#89938B]">
                Total Expenses
              </p>

              <p className="mt-1 text-2xl font-bold text-[#344239]">
                ₹{formatAmount(totalExpense)}
              </p>

            </div>

            {/* BALANCE */}

            <div className="rounded-3xl border border-[#E2E8E2] bg-white p-5">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EEE9F7] text-[#806BA7]">
                <FiArrowDownLeft size={18} />
              </div>

              <p className="mt-4 text-xs text-[#89938B]">
                Net Balance
              </p>

              <p
                className={`mt-1 text-2xl font-bold ${
                  totalBalance < 0
                    ? "text-[#C77868]"
                    : "text-[#344239]"
                }`}
              >
                {totalBalance < 0
                  ? "-"
                  : ""}
                ₹
                {formatAmount(
                  Math.abs(totalBalance)
                )}
              </p>

            </div>

          </section>

          {/* TRANSACTION LIST */}

          <section className="mt-6 rounded-3xl border border-[#E2E8E2] bg-white p-5 sm:p-6">

            {/* TOOLBAR */}

            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

              <div>

                <h2 className="text-lg font-bold text-[#344239]">
                  All transactions
                </h2>

                <p className="mt-1 text-xs text-[#89938B]">
                  {filteredTransactions.length}{" "}
                  transactions found
                </p>

              </div>

              <div className="flex flex-col gap-3 sm:flex-row">

                {/* SEARCH */}

                <div className="relative">

                  <FiSearch
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9AA39D]"
                  />

                  <input
                    type="text"
                    placeholder="Search transactions..."
                    value={search}
                    onChange={(e) =>
                      setSearch(e.target.value)
                    }
                    className="w-full rounded-xl border border-[#E0E6E0] bg-[#FBFCFA] py-2.5 pl-10 pr-4 text-xs outline-none focus:border-[#9BB89F] focus:ring-4 focus:ring-[#E7F0E8] sm:w-56"
                  />

                </div>

                {/* FILTER */}

                <div className="flex items-center gap-2 rounded-xl border border-[#E0E6E0] bg-[#FBFCFA] px-3">

                  <FiFilter
                    size={15}
                    className="text-[#89938B]"
                  />

                  <select
                    value={filter}
                    onChange={(e) =>
                      setFilter(e.target.value)
                    }
                    className="bg-transparent py-2.5 text-xs font-semibold text-[#59655D] outline-none"
                  >
                    <option value="All">
                      All
                    </option>

                    <option value="Income">
                      Income
                    </option>

                    <option value="Expense">
                      Expense
                    </option>
                  </select>

                </div>

              </div>

            </div>

            {/* LIST */}

            <div className="mt-6 space-y-3">

              {loading ? (

                <div className="py-16 text-center">

                  <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-[#DCEBDD] border-t-[#527B5B]" />

                  <p className="text-sm font-semibold text-[#68746C]">
                    Loading transactions...
                  </p>

                </div>

              ) : filteredTransactions.length > 0 ? (

                filteredTransactions.map(
                  (transaction) => {

                    const Icon =
                      getTransactionIcon(
                        transaction.type
                      );

                    return (
                      <div
                        key={transaction._id}
                        className="flex flex-col gap-4 rounded-2xl border border-[#EDF0ED] bg-[#FBFCFA] p-4 transition hover:border-[#D9E4DA] hover:bg-[#F6F9F6] sm:flex-row sm:items-center sm:justify-between"
                      >

                        <div className="flex items-center gap-3">

                          <div
                            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                              transaction.type ===
                              "Income"
                                ? "bg-[#E5F0E6] text-[#527B5B]"
                                : "bg-[#FCEADF] text-[#C77868]"
                            }`}
                          >
                            <Icon size={19} />
                          </div>

                          <div>

                            <p className="text-sm font-bold text-[#46534B]">
                              {transaction.title}
                            </p>

                            <p className="mt-1 text-[11px] text-[#929B94]">
                              {transaction.category}
                              {" • "}
                              {formatDate(
                                transaction.date
                              )}
                            </p>

                          </div>

                        </div>

                        <div className="flex items-center justify-between gap-3 sm:justify-end">

                          <span
                            className={`rounded-full px-3 py-1 text-[10px] font-bold ${
                              transaction.type ===
                              "Income"
                                ? "bg-[#E5F0E6] text-[#527B5B]"
                                : "bg-[#FCEADF] text-[#C77868]"
                            }`}
                          >
                            {transaction.type}
                          </span>

                          <p
                            className={`min-w-[100px] text-right text-sm font-bold ${
                              transaction.type ===
                              "Income"
                                ? "text-[#527B5B]"
                                : "text-[#C77868]"
                            }`}
                          >
                            {transaction.type ===
                            "Income"
                              ? "+"
                              : "-"}{" "}
                            ₹
                            {formatAmount(
                              transaction.amount
                            )}
                          </p>

                          {/* EDIT */}

                          <button
                            type="button"
                            onClick={() =>
                              openEditModal(
                                transaction
                              )
                            }
                            className="rounded-xl border border-[#E0E6E0] bg-white p-2 text-[#718078] transition hover:border-[#BFD2C2] hover:bg-[#EEF4EF] hover:text-[#527B5B]"
                            title="Edit transaction"
                          >
                            <FiEdit2 size={15} />
                          </button>

                          {/* DELETE */}

                          <button
                            type="button"
                            onClick={() =>
                              openDeleteModal(
                                transaction
                              )
                            }
                            className="rounded-xl border border-[#E0E6E0] bg-white p-2 text-[#718078] transition hover:border-[#EBC9C4] hover:bg-[#FFF1EF] hover:text-[#C77868]"
                            title="Delete transaction"
                          >
                            <FiTrash2 size={15} />
                          </button>

                        </div>

                      </div>
                    );
                  }
                )

              ) : (

                <div className="py-16 text-center">

                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EEF3EE] text-[#78927E]">
                    <FiCreditCard size={20} />
                  </div>

                  <p className="mt-4 text-sm font-semibold text-[#68746C]">
                    No transactions found
                  </p>

                  <p className="mt-1 text-xs text-[#9AA39D]">
                    {search ||
                    filter !== "All"
                      ? "Try changing your search or filter."
                      : "Add your first transaction to get started."}
                  </p>

                </div>

              )}

            </div>

          </section>

        </div>

      </main>

      {/* ==================================================
          ADD / EDIT TRANSACTION MODAL
      ================================================== */}

      {showModal && (

        <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-[#26352B]/30 px-5 py-8 backdrop-blur-sm">

          <div className="w-full max-w-lg rounded-[30px] border border-[#E1E7E1] bg-white p-6 shadow-[0_30px_80px_rgba(40,60,45,0.20)] sm:p-8">

            <div className="flex items-start justify-between">

              <div>

                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#719477]">
                  Money activity
                </p>

                <h2 className="mt-2 text-2xl font-bold text-[#26352B]">
                  {editingTransaction
                    ? "Edit transaction"
                    : "Add transaction"}
                </h2>

              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={saving}
                className="rounded-xl bg-[#F3F6F3] p-2 text-[#78837B] hover:bg-[#EAF0EA] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <FiX size={18} />
              </button>

            </div>

            <form
              onSubmit={handleSubmit}
              className="mt-7 space-y-5"
            >

              {/* FORM ERROR */}

              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-600">
                  {error}
                </div>
              )}

              {/* TITLE */}

              <div>

                <label className="mb-2 block text-xs font-bold text-[#536057]">
                  Transaction name
                </label>

                <input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Grocery shopping"
                  required
                  className="w-full rounded-2xl border border-[#DDE5DD] bg-[#FCFDFC] px-4 py-3.5 text-sm outline-none focus:border-[#91B497] focus:ring-4 focus:ring-[#E7F0E8]"
                />

              </div>

              {/* TYPE + CATEGORY */}

              <div className="grid gap-4 sm:grid-cols-2">

                <div>

                  <label className="mb-2 block text-xs font-bold text-[#536057]">
                    Type
                  </label>

                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-[#DDE5DD] bg-[#FCFDFC] px-4 py-3.5 text-sm outline-none focus:border-[#91B497]"
                  >
                    <option value="Expense">
                      Expense
                    </option>

                    <option value="Income">
                      Income
                    </option>
                  </select>

                </div>

                <div>

                  <label className="mb-2 block text-xs font-bold text-[#536057]">
                    Category
                  </label>

                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-[#DDE5DD] bg-[#FCFDFC] px-4 py-3.5 text-sm outline-none focus:border-[#91B497]"
                  >
                    <option>Food</option>
                    <option>Shopping</option>
                    <option>Transport</option>
                    <option>Bills</option>
                    <option>Health</option>
                    <option>Entertainment</option>
                    <option>Education</option>
                    <option>Salary</option>
                    <option>Freelance</option>
                    <option>Other</option>
                  </select>

                </div>

              </div>

              {/* AMOUNT + DATE */}

              <div className="grid gap-4 sm:grid-cols-2">

                <div>

                  <label className="mb-2 block text-xs font-bold text-[#536057]">
                    Amount
                  </label>

                  <input
                    name="amount"
                    type="number"
                    min="1"
                    value={formData.amount}
                    onChange={handleChange}
                    placeholder="₹ 0"
                    required
                    className="w-full rounded-2xl border border-[#DDE5DD] bg-[#FCFDFC] px-4 py-3.5 text-sm outline-none focus:border-[#91B497] focus:ring-4 focus:ring-[#E7F0E8]"
                  />

                </div>

                <div>

                  <label className="mb-2 block text-xs font-bold text-[#536057]">
                    Date
                  </label>

                  <div className="relative">

                    <FiCalendar
                      size={16}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9AA39D]"
                    />

                    <input
                      name="date"
                      type="date"
                      value={formData.date}
                      onChange={handleChange}
                      required
                      className="w-full rounded-2xl border border-[#DDE5DD] bg-[#FCFDFC] py-3.5 pl-11 pr-4 text-sm outline-none focus:border-[#91B497] focus:ring-4 focus:ring-[#E7F0E8]"
                    />

                  </div>

                </div>

              </div>

              {/* DESCRIPTION */}

              <div>

                <label className="mb-2 block text-xs font-bold text-[#536057]">
                  Description
                  <span className="ml-1 font-normal text-[#9AA39D]">
                    (optional)
                  </span>
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Add a note..."
                  rows="3"
                  className="w-full resize-none rounded-2xl border border-[#DDE5DD] bg-[#FCFDFC] px-4 py-3.5 text-sm outline-none focus:border-[#91B497] focus:ring-4 focus:ring-[#E7F0E8]"
                />

              </div>

              {/* BUTTON */}

              <button
                type="submit"
                disabled={saving}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#527B5B] py-3.5 text-sm font-bold text-white shadow-[0_10px_25px_rgba(82,123,91,0.18)] transition hover:bg-[#456D4E] disabled:cursor-not-allowed disabled:opacity-60"
              >

                {saving ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Saving...
                  </>
                ) : (
                  <>
                    <FiPlus size={17} />

                    {editingTransaction
                      ? "Save changes"
                      : "Add transaction"}
                  </>
                )}

              </button>

            </form>

          </div>

        </div>

      )}

      {/* ==================================================
          DELETE CONFIRMATION
      ================================================== */}

      {showDeleteModal &&
        transactionToDelete && (

          <div className="fixed inset-0 z-[110] flex items-center justify-center bg-[#26352B]/30 px-5 backdrop-blur-sm">

            <div className="w-full max-w-md rounded-[30px] border border-[#E1E7E1] bg-white p-7 shadow-[0_30px_80px_rgba(40,60,45,0.20)]">

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFF0ED] text-[#C77868]">
                <FiTrash2 size={20} />
              </div>

              <h2 className="mt-5 text-xl font-bold text-[#26352B]">
                Delete transaction?
              </h2>

              <p className="mt-2 text-sm leading-6 text-[#78837B]">
                Are you sure you want to delete{" "}
                <span className="font-semibold text-[#4B584F]">
                  "{transactionToDelete.title}"
                </span>
                ? This action cannot be undone.
              </p>

              <div className="mt-7 flex gap-3">

                <button
                  type="button"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setTransactionToDelete(null);
                  }}
                  disabled={deleting}
                  className="flex-1 rounded-2xl border border-[#DDE5DD] bg-white py-3 text-sm font-bold text-[#68746C] transition hover:bg-[#F5F7F4]"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[#C77868] py-3 text-sm font-bold text-white transition hover:bg-[#B76658] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {deleting ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <FiTrash2 size={16} />
                      Delete
                    </>
                  )}
                </button>

              </div>

            </div>

          </div>

        )}

    </div>
  );
}

export default Transactions;
