import type { Category, CategoryDocument, StudySession, TimerDocument } from '@/types/interfaces';

export function computeTotalSec(doc: TimerDocument) {
  const starts: number[] = doc.startTimeStamps ?? [];
  const stops: number[] = doc.stopTimeStamps ?? [];
  let total = 0;
  for (let i = 0; i < Math.min(starts.length, stops.length); i++) total += stops[i] - starts[i];
  if (doc.isRunning && starts.length > stops.length) total += Date.now() - starts[starts.length - 1];
  return Math.max(0, total) / 1000;
}


// utils/timerUtils.ts

// Function to calculate total time from timer object
export const getTotalTime = (timer: any): number => {
  if (!timer.startTimeStamps || !timer.stopTimeStamps) return 0;

  let totalTime = 0;
  for (let i = 0; i < timer.startTimeStamps.length; i++) {
    if (i < timer.stopTimeStamps.length) {
      totalTime += (timer.stopTimeStamps[i] - timer.startTimeStamps[i]);
    }
  }

  // Convert milliseconds to minutes
  return Math.round(totalTime / 60000);
};

// Function to group timers by day and category
// export const groupTimersByDay = (timers: TimerDocument[], categories: <string, Category>) => {
//   const grouped: Record<string, StudySession[]> = {};
//
//   timers.forEach(timer => {
//     const dayKey = timer.daykey;
//     const category = categories[timer.categoryId]?.name || 'Unknown';
//     const totalTime = getTotalTime(timer);
//
//     if (!grouped[dayKey]) {
//       grouped[dayKey] = [];
//     }
//
//     // Check if we already have a session for this category on this day
//     const existingSessionIndex = grouped[dayKey].findIndex(
//       session => session.category === category
//     );
//
//     if (existingSessionIndex >= 0) {
//       // Update existing session
//       const existingSession = grouped[dayKey][existingSessionIndex];
//       grouped[dayKey][existingSessionIndex] = {
//         ...existingSession,
//         totalTime: (existingSession.totalTime || 0) + totalTime
//       };
//     } else {
//       // Create new session
//       grouped[dayKey].push({
//         id: timer._id,
//         date: dayKey,
//         startTime: new Date(timer.startTimeStamps[0]).toLocaleTimeString([], {
//           hour: '2-digit', minute: '2-digit'
//         }),
//         endTime: new Date(timer.stopTimeStamps[timer.stopTimeStamps.length - 1]).toLocaleTimeString([], {
//           hour: '2-digit', minute: '2-digit'
//         }),
//         category,
//         title: category,
//         totalTime
//       });
//     }
//   });
//
//   return grouped;
// };
export const groupTimersByDay = (
  timers: TimerDocument[],
  categories: CategoryDocument[]
): Record<string, StudySession[]> => {
  const grouped: Record<string, StudySession[]> = {};

  timers.forEach(timer => {
    const dayKey = timer.daykey;

    // Find category by ID
    const category = categories.find(cat => cat._id === timer.categoryId);
    const categoryName = category?.name || 'Unknown';

    const totalTime = getTotalTime(timer);

    if (!grouped[dayKey]) {
      grouped[dayKey] = [];
    }

    // Check if we already have a session for this category on this day
    const existingSessionIndex = grouped[dayKey].findIndex(
      session => session.category === categoryName
    );

    if (existingSessionIndex >= 0) {
      // Update existing session
      const existingSession = grouped[dayKey][existingSessionIndex];
      grouped[dayKey][existingSessionIndex] = {
        ...existingSession,
        totalTime: (existingSession.totalTime || 0) + totalTime
      };
    } else {
      // Create new session
      const startTime = timer.startTimeStamps?.[0]
        ? new Date(timer.startTimeStamps[0]).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        })
        : '';

      const endTime = timer.stopTimeStamps?.length
        ? new Date(timer.stopTimeStamps[timer.stopTimeStamps.length - 1]).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        })
        : '';

      grouped[dayKey].push({
        id: timer._id,
        date: dayKey,
        startTime,
        endTime,
        category: categoryName,
        title: categoryName,
        totalTime
      });
    }
  });

  return grouped;
};
