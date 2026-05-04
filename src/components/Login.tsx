import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { Eye, EyeOff } from 'lucide-react';

export const Login: React.FC = () => {
  const { setUser, users } = useAppContext();
  const [isLogin, setIsLogin] = useState(true);
  
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');

  const [loginAttempts, setLoginAttempts] = useState(0);
  const [lockoutTimer, setLockoutTimer] = useState(0);

  useEffect(() => {
    let interval: any;
    if (lockoutTimer > 0) {
      interval = setInterval(() => {
        setLockoutTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [lockoutTimer]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (lockoutTimer > 0) return; // Block submissions if on cooldown
    
    setError('');

    if (isLogin) {
      const validUser = users.find(u => u.username === username);
      
      if (validUser) {
          const expectedPassword = validUser.password || `${validUser.username}123`;
          if (password === expectedPassword) {
            setLoginAttempts(0); // Reset attempts on successful login
            setUser({ username: validUser.username, role: validUser.role });
            return;
          }
      }
      
      const newAttempts = loginAttempts + 1;
      if (newAttempts >= 5) {
        setLockoutTimer(30); // 30 seconds cooldown
        setLoginAttempts(0);
        setError('Security Alert: Too many failed attempts. Cooldown triggered for 30 seconds to prevent brute-force attacks.');
      } else {
        setLoginAttempts(newAttempts);
        setError(`Incorrect username or password. (${5 - newAttempts} attempts left)`);
      }
    } else {
      if (!name || !username || !password || !confirmPassword) {
        setError('Please fill out all fields.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
      setUser({ username, role: 'client' });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center overflow-hidden relative" style={{ backgroundColor: 'var(--cream)' }}>
      
      {/* Warm background blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-24 -left-24 w-[32rem] h-[32rem] rounded-full opacity-30" style={{ background: 'radial-gradient(circle, #E8D9C0 0%, transparent 70%)' }} />
        <div className="absolute -bottom-24 -right-24 w-[28rem] h-[28rem] rounded-full opacity-25" style={{ background: 'radial-gradient(circle, #C4752B22 0%, transparent 70%)' }} />
        {/* Scattered dot texture */}
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#C9B99A 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
      </div>

      <div className="w-full max-w-[420px] px-4 relative z-10 animate-cascade">

        {/* Logo / Brand */}
        <div className="text-center mb-8">
          {/* Hanger icon */}
          <div className="flex items-center justify-center mb-4">
            <svg viewBox="0 0 60 48" className="w-16 h-16 animate-tag-swing" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M30 6 C30 6 36 2 38 8 C40 14 34 14 34 14" stroke="#C4752B" strokeWidth="2.5" strokeLinecap="round"/>
              <circle cx="30" cy="5" r="3" stroke="#C4752B" strokeWidth="2.5" fill="none"/>
              <path d="M30 14 L5 40 Q3 44 8 44 L52 44 Q57 44 55 40 L30 14Z" stroke="#5C3D2E" strokeWidth="2.5" fill="#FAF6EF" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 className="text-4xl font-bold mb-1" style={{ fontFamily: "'Playfair Display', serif", color: 'var(--brown)' }}>
            The Find
          </h1>
          <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
            Curated Thrift & Pre-Loved Goods
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border overflow-hidden shadow-lg" style={{ backgroundColor: 'var(--warm-white)', borderColor: 'var(--border)' }}>
          
          {/* Card header */}
          <div className="px-8 pt-7 pb-5 border-b" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--parchment)' }}>
            <div className="vintage-divider">
              <span>{isLogin ? 'Sign In to Your Account' : 'Create an Account'}</span>
            </div>
          </div>

          <div className="p-8">
            {error && (
              <div className="mb-5 p-3.5 rounded-lg text-sm font-medium flex items-center gap-2.5" style={{ backgroundColor: '#FEF2F2', color: 'var(--rust)', border: '1px solid #FECACA' }}>
                <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/></svg>
                {error}
              </div>
            )}

            <form className="space-y-5" onSubmit={handleSubmit}>
              {!isLogin && (
                <div>
                  <label className="block text-xs font-bold mb-1.5 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input-field"
                    placeholder="Jane Doe"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold mb-1.5 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                  Username
                </label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="input-field"
                  placeholder="your_username"
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1.5 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (e.target.value === '') setShowPassword(false);
                    }}
                    className="input-field pr-10"
                    placeholder="••••••••"
                  />
                  {password.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  )}
                </div>
              </div>

              {!isLogin && (
                <div>
                  <label className="block text-xs font-bold mb-1.5 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        if (e.target.value === '') setShowConfirmPassword(false);
                      }}
                      className="input-field pr-10"
                      placeholder="••••••••"
                    />
                    {confirmPassword.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    )}
                  </div>
                </div>
              )}

              <div className="pt-2">
                <button 
                  type="submit" 
                  disabled={lockoutTimer > 0}
                  className={`w-full py-3 text-sm flex items-center justify-center transition-all ${lockoutTimer > 0 ? 'bg-gray-200 text-gray-500 cursor-not-allowed rounded-lg font-bold' : 'btn-primary'}`}
                >
                  {lockoutTimer > 0 ? `Locked Out (${lockoutTimer}s)` : (isLogin ? 'Sign In' : 'Create Account')}
                </button>
              </div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => { setIsLogin(!isLogin); setError(''); setConfirmPassword(''); }}
                  className="text-sm font-semibold transition-colors"
                  style={{ color: 'var(--sienna)' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--sienna-dark)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--sienna)')}
                >
                  {isLogin ? "New here? Create an account →" : "Already have an account? Sign in →"}
                </button>
              </div>
            </form>

            {isLogin && (
              <div className="mt-7 pt-6" style={{ borderTop: '1px solid var(--border)' }}>
                <p className="text-center text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'var(--text-light)' }}>
                  Quick Access
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    className="btn-secondary text-xs py-2.5"
                    onClick={() => { setUsername('admin'); setPassword('123'); }}
                  >
                    🏪 Staff Login
                  </button>
                  <button 
                    className="btn-secondary text-xs py-2.5"
                    onClick={() => { setUsername('client'); setPassword('123'); }}
                  >
                    🛍 Shopper Login
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <p className="text-center mt-6 text-xs" style={{ color: 'var(--text-light)' }}>
          © The Find Thrift Shop · All goods pre-loved with care
        </p>
      </div>
    </div>
  );
};
