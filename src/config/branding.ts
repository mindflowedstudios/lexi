/**
 * Centralized branding configuration for easy customization.
 * Change these values to rebrand the entire application.
 */

// Core brand name - used as the base for all other branding
export const BRAND_NAME = "Lexi";

// OS name - the full product name
export const OS_NAME = `${BRAND_NAME}OS`;

// Domain configuration
export const BRAND_DOMAIN = "lexios.vercel.app";
export const BRAND_URL = `https://${BRAND_DOMAIN}`;

// Admin/owner username
export const ADMIN_USERNAME = "kassam";

// AI Assistant name
export const AI_ASSISTANT_NAME = "Kassam";

// Storage key prefix for localStorage/IndexedDB
export const STORAGE_PREFIX = "lexios";

// Vercel preview URL prefixes (for CORS)
export const VERCEL_PREVIEW_PREFIXES = [
  `${STORAGE_PREFIX}-`,
  `${BRAND_NAME.toLowerCase()}-`,
];

// User-Agent string
export const USER_AGENT = `${OS_NAME}/1.0`;

// File download prefix
export const DOWNLOAD_PREFIX = OS_NAME;

// Copyright/credits
export const CREDITS = {
  author: "Kassam",
  dedicatedTo: "Lexi",
  description: `A love letter in the form of an OS, made for ${BRAND_NAME}`,
};
