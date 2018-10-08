export function getFromStorage(key) {
  if (!key) return null;

  try {
    const valueStr = localStorage.getItem(key);
    if (valueStr) return JSON.parse(valueStr);

    return null;
  } catch (e) {
    return null;
  }
}

export function setInStorage(key, value) {
  if (!key) console.error("Error: Key is missing");

  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(e);
  }
}
