
/**
 * Formats a date string into "dd-MMM-yyyy" format (e.g., "15-Oct-2025").
 * Returns the original string if parsing fails.
 * 
 * @param dateStr - The date string to format.
 * @returns The formatted date string.
 */
export const formatDate = (dateStr: string | undefined | null): string => {
    if (!dateStr || dateStr === 'Scholarship') return dateStr || '';

    try {
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return dateStr;

        const day = String(d.getDate()).padStart(2, '0');
        const month = d.toLocaleString('default', { month: 'short' });
        const year = d.getFullYear();

        return `${day}-${month}-${year}`;
    } catch {
        return dateStr;
    }
};
