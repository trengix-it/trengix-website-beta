import { Mark } from "./Mark";

/** Blauwe achtergrond met zwevende vlekken en het beeldmerk, zoals in de hero's. */
export function HeroBackdrop({ markStyle }: { markStyle?: React.CSSProperties }) {
  return (
    <>
      <div aria-hidden="true" className="blob blob-a" />
      <div aria-hidden="true" className="blob blob-b" />
      <Mark className="hero-mark hide-m" animated style={markStyle} />
    </>
  );
}
