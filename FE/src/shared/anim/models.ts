export type ParallaxTarget = {
  ref: React.RefObject<HTMLElement>;
  factor?: number;
};

export type ParallaxOptions = {
  wrapperRef: React.RefObject<HTMLElement>;
  targets: ParallaxTarget[];
};
