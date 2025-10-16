export interface LogoProps {
  className?: string
}

export default function Logo({ className }: LogoProps) {
  return (
    <>
      <img src="../../../public/vite.svg" alt="Logo vite" className={className ?? ''} />
    </>
  )
}
