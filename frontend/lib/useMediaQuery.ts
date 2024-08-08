import { useState } from 'react';

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    const media = window.matchMedia(query);
    media.onchange = (e) => setMatches(e.matches);

    return media.matches;
  });

  return matches;
}
