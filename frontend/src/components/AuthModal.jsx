import { useState } from "react";
import { supabase } from "../utils/supabase";
import { landingHero } from "../assets/designAssets";

export default function AuthModal({
  isOpen = true,
  onClose = () => {},
  onAuthSuccess = () => {},
}) {
  const [tab, setTab] = useState("signin");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    city: "Pakistan",
    country: "Pakistan",
  });

  if (!isOpen) return null;

  const clearState = () => {
    setForm({
      full_name: "",
      email: "",
      password: "",
      city: "Pakistan",
      country: "Pakistan",
    });
    setError("");
    setLoading(false);
  };

  const switchTab = (t) => {
    setTab(t);
    clearState();
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSignUp = async () => {
    setError("");
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp(
        { email: form.email, password: form.password },
        { data: { full_name: form.full_name } },
      );
      if (error) throw error;
      // insert profile row
      if (data?.user) {
        await supabase
          .from("profiles")
          .insert({
            user_id: data.user.id,
            full_name: form.full_name,
            city: form.city,
            country: form.country,
          });
      }
      setLoading(false);
      setError(
        "Account created! Please check your email to verify your account before signing in.",
      );
    } catch (e) {
      setLoading(false);
      setError(e.message || "Sign up failed");
    }
  };

  const handleSignIn = async () => {
    setError("");
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
      });
      if (error) throw error;
      // check email confirmed - supabase stores confirmation differently; check user metadata
      const user = data.user;
      if (user && user.email_confirmed_at == null) {
        setLoading(false);
        setError("Please verify your email first. Check your inbox.");
        return;
      }
      setLoading(false);
      onAuthSuccess();
      onClose();
    } catch (e) {
      setLoading(false);
      setError(e.message || "Sign in failed");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-slate-800 rounded-lg max-w-md w-full p-6 mx-4">
        <div className="mb-4 rounded overflow-hidden">
          <img
            src={landingHero}
            alt="Auth banner"
            className="w-full h-28 object-cover"
          />
        </div>
        <div className="flex mb-4">
          <button
            onClick={() => switchTab("signin")}
            className={`flex-1 py-2 ${tab === "signin" ? "border-b-2 border-teal-500 font-semibold" : "text-gray-500"}`}
          >
            Sign In
          </button>
          <button
            onClick={() => switchTab("signup")}
            className={`flex-1 py-2 ${tab === "signup" ? "border-b-2 border-teal-500 font-semibold" : "text-gray-500"}`}
          >
            Sign Up
          </button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded mb-3">{error}</div>
        )}

        {tab === "signin" ? (
          <div className="space-y-3">
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
            <div className="flex items-center gap-2">
              <button
                onClick={handleSignIn}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-teal-500 text-white rounded"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
              <button
                onClick={() => {
                  setForm({ ...form, email: "", password: "" });
                }}
                className="px-3 py-2 border rounded"
              >
                Clear
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <input
              name="full_name"
              type="text"
              placeholder="Full name"
              value={form.full_name}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
            <div className="flex gap-2">
              <input
                name="city"
                placeholder="City"
                value={form.city}
                onChange={handleChange}
                className="flex-1 p-2 border rounded"
              />
              <input
                name="country"
                placeholder="Country"
                value={form.country}
                onChange={handleChange}
                className="w-32 p-2 border rounded"
              />
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleSignUp}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-teal-500 text-white rounded"
              >
                {loading ? "Creating..." : "Create account"}
              </button>
              <button
                onClick={() => {
                  clearState();
                  switchTab("signin");
                }}
                className="px-3 py-2 border rounded"
              >
                Back
              </button>
            </div>
          </div>
        )}

        <div className="mt-4 text-sm text-gray-500">
          In a life-threatening emergency, call 1122 (Pakistan) or your local
          emergency number immediately.
        </div>
      </div>
    </div>
  );
}
