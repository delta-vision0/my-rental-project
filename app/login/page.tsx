"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Building, ArrowRight, Eye, EyeOff } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { ThemeToggle } from "@/components/theme-toggle"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [isRegistering, setIsRegistering] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const [loginForm, setLoginForm] = useState({ email: "", password: "" })
  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  // Check if user is already logged in
  useEffect(() => {
    const savedUser = localStorage.getItem("currentUser")
    if (savedUser) {
      // If user is already logged in, redirect to dashboard
      router.push("/dashboard")
    }

    // Check if register param is present
    const register = searchParams.get("register")
    if (register === "true") {
      setIsRegistering(true)
    }
  }, [router, searchParams])

  const handleLoginInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginForm({ ...loginForm, [e.target.name]: e.target.value })
  }

  const handleRegisterInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRegisterForm({ ...registerForm, [e.target.name]: e.target.value })
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()

    // Simple mock login - in a real app, this would be an API call
    if (loginForm.email && loginForm.password) {
      const user = {
        name: loginForm.email.split("@")[0],
        email: loginForm.email,
      }

      localStorage.setItem("currentUser", JSON.stringify(user))

      toast({
        title: "Login Successful",
        description: `Welcome back, ${user.name}!`,
        variant: "default",
      })

      // Redirect to dashboard
      router.push("/dashboard")
    } else {
      toast({
        title: "Login Failed",
        description: "Please enter valid credentials",
        variant: "destructive",
      })
    }
  }

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()

    // Simple validation
    if (!registerForm.name || !registerForm.email || !registerForm.password) {
      toast({
        title: "Registration Failed",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    if (registerForm.password !== registerForm.confirmPassword) {
      toast({
        title: "Registration Failed",
        description: "Passwords do not match",
        variant: "destructive",
      })
      return
    }

    // Simple mock registration - in a real app, this would be an API call
    const user = {
      name: registerForm.name,
      email: registerForm.email,
    }

    localStorage.setItem("currentUser", JSON.stringify(user))

    toast({
      title: "Registration Successful",
      description: `Welcome, ${user.name}!`,
      variant: "default",
    })

    // Redirect to dashboard
    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen">
      <div className="bg-gradient-to-r from-amber-800 to-rose-900 dark:from-gray-900 dark:to-gray-800 min-h-screen flex flex-col">
        {/* Header */}
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <div className="flex items-center cursor-pointer" onClick={() => router.push("/")}>
            <Building className="h-8 w-8 text-amber-400 mr-2" />
            <h1 className="text-2xl font-bold text-white">Premium Room Finder</h1>
          </div>
          <ThemeToggle />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-md">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden"
            >
              {/* Form Header */}
              <div className="bg-amber-50 dark:bg-gray-700 p-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {isRegistering ? "Create an Account" : "Welcome Back"}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mt-2">
                  {isRegistering ? "Sign up to access all premium features" : "Sign in to continue to your account"}
                </p>
              </div>

              {/* Form Content */}
              <div className="p-6">
                {isRegistering ? (
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                      <Label htmlFor="register-name" className="text-gray-700 dark:text-gray-300">
                        Full Name
                      </Label>
                      <Input
                        id="register-name"
                        name="name"
                        value={registerForm.name}
                        onChange={handleRegisterInputChange}
                        required
                        className="mt-1"
                        placeholder="John Doe"
                      />
                    </div>

                    <div>
                      <Label htmlFor="register-email" className="text-gray-700 dark:text-gray-300">
                        Email Address
                      </Label>
                      <Input
                        id="register-email"
                        name="email"
                        type="email"
                        value={registerForm.email}
                        onChange={handleRegisterInputChange}
                        required
                        className="mt-1"
                        placeholder="john@example.com"
                      />
                    </div>

                    <div>
                      <Label htmlFor="register-password" className="text-gray-700 dark:text-gray-300">
                        Password
                      </Label>
                      <div className="relative mt-1">
                        <Input
                          id="register-password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          value={registerForm.password}
                          onChange={handleRegisterInputChange}
                          required
                          className="pr-10"
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-500"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="register-confirm-password" className="text-gray-700 dark:text-gray-300">
                        Confirm Password
                      </Label>
                      <Input
                        id="register-confirm-password"
                        name="confirmPassword"
                        type="password"
                        value={registerForm.confirmPassword}
                        onChange={handleRegisterInputChange}
                        required
                        className="mt-1"
                        placeholder="••••••••"
                      />
                    </div>

                    <Button type="submit" className="w-full bg-amber-500 hover:bg-amber-600 text-white mt-6">
                      Create Account <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>

                    <div className="text-center mt-4">
                      <p className="text-gray-600 dark:text-gray-400">
                        Already have an account?{" "}
                        <button
                          type="button"
                          className="text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 font-medium"
                          onClick={() => setIsRegistering(false)}
                        >
                          Sign In
                        </button>
                      </p>
                    </div>
                  </form>
                ) : (
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                      <Label htmlFor="login-email" className="text-gray-700 dark:text-gray-300">
                        Email Address
                      </Label>
                      <Input
                        id="login-email"
                        name="email"
                        type="email"
                        value={loginForm.email}
                        onChange={handleLoginInputChange}
                        required
                        className="mt-1"
                        placeholder="john@example.com"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="login-password" className="text-gray-700 dark:text-gray-300">
                          Password
                        </Label>
                        <button
                          type="button"
                          className="text-sm text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300"
                        >
                          Forgot password?
                        </button>
                      </div>
                      <div className="relative mt-1">
                        <Input
                          id="login-password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          value={loginForm.password}
                          onChange={handleLoginInputChange}
                          required
                          className="pr-10"
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-500"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>

                    <Button type="submit" className="w-full bg-amber-500 hover:bg-amber-600 text-white mt-6">
                      Sign In <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>

                    <div className="text-center mt-4">
                      <p className="text-gray-600 dark:text-gray-400">
                        Don't have an account?{" "}
                        <button
                          type="button"
                          className="text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 font-medium"
                          onClick={() => setIsRegistering(true)}
                        >
                          Sign Up
                        </button>
                      </p>
                    </div>
                  </form>
                )}

                {/* Social Login Options */}
                <div className="mt-6">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                        Or continue with
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
                    >
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path
                          fillRule="evenodd"
                          d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="ml-2">Facebook</span>
                    </button>
                    <button
                      type="button"
                      className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
                    >
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
                      </svg>
                      <span className="ml-2">Google</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

