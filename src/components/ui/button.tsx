import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  // Sistema «Cercano y confiable»: sin escalas ni sombras al pasar el cursor;
  // el foco usa el anillo global. Alturas: sm 36 px, default 44 px, lg 48 px.
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-[15px] font-semibold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        /** Acción secundaria sólida (tinta). */
        default: "bg-ink text-white hover:bg-ink-soft",
        /** Acción principal: una por vista. Rojo de marca. */
        brand: "bg-brand text-white hover:bg-brand-ink",
        destructive: "bg-brand-ink text-white hover:bg-brand",
        /** Acción terciaria con borde. */
        outline: "border border-ink/25 bg-white text-ink hover:border-ink hover:bg-paper",
        secondary: "bg-paper text-ink hover:bg-paper-deep",
        ghost: "text-ink hover:bg-paper",
        link: "h-auto px-0 text-ink underline underline-offset-4 decoration-ink/30 hover:decoration-ink",
        /** Alias heredado: se dibuja como la acción principal. */
        gradient: "bg-brand text-white hover:bg-brand-ink",
      },
      size: {
        default: "h-11 px-5",
        sm: "h-9 px-3 text-sm",
        lg: "h-12 px-6 text-base",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
