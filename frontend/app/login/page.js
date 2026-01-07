import { LoginForm } from "@/components/auth/login-form"
import Link from "next/link"
export const metadata = {
  title: "Login | Jobify",
  description: "Access your Jobify account to start applying.",
};
export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-background via-background to-muted p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-3 text-balance">Welcome back</h1>
          <p className="text-muted-foreground text-lg">Sign in to continue your job search</p>
        </div>

        <LoginForm />

        <p className="text-center text-sm text-muted-foreground mt-6">
          {"Don't have an account? "}
          <Link href="/register" className="text-primary hover:underline font-medium">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
