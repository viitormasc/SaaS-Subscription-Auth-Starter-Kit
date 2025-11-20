import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useEditCategory } from '@/hooks/useEditCategory';
import type { CategoryDocument } from '@/types/interfaces';
import { Pencil } from 'lucide-react';
import { useId, useState, type ChangeEvent } from 'react';
import { toast } from 'react-toastify';
import Spinner from './Spinner';
import Logo from './ui/logo';

type EditDialogComponentProps = {
  category: CategoryDocument;
};

export default function EditCategoryDialogComponent({
  category,
}: EditDialogComponentProps) {
  const id = useId();
  const [color, setColor] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [name, setName] = useState(category.name);
  const [goal, setGoal] = useState(category.dailyGoalMinutes);
  const [selectedTimeFrame, setSelectedTimeFrame] = useState('hours');

  const colors = [
    '#ef476f',
    '#f78c6b',
    '#ffd166',
    '#06d6a0',
    '#118ab2',
    '#073b4c',
  ];

  const {
    mutate: editCategory,
    isError,
    isPending,
  } = useEditCategory(() => setOpenDialog(false));

  if (isPending) return <Spinner open />;

  function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    const goalInput = document.querySelector(
      `#${id}-dailyGoal`,
    ) as HTMLInputElement;

    const nameInput = document.querySelector(
      `#${id}-category`,
    ) as HTMLInputElement;

    if (nameInput.value.length < 3 || !goalInput.value) {
      toast.error('Please choose a name and a goal time to create a category');
      return;
    }
    if (goalInput.value.match(/[a-z]/gi)) {
      toast.error('Goal should be a number');
      return;
    }
    const goalTime: number =
      selectedTimeFrame == 'hours'
        ? +goalInput.value.replace(/,/g, '.')
        : +goalInput.value.replace(/,/g, '.') / 60;

    if (goalTime > 12) {
      toast.error('Goal should be not more than 12 hours');
      return;
    }
    const currentDailyGoalMinutes = String(goalTime * 60);
    const categoryName = nameInput.value.trim();
    editCategory({
      name: categoryName,
      dailyGoalMinutes: currentDailyGoalMinutes,
      color: color,
      _id: category._id as string,
    });
  }

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>
        <button
          className="inline-flex items-center justify-center rounded-xl border bg-white px-4 py-3  text-sm font-medium text-zinc-700 shadow-sm transition hover:bg-zinc-50 focus:outline-none focus:ring-4 focus:ring-zinc-400/20 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
          title="Edit"
        >
          <Pencil />
        </button>
      </DialogTrigger>
      <DialogContent>
        <div className="flex flex-col items-center gap-2">
          <div
            className="flex size-11 shrink-0 items-center justify-center rounded-full"
            aria-hidden="true"
          >
            <Logo />
          </div>
          <DialogHeader>
            <DialogTitle className="sm:text-center">
              Let's start tracking your study!
            </DialogTitle>
            <DialogDescription className="sm:text-center">
              Edit the category
            </DialogDescription>
          </DialogHeader>
        </div>
        {/* <span>Color Theme</span> */}
        {/* <div className="flex justify-between"> */}
        {/*   {colors.map((color) => ( */}
        {/*     <button */}
        {/*       id={color} */}
        {/*       key={color} */}
        {/*       className={`flex size-10 shrink-0 overflow-hidden rounded-full transition-transform hover:scale-110 themeColors`} */}
        {/*       style={{ backgroundColor: color }} */}
        {/*       onClick={(e) => { */}
        {/*         e.preventDefault(); */}
        {/*         const selectedColor = document.getElementById(`${color}`); */}
        {/*         const themeColorsOptions = Array.from( */}
        {/*           document.querySelectorAll('.themeColors'), */}
        {/*         ); */}
        {/**/}
        {/*         themeColorsOptions.forEach((color) => */}
        {/*           color.classList.remove('colorClicked'), */}
        {/*         ); */}
        {/**/}
        {/*         selectedColor?.classList.add('colorClicked'); */}
        {/**/}
        {/*         setColor(color); */}
        {/*       }} */}
        {/*     /> */}
        {/*   ))} */}
        {/* </div> */}

        <form className="space-y-5">
          <div className="space-y-4">
            <div className="*:not-first:mt-2">
              <Label htmlFor={`${id}-category`}>Category Name</Label>
              <Input
                id={`${id}-category`}
                placeholder="e.g., Programming studying"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="*:not-first:mt-2 flex gap-4">
              <div className="align-middle">
                <Label htmlFor={`${id}-dailyGoal`}>Daily study goal</Label>
              </div>
              <Input
                id={`${id}-dailyGoal`}
                placeholder="e.g., 1.5 hours"
                type="text"
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  const value = e.target.value;
                  if (value.match(/[A-Z]/gi)) {
                    e.target.value = e.target.value.replace(/[^0-9]/g, '');
                  }
                  setGoal(value);
                }}
                className="w-[10rem]"
                inputMode="numeric"
                pattern="[0-9]*"
                value={goal}
                required
              />{' '}
              <select
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                  setSelectedTimeFrame(e.target.value);
                }}
              >
                <option value="hours"> Hours </option>
                <option value="minutes"> Minutes </option>
              </select>
            </div>

            <Button type="button" className="w-full" onClick={handleClick}>
              Update category
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
