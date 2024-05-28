import { useMediaQuery } from "react-responsive";

export function useResponse() {
  const isMobile = useMediaQuery({ maxWidth: 719 });
  const isPad = useMediaQuery({ minWidth: 720, maxWidth: 1079 });
  const isPC = useMediaQuery({ minWidth: 1080 });

  return { isMobile, isPad, isPC };
}
