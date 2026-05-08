/**
 * US states + territories and Canadian provinces, keyed by ISO 3166-2
 * subdivision code. Opayo (the CSP card processor) rejects any order
 * with `billing_country` = US or CA unless `billing_state` is the exact
 * 2-letter code (error 3147 — BillingState field is required).
 */
export interface SubdivisionOption {
  code: string;
  name: string;
}

export const US_STATES: SubdivisionOption[] = [
  { code: "AL", name: "Alabama" },
  { code: "AK", name: "Alaska" },
  { code: "AZ", name: "Arizona" },
  { code: "AR", name: "Arkansas" },
  { code: "CA", name: "California" },
  { code: "CO", name: "Colorado" },
  { code: "CT", name: "Connecticut" },
  { code: "DE", name: "Delaware" },
  { code: "DC", name: "District of Columbia" },
  { code: "FL", name: "Florida" },
  { code: "GA", name: "Georgia" },
  { code: "HI", name: "Hawaii" },
  { code: "ID", name: "Idaho" },
  { code: "IL", name: "Illinois" },
  { code: "IN", name: "Indiana" },
  { code: "IA", name: "Iowa" },
  { code: "KS", name: "Kansas" },
  { code: "KY", name: "Kentucky" },
  { code: "LA", name: "Louisiana" },
  { code: "ME", name: "Maine" },
  { code: "MD", name: "Maryland" },
  { code: "MA", name: "Massachusetts" },
  { code: "MI", name: "Michigan" },
  { code: "MN", name: "Minnesota" },
  { code: "MS", name: "Mississippi" },
  { code: "MO", name: "Missouri" },
  { code: "MT", name: "Montana" },
  { code: "NE", name: "Nebraska" },
  { code: "NV", name: "Nevada" },
  { code: "NH", name: "New Hampshire" },
  { code: "NJ", name: "New Jersey" },
  { code: "NM", name: "New Mexico" },
  { code: "NY", name: "New York" },
  { code: "NC", name: "North Carolina" },
  { code: "ND", name: "North Dakota" },
  { code: "OH", name: "Ohio" },
  { code: "OK", name: "Oklahoma" },
  { code: "OR", name: "Oregon" },
  { code: "PA", name: "Pennsylvania" },
  { code: "RI", name: "Rhode Island" },
  { code: "SC", name: "South Carolina" },
  { code: "SD", name: "South Dakota" },
  { code: "TN", name: "Tennessee" },
  { code: "TX", name: "Texas" },
  { code: "UT", name: "Utah" },
  { code: "VT", name: "Vermont" },
  { code: "VA", name: "Virginia" },
  { code: "WA", name: "Washington" },
  { code: "WV", name: "West Virginia" },
  { code: "WI", name: "Wisconsin" },
  { code: "WY", name: "Wyoming" },
  { code: "PR", name: "Puerto Rico" },
];

export const CA_PROVINCES: SubdivisionOption[] = [
  { code: "AB", name: "Alberta" },
  { code: "BC", name: "British Columbia" },
  { code: "MB", name: "Manitoba" },
  { code: "NB", name: "New Brunswick" },
  { code: "NL", name: "Newfoundland and Labrador" },
  { code: "NS", name: "Nova Scotia" },
  { code: "NT", name: "Northwest Territories" },
  { code: "NU", name: "Nunavut" },
  { code: "ON", name: "Ontario" },
  { code: "PE", name: "Prince Edward Island" },
  { code: "QC", name: "Quebec" },
  { code: "SK", name: "Saskatchewan" },
  { code: "YT", name: "Yukon" },
];

const US_CODES = new Set(US_STATES.map((s) => s.code));
const CA_CODES = new Set(CA_PROVINCES.map((s) => s.code));
const US_NAMES = new Map(US_STATES.map((s) => [s.name.toLowerCase(), s.code]));
const CA_NAMES = new Map(CA_PROVINCES.map((s) => [s.name.toLowerCase(), s.code]));

export function getSubdivisions(countryCode?: string | null): SubdivisionOption[] | null {
  if (countryCode === "US") return US_STATES;
  if (countryCode === "CA") return CA_PROVINCES;
  return null;
}

/**
 * Normalise a free-text state value to its 2-letter ISO code when the
 * country is US or CA. Returns the original trimmed value otherwise.
 */
export function normaliseStateCode(countryCode: string | undefined, raw: string | undefined): string {
  const value = (raw || "").trim();
  if (!value) return "";
  if (countryCode === "US") {
    const upper = value.toUpperCase();
    if (US_CODES.has(upper)) return upper;
    return US_NAMES.get(value.toLowerCase()) || value;
  }
  if (countryCode === "CA") {
    const upper = value.toUpperCase();
    if (CA_CODES.has(upper)) return upper;
    return CA_NAMES.get(value.toLowerCase()) || value;
  }
  return value;
}