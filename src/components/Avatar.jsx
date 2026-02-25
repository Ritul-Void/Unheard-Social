import { useMemo } from 'react';
import { createAvatar } from '@dicebear/core';
import { thumbs } from '@dicebear/collection';
export default function Avatar({
  seed,
  size = 48,
  className = ''
}) {
  const svg = useMemo(() => {
    const avatar = createAvatar(thumbs, {
      seed: seed || 'default',
      size
    });
    return avatar.toDataUri();
  }, [seed, size]);
  return React.createElement("img", {
    src: svg,
    alt: "Avatar",
    width: size,
    height: size,
    className: `rounded-full ${className}`
  });
}
