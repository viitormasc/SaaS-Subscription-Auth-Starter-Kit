import ReactRoutes from './routes/ReactRoutes';
import { useActiveUser } from './hooks/useActiveUser'; // Import useActiveUser
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
function App() {
  // Call useActiveUser here to trigger the initial fetch and populate the cache
  // This ensures the session status is checked when the app loads.

  useActiveUser();
  const queryClient = useQueryClient();
  useEffect(() => {
    const timerBc = new BroadcastChannel('timer-channel');
    timerBc.onmessage = (ev) => {
      if (ev.data?.type === 'timerUpdated') {
        queryClient.invalidateQueries({
          queryKey: ['timer', ev.data.categoryId],
        });
      }
    };
    return () => timerBc.close();
  }, []);
  useEffect(() => {
    const categoryBc = new BroadcastChannel('category-channel');
    categoryBc.onmessage = (ev) => {
      if (ev.data?.type === 'categoryUpdated') {
        queryClient.invalidateQueries({
          queryKey: ['categories', ev.data.userId],
        });
      }
    };
    return () => categoryBc.close();
  }, []);
  return (
    <>
      <ReactRoutes />;
    </>
  );
}
export default App;
