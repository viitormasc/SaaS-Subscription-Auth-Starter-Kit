import type { ChildrenProps } from '@/types/interfaces';
import { Outlet } from 'react-router-dom';

function Container({ children }: ChildrenProps) {
  return (
    <div className="my-[60px]  border-r-[4px] shadow-lg rounded-lg min-h-screen min-w-screen ">
      {children}
      <Outlet />
    </div>
  );
}

export default Container;
