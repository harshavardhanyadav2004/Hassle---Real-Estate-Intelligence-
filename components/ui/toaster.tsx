"use client"

import { Toast, ToastClose, ToastDescription, ToastProvider, ToastTitle } from "@/components/ui/toast"
import { useToast } from "@/components/hooks/use-toast"
import * as ToastPrimitives from "@radix-ui/react-toast"
import { cn } from "@/lib/utils"

export function Toaster() {
    const { toasts } = useToast()

    return (
        <ToastProvider>
            {toasts.map(({ id, title, description, action, ...props }) => (
                <Toast key={id} {...props}>
                    <div className="grid gap-1">
                        {title && <ToastTitle>{title}</ToastTitle>}
                        {description && <ToastDescription>{description}</ToastDescription>}
                    </div>
                    {action}
                    <ToastClose />
                </Toast>
            ))}
            <ToastPrimitives.Viewport
                className={cn(
                    "fixed bottom-0 right-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:flex-col md:max-w-[380px]",
                )}
            />
        </ToastProvider>
    )
}
