import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useDeleteCategory } from '@/hooks/useDeleteCategory';
import type { DeleAlertComponentProps } from '@/types/interfaces';
import { Trash2 } from 'lucide-react';

export default function DeleteAlertComponent({
  category,
}: DeleAlertComponentProps) {
  const { mutate: deleteCategory } = useDeleteCategory();

  function handleDelete() {
    deleteCategory(category);
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button
          className="inline-flex items-center justify-center rounded-xl border bg-white px-4 py-3 text-sm font-medium text-red-600 shadow-sm transition hover:bg-red-50 focus:outline-none focus:ring-4 focus:ring-red-500/20 dark:border-zinc-800 dark:bg-zinc-900 dark:text-red-400 dark:hover:bg-zinc-800"
          title="Delete"
        >
          <Trash2 className="size-5" />
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to delete this?
          </AlertDialogTitle>
          <AlertDialogDescription>
          If you delete this card the past data will not be lost and will still exist in your history.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-500 hover:bg-red-400"
            onClick={handleDelete}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
