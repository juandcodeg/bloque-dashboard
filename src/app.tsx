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

export function App() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [marketItems, setMarketItems] = useState<MarketItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(25);

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
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <main className="min-h-screen bg-black text-white p-6 max-w-6xl mx-auto">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-white">🎣 Galactic-Fishing Game</h1>
        <p className="text-indigo-400 mt-2 text-lg">Live Leaderboard & Market</p>
      </header>

      {/* Leaderboard Section */}
      <section className="mb-14">
        <h2 className="text-2xl font-bold mb-6 text-indigo-400">🏆 Leaderboard</h2>
        <div className="bg-zinc-900 shadow-lg rounded-2xl p-6 overflow-x-auto">
          {loading ? (
            <p className="text-gray-400 italic">Loading leaderboard...</p>
          ) : (
            <>
              <table className="min-w-full text-sm text-left">
                <thead>
                  <tr className="border-b border-zinc-700 text-gray-400">
                    <th className="py-2 px-4">Rank</th>
                    <th className="py-2 px-4">Username</th>
                    <th className="py-2 px-4">Level</th>
                    <th className="py-2 px-4">XP</th>
                    <th className="py-2 px-4">Gold</th>
                  </tr>
                </thead>
                <tbody>
                  {players.slice(0, visibleCount).map((player) => (
                    <tr key={player.username} className="hover:bg-zinc-800 transition">
                      <td className="py-2 px-4">{player.rank}</td>
                      <td className="py-2 px-4">{player.username}</td>
                      <td className="py-2 px-4">{player.level}</td>
                      <td className="py-2 px-4">{player.xp}</td>
                      <td className="py-2 px-4">{player.gold}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {players.length > visibleCount && (
                <div className="text-center mt-6">
                  <button
                    className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-xl transition"
                    onClick={() => setVisibleCount((prev) => prev + 25)}
                  >
                    Load More
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Market Section */}
      <section>
        <h2 className="text-2xl font-bold mb-6 text-indigo-400">🛒 Market</h2>
        {loading ? (
          <div className="bg-zinc-900 shadow-lg rounded-2xl p-6">
            <p className="text-gray-400 italic">Loading market items...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {marketItems.map((item) => (
              <div
                key={item.id}
                className="bg-zinc-900 rounded-2xl p-4 shadow hover:shadow-xl transition"
              >
                <h3 className="text-xl font-bold text-white">{item.name}</h3>
                <p className="text-indigo-400 text-sm italic mb-1">{item.type}</p>
                <p className="text-gray-300 text-sm mb-2">{item.description}</p>
                <p className="text-indigo-400 font-semibold">💰 {item.cost} gold</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
