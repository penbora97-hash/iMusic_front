import { useEffect, useState } from 'react'; import { Card, smBtn } from '../../components/admin/ui'; import * as songService from '../../services/songService';
export default function ManageSongs() {
  const [songs, setSongs] = useState([]);
  const load = () => songService.list().then(setSongs); useEffect(() => { load(); }, []);
  const del = async (s) => { if (confirm(`លុប "${s.title}"?`)) { await songService.remove(s.id); load(); } };
  const ren = async (s) => { const t = prompt('ឈ្មោះថ្មី', s.title); if (t?.trim()) { await songService.rename(s.id, t.trim()); load(); } };
  return (
    <Card title={`Songs (${songs.length})`}>
      <div className="overflow-x-auto"><table className="w-full text-sm"><thead className="text-white/40 text-left"><tr><th className="py-2">Title</th><th>Artist</th><th>Genre</th><th>Plays</th><th>Added</th><th /></tr></thead>
        <tbody>{songs.map((s) => (
          <tr key={s.id} className="border-t border-white/5"><td className="py-3">{s.title}</td><td className="text-white/60">{s.artist?.name}</td>
            <td className="text-white/60">{s.genre?.name || '-'}</td><td>{s.play_count}</td><td className="text-white/60">{new Date(s.created_at).toLocaleDateString()}</td>
            <td className="text-right whitespace-nowrap"><button className={smBtn} onClick={() => ren(s)}>Rename</button> <button className={smBtn} onClick={() => del(s)}>Delete</button></td></tr>))}</tbody></table></div>
      {!songs.length && <p className="text-white/50 py-6 text-center">មិនទាន់មានចម្រៀងទេ</p>}
    </Card>
  );
}
