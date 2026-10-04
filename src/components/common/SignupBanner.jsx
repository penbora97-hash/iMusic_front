import { Link } from 'react-router-dom'; import { useAuth } from '../../context/AuthContext'; import { usePlayer } from '../../context/PlayerContext';
export default function SignupBanner() {
  const { user } = useAuth(); const { cur } = usePlayer();
  if (user || cur) return null;
  return (
    <div className="fixed bottom-4 inset-x-4 z-40 glass rounded-3xl px-6 py-4 flex items-center gap-4 max-w-4xl mx-auto">
      <div className="flex-1"><p className="text-xs tracking-widest text-white/60">PREVIEW OF iMUSIC</p>
        <p className="font-semibold">Sign up to save your favorite songs. No credit card needed.</p></div>
      <Link to="/register" className="btn btn-white">Sign up free</Link>
    </div>
  );
}
