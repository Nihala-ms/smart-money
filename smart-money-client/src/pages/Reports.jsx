import { useEffect, useMemo, useState } from "react";
import {
  FiAlertCircle,
  FiDownload,
  FiTrendingDown,
  FiTrendingUp,
  FiDollarSign,
  FiPieChart,
  FiTarget,
} from "react-icons/fi";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart as RechartsPieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import jsPDF from "jspdf";

import Sidebar from "../components/Sidebar";

const API_URL = import.meta.env.VITE_API_URL;

const CATEGORY_COLORS = [
  "#527B5B",
  "#9C88C4",
  "#E3A57D",
  "#7BA7A9",
  "#D48B8B",
  "#8DAA91",
  "#B5A0C9",
  "#D8B18E",
];

const formatCurrency = (value) => {
  return `₹${Number(value || 0).toLocaleString("en-IN")}`;
};

const formatNumber = (value) => {
  return Number(value || 0).toLocaleString("en-IN");
};

const getMonthKey = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");

  return `${year}-${month}`;
};

const getMonthLabel = (monthKey) => {
  const [year, month] = monthKey.split("-");

  const date = new Date(
    Number(year),
    Number(month) - 1,
    1
  );

  return date.toLocaleString("en-US", {
    month: "short",
  });
};

const getMonthYearLabel = (monthKey) => {
  const [year, month] = monthKey.split("-");

  const date = new Date(
    Number(year),
    Number(month) - 1,
    1
  );

  return date.toLocaleString("en-US", {
    month: "short",
    year: "numeric",
  });
};

const getLastSixMonths = () => {
  const months = [];

  const now = new Date();

  for (let i = 5; i >= 0; i--) {
    const date = new Date(
      now.getFullYear(),
      now.getMonth() - i,
      1
    );

    months.push(getMonthKey(date));
  }

  return months;
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-[#E4E9E4] bg-white px-4 py-3 shadow-lg">
      <p className="mb-2 text-xs font-bold text-[#344239]">
        {label}
      </p>

      {payload.map((item) => (
        <div
          key={item.dataKey}
          className="flex items-center justify-between gap-6 text-xs"
        >
          <span className="text-[#7A847D]">
            {item.name}
          </span>

          <span className="font-bold text-[#344239]">
            {formatCurrency(item.value)}
          </span>
        </div>
      ))}
    </div>
  );
};

