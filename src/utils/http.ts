export const api = async <T>(path: string): Promise<T | Error | null> => {
  const response = await fetch(`/api${path}`);

  if (!response.ok) {
    return new Error(response.statusText);
  }

  const contentLength = response.headers.get("Content-Length");
  if (contentLength === "0") {
    return null;
  }

  return response.json() as Promise<T>;
};
