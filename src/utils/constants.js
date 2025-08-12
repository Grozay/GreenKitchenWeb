// Dynamic API_ROOT based on current hostname
const getApiRoot = () => {
  if (import.meta.env.VITE_API_ROOT) {
    return import.meta.env.VITE_API_ROOT
  }

  const hostname = window.location.hostname
  return `http://${hostname}:8080`
}

export const API_ROOT = getApiRoot()
