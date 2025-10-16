import type { SpinnerOverlayProps } from '@/types/types';
import Logo from "./ui/logo";

export default function Spinner({
  open = true,
  message,
  size = 160,
}: SpinnerOverlayProps) {
  if (!open) return null;

  const ring = `${size}px`;
  const inner = `${Math.max(size - 24, 40)}px`; // anel interno

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black/60 backdrop-blur-[1px]"
      role="status"
      aria-live="assertive"
      aria-busy="true"
    >
      <div className="relative" style={{ width: ring, height: ring }}>
        {/* Anel externo girando */}
        <div
          className="absolute inset-0 rounded-full border-8 animate-spin"
          style={{
            borderColor: "rgba(67,56,202,0.35)", // indigo-600/35
            borderTopColor: "#4338ca",           // indigo-600 sólido
          }}
        />
        {/* Anel interno girando em velocidade diferente */}
        <div
          className="absolute rounded-full border-8 animate-spin"
          style={{
            top: 12,
            left: 12,
            right: 12,
            bottom: 12,
            borderColor: "rgba(67,56,202,0.2)",
            borderRightColor: "transparent",
            animationDuration: "2s",
          }}
        />
        {/* Cápsula do logo no centro */}
        <div className="absolute inset-0 grid place-items-center">
          <div className="rounded-full bg-white/95 shadow-xl p-4">
            {/* Ajuste o tamanho do logo conforme precisar */}
            <Logo className="h-10 w-auto" />
          </div>
        </div>
      </div>

      {message && (
        <p className="mt-6 text-sm text-white/90 select-none">{message}</p>
      )}
    </div>
  );
}
