import { asset } from "../../services/api";

export default function Avatar({ user, size = 40, className = "" }) {
  const s = { width: size, height: size };
  return user?.avatar_url ? (
    <img
      src={asset(user.avatar_url)}
      alt=""
      style={s}
      className={`rounded-full object-cover shrink-0 ${className}`}
    />
  ) : (
    <div
      style={{ ...s, fontSize: size / 2.4 }}
      className={`rounded-full grid place-items-center font-bold shrink-0 bg-gradient-to-br from-fuchsia-500 to-cyan-400 ${className}`}
    >
      {user?.username?.[0]?.toUpperCase() || "U"}
    </div>
  );
}
