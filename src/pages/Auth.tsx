import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { z } from "zod";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { 
  login, 
  register, 
  sendOtp, 
  validateOtp, 
  forgotPassword, 
  resetPassword,
  setAuthToken 
} from "@/services/authService";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

const emailSchema = z.string().email("Please enter a valid email address");
const passwordSchema = z.string().min(6, "Password must be at least 6 characters");
const otpSchema = z.string().length(6, "OTP must be 6 digits");

type AuthStep = 
  | "login" 
  | "register" 
  | "verify-otp" 
  | "set-password"
  | "forgot-password"
  | "reset-password";

export default function Auth() {
  // Current step in auth flow
  const [step, setStep] = useState<AuthStep>("login");
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginErrors, setLoginErrors] = useState<{ email?: string; password?: string }>({});

  // Register form state
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerLoading, setRegisterLoading] = useState(false);
  const [registerErrors, setRegisterErrors] = useState<{ email?: string }>({});

  // OTP verification state
  const [otp, setOtp] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  // Set password state (after OTP)
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState<{ password?: string; confirm?: string }>({});

  // Forgot password state
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotErrors, setForgotErrors] = useState<{ email?: string }>({});

  const navigate = useNavigate();

  const validateLoginForm = () => {
    const newErrors: { email?: string; password?: string } = {};

    try {
      emailSchema.parse(loginEmail);
    } catch (e) {
      if (e instanceof z.ZodError) {
        newErrors.email = e.errors[0].message;
      }
    }

    try {
      passwordSchema.parse(loginPassword);
    } catch (e) {
      if (e instanceof z.ZodError) {
        newErrors.password = e.errors[0].message;
      }
    }

    setLoginErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateRegisterForm = () => {
    const newErrors: { email?: string } = {};

    try {
      emailSchema.parse(registerEmail);
    } catch (e) {
      if (e instanceof z.ZodError) {
        newErrors.email = e.errors[0].message;
      }
    }

    setRegisterErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePasswordForm = () => {
    const newErrors: { password?: string; confirm?: string } = {};

    try {
      passwordSchema.parse(newPassword);
    } catch (e) {
      if (e instanceof z.ZodError) {
        newErrors.password = e.errors[0].message;
      }
    }

    if (newPassword !== confirmPassword) {
      newErrors.confirm = "Passwords do not match";
    }

    setPasswordErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateLoginForm()) return;

    setLoginLoading(true);

    try {
      const data = await login(loginEmail, loginPassword);

      if (data.token) {
        setAuthToken(data.token);
      }

      toast.success("Welcome back!");
      navigate("/");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Login failed";
      if (message.includes("Invalid") || message.includes("incorrect")) {
        toast.error("Invalid email or password. Please try again.");
      } else {
        toast.error(message);
      }
    } finally {
      setLoginLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateRegisterForm()) return;

    setRegisterLoading(true);

    try {
      await register(registerEmail);
      await sendOtp(registerEmail);
      
      toast.success("OTP sent to your email address");
      setStep("verify-otp");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Registration failed";
      if (message.includes("already registered") || message.includes("already exists")) {
        toast.error("This email is already registered. Please sign in instead.");
      } else {
        toast.error(message);
      }
    } finally {
      setRegisterLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      otpSchema.parse(otp);
    } catch {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    setOtpLoading(true);

    try {
      const email = step === "reset-password" ? forgotEmail : registerEmail;
      await validateOtp(email, otp);
      
      toast.success("Email verified successfully!");
      
      if (step === "reset-password") {
        // Stay on reset-password but now show password form
        setStep("set-password");
      } else {
        setStep("set-password");
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Invalid OTP";
      toast.error(message);
    } finally {
      setOtpLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setResendLoading(true);

    try {
      const email = step === "reset-password" || forgotEmail ? forgotEmail : registerEmail;
      await sendOtp(email);
      toast.success("OTP resent to your email");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to resend OTP";
      toast.error(message);
    } finally {
      setResendLoading(false);
    }
  };

  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePasswordForm()) return;

    setPasswordLoading(true);

    try {
      const email = forgotEmail || registerEmail;
      await resetPassword(email, otp, newPassword);
      
      toast.success("Password set successfully! Please login.");
      resetForms();
      setStep("login");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to set password";
      toast.error(message);
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { email?: string } = {};
    try {
      emailSchema.parse(forgotEmail);
    } catch (e) {
      if (e instanceof z.ZodError) {
        newErrors.email = e.errors[0].message;
      }
    }
    setForgotErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setForgotLoading(true);

    try {
      await forgotPassword(forgotEmail);
      await sendOtp(forgotEmail);
      
      toast.success("OTP sent to your email address");
      setStep("reset-password");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to send reset link";
      toast.error(message);
    } finally {
      setForgotLoading(false);
    }
  };

  const resetForms = () => {
    setLoginEmail("");
    setLoginPassword("");
    setRegisterEmail("");
    setOtp("");
    setNewPassword("");
    setConfirmPassword("");
    setForgotEmail("");
    setLoginErrors({});
    setRegisterErrors({});
    setPasswordErrors({});
    setForgotErrors({});
  };

  const goBack = () => {
    if (step === "verify-otp" || step === "set-password") {
      setStep("register");
    } else if (step === "forgot-password" || step === "reset-password") {
      setStep("login");
    }
    setOtp("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const renderVerifyOtp = () => (
    <div className="space-y-6 max-w-md mx-auto">
      <button
        onClick={goBack}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>

      <div className="text-center space-y-2">
        <h2 className="font-serif text-2xl md:text-3xl font-normal text-foreground">
          Verify Your Email
        </h2>
        <p className="text-muted-foreground">
          We've sent a 6-digit code to{" "}
          <span className="font-medium text-foreground">
            {forgotEmail || registerEmail}
          </span>
        </p>
      </div>

      <form onSubmit={handleVerifyOtp} className="space-y-6">
        <div className="flex justify-center">
          <InputOTP
            maxLength={6}
            value={otp}
            onChange={setOtp}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>

        <Button
          type="submit"
          className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-medium h-12"
          disabled={otpLoading || otp.length !== 6}
        >
          {otpLoading ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              Verifying...
            </span>
          ) : (
            "VERIFY OTP"
          )}
        </Button>

        <div className="text-center">
          <p className="text-muted-foreground text-sm">
            Didn't receive the code?{" "}
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={resendLoading}
              className="text-accent hover:text-accent/80 font-medium transition-colors"
            >
              {resendLoading ? "Sending..." : "Resend OTP"}
            </button>
          </p>
        </div>
      </form>
    </div>
  );

  const renderSetPassword = () => (
    <div className="space-y-6 max-w-md mx-auto">
      <button
        onClick={goBack}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>

      <div className="text-center space-y-2">
        <h2 className="font-serif text-2xl md:text-3xl font-normal text-foreground">
          Set Your Password
        </h2>
        <p className="text-muted-foreground">
          Create a secure password for your account
        </p>
      </div>

      <form onSubmit={handleSetPassword} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="newPassword" className="text-xs font-medium tracking-wider uppercase text-muted-foreground">
            New Password <span className="text-accent">*</span>
          </Label>
          <div className="relative">
            <Input
              id="newPassword"
              type={showNewPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={`h-12 pr-12 border-border bg-background ${
                passwordErrors.password
                  ? "border-destructive focus-visible:ring-destructive"
                  : "focus-visible:ring-accent"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showNewPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
          {passwordErrors.password && (
            <p className="text-sm text-destructive">{passwordErrors.password}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-xs font-medium tracking-wider uppercase text-muted-foreground">
            Confirm Password <span className="text-accent">*</span>
          </Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`h-12 pr-12 border-border bg-background ${
                passwordErrors.confirm
                  ? "border-destructive focus-visible:ring-destructive"
                  : "focus-visible:ring-accent"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showConfirmPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
          {passwordErrors.confirm && (
            <p className="text-sm text-destructive">{passwordErrors.confirm}</p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-medium h-12"
          disabled={passwordLoading}
        >
          {passwordLoading ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              Setting Password...
            </span>
          ) : (
            "SET PASSWORD"
          )}
        </Button>
      </form>
    </div>
  );

  const renderForgotPassword = () => (
    <div className="space-y-6 max-w-md mx-auto">
      <button
        onClick={goBack}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Login
      </button>

      <div className="text-center space-y-2">
        <h2 className="font-serif text-2xl md:text-3xl font-normal text-foreground">
          Forgot Password
        </h2>
        <p className="text-muted-foreground">
          Enter your email and we'll send you an OTP to reset your password
        </p>
      </div>

      <form onSubmit={handleForgotPassword} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="forgotEmail" className="text-xs font-medium tracking-wider uppercase text-muted-foreground">
            Email Address <span className="text-accent">*</span>
          </Label>
          <Input
            id="forgotEmail"
            type="email"
            value={forgotEmail}
            onChange={(e) => setForgotEmail(e.target.value)}
            className={`h-12 border-border bg-background ${
              forgotErrors.email
                ? "border-destructive focus-visible:ring-destructive"
                : "focus-visible:ring-accent"
            }`}
          />
          {forgotErrors.email && (
            <p className="text-sm text-destructive">{forgotErrors.email}</p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-medium h-12"
          disabled={forgotLoading}
        >
          {forgotLoading ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              Sending OTP...
            </span>
          ) : (
            "SEND OTP"
          )}
        </Button>
      </form>
    </div>
  );

  const renderResetPassword = () => (
    <div className="space-y-6 max-w-md mx-auto">
      <button
        onClick={goBack}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Login
      </button>

      <div className="text-center space-y-2">
        <h2 className="font-serif text-2xl md:text-3xl font-normal text-foreground">
          Reset Your Password
        </h2>
        <p className="text-muted-foreground">
          Enter the 6-digit code sent to{" "}
          <span className="font-medium text-foreground">{forgotEmail}</span>
        </p>
      </div>

      <form onSubmit={handleVerifyOtp} className="space-y-6">
        <div className="flex justify-center">
          <InputOTP
            maxLength={6}
            value={otp}
            onChange={setOtp}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>

        <Button
          type="submit"
          className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-medium h-12"
          disabled={otpLoading || otp.length !== 6}
        >
          {otpLoading ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              Verifying...
            </span>
          ) : (
            "VERIFY & CONTINUE"
          )}
        </Button>

        <div className="text-center">
          <p className="text-muted-foreground text-sm">
            Didn't receive the code?{" "}
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={resendLoading}
              className="text-accent hover:text-accent/80 font-medium transition-colors"
            >
              {resendLoading ? "Sending..." : "Resend OTP"}
            </button>
          </p>
        </div>
      </form>
    </div>
  );

  const renderLoginRegister = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
      {/* Login Section */}
      <div className="space-y-6">
        <h2 className="font-serif text-2xl md:text-3xl font-normal text-foreground">
          Login
        </h2>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="loginEmail" className="text-xs font-medium tracking-wider uppercase text-muted-foreground">
              Username or email address <span className="text-accent">*</span>
            </Label>
            <Input
              id="loginEmail"
              type="email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              className={`h-12 border-border bg-background ${
                loginErrors.email
                  ? "border-destructive focus-visible:ring-destructive"
                  : "focus-visible:ring-accent"
              }`}
            />
            {loginErrors.email && (
              <p className="text-sm text-destructive">{loginErrors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="loginPassword" className="text-xs font-medium tracking-wider uppercase text-muted-foreground">
              Password <span className="text-accent">*</span>
            </Label>
            <div className="relative">
              <Input
                id="loginPassword"
                type={showPassword ? "text" : "password"}
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className={`h-12 pr-12 border-border bg-background ${
                  loginErrors.password
                    ? "border-destructive focus-visible:ring-destructive"
                    : "focus-visible:ring-accent"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            {loginErrors.password && (
              <p className="text-sm text-destructive">{loginErrors.password}</p>
            )}
          </div>

          <div className="flex items-center gap-4">
            <Button
              type="submit"
              className="bg-accent hover:bg-accent/90 text-accent-foreground font-medium px-8 h-12"
              disabled={loginLoading}
            >
              {loginLoading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Please wait...
                </span>
              ) : (
                "LOG IN"
              )}
            </Button>

            <div className="flex items-center gap-2">
              <Checkbox
                id="rememberMe"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
              />
              <Label htmlFor="rememberMe" className="text-sm text-foreground cursor-pointer">
                REMEMBER ME
              </Label>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setStep("forgot-password");
              setForgotEmail(loginEmail);
            }}
            className="text-accent hover:text-accent/80 text-sm font-medium transition-colors"
          >
            Lost your password?
          </button>
        </form>
      </div>

      {/* Register Section */}
      <div className="space-y-6">
        <h2 className="font-serif text-2xl md:text-3xl font-normal text-foreground">
          Register
        </h2>

        <form onSubmit={handleRegister} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="registerEmail" className="text-xs font-medium tracking-wider uppercase text-muted-foreground">
              Email address <span className="text-accent">*</span>
            </Label>
            <Input
              id="registerEmail"
              type="email"
              value={registerEmail}
              onChange={(e) => setRegisterEmail(e.target.value)}
              className={`h-12 border-border bg-background ${
                registerErrors.email
                  ? "border-destructive focus-visible:ring-destructive"
                  : "focus-visible:ring-accent"
              }`}
            />
            {registerErrors.email && (
              <p className="text-sm text-destructive">{registerErrors.email}</p>
            )}
          </div>

          <p className="text-muted-foreground text-sm">
            An OTP will be sent to your email for verification.
          </p>

          <p className="text-muted-foreground text-sm leading-relaxed">
            Your personal data will be used to support your experience throughout this
            website, to manage access to your account, and for other purposes described
            in our{" "}
            <Link to="/privacy" className="text-accent hover:underline">
              privacy policy
            </Link>
            .
          </p>

          <Button
            type="submit"
            className="bg-accent hover:bg-accent/90 text-accent-foreground font-medium px-8 h-12"
            disabled={registerLoading}
          >
            {registerLoading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Please wait...
              </span>
            ) : (
              "REGISTER"
            )}
          </Button>
        </form>
      </div>
    </div>
  );

  const getStepContent = () => {
    switch (step) {
      case "verify-otp":
        return renderVerifyOtp();
      case "set-password":
        return renderSetPassword();
      case "forgot-password":
        return renderForgotPassword();
      case "reset-password":
        return renderResetPassword();
      default:
        return renderLoginRegister();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      {/* Page Header Banner */}
      <div className="bg-gradient-charcoal py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-primary-foreground">
              My account
            </h1>
            <nav className="mt-4 md:mt-0 flex items-center gap-2 text-sm text-primary-foreground/70">
              <Link to="/" className="hover:text-primary-foreground transition-colors">
                Home
              </Link>
              <span>/</span>
              <Link to="/books" className="hover:text-primary-foreground transition-colors">
                Bookshop
              </Link>
              <span>/</span>
              <span className="text-accent">My account</span>
            </nav>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 py-12 md:py-16">
        <div className="container mx-auto px-4">
          {getStepContent()}
        </div>
      </main>

      <Footer />
    </div>
  );
}
