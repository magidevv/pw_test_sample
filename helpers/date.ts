export function getCurrentDate(): string {
  const now = new Date();
  return now.toISOString().split("T")[0]; // Get date in format YYYY-MM-DD
}