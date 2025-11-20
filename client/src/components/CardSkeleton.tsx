import { Plus } from 'lucide-react';
import NewTrackerDialog from './NewTrackerDialog';

export default function CardSkeleton() {
  return (
    <button className="relative items-center min-w-[250px] w-[30vw] rounded-2xl border  shadow-sm  flex justify-center align-middle">
      <NewTrackerDialog location="cards" />
    </button>
  );
}
