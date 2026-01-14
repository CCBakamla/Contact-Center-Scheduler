
export enum Gender {
  MALE = 'Laki-laki',
  FEMALE = 'Perempuan'
}

export interface Personnel {
  id: string;
  name: string;
  gender: Gender;
}

export interface ShiftAssignment {
  div1: string; // Female
  div2: string; // Male
  div3: string; // Male
  offPersonnel: string[];
}

export interface DailySchedule {
  date: Date;
  assignment: ShiftAssignment;
}

export interface ShiftStats {
  total: number;
  div3Count: number;
  saturdayCount: number;
  redDateCount: number;
}
