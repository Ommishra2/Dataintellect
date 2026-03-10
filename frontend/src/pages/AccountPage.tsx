export default function AccountPage() {
  const token = localStorage.getItem('token');
  let email = 'User';
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      email = payload.sub;
    } catch { /* ignore */ }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold text-white">Account Profile</h1>
        <p className="text-slate-400 mt-2">Your personal account information.</p>
      </div>
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
        <div className="flex items-center gap-6 mb-8">
          <div className="h-20 w-20 rounded-full bg-gradient-to-tr from-rose-500 to-orange-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
            {email[0].toUpperCase()}
          </div>
          <div>
            <p className="text-xl font-semibold text-white">{email}</p>
            <p className="text-slate-400 capitalize">{localStorage.getItem('role') || 'User'}</p>
          </div>
        </div>
        <div className="border-t border-slate-700 pt-6 text-slate-500 text-sm">
          More account settings coming soon.
        </div>
      </div>
    </div>
  );
}
