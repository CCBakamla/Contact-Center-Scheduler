
import { Gender, Personnel } from './types';

export const FEMALE_PERSONNEL: Personnel[] = [
  { id: 'f1', name: 'Letda Bakamla Rina Setiawati', gender: Gender.FEMALE },
  { id: 'f2', name: 'Letda Bakamla Erin Putri Fadhilah', gender: Gender.FEMALE },
  { id: 'f3', name: 'Letda Bakamla Rita Mulliyana', gender: Gender.FEMALE },
  { id: 'f4', name: 'Lettu Bakamla Rindi Nurlaila Sari', gender: Gender.FEMALE },
  { id: 'f5', name: 'Letda Bakamla Isnaini PJ', gender: Gender.FEMALE },
  { id: 'f6', name: 'Letda Bakamla Xena Zitni R', gender: Gender.FEMALE },
  { id: 'f7', name: 'Serka Bakamla Dita Putri Cahyani', gender: Gender.FEMALE },
];

export const MALE_PERSONNEL: Personnel[] = [
  { id: 'm1', name: 'Mayor Bakamla Yuhanes Antara, S.Pd', gender: Gender.MALE },
  { id: 'm2', name: 'Lettu Bakamla Taufiq Hariz Septiawan, S.T.', gender: Gender.MALE },
  { id: 'm3', name: 'Serma Bakamla Hadiyanto', gender: Gender.MALE },
  { id: 'm4', name: 'Serma Bakamla Asmawi', gender: Gender.MALE },
  { id: 'm5', name: 'Serka Bakamla Yaumil Akbar Syahputra', gender: Gender.MALE },
  { id: 'm6', name: 'Serka Bakamla Aziz Nurfalah', gender: Gender.MALE },
  { id: 'm7', name: 'Letda Bakamla Ridwan Hadi', gender: Gender.MALE },
  { id: 'm8', name: 'Serma Bakamla Rohman', gender: Gender.MALE },
  { id: 'm9', name: 'Letda Bakamla Ahmad Ishak Muharom', gender: Gender.MALE },
  { id: 'm10', name: 'Serda Bakamla Shandy Syahputra', gender: Gender.MALE },
  { id: 'm11', name: 'Serka Bakamla Syaoqi Sudarajat', gender: Gender.MALE },
  { id: 'm12', name: 'Letda Bakamla Giffari Said', gender: Gender.MALE },
  { id: 'm13', name: 'Letda Bakamla Restu Tea Dinata', gender: Gender.MALE },
];

export const GIFFARI_ID = 'm12';

/**
 * Daftar Hari Libur Nasional 2026 Indonesia
 * Format: "MM-DD"
 */
export const HOLIDAYS_2026 = [
  "01-01", // Tahun Baru 2026 Masehi
  "01-16", // Isra Mikraj Nabi Muhammad S.A.W.
  "02-17", // Tahun Baru Imlek 2576 Kongzili
  "03-19", // Hari Suci Nyepi (Tahun Baru Saka 1948)
  "03-21", // Idulfitri 1447 Hijriah
  "03-22", // Idulfitri 1447 Hijriah
  "04-03", // Wafat Yesus Kristus
  "04-05", // Kebangkitan Yesus Kristus (Paskah)
  "05-01", // Hari Buruh Internasional
  "05-14", // Kenaikan Yesus Kristus
  "05-27", // Iduladha 1447 Hijriah
  "05-31", // Hari Raya Waisak 2570 BE
  "06-01", // Hari Lahir Pancasila
  "06-16", // Tahun Baru Islam 1448 Hijriah
  "08-17", // Proklamasi Kemerdekaan
  "08-25", // Maulid Nabi Muhammad S.A.W
  "12-25", // Kelahiran Yesus Kristus
];
