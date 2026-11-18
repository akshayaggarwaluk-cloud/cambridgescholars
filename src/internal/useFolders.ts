import { useQuery } from "@tanstack/react-query";
import { getFolders } from "./api";

export const FOLDERS_QUERY_KEY = ["internal-folders"] as const;

/**
 * Folders the current user can open (GET /folders). Refetched whenever a page
 * using it mounts, so folders added on the server appear without a code change.
 */
export function useFolders() {
  return useQuery({ queryKey: FOLDERS_QUERY_KEY, queryFn: getFolders, staleTime: 0 });
}
