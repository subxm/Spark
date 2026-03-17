import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function FormInput({
  label,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  icon: Icon,
  strength,
}) {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordField = type === "password";

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <label
        style={{
          display: "block",
          fontSize: 12,
          fontWeight: 600,
          color: "#334155",
          letterSpacing: "0.4px",
          textTransform: "uppercase",
          marginBottom: 8,
        }}
      >
        {label}
      </label>
      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
        }}
      >
        {Icon && (
          <div
            style={{
              position: "absolute",
              left: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: focused ? "#0ea5e9" : "#64748b",
              transition: "color 0.2s ease",
            }}
          >
            <Icon size={18} />
          </div>
        )}
        <input
          type={isPasswordField && !showPassword ? "password" : "text"}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: "100%",
            background: focused ? "#f0f9ff" : "#f8fafc",
            border: focused ? "1px solid #0ea5e9" : "1px solid #e2e8f0",
            color: "#1e293b",
            fontSize: 13,
            fontFamily: "'Inter', sans-serif",
            padding: Icon ? "11px 13px 11px 40px" : "11px 13px",
            paddingRight: isPasswordField ? 40 : undefined,
            borderRadius: 8,
            outline: "none",
            boxSizing: "border-box",
            transition: "all 0.2s ease",
          }}
        />
        {isPasswordField && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: "absolute",
              right: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "transparent",
              border: "none",
              color: focused ? "#0ea5e9" : "#64748b",
              cursor: "pointer",
              padding: 0,
              transition: "color 0.2s ease",
            }}
            onMouseDown={(e) => e.preventDefault()}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {strength > 0 && (
        <div style={{ marginTop: 8 }}>
          <div
            style={{
              display: "flex",
              gap: 4,
              height: 3,
              borderRadius: 2,
              overflow: "hidden",
            }}
          >
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  background:
                    i < strength
                      ? strength === 1
                        ? "#ef4444"
                        : strength === 2
                          ? "#f97316"
                          : "#22c55e"
                      : "rgba(255,255,255,0.05)",
                  borderRadius: 2,
                  transition: "background 0.3s ease",
                }}
              />
            ))}
          </div>
          <span
            style={{
              fontSize: 10,
              color:
                strength === 1
                  ? "#ef4444"
                  : strength === 2
                    ? "#f97316"
                    : "#10b981",
              marginTop: 4,
              display: "block",
            }}
          >
            {strength === 1 ? "Weak" : strength === 2 ? "Fair" : "Strong"}
          </span>
        </div>
      )}
      {error && (
        <div
          style={{
            fontSize: 11,
            color: "#ef4444",
            marginTop: 6,
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          ⚠ {error}
        </div>
      )}
    </div>
  );
}

export const getPasswordStrength = (password) => {
  if (!password) return 0;
  let strength = 0;
  if (password.length >= 6) strength++;
  if (/[A-Z]/.test(password) && /[0-9]/.test(password)) strength++;
  if (/[^A-Za-z0-9]/.test(password)) strength = 3;
  return strength;
};
