export interface User {
  id: string;
  email: string;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
}
export interface HotChocolate {
    productName: string,
    englishProductName: string,
    vendor: string,
    location: string,
    lat: number,
    lon: number,
    description?: string
};