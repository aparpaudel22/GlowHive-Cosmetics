import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price) {
  return `Rs. ${price.toLocaleString()}`;
}

export function getDiscountPercent(price, salePrice) {
  return Math.round(((price - salePrice) / price) * 100);
}

export function truncate(str, length) {
  return str.length > length ? str.slice(0, length) + "..." : str;
}

export function starArray(rating) {
  return Array.from({ length: 5 }, (_, i) => i + 1 <= Math.round(rating));
}