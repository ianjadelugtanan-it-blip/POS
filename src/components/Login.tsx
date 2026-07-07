import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { API_BASE_URL } from '../config';
import { Eye, EyeOff, Shirt } from 'lucide-react';
import { SuccessModal } from './ui/SuccessModal';




export const Login: React.FC = () => {
  const { setUser } = useAppContext();
  const [isLogin, setIsLogin] = useState(true);
  

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [lockoutTimer, setLockoutTimer] = useState(0);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (lockoutTimer > 0) {
      interval = setInterval(() => {
        setLockoutTimer((prev) => {
          if (prev <= 1) {
            setError(''); // Clear error when timer ends
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [lockoutTimer]);

  useEffect(() => {
    if (lockoutTimer === 0 && error.includes('Security Alert')) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setError('');
    }
  }, [lockoutTimer, error]);

  const passwordStrength = React.useMemo(() => {
    if (!password) return { score: 0, label: '', color: '' };

    let score = 0;
    if (password.length > 6) score++;
    if (password.length > 10) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    let label = '';
    let color = '';

    switch (score) {
      case 0:
      case 1:
        label = 'Weak';
        color = 'text-red-500';
        break;
      case 2:
        label = 'Fair';
        color = 'text-orange-500';
        break;
      case 3:
        label = 'Good';
        color = 'text-green-500';
        break;
      case 4:
        label = 'Strong';
        color = 'text-green-600';
        break;
    }
    return { score, label, color };
  }, [password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (lockoutTimer > 0) return;
    
    setError('');
    setIsLoading(true);

    try {
      if (isLogin) {
        const response = await fetch(`${API_BASE_URL}/auth/login.php`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        });

        const result = await response.json();

        if (response.ok) {
          setLoginAttempts(0);
          setUser(result.user);
        } else {
          const newAttempts = loginAttempts + 1;
          if (newAttempts >= 5) {
            setLockoutTimer(30);
            setLoginAttempts(0);
            setError('Too many failed attempts. Cooldown activated.');
          } else {
            setLoginAttempts(newAttempts);
            setError(result.error || `Incorrect credentials. (${5 - newAttempts} left)`);
          }
        }
      } else {
        if (!username || !password || !confirmPassword) {
          setError('Please fill out all fields.');
          setIsLoading(false);
          return;
        }
        if (password !== confirmPassword) {
          setError('Passwords do not match.');
          setIsLoading(false);
          return;
        }

        const response = await fetch(`${API_BASE_URL}/auth/register.php`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password, role: 'client' })
        });

        const result = await response.json();

        if (response.ok) {
          // Clear credentials so they don't persist in login form
          setUsername('');
          setPassword('');
          setConfirmPassword('');
          
          
          setIsLogin(true);
          setError('');
          setShowSuccessModal(true);
        } else {
          setError(result.error || 'Registration failed.');
        }

      }
    } catch {
      setError('Connection to server failed. Is XAMPP running?');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`sliding-container animate-in fade-in zoom-in-[0.98] duration-700 ease-out ${!isLogin ? 'is-registering' : ''}`}>
      <SuccessModal 
        isOpen={showSuccessModal} 
        onClose={() => setShowSuccessModal(false)}
        title="Welcome to The Find!"
        message="Your account has been created successfully. You can now sign in with your credentials to start your collection of stories."
      />

      
      {/* ── Visual Sliding Overlay ── */}
      <div className="overlay-side flex">
        <div className="overlay-bg-texture" />
        <div className="texture-overlay absolute inset-0 opacity-10" />
        
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Content for Login Mode (Image on Left) */}
          <div className="overlay-content overlay-left flex flex-col items-center">
            <div className="mb-8 p-6 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 animate-tag-swing">
              <svg viewBox="0 0 60 48" className="w-24 h-24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M30 6 C30 6 36 2 38 8 C40 14 34 14 34 14" stroke="#F2EAD8" strokeWidth="2" strokeLinecap="round"/>
                <path d="M30 14 L5 40 Q3 44 8 44 L52 44 Q57 44 55 40 L30 14Z" stroke="white" strokeWidth="2.5" fill="rgba(255,255,255,0.1)" strokeLinejoin="round"/>
              </svg>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold mb-2 md:mb-4 tracking-tight">Welcome Back</h1>
            <p className="hidden md:block text-lg text-parchment max-w-sm font-medium">
              Continue your journey of discovery. Your curated finds are waiting for you.
            </p>
          </div>

          {/* Content for Register Mode (Image on Right) */}
          <div className="overlay-content overlay-right flex flex-col items-center transition-all duration-700">
            <div className="mb-4 md:mb-8 p-4 md:p-6 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 animate-tag-swing">
              <svg viewBox="0 0 60 48" className="w-12 h-12 md:w-24 md:h-24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M30 6 C30 6 36 2 38 8 C40 14 34 14 34 14" stroke="#F2EAD8" strokeWidth="2" strokeLinecap="round"/>
                <path d="M30 14 L5 40 Q3 44 8 44 L52 44 Q57 44 55 40 L30 14Z" stroke="white" strokeWidth="2.5" fill="rgba(255,255,255,0.1)" strokeLinejoin="round"/>
              </svg>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold mb-2 md:mb-4 tracking-tight">Join The Find</h1>
            <p className="hidden md:block text-lg text-parchment max-w-sm font-medium">
              Start your own collection of stories. Register today to access exclusive pre-loved treasures.
            </p>
          </div>
        </div>
      </div>

      {/* ── Login Form Side ── */}
      <div className="form-container login-side">
        <div className="w-full max-w-[400px] px-8">
            <div className="flex flex-col items-center md:items-start mb-8">
               <div className="flex items-center gap-2.5 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-[#C4752B] flex items-center justify-center shadow-lg shadow-[#C4752B]/20">
                     <Shirt className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-xl font-bold text-brown tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>The Find</span>
               </div>
            </div>
            
            <div className="mb-10">
              <h2 className="text-4xl font-bold text-gray-900 mb-2 tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>Welcome back</h2>
              <p className="text-sm text-gray-500 font-medium">Continue your journey into the world of pre-loved treasures.</p>
           </div>

           {error && isLogin && (
             <div className="mb-5 p-3.5 rounded-lg text-sm font-medium flex items-center gap-2.5 bg-red-50 text-red-700 border border-red-100">
               {error}
             </div>
           )}

           <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Account Access</label>
                <input type="text" required value={username} onChange={(e)=>setUsername(e.target.value)} className="input-field" placeholder="Phone number / Username / Email" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Password</label>
                <div className="relative">
                  <input type={showPassword ? "text" : "password"} required value={password} onChange={(e)=>setPassword(e.target.value)} className="input-field" placeholder="••••••••" />
                  <button type="button" onClick={()=>setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <button type="submit" disabled={lockoutTimer > 0 || isLoading} className="w-full btn-primary py-3.5 mt-2">
                {lockoutTimer > 0 ? `Locked (${lockoutTimer}s)` : isLoading ? 'Signing In...' : 'Sign In'}
              </button>
           </form>

           <div className="mt-8 text-center">
             <p className="text-sm text-gray-500">
               New here? <button onClick={() => { 
                 setIsLogin(false); 
                 setError(''); 
                 setUsername('');
                 setPassword('');
                 setConfirmPassword('');
                 
               }} className="text-sienna font-bold hover:underline">Create an account</button>

             </p>
           </div>


        </div>
      </div>

      {/* ── Register Form Side ── */}
      <div className="form-container register-side">
        <div className="w-full max-w-[400px] px-8">
            <div className="flex flex-col items-center md:items-start mb-8">
               <div className="flex items-center gap-2.5 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-[#C4752B] flex items-center justify-center shadow-lg shadow-[#C4752B]/20">
                     <Shirt className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-xl font-bold text-brown tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>The Find</span>
               </div>
            </div>

            <div className="mb-10">
              <h2 className="text-4xl font-bold text-gray-900 mb-2 tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>Create account</h2>
              <p className="text-sm text-gray-500 font-medium">Join our community of curators and finders.</p>
           </div>

           {error && !isLogin && (
             <div className="mb-5 p-3.5 rounded-lg text-sm font-medium flex items-center gap-2.5 bg-red-50 text-red-700 border border-red-100">
               {error}
             </div>
           )}

           <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Username</label>
                <input type="text" required value={username} onChange={(e)=>setUsername(e.target.value)} className="input-field" placeholder="Phone number / Username / Email" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Password</label>
                <div className="relative">
                  <input type={showPassword ? "text" : "password"} required value={password} onChange={(e)=>setPassword(e.target.value)} className="input-field" placeholder="••••••••" />
                  <button type="button" onClick={()=>setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {passwordStrength.label && (
                  <div className="flex items-center gap-2 mt-1.5 ml-1">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4].map((step) => (
                        <div 
                          key={step} 
                          className={`h-1 w-6 rounded-full transition-all duration-300 ${
                            step <= passwordStrength.score ? (
                              passwordStrength.score <= 1 ? 'bg-red-400' : 
                              passwordStrength.score === 2 ? 'bg-orange-400' : 
                              passwordStrength.score === 3 ? 'bg-olive' : 'bg-green-500'
                            ) : 'bg-gray-200'
                          }`} 
                        />
                      ))}
                    </div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${passwordStrength.color}`}>
                      {passwordStrength.label}
                    </span>
                  </div>
                )}
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Confirm Password</label>
                <div className="relative">
                  <input type={showConfirmPassword ? "text" : "password"} required value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)} className="input-field" placeholder="••••••••" />
                  <button type="button" onClick={()=>setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <button type="submit" disabled={isLoading} className="w-full btn-primary py-3.5 mt-2">
                {isLoading ? 'Creating...' : 'Create Account'}
              </button>
           </form>

           <div className="mt-8 text-center">
             <p className="text-sm text-gray-500">
               Already have an account? <button onClick={() => { 
                 setIsLogin(true); 
                 setError(''); 
                 setUsername('');
                 setPassword('');
                 setConfirmPassword('');
               }} className="text-sienna font-bold hover:underline">Sign in instead</button>
             </p>

           </div>

        </div>
      </div>

    </div>
  );
};
