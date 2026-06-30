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

  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
  };

return (
  <AuthLayout>
    <div className="w-full">
      <h2 className="text-2xl sm:text-3xl font-medium text-white">
        {step === 1 ? "Welcome Back" : "Check your email"}
      </h2>

      <p className="text-sm sm:text-md text-[var(--muted)] mt-2 sm:mt-3 leading-relaxed">
        {step === 1
          ? "Sign in to continue to UpFlow."
          : `We sent a temporary login code to ${email}`}
      </p>

      {error && (
        <div className="mt-4 sm:mt-6 p-2 sm:p-4 border-none">
          <p className="text-red-400 text-xs sm:text-sm">{error}</p>
        </div>
      )}

      {step === 1 ? (
        <form onSubmit={handleRequestOtp} className="mt-6 sm:mt-8">

          <div className="mb-5 sm:mb-6">
            <label className="text-white block mb-2 sm:mb-3 text-xs sm:text-sm font-medium">
              Email
            </label>

            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              placeholder="info@example.com"
              className="
                w-full
                h-10 sm:h-12
                rounded-lg
                bg-[rgba(255,255,255,0.03)]
                px-3 sm:px-4
                text-xs sm:text-sm
                text-white
                outline-none
                border border-transparent
                focus:border-blue-500
                transition-all
                disabled:opacity-50
              "
            />
          </div>

          <div>
            <label className="text-white block mb-2 sm:mb-3 text-xs sm:text-sm font-medium">
              Password
            </label>

            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              placeholder="********"
              className="
                w-full
                h-10 sm:h-12
                rounded-lg
                bg-[rgba(255,255,255,0.03)]
                px-3 sm:px-4
                text-xs sm:text-sm
                text-white
                outline-none
                border border-transparent
                focus:border-blue-500
                transition-all
                disabled:opacity-50
              "
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="
              w-full
              h-10 sm:h-12
              mt-6 sm:mt-8
              rounded-lg
              bg-[var(--primary)]
              text-white
              text-sm sm:text-base
              font-semibold
              transition-all
              hover:opacity-90
              disabled:opacity-50
              disabled:cursor-not-allowed
            "
          >
            {loading ? "Verifying..." : "Sign In"}
          </button>

          <div className="flex items-center gap-3 my-5 sm:my-6">
            <div className="flex-1 h-px bg-[rgba(255,255,255,0.1)]" />
            <span className="text-xs sm:text-sm text-[var(--muted)]">or</span>
            <div className="flex-1 h-px bg-[rgba(255,255,255,0.1)]" />
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="
              w-full
              h-10 sm:h-12
              flex
              items-center
              justify-center
              gap-2 sm:gap-3
              rounded-lg
              bg-[rgba(255,255,255,0.03)]
              border border-[rgba(255,255,255,0.1)]
              text-white
              text-xs sm:text-sm
              font-medium
              transition-all
              hover:bg-[rgba(255,255,255,0.06)]
              disabled:opacity-50
              disabled:cursor-not-allowed
            "
          >
            <svg width="18" height="18" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12 c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24 c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
              <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039 l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
              <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36 c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
              <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571 c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24 C44,22.659,43.862,21.35,43.611,20.083z"/>
            </svg>
            Continue with Google
          </button>

          <p className="text-center text-xs sm:text-sm text-[var(--muted)] mt-5 sm:mt-6">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-blue-400 hover:text-blue-300"
            >
              Create Account
            </Link>
          </p>

        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} className="mt-6 sm:mt-8">

          <label className="text-white block mb-2 sm:mb-3 text-xs sm:text-sm font-medium">
            One-Time Password
          </label>

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
              w-full
              h-10 sm:h-12
              rounded-lg
              bg-[rgba(255,255,255,0.03)]
              px-3 sm:px-4
              text-white
              outline-none
              border border-transparent
              focus:border-blue-500
              transition-all
              disabled:opacity-50
              text-center
              tracking-[0.35em] sm:tracking-[0.5em]
              text-lg sm:text-xl
              font-bold
            "
          />

          <button
            type="submit"
            disabled={loading}
            className="
              w-full
              h-10 sm:h-12
              mt-6 sm:mt-8
              rounded-lg
              bg-[var(--primary)]
              text-white
              text-sm sm:text-base
              font-semibold
              transition-all
              hover:opacity-90
              disabled:opacity-50
              disabled:cursor-not-allowed
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
            className="w-full mt-3 sm:mt-4 text-xs sm:text-sm text-[var(--muted)] hover:text-white transition-colors"
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