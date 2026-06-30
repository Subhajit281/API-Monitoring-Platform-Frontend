import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../../components/auth/AuthLayout";
import {
  registerUser,
  sendRegistrationOtp,
  verifyRegistrationOtp,
} from "../../services/auth.service";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");

  const [emailStatus, setEmailStatus] = useState("idle");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/");
    }
  }, [navigate]);

  const validateEmail = (inputEmail) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inputEmail);
  };

  const handleSendOtp = async () => {
    setError("");
    setSuccessMsg("");

    if (!email.trim() || !validateEmail(email.trim())) {
      setError("Please enter a valid email address first");
      return;
    }

    try {
      setLoading(true);
      const response = await sendRegistrationOtp({ email: email.trim() });

      if (response.success) {
        setEmailStatus("pending_otp");
        setSuccessMsg(`Verification code sent to ${email}`);
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to send verification code");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setError("");
    setSuccessMsg("");

    if (!otp || otp.length < 4) {
      setError("Please enter the complete verification code");
      return;
    }

    try {
      setLoading(true);
      const response = await verifyRegistrationOtp({
        email: email.trim(),
        otp: otp.trim(),
      });

      if (response.success) {
        setEmailStatus("verified");
        setSuccessMsg("Email verified successfully! You can now set a password.");
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Invalid or expired code");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (emailStatus !== "verified") {
      setError("Please verify your email before registering");
      return;
    }
    if (!name.trim() || name.trim().length < 3) {
      setError("Name must be at least 3 characters");
      return;
    }
    if (!password || password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const response = await registerUser({
        name: name.trim(),
        email: email.trim(),
        password,
      });

      if (response.success) {
        navigate("/login");
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Registration Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <form onSubmit={handleRegister} className="w-full">
        <h2 className="text-2xl sm:text-3xl font-medium text-white">Create Account</h2>

        <p className="text-sm sm:text-md text-[var(--muted)] mt-2 sm:mt-3">
          Start monitoring with UpFlow.
        </p>

        {error && (
          <div className="mt-4 sm:mt-6 p-2 sm:p-4 border-none">
            <p className="text-red-400 text-xs sm:text-sm">{error}</p>
          </div>
        )}

        {successMsg && !error && (
          <div className="mt-4 sm:mt-6 p-2 sm:p-4 border-none">
            <p className="text-green-400 text-xs sm:text-sm">{successMsg}</p>
          </div>
        )}

        {/* NAME */}
        <div className="mt-6 sm:mt-8">
          <label className="text-white block mb-2 sm:mb-3 text-xs sm:text-sm font-medium">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
            placeholder=" Full name"
            autoComplete="name"
            className="w-full h-10 sm:h-12 rounded-lg bg-[rgba(255,255,255,0.03)] px-3 sm:px-4 text-xs sm:text-sm text-white outline-none border border-transparent focus:border-blue-500 transition-all disabled:opacity-50"
          />
        </div>

        {/* EMAIL + VERIFY */}
        <div className="mt-5 sm:mt-6 relative">
          <label className="text-white block mb-2 sm:mb-3 text-xs sm:text-sm font-medium">Email</label>
          <div className="relative">
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (emailStatus !== "idle") setEmailStatus("idle");
              }}
              disabled={loading || emailStatus === "verified"}
              placeholder="info@example.com"
              autoComplete="email"
              className="w-full h-10 sm:h-12 rounded-lg bg-[rgba(255,255,255,0.03)] pl-3 sm:pl-4 pr-20 sm:pr-24 text-xs sm:text-sm text-white outline-none border border-transparent focus:border-blue-500 transition-all disabled:opacity-50"
            />

            {emailStatus !== "verified" && (
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={loading || !email}
                className="absolute right-1 top-1 bottom-1 px-3 sm:px-4 text-blue-500 hover:text-blue-500 text-xs sm:text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Verify
              </button>
            )}

            {emailStatus === "verified" && (
              <div className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-blue-400 font-semibold text-xs sm:text-sm">
                ✓ Verified
              </div>
            )}
          </div>
        </div>

        {/* OTP */}
        {emailStatus === "pending_otp" && (
          <div className="mt-4 p-3 sm:p-4 rounded-xl bg-black/20 border border-white/5">
            <label className="text-[var(--muted)] text-xs sm:text-sm block mb-2">
              Enter the code sent to your email
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                disabled={loading}
                placeholder="123456"
                maxLength={6}
                className="flex-1 h-10 rounded-md bg-[rgba(255,255,255,0.05)] px-3 sm:px-4 text-white outline-none border border-transparent focus:border-blue-500 text-center text-sm sm:text-base tracking-[0.35em] sm:tracking-[0.5em] font-bold"
              />
              <button
                type="button"
                onClick={handleVerifyOtp}
                disabled={loading || otp.length < 4}
                className="h-10 w-full sm:w-auto px-4 bg-[var(--primary)] hover:opacity-90 text-white text-sm font-medium rounded-md transition-opacity disabled:opacity-50"
              >
                Confirm
              </button>
            </div>
          </div>
        )}

        {/* PASSWORD (only after verified) */}
        {emailStatus === "verified" && (
          <>
            <div className="mt-5 sm:mt-6">
              <label className="text-white block mb-2 sm:mb-3 text-xs sm:text-sm font-medium">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                placeholder="********"
                autoComplete="new-password"
                className="w-full h-10 sm:h-12 rounded-xl bg-[rgba(255,255,255,0.03)] px-3 sm:px-4 text-xs sm:text-sm text-white outline-none border border-transparent focus:border-blue-500 transition-all disabled:opacity-50"
              />
            </div>

            <div className="mt-5 sm:mt-6">
              <label className="text-white block mb-2 sm:mb-3 text-xs sm:text-sm font-medium">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
                placeholder="********"
                autoComplete="new-password"
                className="w-full h-10 sm:h-12 rounded-lg bg-[rgba(255,255,255,0.03)] px-3 sm:px-4 text-xs sm:text-sm text-white outline-none border border-transparent focus:border-blue-500 transition-all disabled:opacity-50"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-10 sm:h-12 mt-6 sm:mt-8 rounded-lg bg-[var(--primary)] text-white font-semibold text-sm sm:text-base disabled:opacity-50 transition-opacity hover:opacity-90"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </>
        )}

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
          Already have an account?{" "}
          <Link to="/login" className="text-blue-400 hover:text-blue-300">
            Sign In
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}

export default Register;