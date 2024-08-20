export function formatRelativeTime(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSecs = Math.round(diffMs / 1000);
    const diffMins = Math.round(diffSecs / 60);
    const diffHours = Math.round(diffMins / 60);
    const diffDays = Math.round(diffHours / 24);
  
    const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  
    if (diffSecs < 60) return rtf.format(-diffSecs, "second");
    if (diffMins < 60) return rtf.format(-diffMins, "minute");
    if (diffHours < 24) return rtf.format(-diffHours, "hour");
    return rtf.format(-diffDays, "day");
}
