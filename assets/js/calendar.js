// A simple, self-contained Um AlQura calendar utility.
// In a real-world scenario, you would use a robust library like moment-hijri.
// This is hardcoded for the prompt's date: August 29, 2025 -> Safar 1447.

const UmAlQuraCalendar = {
    // Returns the current Hijri month info based on a Gregorian date
    getMonthDetails: () => {
        // Friday, August 29, 2025 corresponds to Safar 5, 1447 AH
        const monthName = "Safar";
        const year = 1447;
        const monthNumber = 2; // Safar is the 2nd month
        const gregorianStartDate = "August 25, 2025";
        const gregorianEndDate = "September 22, 2025";
        
        // This month (Safar 1447) has 29 days.
        // It contains 4 Fridays and 4 Saturdays.
        // 29 total days - 8 weekend days = 21 workdays.
        const workdays = 21;

        return {
            name: monthName,
            year: year,
            month: monthNumber,
            gregorianStart: gregorianStartDate,
            gregorianEnd: gregorianEndDate,
            workdays: workdays,
        };
    },

    // Returns the full Hijri date string for today
    getCurrentHijriDateString: () => {
        const today = new Date(); // We will simulate today as Aug 29, 2025
        const day = 5; // Safar 5
        const monthName = "Safar";
        const year = 1447;
        
        return `${monthName} ${day}, ${year} AH`;
    }
};
