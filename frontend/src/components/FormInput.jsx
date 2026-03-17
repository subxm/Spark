import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import "./FormInput.css";

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
    <div
      className={`fi-root ${focused ? "is-focused" : ""} ${error ? "has-error" : ""}`.trim()}
    >
      {label && <label className="fi-label">{label}</label>}

      <div className="fi-field">
        {Icon && (
          <div className="fi-icon">
            <Icon size={16} />
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
          className={`fi-input ${Icon ? "with-icon" : ""} ${isPasswordField ? "with-toggle" : ""}`.trim()}
        />

        {isPasswordField && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="fi-toggle"
            onMouseDown={(e) => e.preventDefault()}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>

      {strength > 0 && (
        <div className="fi-strength">
          <div className="fi-strength-bars">
            {[1, 2, 3].map((level) => {
              const tone =
                strength === 1 ? "weak" : strength === 2 ? "fair" : "strong";
              return (
                <span
                  key={level}
                  className={`${level <= strength ? `active ${tone}` : ""}`.trim()}
                />
              );
            })}
          </div>
          <span
            className={`fi-strength-label ${strength === 1 ? "weak" : strength === 2 ? "fair" : "strong"}`}
          >
            {strength === 1 ? "Weak" : strength === 2 ? "Fair" : "Strong"}
          </span>
        </div>
      )}

      {error && <div className="fi-error">{error}</div>}
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
