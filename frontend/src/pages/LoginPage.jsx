import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Button from '../components/common/Button.jsx';
import { useToast } from '../components/common/Toast.jsx';
import { getErrorMessage } from '../utils/errorMessage';

const SEEDED_ACCOUNTS = ['alice@test.com', 'bob@test.com', 'carol@test.com'];

function Field({ label, ...rest }) {
  return (
    <label className="flex flex-col gap-1.5 text-left">
      <span className="text-xs font-medium text-slate-600">{label}</span>
      <input
        {...rest}
        className="rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
      />
    </label>
  );
}

export default function LoginPage() {
  const [mode, setMode] = useState('login'); // login | register
  const [name, setName] = useState('');
  const [email, setEmail] = useState('alice@test.com');
  const [password, setPassword] = useState('password123');
  const [submitting, setSubmitting] = useState(false);
  const { login, register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (mode === 'login') {
        await login(email.trim(), password);
      } else {
        await register(name.trim(), email.trim(), password);
      }
      navigate('/');
    } catch (err) {
      showToast(getErrorMessage(err, 'Authentication failed'), 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-50 via-[#f5f6fb] to-brand-100 px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center gap-2 text-center">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-600 text-lg font-bold text-white shadow-card">
            C
          </span>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">Collab Docs</h1>
          <p className="text-sm text-slate-500">
            {mode === 'login' ? 'Log in to your workspace' : 'Create your account'}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {mode === 'register' && (
              <Field
                label="Full name"
                type="text"
                required
                placeholder="Jane Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            )}
            <Field
              label="Email"
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Field
              label="Password"
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" disabled={submitting} className="mt-1 w-full">
              {submitting ? 'Please wait…' : mode === 'login' ? 'Log in' : 'Sign up'}
            </Button>
          </form>

          <button
            onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
            className="mt-4 w-full text-center text-xs font-medium text-slate-500 hover:text-brand-600"
          >
            {mode === 'login' ? "Don't have an account? Sign up" : 'Already have an account? Log in'}
          </button>

          {mode === 'login' && (
            <div className="mt-5 rounded-xl bg-slate-50 p-3.5 text-xs text-slate-500">
              <p className="mb-2 font-semibold text-slate-600">Seeded demo accounts</p>
              <div className="flex flex-wrap gap-1.5">
                {SEEDED_ACCOUNTS.map((acc) => (
                  <button
                    key={acc}
                    type="button"
                    onClick={() => setEmail(acc)}
                    className={`rounded-full px-2.5 py-1 font-mono text-[11px] shadow-sm transition ${
                      email === acc
                        ? 'bg-brand-600 text-white'
                        : 'bg-white text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {acc}
                  </button>
                ))}
              </div>
              <p className="mt-2.5">
                Password for all: <span className="font-mono text-slate-600">password123</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
