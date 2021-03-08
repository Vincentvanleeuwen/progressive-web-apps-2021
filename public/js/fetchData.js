// Fetch the database URLs
export async function fetchData(endPoint, options) {
  const response = await fetch(endPoint, options);
  return await response.json()
}
