import { cva } from "class-variance-authority";

export const sidebarVariants = cva(
  "group/sidebar-wrapper flex min-h-svh w-full has-[[data-variant=inset]]:bg-sidebar",
  {
    variants: {
      variant: {
        default: "",
        floating: "",
        inset: "",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);