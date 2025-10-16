import type { ChildrenProps } from '@/types/interfaces';
import { Outlet } from 'react-router-dom';


function Container({ children }: ChildrenProps) {
  return (
    <div className="my-[100px] mx-auto p-[30px] border-r-[4px] shadow-lg rounded-lg min-h-screen min-w-screen dark:">
      {children}
      <Outlet />
    </div>
  );
}

export default Container;
