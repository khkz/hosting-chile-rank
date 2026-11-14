
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  // Etiqueta del sistema: radio 6 px (rounded-sm), 12 px, sin animaciones ni degradados.
  "inline-flex items-center gap-1 rounded-sm border px-2 py-0.5 text-xs font-semibold leading-5 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-paper-deep text-ink-2",
        secondary: "border-rule bg-paper text-ink-2",
        destructive: "border-brand-ink/30 bg-white text-brand-ink",
        outline: "border-rule bg-white text-ink-2",
        /** Tinta sólida, para fondos claros que necesitan peso. */
        ink: "border-transparent bg-ink text-white",
        /** Solo para el puesto 1. */
        brand: "border-transparent bg-brand text-white",
        /** Alias heredados: neutros. */
        gradient: "border-transparent bg-paper-deep text-ink-2",
        glow: "border-transparent bg-paper-deep text-ink-2",
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
