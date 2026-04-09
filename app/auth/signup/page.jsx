// app/auth/signup/page.jsx
// Sign up page with role selection (Customer or Creator)

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/hooks/useAuth';
import { Mail, Lock, User, Loader2, AlertCircle, Eye, EyeOff, CheckCircle, Store, ShoppingBag } from 'lucide-react';

export default function SignUpPage() {
  const router = useRouter();
  const { signUp, signInWithOAuth, loading, error: authError } = useAuth();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [userRole, setUserRole] = useState(null); // 'customer' or 'creator'
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [localLoading, setLocalLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [step, setStep] = useState(1); // Step 1: Role selection, Step 2: Form

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    setError('');

    // Calculate password strength
    if (name === 'password') {
      calculatePasswordStrength(value);
    }
  };

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
    if (password.match(/[0-9]/)) strength++;
    if (password.match(/[^a-zA-Z0-9]/)) strength++;
    setPasswordStrength(strength);
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      setError('Full name is required');
      return false;
    }
    if (formData.fullName.trim().length < 2) {
      setError('Full name must be at least 2 characters');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!formData.email.includes('@')) {
      setError('Please enter a valid email');
      return false;
    }
    if (!formData.password) {
      setError('Password is required');
      return false;
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return false;
    }
    if (passwordStrength < 2) {
      setError('Password must contain uppercase, lowercase, and numbers');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (!userRole) {
      setError('Please select a role');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLocalLoading(true);
    try {
      const { error } = await signUp(
        formData.email,
        formData.password,
        formData.fullName,
        userRole // Pass the selected role
      );
      
      if (error) {
        setError(error || 'Failed to sign up');
        setLocalLoading(false);
        return;
      }

      setSuccess('Account created! Check your email to verify your account.');
      setFormData({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
      });

      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push('/auth/login?verified=true');
      }, 2000);
    } catch (err) {
      setError(err.message || 'An unexpected error occurred');
      setLocalLoading(false);
    }
  };

  const handleOAuthSignUp = async (provider) => {
    if (!userRole) {
      setError('Please select a role first');
      return;
    }
    setLocalLoading(true);
    try {
      const { error } = await signInWithOAuth(provider);
      if (error) {
        setError(`Failed to sign up with ${provider}`);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLocalLoading(false);
    }
  };

  const isLoading = loading || localLoading;
  const passwordsMatch = formData.password && formData.confirmPassword && formData.password === formData.confirmPassword;
  const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500'];
  const strengthLabels = ['Weak', 'Fair', 'Good', 'Strong'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
          <p className="text-gray-600">
            {step === 1 ? 'Choose your role' : 'Join and start selling'}
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Error Message */}
          {(error || authError) && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="text-red-600 flex-shrink-0 w-5 h-5 mt-0.5" />
              <p className="text-red-800 text-sm">{error || authError}</p>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
              <CheckCircle className="text-green-600 flex-shrink-0 w-5 h-5 mt-0.5" />
              <p className="text-green-800 text-sm">{success}</p>
            </div>
          )}

          {/* STEP 1: Role Selection */}
          {step === 1 && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600 mb-6">What best describes you?</p>

              {/* Customer Option */}
              <button
                onClick={() => {
                  setUserRole('customer');
                  setStep(2);
                }}
                disabled={isLoading}
                className={`w-full p-6 rounded-lg border-2 transition-all flex items-start gap-4 ${
                  userRole === 'customer'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <div className={`p-3 rounded-lg ${
                  userRole === 'customer' ? 'bg-blue-100' : 'bg-gray-100'
                }`}>
                  <ShoppingBag className={`w-6 h-6 ${
                    userRole === 'customer' ? 'text-blue-600' : 'text-gray-600'
                  }`} />
                </div>
                <div className="text-left flex-1">
                  <h3 className="font-semibold text-gray-900">I&apos;m a Customer</h3>
                  <p className="text-xs text-gray-500 mt-1">Browse and purchase products</p>
                </div>
              </button>

              {/* Creator Option */}
              <button
                onClick={() => {
                  setUserRole('creator');
                  setStep(2);
                }}
                disabled={isLoading}
                className={`w-full p-6 rounded-lg border-2 transition-all flex items-start gap-4 ${
                  userRole === 'creator'
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <div className={`p-3 rounded-lg ${
                  userRole === 'creator' ? 'bg-indigo-100' : 'bg-gray-100'
                }`}>
                  <Store className={`w-6 h-6 ${
                    userRole === 'creator' ? 'text-indigo-600' : 'text-gray-600'
                  }`} />
                </div>
                <div className="text-left flex-1">
                  <h3 className="font-semibold text-gray-900">I&apos;m a Creator</h3>
                  <p className="text-xs text-gray-500 mt-1">Sell your digital products</p>
                </div>
              </button>

              {/* Sign In Link */}
              <div className="mt-8 pt-6 border-t border-gray-200 text-center">
                <p className="text-gray-600 text-sm">
                  Already have an account?{' '}
                  <Link
                    href="/auth/login"
                    className="text-blue-600 font-semibold hover:text-blue-700 transition"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          )}

          {/* STEP 2: Sign Up Form */}
          {step === 2 && (
            <>
              {/* Back Button */}
              <button
                onClick={() => {
                  setStep(1);
                  setError('');
                }}
                disabled={isLoading}
                className="text-sm text-blue-600 hover:text-blue-700 mb-4 disabled:opacity-50"
              >
                ← Back to role selection
              </button>

              {/* Role Badge */}
              <div className="mb-6 flex items-center gap-2">
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                  userRole === 'creator'
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'bg-blue-100 text-blue-700'
                }`}>
                  {userRole === 'creator' ? '🏪 Creator' : '🛍️ Customer'}
                </div>
              </div>

              {/* Sign Up Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Full Name Field */}
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="John Doe"
                      disabled={isLoading}
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="you@example.com"
                      disabled={isLoading}
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="••••••••"
                      disabled={isLoading}
                      className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition disabled:opacity-50"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>

                  {/* Password Strength Indicator */}
                  {formData.password && (
                    <div className="mt-2">
                      <div className="flex gap-1 mb-1">
                        {[0, 1, 2, 3].map((i) => (
                          <div
                            key={i}
                            className={`h-1 flex-1 rounded-full ${
                              i < passwordStrength ? strengthColors[passwordStrength - 1] : 'bg-gray-200'
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-gray-600">
                        Strength: <span className="font-medium">{strengthLabels[Math.max(0, passwordStrength - 1)]}</span>
                      </p>
                    </div>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="••••••••"
                      disabled={isLoading}
                      className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      disabled={isLoading}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition disabled:opacity-50"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>

                  {/* Password Match Indicator */}
                  {formData.confirmPassword && (
                    <div className="mt-2 flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${passwordsMatch ? 'bg-green-500' : 'bg-red-500'}`} />
                      <p className={`text-xs ${passwordsMatch ? 'text-green-600' : 'text-red-600'}`}>
                        {passwordsMatch ? 'Passwords match' : 'Passwords do not match'}
                      </p>
                    </div>
                  )}
                </div>

                {/* Terms Agreement */}
                <div className="flex items-start gap-2 pt-2">
                  <input
                    id="terms"
                    type="checkbox"
                    disabled={isLoading}
                    className="mt-1 w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <label htmlFor="terms" className="text-xs text-gray-600">
                    I agree to the{' '}
                    <Link href="/terms" className="text-blue-600 hover:text-blue-700">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link href="/privacy" className="text-blue-600 hover:text-blue-700">
                      Privacy Policy
                    </Link>
                  </label>
                </div>

                {/* Sign Up Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-6 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </button>
              </form>

              {/* Sign In Link */}
              <div className="mt-6 pt-6 border-t border-gray-200 text-center">
                <p className="text-gray-600 text-sm">
                  Already have an account?{' '}
                  <Link
                    href="/auth/login"
                    className="text-blue-600 font-semibold hover:text-blue-700 transition"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        {step === 1 && (
          <div className="mt-8 text-center text-sm text-gray-600">
            <p>Join thousands of creators and customers</p>
          </div>
        )}
      </div>
    </div>
  );
}