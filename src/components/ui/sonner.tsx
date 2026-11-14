import { useTheme } from "next-themes"
import { Toaster as Sonner, toast } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast font-sans rounded-lg group-[.toaster]:bg-white group-[.toaster]:text-ink group-[.toaster]:border-rule group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-ink-2",
          actionButton:
            "group-[.toast]:bg-ink group-[.toast]:text-white",
          cancelButton:
            "group-[.toast]:bg-paper group-[.toast]:text-ink-2",
        },
      }}
      {...props}
    />
  )
}

export { Toaster, toast }
