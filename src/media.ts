import { useMediaQuery } from "react-responsive";

export function useResponse() {
  const isMobile = useMediaQuery({ maxWidth: 719 });
  const isPad = useMediaQuery({ minWidth: 720, maxWidth: 1279 });
  const isPC = useMediaQuery({ minWidth: 1280 });

  return { isMobile, isPad, isPC };
}
