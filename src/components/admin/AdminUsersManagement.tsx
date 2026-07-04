import React, { useState, useEffect } from 'react';
import type { User } from '../../types';
import { Users, UserPlus, Shield, Trash2 } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { AlertBanner } from '../ui/AlertBanner';
import { API_BASE_URL } from '../../config';
import { SkeletonUserCard } from '../ui/Skeleton';
import { SuccessModal } from '../ui/SuccessModal';

export const AdminUsersManagement: React.FC = () => {
  const { users, setUsers, isLoadingUsers } = useAppContext();
  const [newUsername, setNewUsername] = useState('');
  const [newRole, setNewRole] = useState<'admin' | 'client'>('admin');
  const [newPassword, setNewPassword] = useState('');
  const [userToRemove, setUserToRemove] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [removedUser, setRemovedUser] = useState<User | null>(null);

  // Revoke modal
  const [showRevokeModal, setShowRevokeModal] = useState(false);
  const [revokedUsername, setRevokedUsername] = useState('');

  // Create modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createdUsername, setCreatedUsername] = useState('');

  const anyModalOpen = showRevokeModal || showCreateModal;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Heuristic 3: Escape key dismisses the access revoke confirmation overlay
      if (e.key === 'Escape') {
        setUserToRemove(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleAddUser = async () => {
    setError(null);
    if (!newUsername.trim() || !newPassword.trim()) {
      setError("Username and Password are required. Please fill out both fields.");
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

        const created = newUsername.trim();
        setNewUsername('');
        setNewPassword('');
        setCreatedUsername(created);
        setShowCreateModal(true);
      } else {
        setError(result.error || "Failed to create account.");
      }
    } catch {
      setError("Connection error. Is XAMPP running?");
    }
  };

  const handleRemoveUser = async () => {
    if (!userToRemove) return;
    setError(null);
    if (userToRemove === 'admin' || userToRemove === 'client') {
      setError("System core accounts cannot be removed.");
      setUserToRemove(null);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/users/remove.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: userToRemove })
      });

      const result = await response.json();

      if (response.ok) {
        const removed = users.find(u => u.username === userToRemove) || null;
        setUsers(users.filter(u => u.username !== userToRemove));
        setUserToRemove(null);
        setRemovedUser(removed);
        setRevokedUsername(removed?.username ?? userToRemove ?? '');
        setShowRevokeModal(true);
        // auto-clear the removedUser after 10s
        setTimeout(() => setRemovedUser(null), 10000);
      } else {
        setError(result.error || "Failed to remove user.");
        setUserToRemove(null);
      }
    } catch {
      setError("Connection error while revoking user.");
      setUserToRemove(null);
    }
  };

  const handleUndoRemove = async () => {
    if (!removedUser) return;
    try {
      // Try to recreate the user with a random password for demo recovery
      const pw = Math.random().toString(36).slice(2, 10);
      const response = await fetch(`${API_BASE_URL}/auth/register.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: removedUser.username, role: removedUser.role, password: pw })
      });
      if (response.ok) {
        const userRes = await fetch(`${API_BASE_URL}/users/get.php`);
        if (userRes.ok) setUsers(await userRes.json());
        setRemovedUser(null);
      } else {
        const r = await response.json();
        setError(r.error || 'Could not restore user.');
      }
    } catch {
      setError('Connection error while attempting restore.');
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto">

      {/* ── Success Modals ── */}
      <SuccessModal
        isOpen={showRevokeModal}
        onClose={() => { setShowRevokeModal(false); setRevokedUsername(''); }}
        title="Account Revoked Successfully"
        message={`Access for "${revokedUsername}" has been successfully revoked and removed from the system.`}
      />
      <SuccessModal
        isOpen={showCreateModal}
        onClose={() => { setShowCreateModal(false); setCreatedUsername(''); }}
        title="Account Created Successfully"
        message={`The account "${createdUsername}" has been created and is ready to use.`}
      />

      {/* ── Page content — blurs when any modal is open ── */}
      <div
        className="transition-all duration-300"
        style={anyModalOpen ? { filter: 'blur(4px)', transform: 'scale(0.98)', pointerEvents: 'none' } : {}}
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
             <h2 className="text-2xl font-bold text-gray-900 tracking-tight">System Configuration</h2>
             <p className="text-gray-500 mt-1">Manage platform accounts and roles.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

          {/* Creation Form */}
          <div className="lg:col-span-4 self-start flex justify-center lg:justify-start">
             <div className="card w-full max-w-md pt-4 px-6 pb-6 border border-gray-200">
               <div className="flex items-center gap-2 mb-5">
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
                  {error && (
                    <div className="p-3 text-xs font-semibold text-red-700 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-1 duration-200 mb-2">
                      <span className="text-xs">⚠️</span> {error}
                    </div>
                  )}
                 <button
                    onClick={handleAddUser}
                    className="w-full btn-primary mt-4"
                 >
                    Create Secure Account
                 </button>
               </div>
             </div>
          </div>

          {/* User List */}
          <div className="lg:col-span-8 self-start space-y-4">
              {removedUser && (
                <div className="mb-2">
                  <AlertBanner
                    type="info"
                    message={`Access revoked: ${removedUser.username}`}
                    actionLabel="Undo"
                    onAction={handleUndoRemove}
                    onClose={() => setRemovedUser(null)}
                  />
                </div>
              )}
            {isLoadingUsers ? (
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <SkeletonUserCard key={i} />
                ))}
              </div>
            ) : (
              <>
                <div className="hidden sm:block overflow-x-auto rounded-3xl border border-gray-200 bg-white shadow-sm">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">User</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">Role</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">Status</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {users.map((u) => (
                        <tr key={u.username} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200">
                                {u.role === 'admin' ? (
                                  <Shield className="w-5 h-5 text-blue-600" />
                                ) : (
                                  <Users className="w-5 h-5 text-gray-500" />
                                )}
                              </div>
                              <div>
                                <div className="text-sm font-bold text-gray-900 break-words">{u.username}</div>
                                <div className="text-xs text-gray-500">Has valid system credentials</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                              u.role === 'admin' ? 'bg-blue-50 text-blue-700 border border-blue-100' : 'bg-gray-100 text-gray-700 border border-gray-200'
                            }`}>
                              {u.role}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">Active</td>
                          <td className="px-4 py-4 whitespace-nowrap text-right">
                            {u.username !== 'admin' && u.username !== 'client' ? (
                              <button
                                onClick={() => setUserToRemove(u.username)}
                                className="text-sm font-semibold text-red-600 hover:text-red-700 transition-colors"
                              >
                                Revoke Access
                              </button>
                            ) : (
                              <span className="text-xs uppercase tracking-[0.18em] text-gray-400">System core admin</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="sm:hidden space-y-4">
                  {users.map((u) => (
                    <div key={u.username} className="card p-5 border border-gray-200 group flex flex-col hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
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
                            onClick={() => setUserToRemove(u.username)}
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
              </>
            )}
          </div>

        </div>

        {/* Revoke Access Confirmation Modal */}
        {userToRemove && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
             <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-8 pb-4 flex flex-col items-center text-center">
                   <div className="w-16 h-16 rounded-full bg-red-50 text-red-600 flex items-center justify-center mb-4">
                      <Trash2 className="w-8 h-8" />
                   </div>
                   <h3 className="text-xl font-bold text-gray-900">Revoke System Access?</h3>
                   <p className="text-sm text-gray-500 mt-2">
                     Are you sure you want to remove <span className="font-bold text-gray-900">{userToRemove}</span>? They will no longer be able to log in to the platform.
                   </p>
                </div>

                <div className="p-8 flex gap-3">
                   <button
                     onClick={() => setUserToRemove(null)}
                     className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-700 font-bold hover:bg-gray-50 transition-colors"
                   >
                     Cancel
                   </button>
                   <button
                     onClick={handleRemoveUser}
                     className="flex-1 py-3 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 transition-colors shadow-lg shadow-red-100"
                   >
                     Revoke
                   </button>
                </div>
             </div>
          </div>
        )}
      </div>{/* end blur wrapper */}
    </div>
  );
};
