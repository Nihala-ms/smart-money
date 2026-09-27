import { useEffect, useState } from "react";

import {
  FiBarChart2,
  FiCreditCard,
  FiHome,
  FiLogOut,
  FiPieChart,
  FiTarget,
  FiX,
} from "react-icons/fi";

import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import axios from "axios";

function Sidebar({ isOpen, onClose }) {
  const location = useLocation();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: FiHome,
    },
    {
      name: "Transactions",
      path: "/transactions",
      icon: FiCreditCard,
    },
    {
      name: "Budget",
      path: "/budget",
      icon: FiPieChart,
    },
    {
      name: "Goals",
      path: "/goals",
      icon: FiTarget,
    },
    {
      name: "Reports",
      path: "/reports",
      icon: FiBarChart2,
    },
  ];

  // ======================================================
  // GET LOGGED-IN USER
  // ======================================================

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/user/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setUser(response.data.user);

        // Keep localStorage user information updated
        localStorage.setItem(
          "user",
          JSON.stringify(response.data.user)
        );
      } catch (error) {
        console.error(
          "Failed to fetch user:",
          error
        );

        // If token is invalid or expired
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");

          navigate("/login", {
            replace: true,
          });
        }
      }
    };

    fetchUser();
  }, [navigate]);

  // ======================================================
  // LOGOUT
  // ======================================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    if (onClose) {
      onClose();
    }

    navigate("/login", {
      replace: true,
    });
  };

  // ======================================================
  // USER NAME FALLBACK
  // ======================================================

  const storedUser = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  const userName =
    user?.name ||
    storedUser?.name ||
    "User";

  // ======================================================
  // USER INITIAL
  // ======================================================

  const userInitial = userName
    .charAt(0)
    .toUpperCase();

  // ======================================================
  // SIDEBAR
  // ======================================================

  return (
    <>
      {/* ==================================================
          MOBILE OVERLAY
      ================================================== */}

      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/20 lg:hidden"
        />
      )}

      {/* ==================================================
          SIDEBAR
      ================================================== */}

      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-72 flex-col border-r border-[#E5EAE5] bg-[#FCFCFA] px-5 py-6 transition-transform duration-300 lg:translate-x-0 ${
          isOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >

        {/* ==================================================
            LOGO
        ================================================== */}

        <div className="flex items-center justify-between">

          <Link
            to="/"
            onClick={onClose}
            className="flex items-center gap-3"
          >

            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#DDEBDD]">

              <div className="flex items-end gap-[3px]">

                <span className="h-3 w-1.5 rounded-full bg-[#5D8B68]" />

                <span className="h-5 w-1.5 rounded-full bg-[#527B5B]" />

                <span className="h-4 w-1.5 rounded-full bg-[#9BB89F]" />

              </div>

            </div>

            <div>

              <p className="text-lg font-bold tracking-tight text-[#26352B]">
                SmartMoney
              </p>

              <p className="text-[9px] font-medium uppercase tracking-[0.18em] text-[#929A94]">
                Money made simple
              </p>

            </div>

          </Link>

          {/* Mobile close */}
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-[#7B857E] hover:bg-[#EEF3EE] lg:hidden"
          >
            <FiX size={20} />
          </button>

        </div>

        {/* ==================================================
            PROFILE
        ================================================== */}

        <div className="mt-8 rounded-2xl bg-[#F0F5F0] p-4">

          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#527B5B] text-sm font-bold text-white">
              {userInitial}
            </div>

            <div className="min-w-0">

              <p className="truncate text-sm font-bold text-[#344239]">
                {userName}
              </p>

              <p className="truncate text-xs text-[#89938B]">
                Personal Account
              </p>

            </div>

          </div>

        </div>

        {/* ==================================================
            MENU
        ================================================== */}

        <div className="mt-8">

          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#A1AAA3]">
            Main Menu
          </p>

          <nav className="space-y-1.5">

            {menuItems.map((item) => {

              const Icon = item.icon;

              const active =
                location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                    active
                      ? "bg-[#527B5B] text-white shadow-[0_8px_20px_rgba(82,123,91,0.18)]"
                      : "text-[#68746C] hover:bg-[#EEF3EE] hover:text-[#527B5B]"
                  }`}
                >

                  <Icon size={18} />

                  <span>{item.name}</span>

                </Link>
              );
            })}

          </nav>

        </div>

        {/* ==================================================
            BOTTOM
        ================================================== */}

        <div className="mt-auto">

          {/* Savings card */}

          <div className="mb-5 rounded-2xl bg-[#EEE9F7] p-4">

            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-[#806BA7]">
              <FiTarget size={17} />
            </div>

            <p className="mt-3 text-xs font-bold text-[#4A4054]">
              Savings goal
            </p>

            <p className="mt-1 text-[11px] text-[#847B8E]">
              Keep building your future.
            </p>

            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#DDD7E8]">

              <div className="h-full w-[72%] rounded-full bg-[#9C88C4]" />

            </div>

            <p className="mt-2 text-[10px] font-semibold text-[#806BA7]">
              72% completed
            </p>

          </div>

          {/* ==================================================
              LOGOUT
          ================================================== */}

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-[#7B857E] transition hover:bg-[#F2EDEA] hover:text-[#B05E55]"
          >

            <FiLogOut size={18} />

            Logout

          </button>

        </div>

      </aside>
    </>
  );
}

export default Sidebar;
