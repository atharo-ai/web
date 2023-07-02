type Request = {
  location: string;
};
type Response = {
  location: string;
  chance: number;
};
export function main(request: Request): Response {
  return {
    ...request,
    chance: 45,
  };
}
