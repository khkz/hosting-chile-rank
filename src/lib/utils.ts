
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Helper function to check if we have a valid IP address
export const hasValidIP = (ip: string) => {
  if (!ip || ip === '–' || ip === '-' || ip === 'No disponible' || ip === 'Error al obtener IP') {
    return false;
  }
  // Check if it's a valid IP format
  const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
  return ipRegex.test(ip);
};
