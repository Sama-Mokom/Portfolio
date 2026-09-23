import NextLink from "next/link";
import type { ComponentProps } from "react";

// Keep initial visits light on metered connections; fetch routes on navigation.
export default function Link(props: ComponentProps<typeof NextLink>) {
  return <NextLink {...props} prefetch={false} />;
}
