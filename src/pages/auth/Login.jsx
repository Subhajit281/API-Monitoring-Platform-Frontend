import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../../components/auth/AuthLayout";
import { requestOtp, verifyOtp } from "../../services/auth.service";

function LoginOTP() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/");
    }
  }, [navigate]);

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !validateEmail(email.trim())) {
      setError("Please enter a valid email address");
      return;
    }

    if (!password) {
      setError("Password is required");
      return;
    }

    try {
      setLoading(true);
      const response = await requestOtp({
        email: email.trim(),
        password: password,
      });

      if (response.success) {
        setStep(2);
      }
    } catch (error) {
      setError(
        error?.response?.data?.message || "Login Failed, Please try again"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");

    if (!otp || otp.length < 4) {
      setError("Please enter the complete OTP code");
      return;
    }

    try {
      setLoading(true);

      const response = await verifyOtp({
        email: email.trim(),
        otp: otp.trim(),
      });

      if (response.success) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        navigate("/");
      }
    } catch (error) {
      setError(
        error?.response?.data?.message || "Invalid or expired OTP"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="w-full">
        <h2 className="text-3xl font-medium text-white">
          {step === 1 ? "Welcome Back" : "Check your email"}
        </h2>

        <p className="text-md text-[var(--muted)] mt-3">
          {step === 1
            ? "Sign in to continue to UpFlow."
            : `We sent a temporary login code to ${email}`}
        </p>

        {error && (
          <div className="mt-6 p-4 border-none">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleRequestOtp} className="mt-8">
            <div className="mb-6">
              <label className="text-white block mb-3">Email</label>
              <input
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                placeholder="info@example.com"
                className="
                  w-full h-12 rounded-lg bg-[rgba(255,255,255,0.03)] px-4
                  text-white outline-none border border-transparent
                  focus:border-blue-500 transition-all disabled:opacity-50
                "
              />
            </div>

            <div>
              <label className="text-white block mb-3">Password</label>
              <input
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                placeholder="********"
                className="
                  w-full h-12 rounded-lg bg-[rgba(255,255,255,0.03)] px-4
                  text-white outline-none border border-transparent
                  focus:border-blue-500 transition-all disabled:opacity-50
                "
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="
                w-full h-12 mt-8 rounded-lg bg-[var(--primary)] text-white
                font-semibold transition-all hover:opacity-90
                disabled:opacity-50 disabled:cursor-not-allowed
              "
            >
              {loading ? "Verifying..." : "Sign In"}
            </button>

            <p className="text-center text-[var(--muted)] mt-6">
              Don't have an account?{" "}
              <Link to="/register" className="text-blue-400 hover:text-blue-300">
                Create Account
              </Link>
            </p>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="mt-8">
            <label className="text-white block mb-3">One-Time Password</label>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              autoComplete="one-time-code"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              disabled={loading}
              placeholder="123456"
              maxLength={6}
              className="
                w-full h-12 rounded-lg bg-[rgba(255,255,255,0.03)] px-4
                text-white outline-none border border-transparent
                focus:border-blue-500 transition-all disabled:opacity-50
                text-center tracking-[0.5em] text-xl font-bold
              "
            />

            <button
              type="submit"
              disabled={loading}
              className="
                w-full h-12 mt-8 rounded-lg bg-[var(--primary)] text-white
                font-semibold transition-all hover:opacity-90
                disabled:opacity-50 disabled:cursor-not-allowed
              "
            >
              {loading ? "Verifying..." : "Verify & Sign In"}
            </button>

            <button
              type="button"
              onClick={() => {
                setStep(1);
                setOtp("");
                setError("");
              }}
              disabled={loading}
              className="w-full mt-4 text-sm text-[var(--muted)] hover:text-white transition-colors"
            >
              Back to Login
            </button>
          </form>
        )}
      </div>
    </AuthLayout>
  );
}

export default LoginOTP;