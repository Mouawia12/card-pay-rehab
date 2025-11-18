import { useMemo } from "react";

interface PasswordStrengthIndicatorProps {
  password: string;
}

export const PasswordStrengthIndicator = ({ password }: PasswordStrengthIndicatorProps) => {
  const strength = useMemo(() => {
    if (!password) return { score: 0, label: "", color: "" };

    let score = 0;
    const checks = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    // Calculate score
    Object.values(checks).forEach(check => {
      if (check) score++;
    });

    // Determine strength level
    if (score <= 2) {
      return { score, label: "ضعيف", color: "bg-red-500" };
    } else if (score <= 3) {
      return { score, label: "متوسط", color: "bg-yellow-500" };
    } else if (score <= 4) {
      return { score, label: "جيد", color: "bg-blue-500" };
    } else {
      return { score, label: "قوي", color: "bg-green-500" };
    }
  }, [password]);

  if (!password) return null;

  return (
    <div className="mt-2">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-muted-foreground">قوة كلمة المرور</span>
        <span className={`text-xs font-medium ${
          strength.score <= 2 ? 'text-red-500' :
          strength.score <= 3 ? 'text-yellow-500' :
          strength.score <= 4 ? 'text-blue-500' : 'text-green-500'
        }`}>
          {strength.label}
        </span>
      </div>
      <div className="w-full bg-muted rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${strength.color}`}
          style={{ width: `${(strength.score / 5) * 100}%` }}
        />
      </div>
    </div>
  );
};
