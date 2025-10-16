import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Page404 = () => {
  return (
    <div className="flex items-center justify-center  ">
      <div className="text-center p-8 rounded-2xl shadow-lg max-w-md">
        <h1 className="text-9xl font-bold ">404</h1>
        <h2 className="mt-4 text-2xl font-semibold ">Page Not Found</h2>
        <p className="mt-2 ">
          Sorry, the page you are looking for doesn’t exist or has been moved.
        </p>

        <Button asChild size="sm" className="text-sm">
          <Link
            to="/"
             className="inline-block mt-6 px-6 py-3 transition-colors"
          >
            Go Home
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default Page404;
