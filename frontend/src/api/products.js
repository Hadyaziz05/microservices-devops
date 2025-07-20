export async function fetchProducts() {
  const response = await fetch('https://myapp.local/api/commerce/products/all-products');
  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }
  return response.json();
}