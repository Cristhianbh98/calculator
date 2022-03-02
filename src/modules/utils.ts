function getLocalStorage(key: string) {
  const item = window.localStorage.getItem(key)
  return item !== null ? JSON.parse(item) : null
}

const setLocalStorage = (key: string, value: object) => window.localStorage.setItem(key, JSON.stringify(value))

export { getLocalStorage, setLocalStorage }