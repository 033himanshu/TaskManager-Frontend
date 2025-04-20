import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-br from-[#1DA1F2] to-[#005BEA] text-white shadow-md hover:from-[#1A8CD8] hover:to-[#004EC9]",
        destructive:
          "bg-red-600 text-white shadow-md hover:bg-red-700",
        outline:
          "border border-[#89CFF0] text-[#89CFF0] bg-transparent hover:bg-[#1DA1F2]/10",
        secondary:
          "bg-[#0A192F] text-[#AEE1F9] hover:bg-[#112240]",
        ghost: "text-[#AEE1F9] hover:bg-[#1DA1F2]/10",
        link: "text-[#1DA1F2] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-8 rounded-xl px-3 text-xs",
        lg: "h-12 rounded-2xl px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Button = React.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props} />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
