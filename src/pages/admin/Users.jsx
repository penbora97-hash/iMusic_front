import { useEffect, useState } from "react";
import { Card, Badge, inputCls, smBtn } from "../../components/admin/ui";
import * as admin from "../../services/adminService";
export default function Users() {
  const [u, setU] = useState([]);
  const [q, setQ] = useState("");
  const [err, setErr] = useState("");
  const load = () =>
    admin
      .users()
      .then(setU)
      .catch((e) => setErr(e.message));
  useEffect(() => {
    load();
  }, []);
  const toggle = async (x) => {
    try {
      await admin.toggleUser(x.id);
      load();
    } catch (e) {
      alert(e.message);
    }
  };
  const rows = u.filter((x) =>
    (x.name + x.email).toLowerCase().includes(q.toLowerCase()),
  );
  return (
    <Card
      title={`Users (${u.length})`}
      right={
        <input
          className={inputCls + " !w-56 !py-2"}
          placeholder="Search..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      }
    >
      {err && <p className="text-rose-300 mb-3">❌ {err}</p>}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-white/40 text-left">
            <tr>
              <th className="py-2">Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Joined</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {rows.map((x) => (
              <tr key={x.id} className="border-t border-white/5">
                <td className="py-3">{x.name}</td>
                <td className="text-white/60">{x.email}</td>
                <td>
                  <Badge ok={x.role === "admin"}>{x.role}</Badge>
                </td>
                <td>
                  <Badge ok={x.is_active}>
                    {x.is_active ? "Active" : "Banned"}
                  </Badge>
                </td>
                <td className="text-white/60">
                  {new Date(x.created_at).toLocaleDateString()}
                </td>
                <td className="text-right">
                  {x.role !== "admin" && (
                    <button className={smBtn} onClick={() => toggle(x)}>
                      {x.is_active ? "Ban" : "Unban"}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