function Reports() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [transactions, setTransactions] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  // --------------------------------------------------
  // FETCH TRANSACTIONS
  // --------------------------------------------------

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");

        if (!token) {
          setError("Please login to view your reports.");
          return;
        }

        const response = await fetch(
          `${API_URL}/transactions`,
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
            data.message ||
              "Failed to fetch transactions."
          );
        }

        setTransactions(data.transactions || []);
      } catch (err) {
        console.error(
          "Reports fetch error:",
          err
        );

        setError(
          err.message ||
            "Unable to load reports."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  // --------------------------------------------------
  // CURRENT / PREVIOUS MONTH
  // --------------------------------------------------

  const currentMonth = useMemo(() => {
    const now = new Date();

    return new Date(
      now.getFullYear(),
      now.getMonth(),
      1
    );
  }, []);

  const currentMonthKey = getMonthKey(
    currentMonth
  );

  const previousMonth = useMemo(() => {
    return new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() - 1,
      1
    );
  }, [currentMonth]);

  const previousMonthKey = getMonthKey(
    previousMonth
  );

  // --------------------------------------------------
  // CURRENT MONTH TRANSACTIONS
  // --------------------------------------------------

  const currentMonthTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const date = new Date(transaction.date);

      return (
        getMonthKey(date) === currentMonthKey
      );
    });
  }, [
    transactions,
    currentMonthKey,
  ]);

  const previousMonthTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const date = new Date(transaction.date);

      return (
        getMonthKey(date) === previousMonthKey
      );
    });
  }, [
    transactions,
    previousMonthKey,
  ]);

  // --------------------------------------------------
  // CURRENT MONTH INCOME
  // --------------------------------------------------

  const currentIncome = useMemo(() => {
    return currentMonthTransactions
      .filter(
        (transaction) =>
          transaction.type === "Income"
      )
      .reduce(
        (total, transaction) =>
          total +
          Number(transaction.amount || 0),
        0
      );
  }, [currentMonthTransactions]);

  // --------------------------------------------------
  // CURRENT MONTH EXPENSE
  // --------------------------------------------------

  const currentExpense = useMemo(() => {
    return currentMonthTransactions
      .filter(
        (transaction) =>
          transaction.type === "Expense"
      )
      .reduce(
        (total, transaction) =>
          total +
          Number(transaction.amount || 0),
        0
      );
  }, [currentMonthTransactions]);

  // --------------------------------------------------
  // PREVIOUS MONTH INCOME
  // --------------------------------------------------

  const previousIncome = useMemo(() => {
    return previousMonthTransactions
      .filter(
        (transaction) =>
          transaction.type === "Income"
      )
      .reduce(
        (total, transaction) =>
          total +
          Number(transaction.amount || 0),
        0
      );
  }, [previousMonthTransactions]);

  // --------------------------------------------------
  // PREVIOUS MONTH EXPENSE
  // --------------------------------------------------

  const previousExpense = useMemo(() => {
    return previousMonthTransactions
      .filter(
        (transaction) =>
          transaction.type === "Expense"
      )
      .reduce(
        (total, transaction) =>
          total +
          Number(transaction.amount || 0),
        0
      );
  }, [previousMonthTransactions]);

  // --------------------------------------------------
  // SAVINGS
  // --------------------------------------------------

  const currentSavings =
    currentIncome - currentExpense;

  const previousSavings =
    previousIncome - previousExpense;

  // --------------------------------------------------
  // PERCENTAGE CHANGE
  // --------------------------------------------------

  const calculatePercentageChange = (
    current,
    previous
  ) => {
    if (previous === 0) {
      if (current === 0) {
        return 0;
      }

      return 100;
    }

    return Math.round(
      ((current - previous) / previous) * 100
    );
  };

  const currentIncomeChange =
    calculatePercentageChange(
      currentIncome,
      previousIncome
    );

  const currentExpenseChange =
    calculatePercentageChange(
      currentExpense,
      previousExpense
    );

  const currentSavingsChange =
    calculatePercentageChange(
      currentSavings,
      previousSavings
    );

  // --------------------------------------------------
  // SAVINGS RATE
  // --------------------------------------------------

  const savingsRate =
    currentIncome > 0
      ? Math.round(
          (currentSavings / currentIncome) * 100
        )
      : 0;

  // --------------------------------------------------
  // CATEGORY EXPENSE DATA
  // --------------------------------------------------

  const categoryExpenseData = useMemo(() => {
    const categoryMap = {};

    currentMonthTransactions
      .filter(
        (transaction) =>
          transaction.type === "Expense"
      )
      .forEach((transaction) => {
        const category =
          transaction.category?.trim() ||
          "Other";

        if (!categoryMap[category]) {
          categoryMap[category] = 0;
        }

        categoryMap[category] += Number(
          transaction.amount || 0
        );
      });

    return Object.entries(categoryMap)
      .map(([name, value]) => ({
        name,
        value,
      }))
      .sort((a, b) => b.value - a.value);
  }, [currentMonthTransactions]);

  // --------------------------------------------------
  // SIX MONTH DATA
  // --------------------------------------------------

  const monthlyData = useMemo(() => {
    const months = getLastSixMonths();

    return months.map((monthKey) => {
      const monthTransactions =
        transactions.filter((transaction) => {
          const date = new Date(
            transaction.date
          );

          return (
            getMonthKey(date) === monthKey
          );
        });

      const income = monthTransactions
        .filter(
          (transaction) =>
            transaction.type === "Income"
        )
        .reduce(
          (total, transaction) =>
            total +
            Number(transaction.amount || 0),
          0
        );

      const expenses = monthTransactions
        .filter(
          (transaction) =>
            transaction.type === "Expense"
        )
        .reduce(
          (total, transaction) =>
            total +
            Number(transaction.amount || 0),
          0
        );

      const savings = income - expenses;

      const rate =
        income > 0
          ? Math.round(
              (savings / income) * 100
            )
          : 0;

      return {
        monthKey,
        month: getMonthLabel(monthKey),
        label: getMonthYearLabel(monthKey),
        income,
        expenses,
        savings,
        rate,
      };
    });
  }, [transactions]);

  // --------------------------------------------------
  // MONTH RANGE
  // --------------------------------------------------

  const monthRangeText = useMemo(() => {
    if (!monthlyData.length) {
      return "";
    }

    return `${monthlyData[0].label} - ${
      monthlyData[monthlyData.length - 1].label
    }`;
  }, [monthlyData]);

  // --------------------------------------------------
  // PDF EXPORT
  // --------------------------------------------------

  const handleExportPDF = () => {
    try {
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageWidth =
        doc.internal.pageSize.getWidth();

      const pageHeight =
        doc.internal.pageSize.getHeight();

      const margin = 18;

      const contentWidth =
        pageWidth - margin * 2;

      let y = 18;

      // ------------------------------------------------
      // PDF COLORS
      // ------------------------------------------------

      const COLORS = {
        dark: [38, 53, 43],
        green: [82, 123, 91],
        lightGreen: [239, 245, 239],
        border: [220, 227, 221],
        muted: [112, 122, 115],
        white: [255, 255, 255],
        lavender: [238, 233, 247],
        lavenderDark: [128, 107, 167],
        peach: [250, 238, 229],
        red: [176, 94, 85],
        softGray: [248, 250, 248],
      };

      // ------------------------------------------------
      // FONT HELPER
      // ------------------------------------------------

      const setFont = (
        size = 10,
        style = "normal",
        color = COLORS.dark
      ) => {
        doc.setFont(
          "helvetica",
          style
        );

        doc.setFontSize(size);

        doc.setTextColor(...color);
      };

      // ------------------------------------------------
      // CURRENCY
      // ------------------------------------------------

      const formatPDFCurrency = (value) => {
        return `INR ${Number(
          value || 0
        ).toLocaleString("en-IN")}`;
      };

      // ------------------------------------------------
      // LINE
      // ------------------------------------------------

      const drawLine = (lineY) => {
        doc.setDrawColor(
          ...COLORS.border
        );

        doc.setLineWidth(0.3);

        doc.line(
          margin,
          lineY,
          pageWidth - margin,
          lineY
        );
      };

      // ------------------------------------------------
      // FOOTER
      // ------------------------------------------------

      const drawFooter = (
        pageNumber,
        totalPages
      ) => {
        setFont(
          7.5,
          "normal",
          COLORS.muted
        );

        doc.text(
          "SmartMoney - Personal Finance Management",
          margin,
          pageHeight - 9
        );

        doc.text(
          `Page ${pageNumber} of ${totalPages}`,
          pageWidth - margin,
          pageHeight - 9,
          {
            align: "right",
          }
        );
      };

      // ------------------------------------------------
      // PAGE SPACE
      // ------------------------------------------------

      const checkPageSpace = (
        requiredHeight = 20
      ) => {
        if (
          y + requiredHeight >
          pageHeight - 20
        ) {
          doc.addPage();

          y = 20;
        }
      };

      // ------------------------------------------------
      // ROUNDED BOX
      // ------------------------------------------------

      const drawRoundedBox = (
        x,
        boxY,
        width,
        height,
        fillColor
      ) => {
        doc.setFillColor(
          ...fillColor
        );

        doc.roundedRect(
          x,
          boxY,
          width,
          height,
          4,
          4,
          "F"
        );
      };

      // ------------------------------------------------
      // SECTION TITLE
      // ------------------------------------------------

      const drawSectionTitle = (
        title,
        subtitle = ""
      ) => {
        checkPageSpace(22);

        setFont(
          13,
          "bold",
          COLORS.dark
        );

        doc.text(
          title,
          margin,
          y
        );

        y += 6;

        if (subtitle) {
          setFont(
            8.5,
            "normal",
            COLORS.muted
          );

          doc.text(
            subtitle,
            margin,
            y
          );

          y += 5;
        }

        drawLine(y);

        y += 8;
      };

      // ------------------------------------------------
      // SUMMARY CARD
      // ------------------------------------------------

      const drawSummaryCard = (
        x,
        cardY,
        width,
        title,
        value,
        accent
      ) => {
        drawRoundedBox(
          x,
          cardY,
          width,
          31,
          COLORS.lightGreen
        );

        setFont(
          8,
          "bold",
          COLORS.muted
        );

        doc.text(
          title,
          x + 7,
          cardY + 9
        );

        setFont(
          14,
          "bold",
          accent
        );

        doc.text(
          value,
          x + 7,
          cardY + 21
        );
      };

      // =================================================
      // HEADER
      // =================================================

      setFont(
        23,
        "bold",
        COLORS.dark
      );

      doc.text(
        "SmartMoney",
        margin,
        y
      );

      setFont(
        10,
        "normal",
        COLORS.green
      );

      doc.text(
        "Personal Financial Report",
        margin,
        y + 7
      );

      setFont(
        8.5,
        "normal",
        COLORS.muted
      );

      doc.text(
        `${currentMonth.toLocaleString(
          "en-US",
          {
            month: "long",
          }
        )} ${currentMonth.getFullYear()}`,
        pageWidth - margin,
        y + 2,
        {
          align: "right",
        }
      );

      doc.text(
        `Generated ${new Date().toLocaleDateString(
          "en-GB",
          {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }
        )}`,
        pageWidth - margin,
        y + 8,
        {
          align: "right",
        }
      );

      y += 18;

      drawLine(y);

      y += 12;

      // =================================================
      // FINANCIAL SUMMARY
      // =================================================

      drawSectionTitle(
        `${currentMonth.toLocaleString(
          "en-US",
          {
            month: "long",
          }
        )} Financial Summary`
      );

      const cardGap = 5;

      const cardWidth =
        (contentWidth -
          cardGap * 2) /
        3;

      drawSummaryCard(
        margin,
        y,
        cardWidth,
        "INCOME",
        formatPDFCurrency(
          currentIncome
        ),
        COLORS.green
      );

      drawSummaryCard(
        margin +
          cardWidth +
          cardGap,
        y,
        cardWidth,
        "EXPENSES",
        formatPDFCurrency(
          currentExpense
        ),
        COLORS.red
      );

      drawSummaryCard(
        margin +
          (cardWidth +
            cardGap) *
            2,
        y,
        cardWidth,
        "SAVINGS",
        formatPDFCurrency(
          currentSavings
        ),
        COLORS.lavenderDark
      );

      y += 42;

      // =================================================
      // KEY METRICS
      // =================================================

      checkPageSpace(48);

      const metricWidth =
        (contentWidth -
          cardGap) /
        2;

      drawRoundedBox(
        margin,
        y,
        metricWidth,
        39,
        COLORS.peach
      );

      setFont(
        8,
        "bold",
        COLORS.muted
      );

      doc.text(
        "SAVINGS RATE",
        margin + 7,
        y + 9
      );

      setFont(
        20,
        "bold",
        COLORS.dark
      );

      doc.text(
        `${savingsRate}%`,
        margin + 7,
        y + 23
      );

      setFont(
        7.8,
        "normal",
        COLORS.muted
      );

      doc.text(
        "of your income was saved",
        margin + 7,
        y + 32
      );

      const rightMetricX =
        margin +
        metricWidth +
        cardGap;

      drawRoundedBox(
        rightMetricX,
        y,
        metricWidth,
        39,
        COLORS.lavender
      );

      setFont(
        8,
        "bold",
        COLORS.muted
      );

      doc.text(
        "MONTHLY BALANCE",
        rightMetricX + 7,
        y + 9
      );

      setFont(
        20,
        "bold",
        COLORS.dark
      );

      doc.text(
        formatPDFCurrency(
          currentSavings
        ),
        rightMetricX + 7,
        y + 23
      );

      setFont(
        7.8,
        "normal",
        COLORS.muted
      );

      doc.text(
        "income remaining after expenses",
        rightMetricX + 7,
        y + 32
      );

      y += 51;

      // =================================================
      // MONTHLY COMPARISON
      // =================================================

      drawSectionTitle(
        "Monthly Comparison",
        "Change compared with the previous month"
      );

      const comparisonItems = [
        {
          label: "Income change",
          value: currentIncomeChange,
        },
        {
          label: "Expense change",
          value: currentExpenseChange,
        },
        {
          label: "Savings change",
          value: currentSavingsChange,
        },
      ];

      const comparisonWidth =
        contentWidth / 3;

      comparisonItems.forEach(
        (item, index) => {
          const x =
            margin +
            index *
              comparisonWidth;

          const value =
            Number(item.value || 0);

          setFont(
            8,
            "bold",
            COLORS.muted
          );

          doc.text(
            item.label,
            x,
            y
          );

          setFont(
            12,
            "bold",
            value >= 0
              ? COLORS.green
              : COLORS.red
          );

          doc.text(
            `${value >= 0 ? "+" : ""}${value}%`,
            x,
            y + 8
          );
        }
      );

      y += 22;

      // =================================================
      // SPENDING BY CATEGORY
      // =================================================

      drawSectionTitle(
        "Spending by Category",
        `Total spending: ${formatPDFCurrency(
          currentExpense
        )}`
      );

      if (
        categoryExpenseData.length >
        0
      ) {
        const categoryRowHeight = 12;

        categoryExpenseData.forEach(
          (item, index) => {
            checkPageSpace(
              categoryRowHeight + 5
            );

            const percentage =
              currentExpense > 0
                ? Math.round(
                    (Number(
                      item.value ||
                        0
                    ) /
                      currentExpense) *
                      100
                  )
                : 0;

            setFont(
              8,
              "bold",
              COLORS.muted
            );

            doc.text(
              String(
                index + 1
              ).padStart(2, "0"),
              margin,
              y
            );

            setFont(
              9.5,
              "bold",
              COLORS.dark
            );

            doc.text(
              item.name,
              margin + 10,
              y
            );

            setFont(
              8.5,
              "normal",
              COLORS.muted
            );

            doc.text(
              `${percentage}%`,
              pageWidth -
                margin -
                32,
              y,
              {
                align: "right",
              }
            );

            setFont(
              9.5,
              "bold",
              COLORS.dark
            );

            doc.text(
              formatPDFCurrency(
                item.value
              ),
              pageWidth -
                margin,
              y,
              {
                align: "right",
              }
            );

            y +=
              categoryRowHeight;

            if (
              index <
              categoryExpenseData.length -
                1
            ) {
              drawLine(
                y - 5
              );
            }
          }
        );
      } else {
        setFont(
          9,
          "normal",
          COLORS.muted
        );

        doc.text(
          "No expense categories recorded for this month.",
          margin,
          y
        );

        y += 12;
      }

      // =================================================
      // PAGE 2 SECTION
      // =================================================

      doc.addPage();

      y = 20;

      // -------------------------------------------------
      // PAGE 2 HEADER
      // -------------------------------------------------

      setFont(
        17,
        "bold",
        COLORS.dark
      );

      doc.text(
        "SmartMoney",
        margin,
        y
      );

      setFont(
        8.5,
        "normal",
        COLORS.muted
      );

      doc.text(
        "Personal Financial Report",
        pageWidth - margin,
        y,
        {
          align: "right",
        }
      );

      y += 10;

      drawLine(y);

      y += 12;

      // =================================================
      // SIX MONTH BREAKDOWN
      // =================================================

      drawSectionTitle(
        "Six-Month Financial Breakdown",
        monthRangeText
          ? `${monthRangeText} - income, expenses, savings and savings rate`
          : "Income, expenses, savings and savings rate"
      );

      const tableX = margin;

      const tableWidth =
        contentWidth;

      const rowHeight = 10;

      const colMonth = 37;
      const colIncome = 39;
      const colExpense = 39;
      const colSavings = 39;

      const colRate =
        tableWidth -
        colMonth -
        colIncome -
        colExpense -
        colSavings;

      // -------------------------------------------------
      // TABLE HEADER
      // -------------------------------------------------

      doc.setFillColor(
        ...COLORS.green
      );

      doc.roundedRect(
        tableX,
        y,
        tableWidth,
        11,
        2.5,
        2.5,
        "F"
      );

      setFont(
        8,
        "bold",
        COLORS.white
      );

      doc.text(
        "Month",
        tableX + 5,
        y + 7
      );

      doc.text(
        "Income",
        tableX +
          colMonth +
          colIncome -
          5,
        y + 7,
        {
          align: "right",
        }
      );

      doc.text(
        "Expenses",
        tableX +
          colMonth +
          colIncome +
          colExpense -
          5,
        y + 7,
        {
          align: "right",
        }
      );

      doc.text(
        "Savings",
        tableX +
          colMonth +
          colIncome +
          colExpense +
          colSavings -
          5,
        y + 7,
        {
          align: "right",
        }
      );

      doc.text(
        "Rate",
        tableX +
          tableWidth -
          5,
        y + 7,
        {
          align: "right",
        }
      );

      y += 11;

      // -------------------------------------------------
      // TABLE ROWS
      // -------------------------------------------------

      monthlyData.forEach(
        (month, index) => {
          checkPageSpace(
            rowHeight + 2
          );

          if (index % 2 === 0) {
            doc.setFillColor(
              ...COLORS.softGray
            );

            doc.rect(
              tableX,
              y,
              tableWidth,
              rowHeight,
              "F"
            );
          }

          const income =
            Number(
              month.income || 0
            );

          const expenses =
            Number(
              month.expenses || 0
            );

          const savings =
            income - expenses;

          const rate =
            income > 0
              ? Math.round(
                  (savings /
                    income) *
                    100
                )
              : 0;

          setFont(
            8.3,
            "normal",
            COLORS.dark
          );

          doc.text(
            month.label ||
              month.month ||
              "",
            tableX + 5,
            y + 6.5
          );

          doc.text(
            formatPDFCurrency(
              income
            ),
            tableX +
              colMonth +
              colIncome -
              5,
            y + 6.5,
            {
              align: "right",
            }
          );

          doc.text(
            formatPDFCurrency(
              expenses
            ),
            tableX +
              colMonth +
              colIncome +
              colExpense -
              5,
            y + 6.5,
            {
              align: "right",
            }
          );

          doc.text(
            formatPDFCurrency(
              savings
            ),
            tableX +
              colMonth +
              colIncome +
              colExpense +
              colSavings -
              5,
            y + 6.5,
            {
              align: "right",
            }
          );

          setFont(
            8.3,
            "bold",
            rate >= 0
              ? COLORS.green
              : COLORS.red
          );

          doc.text(
            `${rate}%`,
            tableX +
              tableWidth -
              5,
            y + 6.5,
            {
              align: "right",
            }
          );

          y += rowHeight;

          doc.setDrawColor(
            ...COLORS.border
          );

          doc.setLineWidth(0.15);

          doc.line(
            tableX,
            y,
            tableX +
              tableWidth,
            y
          );
        }
      );

      y += 16;

      // =================================================
      // SNAPSHOT
      // =================================================

      drawSectionTitle(
        `${currentMonth.toLocaleString(
          "en-US",
          {
            month: "long",
          }
        )} Snapshot`
      );

      let snapshotText = "";

      if (currentIncome > 0) {
        snapshotText =
          `You earned ${formatPDFCurrency(
            currentIncome
          )} and spent ${formatPDFCurrency(
            currentExpense
          )} this month. Your remaining savings are ${formatPDFCurrency(
            currentSavings
          )}, giving you a savings rate of ${savingsRate}%.`;
      } else {
        snapshotText =
          `No income has been recorded for ${currentMonth.toLocaleString(
            "en-US",
            {
              month: "long",
            }
          )}.`;
      }

      const snapshotLines =
        doc.splitTextToSize(
          snapshotText,
          contentWidth - 18
        );

      const snapshotHeight =
        Math.max(
          32,
          snapshotLines.length *
              5.5 +
            17
        );

      checkPageSpace(
        snapshotHeight + 5
      );

      drawRoundedBox(
        margin,
        y,
        contentWidth,
        snapshotHeight,
        COLORS.lightGreen
      );

      setFont(
        9.5,
        "normal",
        COLORS.dark
      );

      doc.text(
        snapshotLines,
        margin + 9,
        y + 11,
        {
          lineHeightFactor: 1.45,
        }
      );

      y +=
        snapshotHeight + 14;

      // =================================================
      // REPORT NOTE
      // =================================================

      checkPageSpace(45);

      drawRoundedBox(
        margin,
        y,
        contentWidth,
        32,
        COLORS.lavender
      );

      setFont(
        8,
        "bold",
        COLORS.lavenderDark
      );

      doc.text(
        "SMART MONEY NOTE",
        margin + 8,
        y + 9
      );

      setFont(
        8.5,
        "normal",
        COLORS.dark
      );

      const noteText =
        "This report is generated from the transactions recorded in your SmartMoney account.";

      const noteLines =
        doc.splitTextToSize(
          noteText,
          contentWidth - 18
        );

      doc.text(
        noteLines,
        margin + 8,
        y + 18,
        {
          lineHeightFactor: 1.4,
        }
      );

      // =================================================
      // FOOTERS
      // =================================================

      const totalPages =
        doc.internal.getNumberOfPages();

      for (
        let page = 1;
        page <= totalPages;
        page++
      ) {
        doc.setPage(page);

        drawFooter(
          page,
          totalPages
        );
      }

      // =================================================
      // SAVE
      // =================================================

      const reportMonth =
        currentMonth.toLocaleString(
          "en-US",
          {
            month: "long",
          }
        );

      const reportYear =
        currentMonth.getFullYear();

      const fileName =
        `SmartMoney-Financial-Report-${reportMonth}-${reportYear}.pdf`;

      doc.save(fileName);
    } catch (error) {
      console.error(
        "PDF export failed:",
        error
      );

      alert(
        "Unable to generate the PDF. Please try again."
      );
    }
  };

  // --------------------------------------------------
  // LOADING
  // --------------------------------------------------

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

              <p className="mt-4 text-sm font-medium text-[#737D76]">
                Preparing your financial report...
              </p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // --------------------------------------------------
  // ERROR
  // --------------------------------------------------

  if (error) {
    return (
      <div className="min-h-screen bg-[#F7F8F5]">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() =>
            setSidebarOpen(false)
          }
        />

        <main className="min-h-screen lg:ml-72">
          <div className="flex min-h-screen items-center justify-center px-6">
            <div className="max-w-md rounded-3xl border border-[#E7EAE6] bg-white p-8 text-center shadow-sm">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F8EDEA] text-[#B05E55]">
                <FiAlertCircle size={25} />
              </div>

              <h2 className="mt-5 text-xl font-bold text-[#344239]">
                Unable to load reports
              </h2>

              <p className="mt-2 text-sm leading-6 text-[#7C857E]">
                {error}
              </p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // --------------------------------------------------
  // MAIN PAGE
  // --------------------------------------------------

  return (
    <div className="min-h-screen bg-[#F7F8F5]">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() =>
          setSidebarOpen(false)
        }
      />

      <main className="min-h-screen lg:ml-72">
        <div className="mx-auto max-w-[1500px] px-5 py-6 sm:px-8 lg:px-10">
          {/* ------------------------------------------ */}
          {/* HEADER */}
          {/* ------------------------------------------ */}

          <div className="flex flex-col gap-5 border-b border-[#E5EAE5] pb-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8B968E]">
                Financial overview
              </p>

              <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#26352B]">
                Reports
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#78827B]">
                Understand your spending,
                savings, and financial
                progress at a glance.
              </p>
            </div>

            <button
              type="button"
              onClick={handleExportPDF}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#527B5B] px-5 py-3 text-sm font-bold text-white shadow-[0_10px_24px_rgba(82,123,91,0.18)] transition hover:-translate-y-0.5 hover:bg-[#466C4F]"
            >
              <FiDownload size={17} />

              Export Report
            </button>
          </div>

          {/* ------------------------------------------ */}
          {/* SUMMARY CARDS */}
          {/* ------------------------------------------ */}

          <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {/* Income */}

            <div className="rounded-3xl border border-[#E3E9E3] bg-white p-5 shadow-[0_8px_30px_rgba(40,60,45,0.04)]">
              <div className="flex items-start justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#E5F0E6] text-[#527B5B]">
                  <FiTrendingUp
                    size={20}
                  />
                </div>

                <span
                  className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
                    currentIncomeChange >=
                    0
                      ? "bg-[#E8F2E9] text-[#527B5B]"
                      : "bg-[#F8EDEA] text-[#B05E55]"
                  }`}
                >
                  {currentIncomeChange >=
                  0
                    ? "+"
                    : ""}
                  {currentIncomeChange}%
                </span>
              </div>

              <p className="mt-5 text-xs font-bold  tracking-[0.12em] text-[#9AA39D]">
                Monthly income
              </p>

              <p className="mt-1 text-2xl font-bold text-[#344239]">
                {formatCurrency(
                  currentIncome
                )}
              </p>

              <p className="mt-2 text-xs text-[#89938B]">
                Compared with last month
              </p>
            </div>

            {/* Expense */}

            <div className="rounded-3xl border border-[#E3E9E3] bg-white p-5 shadow-[0_8px_30px_rgba(40,60,45,0.04)]">
              <div className="flex items-start justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F8EDEA] text-[#B05E55]">
                  <FiTrendingDown
                    size={20}
                  />
                </div>

                <span
                  className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
                    currentExpenseChange <=
                    0
                      ? "bg-[#E8F2E9] text-[#527B5B]"
                      : "bg-[#F8EDEA] text-[#B05E55]"
                  }`}
                >
                  {currentExpenseChange >=
                  0
                    ? "+"
                    : ""}
                  {currentExpenseChange}%
                </span>
              </div>

              <p className="mt-5 text-xs font-bold  tracking-[0.12em] text-[#9AA39D]">
                Monthly expenses
              </p>

              <p className="mt-1 text-2xl font-bold text-[#344239]">
                {formatCurrency(
                  currentExpense
                )}
              </p>

              <p className="mt-2 text-xs text-[#89938B]">
                Compared with last month
              </p>
            </div>

            {/* Savings */}

            <div className="rounded-3xl border border-[#E3E9E3] bg-white p-5 shadow-[0_8px_30px_rgba(40,60,45,0.04)]">
              <div className="flex items-start justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#EEE9F7] text-[#806BA7]">
                  <FiDollarSign
                    size={20}
                  />
                </div>

                <span
                  className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
                    currentSavingsChange >=
                    0
                      ? "bg-[#E8F2E9] text-[#527B5B]"
                      : "bg-[#F8EDEA] text-[#B05E55]"
                  }`}
                >
                  {currentSavingsChange >=
                  0
                    ? "+"
                    : ""}
                  {currentSavingsChange}%
                </span>
              </div>

              <p className="mt-5 text-xs font-bold  tracking-[0.12em] text-[#9AA39D]">
                Monthly savings
              </p>

              <p className="mt-1 text-2xl font-bold text-[#344239]">
                {formatCurrency(
                  currentSavings
                )}
              </p>

              <p className="mt-2 text-xs text-[#89938B]">
                Income minus expenses
              </p>
            </div>

            {/* Savings Rate */}

            <div className="rounded-3xl border border-[#E3E9E3] bg-white p-5 shadow-[0_8px_30px_rgba(40,60,45,0.04)]">
              <div className="flex items-start justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F8EFE7] text-[#B47D55]">
                  <FiTarget
                    size={20}
                  />
                </div>

                <span className="rounded-full bg-[#E8F2E9] px-2.5 py-1 text-[11px] font-bold text-[#527B5B]">
                  Savings
                </span>
              </div>

              <p className="mt-5 text-xs font-bold  tracking-[0.12em] text-[#9AA39D]">
                Savings rate
              </p>

              <p className="mt-1 text-2xl font-bold text-[#344239]">
                {savingsRate}%
              </p>

              <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#E8EDE8]">
                <div
                  className="h-full rounded-full bg-[#527B5B]"
                  style={{
                    width: `${Math.min(
                      Math.max(
                        savingsRate,
                        0
                      ),
                      100
                    )}%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* ------------------------------------------ */}
          {/* SIX MONTH CHART */}
          {/* ------------------------------------------ */}

          <div className="mt-6 rounded-3xl border border-[#E3E9E3] bg-white p-5 shadow-[0_8px_30px_rgba(40,60,45,0.04)] sm:p-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-lg font-bold text-[#344239]">
                  Income vs Expenses
                </h2>

                <p className="mt-1 text-xs text-[#89938B]">
                  Your financial activity over
                  the last six months
                </p>
              </div>

              <div className="flex items-center gap-4 text-xs font-semibold text-[#7C857E]">
                <span className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#527B5B]" />
                  Income
                </span>

                <span className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#9C88C4]" />
                  Expenses
                </span>
              </div>
            </div>

            <div className="mt-6 h-[320px] w-full">
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <AreaChart
                  data={monthlyData}
                  margin={{
                    top: 10,
                    right: 10,
                    left: 0,
                    bottom: 0,
                  }}
                >
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
                        stopOpacity={0.24}
                      />

                      <stop
                        offset="100%"
                        stopColor="#527B5B"
                        stopOpacity={0.02}
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
                        stopColor="#9C88C4"
                        stopOpacity={0.2}
                      />

                      <stop
                        offset="100%"
                        stopColor="#9C88C4"
                        stopOpacity={0.02}
                      />
                    </linearGradient>
                  </defs>

                  <CartesianGrid
                    stroke="#EDF0ED"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="month"
                    tick={{
                      fill: "#89938B",
                      fontSize: 11,
                    }}
                    axisLine={false}
                    tickLine={false}
                  />

                  <YAxis
                    tick={{
                      fill: "#89938B",
                      fontSize: 11,
                    }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(value) =>
                      `₹${formatNumber(
                        value
                      )}`
                    }
                  />

                  <Tooltip
                    content={
                      <CustomTooltip />
                    }
                  />

                  <Area
                    type="monotone"
                    dataKey="income"
                    name="Income"
                    stroke="#527B5B"
                    strokeWidth={3}
                    fill="url(#incomeGradient)"
                  />

                  <Area
                    type="monotone"
                    dataKey="expenses"
                    name="Expenses"
                    stroke="#9C88C4"
                    strokeWidth={3}
                    fill="url(#expenseGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* ------------------------------------------ */}
          {/* CATEGORY + SAVINGS */}
          {/* ------------------------------------------ */}

          <div className="mt-6 grid gap-6 xl:grid-cols-2">
            {/* Category */}

            <div className="rounded-3xl border border-[#E3E9E3] bg-white p-5 shadow-[0_8px_30px_rgba(40,60,45,0.04)] sm:p-6">
              <div>
                <h2 className="text-lg font-bold text-[#344239]">
                  Spending by Category
                </h2>

                <p className="mt-1 text-xs text-[#89938B]">
                  Where your money went this
                  month
                </p>
              </div>

              {categoryExpenseData.length >
              0 ? (
                <div className="mt-6 flex flex-col items-center gap-6 sm:flex-row">
                  <div className="h-[230px] w-full sm:w-1/2">
                    <ResponsiveContainer
                      width="100%"
                      height="100%"
                    >
                      <RechartsPieChart>
                        <Pie
                          data={
                            categoryExpenseData
                          }
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          innerRadius={55}
                          outerRadius={85}
                          paddingAngle={3}
                        >
                          {categoryExpenseData.map(
                            (
                              entry,
                              index
                            ) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={
                                  CATEGORY_COLORS[
                                    index %
                                      CATEGORY_COLORS.length
                                  ]
                                }
                              />
                            )
                          )}
                        </Pie>

                        <Tooltip
                          formatter={(
                            value
                          ) =>
                            formatCurrency(
                              value
                            )
                          }
                        />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="w-full space-y-3 sm:w-1/2">
                    {categoryExpenseData.map(
                      (
                        category,
                        index
                      ) => {
                        const percentage =
                          currentExpense >
                          0
                            ? Math.round(
                                (category.value /
                                  currentExpense) *
                                  100
                              )
                            : 0;

                        return (
                          <div
                            key={
                              category.name
                            }
                            className="flex items-center justify-between gap-3"
                          >
                            <div className="flex min-w-0 items-center gap-2">
                              <span
                                className="h-2.5 w-2.5 shrink-0 rounded-full"
                                style={{
                                  backgroundColor:
                                    CATEGORY_COLORS[
                                      index %
                                        CATEGORY_COLORS.length
                                    ],
                                }}
                              />

                              <span className="truncate text-xs font-semibold text-[#5E6961]">
                                {
                                  category.name
                                }
                              </span>
                            </div>

                            <div className="shrink-0 text-right">
                              <p className="text-xs font-bold text-[#344239]">
                                {formatCurrency(
                                  category.value
                                )}
                              </p>

                              <p className="text-[10px] text-[#99A29B]">
                                {percentage}%
                              </p>
                            </div>
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex h-[260px] items-center justify-center">
                  <div className="text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EEF3EE] text-[#527B5B]">
                      <FiPieChart
                        size={21}
                      />
                    </div>

                    <p className="mt-4 text-sm font-bold text-[#526057]">
                      No expenses yet
                    </p>

                    <p className="mt-1 text-xs text-[#929A94]">
                      Add expenses to see
                      your spending breakdown.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Savings Trend */}

            <div className="rounded-3xl border border-[#E3E9E3] bg-white p-5 shadow-[0_8px_30px_rgba(40,60,45,0.04)] sm:p-6">
              <div>
                <h2 className="text-lg font-bold text-[#344239]">
                  Savings Trend
                </h2>

                <p className="mt-1 text-xs text-[#89938B]">
                  Monthly savings over the last
                  six months
                </p>
              </div>

              <div className="mt-6 h-[280px] w-full">
                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >
                  <BarChart
                    data={monthlyData}
                    margin={{
                      top: 10,
                      right: 10,
                      left: 0,
                      bottom: 0,
                    }}
                  >
                    <CartesianGrid
                      stroke="#EDF0ED"
                      vertical={false}
                    />

                    <XAxis
                      dataKey="month"
                      tick={{
                        fill: "#89938B",
                        fontSize: 11,
                      }}
                      axisLine={false}
                      tickLine={false}
                    />

                    <YAxis
                      tick={{
                        fill: "#89938B",
                        fontSize: 11,
                      }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(value) =>
                        `₹${formatNumber(
                          value
                        )}`
                      }
                    />

                    <Tooltip
                      formatter={(
                        value
                      ) =>
                        formatCurrency(
                          value
                        )
                      }
                    />

                    <Bar
                      dataKey="savings"
                      name="Savings"
                      fill="#527B5B"
                      radius={[
                        7,
                        7,
                        0,
                        0,
                      ]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* ------------------------------------------ */}
          {/* MONTHLY BREAKDOWN TABLE */}
          {/* ------------------------------------------ */}

          <div className="mt-6 rounded-3xl border border-[#E3E9E3] bg-white p-5 shadow-[0_8px_30px_rgba(40,60,45,0.04)] sm:p-6">
            <div>
              <h2 className="text-lg font-bold text-[#344239]">
                Monthly Breakdown
              </h2>

              <p className="mt-1 text-xs text-[#89938B]">
                Detailed financial activity for
                the last six months
              </p>
            </div>

            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-[650px] border-collapse">
                <thead>
                  <tr className="border-b border-[#E8ECE8]">
                    <th className="px-4 py-3 text-left text-[10px] font-bold  tracking-[0.12em] text-[#9AA39D]">
                      Month
                    </th>

                    <th className="px-4 py-3 text-right text-[10px] font-bold  tracking-[0.12em] text-[#9AA39D]">
                      Income
                    </th>

                    <th className="px-4 py-3 text-right text-[10px] font-bold  tracking-[0.12em] text-[#9AA39D]">
                      Expenses
                    </th>

                    <th className="px-4 py-3 text-right text-[10px] font-bold  tracking-[0.12em] text-[#9AA39D]">
                      Savings
                    </th>

                    <th className="px-4 py-3 text-right text-[10px] font-bold tracking-[0.12em] text-[#9AA39D]">
                      Rate
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {monthlyData.map(
                    (month) => (
                      <tr
                        key={
                          month.monthKey
                        }
                        className="border-b border-[#F0F2F0] last:border-0"
                      >
                        <td className="px-4 py-4 text-sm font-bold text-[#46534A]">
                          {
                            month.label
                          }
                        </td>

                        <td className="px-4 py-4 text-right text-sm font-semibold text-[#527B5B]">
                          {formatCurrency(
                            month.income
                          )}
                        </td>

                        <td className="px-4 py-4 text-right text-sm font-semibold text-[#B05E55]">
                          {formatCurrency(
                            month.expenses
                          )}
                        </td>

                        <td className="px-4 py-4 text-right text-sm font-semibold text-[#806BA7]">
                          {formatCurrency(
                            month.savings
                          )}
                        </td>

                        <td className="px-4 py-4 text-right">
                          <span className="inline-flex rounded-full bg-[#EAF1EA] px-2.5 py-1 text-[11px] font-bold text-[#527B5B]">
                            {
                              month.rate
                            }
                            %
                          </span>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* ------------------------------------------ */}
          {/* SNAPSHOT */}
          {/* ------------------------------------------ */}

          <div className="mt-6 rounded-3xl border border-[#DDE7DE] bg-[#EEF4EE] p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-[#527B5B] shadow-sm">
                <FiTarget
                  size={20}
                />
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#78917E]">
                  Monthly snapshot
                </p>

                <p className="mt-2 text-sm leading-7 text-[#526057]">
                  {currentIncome > 0
                    ? `You earned ${formatCurrency(
                        currentIncome
                      )} and spent ${formatCurrency(
                        currentExpense
                      )} this month. Your remaining savings are ${formatCurrency(
                        currentSavings
                      )}, giving you a savings rate of ${savingsRate}%.`
                    : "Add your income and expenses to see your monthly financial snapshot."}
                </p>
              </div>
            </div>
          </div>

          <div className="h-8" />
        </div>
      </main>
    </div>
  );
}

export default Reports;