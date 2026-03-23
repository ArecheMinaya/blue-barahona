type ApiRequestOptions = RequestInit & {
  token?: string | null;
};

export class ApiClientError extends Error {
  status: number;
  code?: string;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

function getApiBaseUrl() {
  return process.env.NEXT_PUBLIC_API_URL;
}

export async function apiRequest<T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const headers = new Headers(options.headers);

  headers.set("Content-Type", "application/json");

  if (options.token) {
    headers.set("Authorization", `Bearer ${options.token}`);
  }

  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    ...options,
    headers,
    cache: "no-store",
  });

  if (response.status === 204) {
    return undefined as T;
  }

  const payload = (await response.json()) as
    | T
    | {
        error?: {
          code?: string;
          message?: string;
        };
      };

  if (!response.ok) {
    throw new ApiClientError(
      payload && typeof payload === "object" && "error" in payload
        ? payload.error?.message ?? "Request failed."
        : "Request failed.",
      response.status,
      payload && typeof payload === "object" && "error" in payload
        ? payload.error?.code
        : undefined,
    );
  }

  return payload as T;
}
