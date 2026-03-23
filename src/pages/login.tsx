import React, { useState } from "react";
import { Eye, EyeOff, Mail, Lock, User, Loader2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useNavigate } from "react-router";
import { Navigate } from "react-router";

const Login = () => {
  const { data } = authClient.useSession();
  if (data) return <Navigate to="/" />;
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [operation, setOperation] = useState<"login" | "sign-up">("login");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();

    setIsLoading(true);
    if (!name || !email || !password) {
      alert("Fields are empty!");
      return;
    }
    if (operation === "login") {
      await authClient.signIn.email(
        {
          email: email,
          password: password,
        },
        {
          onRequest: () => setIsLoading(true),
          onError: (ctx) => {
            setIsLoading(false);
            console.log("Error:", ctx.error.message);
            alert("Failed to login, something went wrong!");
          },
          onSuccess: () => {
            setIsLoading(false);
            navigate("/");
          },
        },
      );
    } else {
      await authClient.signUp.email(
        {
          name: name,
          email: email,
          password: password,
        },
        {
          onRequest: () => setIsLoading(true),
          onError: (ctx) => {
            setIsLoading(false);
            console.log("Error:", ctx.error.message);
            alert("Failed to sign up, something went wrong!");
          },
          onSuccess: () => {
            setIsLoading(false);
            navigate("/");
          },
        },
      );
    }
  };

  return (
    <div className="flex min-h-150 w-full items-center justify-center p-4 bg-slate-50/50">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-8 space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Create an account
          </h1>
          <p className="text-sm text-slate-500">
            Enter your details to get started.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name Field */}

          {operation === "sign-up" && (
            <div className="space-y-2">
              <label
                className="text-sm font-medium text-slate-700"
                htmlFor="name"
              >
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  required
                  className="w-full rounded-lg border border-slate-200 bg-transparent py-2.5 pl-10 pr-4 text-sm transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/10 placeholder:text-slate-400"
                />
              </div>
            </div>
          )}

          {/* Email Field */}
          <div className="space-y-2">
            <label
              className="text-sm font-medium text-slate-700"
              htmlFor="email"
            >
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                className="w-full rounded-lg border border-slate-200 bg-transparent py-2.5 pl-10 pr-4 text-sm transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/10"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <label
              className="text-sm font-medium text-slate-700"
              htmlFor="password"
            >
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                required
                className="w-full rounded-lg border border-slate-200 bg-transparent py-2.5 pl-10 pr-12 text-sm transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 py-2.5 text-sm font-semibold text-white transition-all hover:bg-slate-800 active:scale-[0.98] disabled:opacity-70"
          >
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            {operation === "sign-up" ? "Create Account" : "Login"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-500 cursor-pointer">
          {operation === "login" ? (
            <span onClick={() => setOperation("sign-up")}>
              New Here? Create Account
            </span>
          ) : (
            <span onClick={() => setOperation("login")}>
              Already have account? Login
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
