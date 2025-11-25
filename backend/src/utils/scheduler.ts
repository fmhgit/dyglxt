import { addDays, addMonths, addYears, isBefore, parseISO } from 'date-fns';
import { getNextLunarDate } from './lunar';

export function calculateNextRenewal(sub: any): Date {
    const startDate = new Date(sub.startDate);
    const now = new Date();

    if (sub.isLunar && sub.cycleUnit === 'year') {
        // Assuming startDate string is YYYY-MM-DD, we parse the Month and Day as Lunar
        // This is a simplification. Ideally we store lunarMonth/lunarDay separately or parse from startDate if it was entered as lunar.
        // For now, let's assume startDate IS the lunar date in Gregorian format (e.g. 2023-01-01 means Lunar Jan 1st)
        // OR we need to convert the stored Gregorian start date to Lunar to get the Day/Month.

        // Let's assume the user enters the FIRST start date.
        // If isLunar is true, we treat the cycle as Lunar Years.

        // Actually, a better approach for "Lunar Birthday" style:
        // We need the Lunar Month and Day.
        // Let's assume we derive it from the startDate (which is when it started).
        // We convert startDate to Lunar, get Month/Day, then find next occurrence.

        // Implementation:
        // 1. Convert startDate to Lunar
        // 2. Get Month and Day
        // 3. Find next occurrence of that Lunar Month/Day after 'now'

        // Note: This requires 'lunar-javascript'
        // I'll defer the exact implementation details to the `lunar.ts` helper if possible, 
        // but here is the logic.

        // For now, let's stick to standard Gregorian cycles if not strictly Lunar Birthday.
        // If the user wants "Every Lunar Year", we need that logic.

        // Placeholder for strict Lunar Cycle logic:
        // return getNextLunarDate(lunarMonth, lunarDay, now);
    }

    let nextDate = startDate;

    // Simple loop to find next date in future
    // Optimization: Calculate directly instead of loop for fixed cycles
    while (isBefore(nextDate, now)) {
        switch (sub.cycleUnit) {
            case 'day':
                nextDate = addDays(nextDate, sub.cycleValue);
                break;
            case 'month':
                nextDate = addMonths(nextDate, sub.cycleValue);
                break;
            case 'year':
                nextDate = addYears(nextDate, sub.cycleValue);
                break;
            default:
                return nextDate; // Should not happen
        }
    }

    return nextDate;
}

export function getDaysRemaining(targetDate: Date): number {
    const now = new Date();
    const diffTime = targetDate.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}
