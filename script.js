// script.js
(function(){
  // Replace this with your real hosting domain once deployed:
  const HOSTING_BASE = "https://your-username.github.io/ankitha-resume"; 
  // Example tracking image endpoint (server-side) that will receive tid and referrer.
  // Replace with your own server or analytics endpoint if you have one.
  const TRACKING_ENDPOINT = "https://example.com/track.gif";

  // Helper to read query params
  function getQueryParam(name) {
    const params = new URLSearchParams(window.location.search);
    return params.get(name);
  }

  // Build example tracked URL to show & to generate QR
  function buildTrackedURL(tid){
    // tid is optional; if present, appended as ?tid=...
    const url = new URL(HOSTING_BASE + "/", window.location.origin);
    if(tid) url.searchParams.set('tid', tid);
    return url.toString();
  }

  // Place the example URL and QR image src
  const sampleTid = "TID12345"; // example TID for QR generation (you can change)
  const exampleUrlString = buildTrackedURL(sampleTid);
  document.getElementById('exampleUrl').textContent = exampleUrlString;

  // Use Google Chart API to generate quick QR for demo (safe & simple).
  // Production: you may regenerate with your real domain/tid.
  const qrImg = document.getElementById('qrImage');
  const googleQR = "https://chart.googleapis.com/chart?chs=300x300&cht=qr&chl=" + encodeURIComponent(exampleUrlString);
  qrImg.src = googleQR;

  // Read tid from current page URL (if user scanned a QR with tid param)
  const tidFromUrl = getQueryParam('tid');
  if(tidFromUrl){
    document.getElementById('trackingBanner').classList.remove('hidden');
    document.getElementById('tidValue').textContent = tidFromUrl;
    document.getElementById('displayTid').textContent = tidFromUrl;
    // Send a lightweight tracking ping to your tracking endpoint (image beacon)
    // NOTE: Replace TRACKING_ENDPOINT with your server that logs the request.
    const beaconUrl = TRACKING_ENDPOINT + "?tid=" + encodeURIComponent(tidFromUrl) + "&path=" + encodeURIComponent(location.pathname) + "&ref=" + encodeURIComponent(document.referrer || 'direct');
    // Fire-and-forget image request (works without CORS)
    const img = new Image();
    img.src = beaconUrl;
    // Optionally: store in localStorage for later review
    try {
      const log = JSON.parse(localStorage.getItem('tid_log') || "[]");
      log.push({tid: tidFromUrl, time: new Date().toISOString(), url: location.href});
      localStorage.setItem('tid_log', JSON.stringify(log.slice(-50)));
    } catch(e){ /* ignore localStorage errors */ }
  }

  // Nice: copy QR to clipboard (optional)
  qrImg.addEventListener('click', function(){
    window.open(googleQR, "_blank");
  });
})();
