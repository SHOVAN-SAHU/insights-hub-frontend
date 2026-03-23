import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { logoutUser } from "../../features/auth/authSlice";
import { showToast } from "../common/Toast";

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((s) => s.auth);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate("/login");
    showToast("Logged out successfully", "info");
  };

  const navLinks = [
    { to: "/dashboard", label: "Spaces" },
    { to: "/subscription", label: "Plans" },
  ];

  return (
    <nav
      style={{
        background: "var(--bg-secondary)",
        borderBottom: "1px solid var(--border)",
        padding: "0 32px",
        height: 60,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 100,
        backdropFilter: "blur(12px)",
      }}
    >
      {/* Logo */}
      <Link
        to="/dashboard"
        style={{ display: "flex", alignItems: "center", gap: 10 }}
      >
        <div
          style={{
            width: 30,
            height: 30,
            background: "var(--accent)",
            borderRadius: 8,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 0 12px var(--accent-glow)",
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
            <rect width="64" height="64" rx="14" fill="#6c63ff" />
            <path
              d="M32 9 L51 20 L51 44 L32 55 L13 44 L13 20 Z"
              fill="none"
              stroke="rgba(255,255,255,0.3)"
              stroke-width="2"
              stroke-linejoin="round"
            />
            <rect x="16" y="20" width="6" height="24" rx="2" fill="white" />
            <rect x="13" y="20" width="12" height="5" rx="1.5" fill="white" />
            <rect x="13" y="39" width="12" height="5" rx="1.5" fill="white" />
            <rect x="30" y="20" width="6" height="24" rx="2" fill="white" />
            <rect x="30" y="29.5" width="16" height="5" rx="2" fill="white" />
            <rect x="40" y="20" width="6" height="24" rx="2" fill="white" />
            <circle cx="51" cy="51" r="5" fill="rgba(255,255,255,0.4)" />
            <circle cx="51" cy="51" r="2.5" fill="white" />
          </svg>
        </div>
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: 17,
            letterSpacing: "-0.03em",
            color: "var(--text-primary)",
          }}
        >
          Insights<span style={{ color: "var(--accent)" }}>Hub</span>
        </span>
      </Link>

      {/* Nav Links */}
      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        {navLinks.map((link) => {
          const active = location.pathname === link.to;
          return (
            <Link
              key={link.to}
              to={link.to}
              style={{
                padding: "6px 14px",
                borderRadius: "var(--radius-sm)",
                fontSize: 14,
                fontWeight: active ? 600 : 400,
                color: active ? "var(--accent)" : "var(--text-secondary)",
                background: active ? "var(--accent-dim)" : "transparent",
                transition: "all var(--transition)",
              }}
            >
              {link.label}
            </Link>
          );
        })}
      </div>

      {/* User Info */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {user?.picture ? (
          <img
            src={user.picture}
            alt={user.name}
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              border: "2px solid var(--border)",
            }}
          />
        ) : (
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: "var(--accent-dim)",
              border: "2px solid var(--accent)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 13,
              fontWeight: 700,
              color: "var(--accent)",
            }}
          >
            {user?.name?.[0]?.toUpperCase() || "U"}
          </div>
        )}
        <span
          style={{
            fontSize: 14,
            color: "var(--text-secondary)",
            maxWidth: 140,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {user?.name || user?.email}
        </span>
        <button
          onClick={handleLogout}
          style={{
            background: "var(--bg-hover)",
            border: "1px solid var(--border)",
            color: "var(--text-secondary)",
            padding: "6px 14px",
            borderRadius: "var(--radius-sm)",
            fontSize: 13,
            cursor: "pointer",
            transition: "all var(--transition)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "var(--danger)";
            e.currentTarget.style.borderColor = "var(--danger)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "var(--text-secondary)";
            e.currentTarget.style.borderColor = "var(--border)";
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
