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