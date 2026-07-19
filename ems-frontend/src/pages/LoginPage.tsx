import { useState, type FormEvent } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { Orbit, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
// Demo credentials matching the seeded database
const demoAccounts = [
  { email: 'aarav.sharma@orbit.io',  password: 'admin123', user: { role: 'Super Admin' } },
  { email: 'priya.nair@orbit.io',    password: 'hr123',    user: { role: 'HR Manager'  } },
  { email: 'karan.joshi@orbit.io',   password: 'emp123',   user: { role: 'Employee'    } },
] as const;
import toast from 'react-hot-toast';

export default function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  if (user) {
    const from = (location.state as { from?: Location })?.from?.pathname || '/dashboard';
    return <Navigate to={from} replace />;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    const result = await login(email, password);
    setIsLoading(false);
    if (result.success) {
      toast.success('Welcome back!');
      navigate('/dashboard');
    } else {
      setError(result.error ?? 'Login failed');
    }
  };

  const fillDemo = (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
  };

  return (
    <div className="flex min-h-screen bg-base">
      {/* Left panel — brand */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-[#0a0d16] p-12 text-white lg:flex">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 20%, rgba(124,92,255,0.35), transparent 40%), radial-gradient(circle at 80% 70%, rgba(56,189,248,0.25), transparent 45%)',
          }}
        />
        <div className="relative flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-500">
            <Orbit size={18} />
          </div>
          <span className="font-display text-lg font-semibold">Orbit</span>
        </div>

        <div className="relative">
          <h1 className="font-display text-4xl font-semibold leading-tight">
            People operations,<br />finally in orbit.
          </h1>
          <p className="mt-4 max-w-sm text-sm text-white/60">
            Manage your entire workforce — hierarchy, roles, and records — from one calm, connected dashboard.
          </p>

          <div className="mt-10 flex items-center gap-6">
            <div>
              <p className="font-display text-2xl font-semibold">35+</p>
              <p className="text-xs text-white/50">Employees tracked</p>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div>
              <p className="font-display text-2xl font-semibold">9</p>
              <p className="text-xs text-white/50">Departments</p>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div>
              <p className="font-display text-2xl font-semibold">3</p>
              <p className="text-xs text-white/50">Access tiers</p>
            </div>
          </div>
        </div>

        <p className="relative text-xs text-white/40">© {new Date().getFullYear()} Orbit HR. All rights reserved.</p>
      </div>

      {/* Right panel — form */}
      <div className="flex w-full flex-col items-center justify-center px-6 py-12 lg:w-1/2">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-2.5 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-500 text-white">
              <Orbit size={18} />
            </div>
            <span className="font-display text-lg font-semibold text-primary">Orbit</span>
          </div>

          <h2 className="font-display text-2xl font-semibold text-primary">Welcome back</h2>
          <p className="mt-1.5 text-sm text-secondary">Sign in to manage your organization.</p>

          <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
            <div className="relative">
              <Mail size={16} className="pointer-events-none absolute left-3.5 top-[42px] text-tertiary" />
              <Input
                label="Email address"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@orbit.io"
                className="pl-10"
              />
            </div>

            <div className="relative">
              <Lock size={16} className="pointer-events-none absolute left-3.5 top-[42px] text-tertiary" />
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="pl-10 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3.5 top-[42px] text-tertiary hover:text-secondary"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {error && (
              <div className="rounded-lg bg-danger-500/10 px-3.5 py-2.5 text-xs font-medium text-danger-500">
                {error}
              </div>
            )}

            <Button type="submit" fullWidth isLoading={isLoading} icon={<ArrowRight size={16} />} className="mt-1">
              Sign in
            </Button>
          </form>

          <div className="mt-8">
            <p className="mb-3 text-center text-xs font-medium text-tertiary">Quick demo access</p>
            <div className="grid grid-cols-3 gap-2">
              {demoAccounts.map((acc) => (
                <button
                  key={acc.email}
                  onClick={() => fillDemo(acc.email, acc.password)}
                  className="rounded-lg border border-default px-2 py-2.5 text-center text-xs font-medium text-secondary transition-colors hover:border-accent-500/50 hover:bg-surface-2 hover:text-accent-500"
                >
                  {acc.user.role}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
