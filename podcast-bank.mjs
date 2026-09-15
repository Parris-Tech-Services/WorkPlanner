export const PODCAST_EPISODES = Object.freeze([
  { id: '4TSTWy5JdLhJUJJnh0iUbB', title: 'Is Deep Work Still Possible in 2026?', show: 'Deep Questions with Cal Newport', topic: 'focus', url: 'https://open.spotify.com/episode/4TSTWy5JdLhJUJJnh0iUbB' },
  { id: '4jznZ0XGcGsyC937LhePLH', title: 'Burnout and Beyond: Why Are Boundaries Important?', show: 'NHS Practitioner Health Wellbeing Podcast', topic: 'boundaries', url: 'https://open.spotify.com/episode/4jznZ0XGcGsyC937LhePLH' },
  { id: '2AS0EWBDIZFsxnKnrgfGzC', title: 'How to Leave Your Job Without Burning Bridges', show: 'Happen To Your Career', topic: 'transition', url: 'https://open.spotify.com/episode/2AS0EWBDIZFsxnKnrgfGzC' },
  { id: '3LFn5Is0pCBrC412QcIGjb', title: 'How To Make the Right Career Decision', show: 'Happen To Your Career', topic: 'decisions', url: 'https://open.spotify.com/episode/3LFn5Is0pCBrC412QcIGjb' },
  { id: '7xOxrlpdSBjI2zCXrv89Qi', title: 'Career Change When Your Work No Longer Matches Your Values', show: 'Happen To Your Career', topic: 'values', url: 'https://open.spotify.com/episode/7xOxrlpdSBjI2zCXrv89Qi' },
  { id: '0epzx8P6EWfgGw7f6f0nlj', title: 'Should You Quit Your Job to Focus on Making a Career Change?', show: 'Happen To Your Career', topic: 'transition', url: 'https://open.spotify.com/episode/0epzx8P6EWfgGw7f6f0nlj' },
  { id: '2GethljFno0pV4mUbxDZ4l', title: 'Career Change Triggers: Why Most People Wait Years Too Long', show: 'Happen To Your Career', topic: 'transition', url: 'https://open.spotify.com/episode/2GethljFno0pV4mUbxDZ4l' },
  { id: '7ILqw0y0YgA5LQLqu4uneW', title: "You're Not Just Busy. You're Over-Functioning.", show: 'Stop the Burnout Podcast', topic: 'workload', url: 'https://open.spotify.com/episode/7ILqw0y0YgA5LQLqu4uneW' },
  { id: '412APsfQRgV9UNB6PWi7Et', title: 'No is a Full Sentence', show: 'The Burnout Recovery Podcast', topic: 'boundaries', url: 'https://open.spotify.com/episode/412APsfQRgV9UNB6PWi7Et' },
  { id: '4HYJMc9ONigbHQu2TbUSBw', title: 'The Boundary Fix for Burnout with Nedra Glover Tawwab', show: 'We Can Do Hard Things', topic: 'boundaries', url: 'https://open.spotify.com/episode/4HYJMc9ONigbHQu2TbUSBw' },
  { id: '6QpvkhdhAeeu8OqOcLDYOs', title: 'How Do I Maintain the Will to Do Deep Work?', show: 'Deep Questions with Cal Newport', topic: 'focus', url: 'https://open.spotify.com/episode/6QpvkhdhAeeu8OqOcLDYOs' },
  { id: '1qGAnHp65pta7VyZOfBudZ', title: 'How to Leave Corporate and Build Work You Actually Love', show: 'Happen To Your Career', topic: 'career design', url: 'https://open.spotify.com/episode/1qGAnHp65pta7VyZOfBudZ' }
]);

export function pickNextEpisode(episodes, recentIds = [], randomValue = Math.random()) {
  if (!Array.isArray(episodes) || episodes.length === 0) return null;
  const recent = new Set(Array.isArray(recentIds) ? recentIds : []);
  const fresh = episodes.filter((episode) => !recent.has(episode.id));
  const pool = fresh.length > 0 ? fresh : episodes;
  const safeRandom = Number.isFinite(randomValue) ? Math.min(Math.max(randomValue, 0), 0.999999999) : 0;
  return pool[Math.floor(safeRandom * pool.length)];
}

export function updateRecentIds(recentIds, selectedId, limit = 4) {
  const cleaned = (Array.isArray(recentIds) ? recentIds : []).filter((id) => id !== selectedId);
  return [selectedId, ...cleaned].slice(0, Math.max(1, limit));
}
