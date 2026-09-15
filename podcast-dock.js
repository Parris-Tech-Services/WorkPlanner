(async () => {
  const STORAGE_KEY = 'work-planner-podcast-state-v1';
  const { PODCAST_EPISODES, pickNextEpisode, updateRecentIds } = await import('./podcast-bank.mjs');

  const safeParse = (value, fallback) => {
    try { return value ? JSON.parse(value) : fallback; } catch { return fallback; }
  };

  const stored = safeParse(localStorage.getItem(STORAGE_KEY), {});
  let state = {
    open: Boolean(stored.open),
    selectedId: PODCAST_EPISODES.some((episode) => episode.id === stored.selectedId) ? stored.selectedId : null,
    recentIds: Array.isArray(stored.recentIds) ? stored.recentIds.filter((id) => PODCAST_EPISODES.some((episode) => episode.id === id)).slice(0, 4) : [],
  };

  const save = () => localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  const selectedEpisode = () => PODCAST_EPISODES.find((episode) => episode.id === state.selectedId) || null;

  const chooseAnother = () => {
    const episode = pickNextEpisode(PODCAST_EPISODES, state.recentIds);
    if (!episode) return;
    state.selectedId = episode.id;
    state.recentIds = updateRecentIds(state.recentIds, episode.id, 4);
    save();
    render();
  };

  if (!selectedEpisode()) {
    const initial = pickNextEpisode(PODCAST_EPISODES, state.recentIds, 0.37);
    state.selectedId = initial?.id || null;
    if (initial) state.recentIds = updateRecentIds(state.recentIds, initial.id, 4);
    save();
  }

  const style = document.createElement('style');
  style.textContent = `
    .jpd-shell{position:fixed;z-index:9000;right:max(14px,env(safe-area-inset-right));bottom:max(14px,env(safe-area-inset-bottom));width:min(390px,calc(100vw - 28px));font-family:inherit;color:#172033}
    .jpd-toggle,.jpd-button,.jpd-link{font:inherit;border-radius:999px;min-height:44px;cursor:pointer}
    .jpd-toggle{width:100%;border:1px solid rgba(31,41,55,.15);background:#fff;padding:11px 16px;box-shadow:0 10px 30px rgba(20,31,50,.16);font-weight:700;text-align:left;color:#24344d}
    .jpd-panel{margin-bottom:9px;padding:14px;border-radius:18px;background:rgba(255,255,255,.98);border:1px solid rgba(31,41,55,.12);box-shadow:0 18px 46px rgba(20,31,50,.2)}
    .jpd-panel[hidden]{display:none}.jpd-head{display:flex;gap:10px;align-items:flex-start;justify-content:space-between;margin-bottom:10px}
    .jpd-kicker{margin:0 0 3px;font-size:.76rem;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:#52657d}.jpd-title{margin:0;font-size:1rem;line-height:1.3;color:#182437}.jpd-show{margin:5px 0 0;font-size:.84rem;color:#5c697a}
    .jpd-close{border:0;background:transparent;font-size:1.4rem;line-height:1;padding:5px 7px;border-radius:10px;color:#52657d;cursor:pointer}.jpd-frame{display:block;width:100%;height:152px;border:0;border-radius:12px;margin:10px 0}
    .jpd-actions{display:flex;gap:8px;flex-wrap:wrap}.jpd-button,.jpd-link{display:inline-flex;align-items:center;justify-content:center;padding:9px 13px;text-decoration:none;border:1px solid rgba(31,41,55,.14);background:#f6f8fb;color:#24344d;font-weight:700}.jpd-link{background:#1f6f5f;color:#fff;border-color:#1f6f5f}
    .jpd-note{margin:10px 2px 0;font-size:.75rem;line-height:1.4;color:#667285}@media (max-width:560px){.jpd-shell{right:10px;bottom:max(10px,env(safe-area-inset-bottom));width:calc(100vw - 20px)}.jpd-frame{height:152px}}@media print{.jpd-shell{display:none!important}}@media (prefers-reduced-motion:reduce){.jpd-shell *{scroll-behavior:auto!important;transition:none!important}}
  `;
  document.head.append(style);

  const shell = document.createElement('aside');
  shell.className = 'jpd-shell';
  shell.setAttribute('aria-label', 'Work transition podcast');
  document.body.append(shell);

  function render() {
    const episode = selectedEpisode();
    if (!episode) return;
    const embedUrl = `https://open.spotify.com/embed/episode/${encodeURIComponent(episode.id)}?utm_source=generator`;
    shell.innerHTML = `
      <section class="jpd-panel" ${state.open ? '' : 'hidden'} aria-live="polite">
        <div class="jpd-head"><div><p class="jpd-kicker">${episode.topic}</p><h2 class="jpd-title">${episode.title}</h2><p class="jpd-show">${episode.show}</p></div><button class="jpd-close" type="button" aria-label="Close podcast dock">×</button></div>
        <iframe class="jpd-frame" src="${embedUrl}" title="Spotify player: ${episode.title.replaceAll('"', '&quot;')}" loading="lazy" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"></iframe>
        <div class="jpd-actions"><a class="jpd-link" href="${episode.url}" target="_blank" rel="noopener noreferrer">Open in Spotify</a><button class="jpd-button jpd-another" type="button">Another episode</button></div>
        <p class="jpd-note">No autoplay. Your recent picks stay on this device so the dock avoids immediate repeats.</p>
      </section>
      <button class="jpd-toggle" type="button" aria-expanded="${state.open}" aria-label="${state.open ? 'Hide' : 'Open'} work transition podcast">🎧 ${state.open ? 'Hide podcast' : 'Listen to a work-transition podcast'}</button>
    `;

    shell.querySelector('.jpd-toggle').addEventListener('click', () => { state.open = !state.open; save(); render(); });
    shell.querySelector('.jpd-close')?.addEventListener('click', () => { state.open = false; save(); render(); });
    shell.querySelector('.jpd-another')?.addEventListener('click', chooseAnother);
  }

  render();
})().catch((error) => console.warn('Podcast dock unavailable; planner remains usable.', error));
