export function formatErr(err) {
  let message = err.toString();
  if (!(err instanceof Error) && err.message) {
    message = err.message;
  }
  return message;
}

