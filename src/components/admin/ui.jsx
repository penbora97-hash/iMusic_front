// src/components/admin/ui.jsx

export const inputCls =
  "w-full bg-[#0d0b10] border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-[#b07a9a] placeholder:text-white/30 file:mr-3 file:rounded-lg file:border-0 file:bg-white/10 file:px-3 file:py-1 file:text-white";

// ✅ បន្ថែម btnCls ត្រឡប់ទៅវិញ
export const btnCls =
  "bg-gradient-to-r from-[#b07a9a] to-[#7a4a68] hover:opacity-90 rounded-xl px-5 py-2.5 font-semibold text-white disabled:opacity-50 transition";

export const smBtn =
  "rounded-lg px-3 py-1.5 text-sm bg-white/5 hover:bg-white/10 border border-white/10";

export const Card = ({ title, right, children, className = "" }) => (
  <section
    className={`bg-[#17131b] border border-white/5 rounded-2xl p-5 ${className}`}
  >
    {(title || right) && (
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-white/90">{title}</h3>
        {right}
      </div>
    )}
    {children}
  </section>
);

export const Badge = ({ ok, children }) => (
  <span
    className={`px-2.5 py-0.5 rounded-full text-xs ${
      ok ? "bg-emerald-500/15 text-emerald-300" : "bg-rose-500/15 text-rose-300"
    }`}
  >
    {children}
  </span>
);

export function LineChart({ data }) {
  if (!data?.length) return null;

  // ✅ គាំទ្រទាំង ២ Format: { value } និង { count }
  const points = data.map((d) => ({
    value: Number(d.value ?? d.count ?? 0),
    label:
      d.label ||
      (d.date
        ? new Date(d.date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })
        : ""),
  }));

  const W = 600,
    H = 200,
    P = 24,
    max = Math.max(1, ...points.map((d) => d.value));

  const pts = points.map((d, i) => [
    P + i * ((W - 2 * P) / Math.max(1, points.length - 1)),
    H - P - (d.value / max) * (H - 2 * P),
  ]);

  const line = pts
    .map((p, i) => (i ? "L" : "M") + p[0].toFixed(2) + " " + p[1].toFixed(2))
    .join(" ");

  const area = `${line} L${pts[pts.length - 1][0].toFixed(2)} ${H - P} L${pts[0][0].toFixed(2)} ${H - P} Z`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#b07a9a" stopOpacity=".45" />
          <stop offset="1" stopColor="#b07a9a" stopOpacity="0" />
        </linearGradient>
      </defs>

      <path d={area} fill="url(#g)" />
      <path d={line} fill="none" stroke="#d8a0c0" strokeWidth="2.5" />

      {pts.map((p, i) => (
        <circle key={i} cx={p[0]} cy={p[1]} r="3.5" fill="#d8a0c0">
          <title>
            {points[i].label}: {points[i].value}
          </title>
        </circle>
      ))}

      {points.map(
        (d, i) =>
          i % 2 === 0 && (
            <text
              key={i}
              x={pts[i][0]}
              y={H - 6}
              fontSize="10"
              fill="#ffffff66"
              textAnchor="middle"
            >
              {d.label}
            </text>
          )
      )}
    </svg>
  );
}