export class HttpClient {
  async get<T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
    const response = await fetch(input, {
      headers: {
        'Content-Type': 'application/json',
        ...(init?.headers ?? {}),
      },
      ...init,
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status} - ${response.statusText}`);
    }

    return response.json() as Promise<T>;
  }
}
