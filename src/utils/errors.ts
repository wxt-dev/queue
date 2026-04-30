export class FetchError extends Error {
  status: number;
  body: any;
  url: string;

  constructor(response: Response, body: string, options?: ErrorOptions) {
    super(
      `Fetch request failed with "${response.status} ${response.statusText || "undefined"}"`,
      options,
    );
    this.name = "FetchError";
    this.url = response.url;
    this.status = response.status;
    this.body = response.headers
      .get("content-type")
      ?.includes("application/json")
      ? JSON.parse(body)
      : body.length > 100
        ? body.slice(0, 100) + "..."
        : body;
  }
}
