// src/utils/time.ts
import { DateTime } from 'luxon';
import { StudyDataDocument } from '../types/interfaces';
export const TZ = 'America/Fortaleza';

export const nowTZ = () => DateTime.now().setZone(TZ);
export const getDayKey = (d = new Date()) => DateTime.fromJSDate(d, { zone: TZ }).toFormat('yyyy-LL-dd');
export const endOfDay = (dk: string) => DateTime.fromFormat(dk, 'yyyy-LL-dd', { zone: TZ }).endOf('day').toJSDate();

export function computeTotalMs(doc: StudyDataDocument) {
  const starts: number[] = doc.startTimeStamps ?? [];
  const stops: number[] = doc.stopTimeStamps ?? [];
  let total = 0;
  for (let i = 0; i < Math.min(starts.length, stops.length); i++) total += stops[i] - starts[i];
  if (doc.isRunning && starts.length > stops.length) total += Date.now() - starts[starts.length - 1];
  return Math.max(0, total);
}
