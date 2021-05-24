export function formatDate(timestamp) {
    const date = new Date(timestamp);
    const now = Date.now() / 1000;
    const elapsedSeconds = now - date.getTime() / 1000;
    const elapsedMinutes = Math.round(elapsedSeconds / 60);
    const elapsedHours = Math.round(elapsedMinutes / 60);
    const elapsedDays = Math.round(elapsedHours / 24);
    if (elapsedSeconds < 60) {
        return "just now";
    }
    if (elapsedMinutes < 60) {
        return elapsedMinutes + " minutes ago";
    }
    if (elapsedHours === 1) {
        return "1 hour ago";
    }
    if (elapsedHours < 24) {
        return elapsedHours + " hours ago";
    }
    if (elapsedDays === 1) {
        return "1 day ago";
    }
    if (elapsedDays < 3) {
        return elapsedDays + " days ago";
    }
    return date.toLocaleDateString(undefined, { day: '2-digit' }) + ' ' + date.toLocaleDateString(undefined, { month: 'short' }) + ', ' + date.toLocaleDateString(undefined, { year: 'numeric' });
}
