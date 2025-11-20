import logo from '../assets/CodeByVitor-withotu-bg.png';
interface SpinnerOverlayProps {
  open?: boolean;
  message?: string;
  size?: number;
}

export default function Spinner({
  open = true,
  message,
  size = 160,
}: SpinnerOverlayProps) {
  if (!open) return null;

  const ring = `${size}px`;

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black/60 backdrop-blur-[1px]"
      role="status"
      aria-live="assertive"
      aria-busy="true"
    >
      <div className="relative" style={{ width: ring, height: ring }}>
        <svg
          className="absolute inset-0 animate-spin"
          viewBox="0 0 100 100"
          style={{ animationDuration: '1.5s' }}
        >
          <defs>
            <linearGradient
              id="ringPrimary"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="rgb(50, 10, 200)" stopOpacity="0.15" />{' '}
              {/* lighter orange */}
              <stop offset="50%" stopColor="rgb(50, 10, 200)" stopOpacity="0.8" />{' '}
              {/* main orange */}
              <stop offset="100%" stopColor="rgb(50, 10, 200)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <circle
            cx="50"
            cy="50"
            r="46"
            fill="none"
            stroke="url(#ringPrimary)"
            strokeWidth="8"
            strokeLinecap="round"
          />
        </svg>

        <svg
          className="absolute inset-0 animate-spin"
          viewBox="0 0 100 100"
          style={{ animationDuration: '2s', animationDirection: 'reverse' }}
        >
          <defs>
            <linearGradient
              id="ringSecondary"
              x1="100%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#FDBA74" stopOpacity="0.25" />{' '}
              {/* peachy highlight */}
              <stop offset="50%" stopColor="rgb(50, 10, 200)" stopOpacity="0.85" />
              <stop offset="100%" stopColor="rgb(50, 10, 200)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <circle
            cx="50"
            cy="50"
            r="38"
            fill="none"
            stroke="url(#ringSecondary)"
            strokeWidth="6"
            strokeLinecap="round"
          />
        </svg>

        <div
          className="absolute inset-0 animate-spin"
          style={{ animationDuration: '3s' }}
        >
          <div className="absolute top-0 left-1/2 w-3 h-3 -ml-1.5 rounded-full bg-blue-400 shadow-lg shadow-blue-500/40 animate-pulse" />
          <div
            className="absolute top-1/2 right-0 w-3 h-3 -mt-1.5 rounded-full bg-white shadow-lg shadow-white/40 animate-pulse"
            style={{ animationDelay: '0.5s' }}
          />
        </div>

        <div className="absolute inset-0 grid place-items-center">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400/20 to-white/10 blur-xl animate-pulse" />

            <div className="relative rounded-full  shadow-2xl p-5 backdrop-blur-sm border border-white/10 dark:border-zinc-700/30">
              <img src={logo} />
            </div>
          </div>
        </div>
      </div>

      {message && (
        <p className="mt-8 text-sm font-medium text-white/90 select-none animate-pulse">
          {message}
        </p>
      )}
    </div>
  );
}
