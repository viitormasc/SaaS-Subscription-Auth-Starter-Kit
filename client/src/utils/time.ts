import type {
  CategoryDocument,
  StudySession,
  TimerDocument,
} from '@/types/interfaces';

export function computeTotalSec(doc: TimerDocument) {
  const starts: number[] = doc.startTimeStamps ?? [];
  const stops: number[] = doc.stopTimeStamps ?? [];
  let total = 0;
  for (let i = 0; i < Math.min(starts.length, stops.length); i++)
    total += stops[i] - starts[i];
  if (doc.isRunning && starts.length > stops.length)
    total += Date.now() - starts[starts.length - 1];
  return Math.max(0, total) / 1000;
}

// utils/timerUtils.ts

// Function to calculate total time from timer object
export const getTotalTime = (timer: any): number => {
  if (!timer.startTimeStamps || !timer.stopTimeStamps) return 0;

  let totalTime = 0;
  for (let i = 0; i < timer.startTimeStamps.length; i++) {
    if (i < timer.stopTimeStamps.length) {
      totalTime += timer.stopTimeStamps[i] - timer.startTimeStamps[i];
    }
  }

  // Convert milliseconds to minutes
  return Math.round(totalTime / 60000);
};

export function formatDateToText(dateString: string): string {
  const date = new Date(dateString);

  const day = date.getDate();
  const month = date.toLocaleString('en-US', { month: 'long' });
  const year = date.getFullYear();

  return ` ${day}th ${month} ${year}`;
}

export function formatDuration(totalSeconds: number) {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = Math.floor(totalSeconds % 60);

  if (h) return `${h}h ${m}m ${s}s`;
  if (m) return `${m}m ${s}s`;
  return `${s}s`;
}
export const groupTimersByDay = (
  timers: TimerDocument[],
  categories: CategoryDocument[],
): Record<string, StudySession[]> => {
  const grouped: Record<string, StudySession[]> = {};

  timers.forEach((timer) => {
    const dayKey = timer.daykey;

    // Find category by ID
    const category = categories.find((cat) => cat._id === timer.categoryId);
    const categoryName = category?.name || 'Unknown';

    const totalTime = getTotalTime(timer);

    if (!grouped[dayKey]) {
      grouped[dayKey] = [];
    }

    // Check if we already have a session for this category on this day
    const existingSessionIndex = grouped[dayKey].findIndex(
      (session) => session.category === categoryName,
    );

    if (existingSessionIndex >= 0) {
      // Update existing session
      const existingSession = grouped[dayKey][existingSessionIndex];
      grouped[dayKey][existingSessionIndex] = {
        ...existingSession,
        totalTime: (existingSession.totalTime || 0) + totalTime,
      };
    } else {
      // Create new session
      const startTime = timer.startTimeStamps?.[0]
        ? new Date(timer.startTimeStamps[0]).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })
        : '';

      const endTime = timer.stopTimeStamps?.length
        ? new Date(
            timer.stopTimeStamps[timer.stopTimeStamps.length - 1],
          ).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })
        : '';

      grouped[dayKey].push({
        id: timer._id,
        date: dayKey,
        startTime,
        endTime,
        category: categoryName,
        title: categoryName,
        totalTime,
      });
    }
  });

  return grouped;
};

export function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export function endOfDay(d: Date) {
  const e = new Date(
    d.getFullYear(),
    d.getMonth(),
    d.getDate(),
    23,
    59,
    59,
    999,
  );
  return e;
}

/**
 * Parse "YYYY-MM-DD" as local date at 00:00 (avoid UTC shift bugs).
 */
export function parseLocalDateKey(daykey: string): Date {
  const [y, m, d] = daykey.split('-').map(Number);
  return new Date(y, m - 1, d); // local midnight
}

/**
 * Returns duration in milliseconds for a single TimerDocument,
 * clipped to the calendar day represented by `timer.daykey`.
 */
export function getTimerDurationClippedToDay(timer: {
  daykey: string;
  startTimeStamps: number[];
  stopTimeStamps: number[];
  isRunning: boolean;
  lastHeartbeat?: number;
}): number {
  const day = parseLocalDateKey(timer.daykey);
  const dayStart = startOfDay(day).getTime();
  const dayEnd = endOfDay(day).getTime();

  const starts = timer.startTimeStamps ?? [];
  const stops = timer.stopTimeStamps ?? [];

  let total = 0;

  // pair up starts/stops
  const pairCount = Math.max(starts.length, stops.length);
  for (let i = 0; i < pairCount; i++) {
    const s = starts[i];
    if (s == null) continue;

    // prefer matching stop; if missing and not running, skip
    const e = stops[i];

    // Clip each segment to the day bounds
    const segStart = Math.max(s, dayStart);
    let segEnd: number | undefined = e;

    // Incomplete pair:
    if (segEnd == null) {
      if (timer.isRunning && i === starts.length - 1) {
        // running segment: use lastHeartbeat (if any) or now
        const nowMs = Date.now();
        const liveEnd = timer.lastHeartbeat ?? nowMs;
        segEnd = liveEnd;
      } else {
        // stray start without stop and not the current running one -> ignore
        continue;
      }
    }

    // Final clamp to the day end
    const clampedEnd = Math.min(segEnd, dayEnd);
    const clampedStart = segStart;

    if (clampedEnd > clampedStart) {
      total += clampedEnd - clampedStart;
    }
  }

  return total;
}
