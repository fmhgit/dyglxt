import { Lunar, Solar } from 'lunar-javascript';

export function solarToLunar(date: Date): string {
    const solar = Solar.fromDate(date);
    const lunar = solar.getLunar();
    return `${lunar.getYearInGanZhi()}年 ${lunar.getMonthInChinese()}月${lunar.getDayInChinese()}`;
}

export function getNextLunarDate(lunarMonth: number, lunarDay: number, afterDate: Date = new Date()): Date {
    let year = afterDate.getFullYear();
    // Try this year first
    let lunar = Lunar.fromYmd(year, lunarMonth, lunarDay);
    let solar = lunar.getSolar();
    let date = new Date(solar.getYear(), solar.getMonth() - 1, solar.getDay());

    if (date < afterDate) {
        // If passed, try next year
        year++;
        lunar = Lunar.fromYmd(year, lunarMonth, lunarDay);
        solar = lunar.getSolar();
        date = new Date(solar.getYear(), solar.getMonth() - 1, solar.getDay());
    }
    return date;
}
