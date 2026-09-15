(() => {
  const loadScript = (src) =>
    new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.defer = true;
      script.addEventListener('load', resolve, { once: true });
      script.addEventListener('error', () => reject(new Error(`Failed to load ${src}`)), { once: true });
      document.head.append(script);
    });

  const showBootError = (message) => {
    const banner = document.createElement('div');
    banner.setAttribute('role', 'alert');
    banner.style.cssText = 'position:fixed;inset:0 0 auto 0;z-index:99999;padding:12px 16px;background:#7f1d1d;color:white;font:600 14px/1.4 system-ui;text-align:center';
    banner.textContent = message;
    document.body.prepend(banner);
  };

  loadScript('./planner-core.js')
    .then(() => loadScript('./podcast-dock.js'))
    .catch((error) => {
      console.error(error);
      showBootError('Work Planner could not finish loading. Refresh the page; if the problem continues, use the planner backup from another device.');
    });
})();
