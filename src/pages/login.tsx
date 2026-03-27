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

    if (operation === "login") {
      if (!email || !password) {
        alert("Fields are empty!");
        return;
      }
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
      if (!name || !email || !password) {
        alert("Fields are empty!");
        return;
      }
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
    <div className="flex min-h-[calc(100vh-2rem)] w-full items-center justify-center p-4 bg-background transition-colors duration-300">
      <div className="w-full max-w-md rounded-2xl border bg-card p-8 shadow-sm">
        <div className="mb-8 space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {operation === "login" ? "Welcome back" : "Create an account"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {operation === "login"
              ? "Login to continue."
              : "Enter your details to get started."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {operation === "sign-up" && (
            <div className="space-y-2">
              <label
                className="text-sm font-medium text-foreground"
                htmlFor="name"
              >
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  required
                  className="w-full rounded-lg border border-input bg-transparent py-2.5 pl-10 pr-4 text-sm transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label
              className="text-sm font-medium text-foreground"
              htmlFor="email"
            >
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                className="w-full rounded-lg border border-input bg-transparent py-2.5 pl-10 pr-4 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label
              className="text-sm font-medium text-foreground"
              htmlFor="password"
            >
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                required
                className="w-full rounded-lg border border-input bg-transparent py-2.5 pl-10 pr-12 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-muted-foreground transition-colors hover:text-foreground"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 active:scale-[0.98] disabled:opacity-70"
          >
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            {operation === "sign-up" ? "Create Account" : "Login"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          {operation === "login" ? (
            <button
              type="button"
              onClick={() => setOperation("sign-up")}
              className="cursor-pointer transition-colors hover:text-primary"
            >
              New Here? Create Account
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setOperation("login")}
              className="cursor-pointer transition-colors hover:text-primary"
            >
              Already have account? Login
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
