/* IP extraction + geolocation helpers shared by submit-score and log-run. */

function cleanIp(headers) {
  let ip = String(headers["x-forwarded-for"] || "").split(",")[0].trim();
  // Azure often appends a port to IPv4 addresses ("1.2.3.4:54321") — strip it
  const m = ip.match(/^(\d{1,3}(?:\.\d{1,3}){3}):\d+$/);
  if (m) ip = m[1];
  if (!ip) ip = String(headers["x-client-ip"] || headers["client-ip"] || "").trim();
  return ip;
}

function isPrivateIp(ip) {
  return /^(10\.|192\.168\.|127\.|169\.254\.|172\.(1[6-9]|2\d|3[01])\.|::1$|fc|fd)/i.test(ip);
}

/* Looks up city/region/country for an IP via ipwho.is (free, keyless, HTTPS).
   Returns a display string like "Tampa, Florida, United States" or "".
   Never throws and gives up after 2.5s so it can't break a submission. */
async function lookupLocation(ip) {
  if (!ip || isPrivateIp(ip)) return "";
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 2500);
    const resp = await fetch("https://ipwho.is/" + encodeURIComponent(ip), { signal: ctrl.signal });
    clearTimeout(timer);
    if (!resp.ok) return "";
    const d = await resp.json();
    if (!d || d.success === false) return "";
    return [d.city, d.region, d.country].filter(Boolean).join(", ").slice(0, 120);
  } catch (e) {
    return "";
  }
}

module.exports = { cleanIp, lookupLocation };
