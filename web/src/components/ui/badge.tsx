import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/85",
        outline: "border-[#E2E8F0] text-[#0F172A] bg-white",
        lime: "border-[var(--accent-soft-border)] bg-[var(--accent-soft)] text-[var(--accent-soft-foreground)] hover:bg-[#CCFBF1]",
        teal: "border-[#99F6E4] bg-[#F0FDFA] text-[#0F766E] hover:bg-[#CCFBF1]",
        amber: "border-[#FDE68A] bg-[#FFFBEB] text-[#B45309] hover:bg-[#FEF3C7]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
