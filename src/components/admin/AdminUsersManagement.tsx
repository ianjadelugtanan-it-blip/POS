import React, { useState } from 'react';
import { Users, UserPlus, Shield, Trash2 } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { API_BASE_URL } from '../../context/AppContextProvider';

export const AdminUsersManagement: React.FC = () => {
  const { users, setUsers } = useAppContext();
  const [newUsername, setNewUsername] = useState('');
  const [newRole, setNewRole] = useState<'admin' | 'client'>('admin');
  const [newPassword, setNewPassword] = useState('');

  const handleAddUser = async () => {
    if (!newUsername.trim() || !newPassword.trim()) {
      alert("Username and Password are required.");
      return;
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          username: newUsername.trim(), 
          role: newRole,
          password: newPassword.trim()
        })
      });

      const result = await response.json();

      if (response.ok) {
        // Refresh the list from the server
        const userRes = await fetch(`${API_BASE_URL}/users/get.php`);
        if (userRes.ok) setUsers(await userRes.json());
        
        setNewUsername('');
        setNewPassword('');
        alert("Account created successfully!");
      } else {
        alert(result.error || "Failed to create account.");
      }
    } catch (error) {
      alert("Connection error. Is XAMPP running?");
    }
  };

  const handleRemoveUser = async (usernameToRemove: string) => {
    if (usernameToRemove === 'admin' || usernameToRemove === 'client') {
      alert("System core accounts cannot be removed.");
      return;
    }
    
    if (!confirm(`Are you sure you want to revoke access for ${usernameToRemove}?`)) return;

    try {
      const response = await fetch(`${API_BASE_URL}/users/remove.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: usernameToRemove })
      });

      const result = await response.json();

      if (response.ok) {
        setUsers(users.filter(u => u.username !== usernameToRemove));
      } else {
        alert(result.error || "Failed to remove user.");
      }
    } catch (error) {
      alert("Connection error. Is XAMPP running?");
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
           <h2 className="text-2xl font-bold text-gray-900 tracking-tight">System Configuration</h2>
           <p className="text-gray-500 mt-1">Manage platform accounts and roles.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* Creation Form */}
        <div className="xl:col-span-4">
           <div className="card p-6 sticky top-8 border border-gray-200">
             <div className="flex items-center gap-2 mb-6">
                <UserPlus className="w-5 h-5 text-gray-400" />
                <h3 className="text-lg font-bold text-gray-900">Add Account</h3>
             </div>
             
             <div className="space-y-4">
               <div>
                 <label className="block text-sm font-semibold text-gray-700 mb-1">Username</label>
                 <input
                    type="text"
                    value={newUsername}
                    onChange={e => setNewUsername(e.target.value)}
                    placeholder="Enter username"
                    className="input-field"
                 />
               </div>
               <div>
                 <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
                 <input
                    type="password"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    placeholder="Enter explicit password"
                    className="input-field"
                 />
               </div>
               <div>
                 <label className="block text-sm font-semibold text-gray-700 mb-1">Access Role</label>
                 <select 
                    value={newRole} 
                    onChange={e => setNewRole(e.target.value as 'admin' | 'client')}
                    className="input-field"
                 >
                    <option value="admin">Administrator (Full Access)</option>
                    <option value="client">Client (Store Only)</option>
                 </select>
               </div>
               <button 
                  onClick={handleAddUser}
                  className="w-full btn-primary mt-4"
               >
                  Create Secure Account
               </button>
             </div>
           </div>
        </div>

        {/* User Grid */}
        <div className="xl:col-span-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {users.map((u, index) => (
               <div key={u.username} className="card p-5 border border-gray-200 group flex flex-col hover:-translate-y-1 hover:shadow-xl transition-all duration-300 animate-cascade" style={{ animationDelay: `${index * 75}ms` }}>
                 <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200 shadow-sm">
                      {u.role === 'admin' ? (
                        <Shield className="w-6 h-6 text-blue-600" />
                      ) : (
                        <Users className="w-6 h-6 text-gray-500" />
                      )}
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                      u.role === 'admin' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-gray-100 text-gray-700 border border-gray-200'
                    }`}>
                      {u.role}
                    </span>
                 </div>
                 
                 <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-900 break-words">{u.username}</h3>
                    <p className="text-sm font-medium text-gray-500 mt-1">Has valid system credentials</p>
                 </div>
                 
                 <div className="mt-auto pt-4 border-t border-gray-100 flex justify-end">
                   {u.username !== 'admin' && u.username !== 'client' ? (
                     <button 
                       onClick={() => handleRemoveUser(u.username)}
                       className="flex items-center gap-1.5 text-sm font-semibold text-gray-400 hover:text-red-600 transition-colors bg-gray-50 hover:bg-red-50 px-3 py-1.5 rounded-full"
                     >
                       <Trash2 className="w-4 h-4" />
                       Revoke Access
                     </button>
                   ) : (
                     <span className="text-xs font-bold uppercase tracking-wider text-gray-300 select-none">
                       System Core Admin
                     </span>
                   )}
                 </div>
               </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
