// cachingUtils.js — Reusable caching helper

// -----------------------------
// 1. In-Memory Cache (fastest)
// -----------------------------
const memoryCache = new Map();

export function setMemoryCache(key, value) {
    memoryCache.set(key, value);
}

export function getMemoryCache(key) {
    return memoryCache.get(key);
}

export function hasMemoryCache(key) {
    return memoryCache.has(key);
}

export function clearMemoryCache() {
    memoryCache.clear();
}


// -----------------------------
// 2. Local Storage (persistent)
// -----------------------------
export function setLocalCache(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

export function getLocalCache(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
}

export function removeLocalCache(key) {
    localStorage.removeItem(key);
}


// -----------------------------
// 3. Session Storage (per tab)
// -----------------------------
export function setSessionCache(key, value) {
    sessionStorage.setItem(key, JSON.stringify(value));
}

export function getSessionCache(key) {
    const data = sessionStorage.getItem(key);
    return data ? JSON.parse(data) : null;
}

export function removeSessionCache(key) {
    sessionStorage.removeItem(key);
}


// -----------------------------
// 4. Expiring Cache (TTL)
// -----------------------------
export function setExpiringCache(key, value, ttlInMinutes) {
    const expiry = Date.now() + ttlInMinutes * 60 * 1000;

    const payload = {
        value: value,
        expiry: expiry
    };

    localStorage.setItem(key, JSON.stringify(payload));
}

export function getExpiringCache(key) {
    const raw = localStorage.getItem(key);
    if (!raw) return null;

    const parsed = JSON.parse(raw);

    if (Date.now() > parsed.expiry) {
        localStorage.removeItem(key);
        return null;
    }

    return parsed.value;
}
