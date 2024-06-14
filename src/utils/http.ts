export const api = async <T>(path: string): Promise<T | Error> => {
  const response = await fetch('/api' + path)

  if (!response.ok) {
    return new Error(response.statusText)
  }

  return response.json() as Promise<T>
}
