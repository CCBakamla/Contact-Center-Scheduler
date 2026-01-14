
import { 
  DailySchedule, 
  Gender, 
  Personnel, 
  ShiftStats 
} from '../types';
import { 
  FEMALE_PERSONNEL, 
  MALE_PERSONNEL, 
  GIFFARI_ID,
  HOLIDAYS_2026
} from '../constants';

/**
 * Checks if a specific date is a Red Date (Weekend or Public Holiday).
 */
export const isRedDate = (date: Date): boolean => {
  const dayOfWeek = date.getDay();
  if (dayOfWeek === 0 || dayOfWeek === 6) return true;

  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const dateStr = `${month}-${day}`;

  return HOLIDAYS_2026.includes(dateStr);
};

/**
 * Generates a schedule for a specific month.
 * Supports optional carry-over of redDateCount for yearly fairness.
 */
export const generateMonthSchedule = (
  year: number, 
  month: number, 
  cumulativeRedStats?: Map<string, number>
): DailySchedule[] => {
  const schedule: DailySchedule[] = [];
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  // Monthly stats for local constraints (Giffari, Mayor, Lettu)
  const monthlyStats = new Map<string, ShiftStats>();
  [...FEMALE_PERSONNEL, ...MALE_PERSONNEL].forEach(p => {
    monthlyStats.set(p.id, { 
      total: 0, 
      div3Count: 0, 
      saturdayCount: 0, 
      redDateCount: cumulativeRedStats?.get(p.id) || 0 
    });
  });

  const offReasons = new Map<number, Set<string>>();

  const getAvailable = (gender: Gender, day: number, date: Date, excludeIds: string[] = []): Personnel[] => {
    const list = gender === Gender.FEMALE ? FEMALE_PERSONNEL : MALE_PERSONNEL;
    const dayOffSet = offReasons.get(day) || new Set();

    return list.filter(p => {
      if (dayOffSet.has(p.id)) return false;
      if (excludeIds.includes(p.id)) return false;
      
      const pStats = monthlyStats.get(p.id)!;

      // BATASAN BULANAN (Strict)
      if (p.id === GIFFARI_ID) {
        if (pStats.total >= 2) return false;
      }

      if (gender === Gender.MALE && (p.name.startsWith('Mayor') || p.name.startsWith('Lettu'))) {
        if (pStats.total >= 3) return false;
      }

      return true;
    });
  };

  for (let d = 1; d <= daysInMonth; d++) {
    const currentDate = new Date(year, month, d);
    const dayOfWeek = currentDate.getDay();
    const isRed = isRedDate(currentDate);

    // 1. Assign Div 1 (Female Only)
    const div1Candidates = getAvailable(Gender.FEMALE, d, currentDate);
    const div1 = div1Candidates.sort((a, b) => {
        const sA = monthlyStats.get(a.id)!;
        const sB = monthlyStats.get(b.id)!;
        if (isRed) {
          if (sA.redDateCount !== sB.redDateCount) return sA.redDateCount - sB.redDateCount;
        }
        return sA.total - sB.total;
    })[0] || FEMALE_PERSONNEL[0];
    
    // 2. Assign Div 2 (Male Only)
    const div2Candidates = getAvailable(Gender.MALE, d, currentDate);
    const div2 = div2Candidates.sort((a, b) => {
        const sA = monthlyStats.get(a.id)!;
        const sB = monthlyStats.get(b.id)!;
        if (isRed) {
          if (sA.redDateCount !== sB.redDateCount) return sA.redDateCount - sB.redDateCount;
        }
        if (sA.total !== sB.total) return sA.total - sB.total;
        return sB.div3Count - sA.div3Count;
      })[0] || MALE_PERSONNEL[0];

    // 3. Assign Div 3 (Male Only)
    const div3Candidates = getAvailable(Gender.MALE, d, currentDate, [div2.id]);
    const div3 = div3Candidates.sort((a, b) => {
        const sA = monthlyStats.get(a.id)!;
        const sB = monthlyStats.get(b.id)!;
        if (isRed) {
           if (sA.redDateCount !== sB.redDateCount) return sA.redDateCount - sB.redDateCount;
        }
        if (sA.div3Count !== sB.div3Count) return sA.div3Count - sB.div3Count;
        return sA.total - sB.total;
      })[0] || MALE_PERSONNEL[1];

    const assignShift = (p: Personnel, div: number) => {
      const s = monthlyStats.get(p.id)!;
      s.total += 1;
      if (div === 3) s.div3Count += 1;
      if (dayOfWeek === 6) s.saturdayCount += 1;
      if (isRed) {
        s.redDateCount += 1;
        if (cumulativeRedStats) {
          cumulativeRedStats.set(p.id, (cumulativeRedStats.get(p.id) || 0) + 1);
        }
      }
      
      // Rest Rules for Div 2 and 3
      if (div === 2 || div === 3) {
        const nextDay = d + 1;
        if (nextDay <= daysInMonth) {
          const sNext = offReasons.get(nextDay) || new Set();
          sNext.add(p.id);
          offReasons.set(nextDay, sNext);
        }
      }

      // Special Rest Rules for Saturday/Sunday
      if (dayOfWeek === 6) { // Saturday
        const tuesday = d + (2 - 6 + 7) % 7;
        if (tuesday > d && tuesday <= daysInMonth) {
          const sTue = offReasons.get(tuesday) || new Set();
          sTue.add(p.id);
          offReasons.set(tuesday, sTue);
        }
      }

      if (dayOfWeek === 0) { // Sunday
        const monday = d + 1;
        if (monday <= daysInMonth) {
          const sMon = offReasons.get(monday) || new Set();
          sMon.add(p.id);
          offReasons.set(monday, sMon);
        }
      }
    };

    assignShift(div1, 1);
    assignShift(div2, 2);
    assignShift(div3, 3);

    schedule.push({
      date: currentDate,
      assignment: {
        div1: div1.name,
        div2: div2.name,
        div3: div3.name,
        offPersonnel: Array.from(offReasons.get(d) || []).map(id => {
          const p = [...FEMALE_PERSONNEL, ...MALE_PERSONNEL].find(x => x.id === id);
          return p ? p.name : '';
        }).filter(name => name !== '')
      }
    });
  }

  return schedule;
};

/**
 * Generates yearly red date stats (holidays + weekends) for all personnel.
 */
export const generateYearlyRedDateStats = (year: number) => {
  const yearlyData: Record<string, number[]> = {};
  const cumulativeRedStats = new Map<string, number>();
  
  [...FEMALE_PERSONNEL, ...MALE_PERSONNEL].forEach(p => {
    yearlyData[p.name] = new Array(12).fill(0);
    cumulativeRedStats.set(p.id, 0);
  });

  for (let m = 0; m < 12; m++) {
    const monthSchedule = generateMonthSchedule(year, m, cumulativeRedStats);
    monthSchedule.forEach(day => {
      if (isRedDate(day.date)) {
        if (yearlyData[day.assignment.div1]) yearlyData[day.assignment.div1][m]++;
        if (yearlyData[day.assignment.div2]) yearlyData[day.assignment.div2][m]++;
        if (yearlyData[day.assignment.div3]) yearlyData[day.assignment.div3][m]++;
      }
    });
  }

  return yearlyData;
};
