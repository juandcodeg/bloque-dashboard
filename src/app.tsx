import { useEffect, useState } from 'preact/hooks';

interface Player {
  rank: number;
  username: string;
  level: number;
  xp: number;
  gold: number;
}

interface MarketItem {
  id: string;
  name: string;
  type: string;
  description: string;
  cost: number;
}

function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(true); // default to true

  useEffect(() => {
    const updateStatus = () => {
      const online = navigator.onLine;
      setIsOnline(online);
      console.log('Network status changed:', online);
    };

    updateStatus(); // Check immediately on mount
    window.addEventListener('online', updateStatus);
    window.addEventListener('offline', updateStatus);

    return () => {
      window.removeEventListener('online', updateStatus);
      window.removeEventListener('offline', updateStatus);
    };
  }, []);

  return isOnline;
}

export function App() {
  const isOnline = useNetworkStatus();
  const [players, setPlayers] = useState<Player[]>([]);
  const [marketItems, setMarketItems] = useState<MarketItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const pageSize = 10;
  const paginatedPlayers = players.slice(page * pageSize, (page + 1) * pageSize);
  const totalPages = Math.ceil(players.length / pageSize);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [leaderboardRes, marketRes] = await Promise.all([
          fetch('https://api-game.bloque.app/game/leaderboard'),
          fetch('https://api-game.bloque.app/game/market'),
        ]);
        const leaderboardData = await leaderboardRes.json();
        const marketData = await marketRes.json();
        setPlayers(leaderboardData.players || []);
        setMarketItems(marketData.items || []);
        // Save to localStorage
        localStorage.setItem('bloque-leaderboard', JSON.stringify(leaderboardData.players || []));
        localStorage.setItem('bloque-market', JSON.stringify(marketData.items || []));
      } catch (err) {
        // Fallback to localStorage
        const localPlayers = localStorage.getItem('bloque-leaderboard');
        const localMarket = localStorage.getItem('bloque-market');
        if (localPlayers) setPlayers(JSON.parse(localPlayers));
        if (localMarket) setMarketItems(JSON.parse(localMarket));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <main className="min-h-screen bg-zinc-900 text-white p-6 max-w-6xl mx-auto">
{!isOnline && (
  <div className="bg-red-600 text-white text-sm text-center py-2 rounded mb-4">
    ❌ You're currently offline. Data may be outdated.
  </div>
)}

      <header className="text-center mb-12">
        <h1 className="text-2xl md:text-4xl font-extrabold text-white">
          🎣 Galactic-Fishing Game
        </h1>
        <p className="text-sky-400 mt-2 text-base md:text-lg">
          Live Leaderboard & Market
        </p>
      </header>

      {/* Leaderboard Section */}
      <section className="mb-20">
        <h2 className="text-2xl font-bold mb-4 text-sky-400">🏆 Leaderboard</h2>
        <p className="text-gray-400 text-sm mb-4">Page {page + 1} of {totalPages}</p>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-3">
          {loading ? (
            <p className="text-gray-400 italic">Loading leaderboard...</p>
          ) : players.length === 0 ? (
            <p className="text-gray-500 italic text-center">No leaderboard data available.</p>
          ) : (
            paginatedPlayers.map((player) => (
              <div
                key={player.username}
                className="bg-zinc-800 rounded-xl p-4 shadow flex flex-col items-center text-center space-y-1"
              >
                <span className="font-semibold text-sky-400 text-sm">#{player.rank}</span>
                <span className="text-white font-medium">{player.username}</span>
                <span className="text-gray-300 text-sm">
                  Level {player.level} · XP {player.xp} · 🪙 {player.gold}
                </span>
              </div>
            ))
          )}
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block bg-zinc-800 shadow-lg rounded-2xl p-4 overflow-x-auto max-w-3xl mx-auto mt-6">
          {loading ? (
            <p className="text-gray-400 italic">Loading leaderboard...</p>
          ) : players.length === 0 ? (
            <p className="text-gray-500 italic text-center">No leaderboard data available.</p>
          ) : (
            <table className="w-full table-auto text-xs text-left">
              <thead>
                <tr className="border-b border-zinc-700 text-gray-400 uppercase tracking-wide">
                  <th className="py-2 px-3">Rank</th>
                  <th className="py-2 px-3">Username</th>
                  <th className="py-2 px-3">Level</th>
                  <th className="py-2 px-3">XP</th>
                  <th className="py-2 px-3">Gold</th>
                </tr>
              </thead>
              <tbody>
                {paginatedPlayers.map((player) => (
                  <tr key={player.username} className="hover:bg-zinc-700 transition text-sm">
                    <td className="py-2 px-3">{player.rank}</td>
                    <td className="py-2 px-3">{player.username}</td>
                    <td className="py-2 px-3">{player.level}</td>
                    <td className="py-2 px-3">{player.xp}</td>
                    <td className="py-2 px-3">{player.gold}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {players.length > pageSize && (
          <div className="flex justify-center gap-4 mt-6">
            <button
              className="bg-zinc-700 hover:bg-zinc-600 px-4 py-2 rounded disabled:opacity-30 transition"
              onClick={() => setPage((p) => p - 1)}
              disabled={page === 0}
            >
              ← Prev
            </button>
            <button
              className="bg-sky-600 hover:bg-sky-700 px-4 py-2 rounded transition disabled:opacity-30"
              onClick={() => setPage((p) => p + 1)}
              disabled={page >= totalPages - 1}
            >
              Next →
            </button>
          </div>
        )}
      </section>

      {/* Market Section */}
      <section>
        <h2 className="text-2xl font-bold mb-6 text-sky-400">🛒 Market</h2>
        {loading ? (
          <div className="bg-zinc-800 shadow-lg rounded-2xl p-6">
            <p className="text-gray-400 italic">Loading market items...</p>
          </div>
        ) : marketItems.length === 0 ? (
          <p className="text-gray-500 italic text-center">No market data available.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {marketItems.map((item) => (
              <div
                key={item.id}
                className="bg-zinc-800 rounded-2xl p-4 shadow hover:shadow-xl transition"
              >
                <h3 className="text-lg font-bold text-white">{item.name}</h3>
                <p className="text-sky-400 text-sm italic mb-1">{item.type}</p>
                <p className="text-gray-300 text-sm mb-2">{item.description}</p>
                <p className="text-sky-400 font-semibold">💰 {item.cost} gold</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
