export type LenisLike = {
  on: (event: string, cb: () => void) => (() => void) | void;
  destroy: () => void;
  raf: (time: number) => void;
  scroll: number;
};

type Listener = (instance: LenisLike | null) => void;

let instance: LenisLike | null = null;
const listeners = new Set<Listener>();

export function setLenisInstance(next: LenisLike | null) {
  instance = next;
  listeners.forEach((listener) => listener(instance));
}

export function getLenisInstance() {
  return instance;
}

export function subscribeLenis(listener: Listener) {
  listeners.add(listener);
  listener(instance);
  return () => {
    listeners.delete(listener);
  };
}
