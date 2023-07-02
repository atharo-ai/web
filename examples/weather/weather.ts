type Request = {
  location: string;
  unit: string;
};
type Response = {
  location: string;
  unit: string;
  temperature: number;
  forecast: string;
};
export function main(request: Request): Response {
  return {
    ...request,
    temperature: 77,
    forecast: "sunny",
  };
}
