import * as React from "react"
import * as SeparatorPrimitive from "@radix-ui/react-separator"

const Separator = React.forwardRef<
React.ElementRef<typeof SeparatorPrimitive.Root>,
React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>
>(
  (
    { style, className, orientation = "horizontal", decorative = true, ...props },
    ref
  ) => (
      <SeparatorPrimitive.Root
        ref={ref}
        decorative={decorative}
        orientation={orientation}
        className={
          `separator ${className || ''} `
            + (orientation === 'horizontal' ? "horizontal" : "vertical")
        }

        style={{
          width: orientation === 'horizontal' ? "100%" : "1px",
          height: orientation === 'horizontal' ? "1px" : "100%",
          backgroundColor: 'hsla(var(--grey))',
          flexShrink: "0",
          ...style
        }}
        {...props}
      />
    )
)
Separator.displayName = SeparatorPrimitive.Root.displayName

export { Separator }
