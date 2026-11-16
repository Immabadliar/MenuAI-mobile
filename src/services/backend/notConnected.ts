export function notConnected(operation: string): never {
  throw new Error(`Implement ${operation} in the backend service adapter first.`);
}
