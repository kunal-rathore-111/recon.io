
// to use in server component
"use client"

import { useEffect } from "react"
import { toast } from "sonner";

export function ToastComp({ message, type }: { message: string, type: string }) {

    useEffect(() => {
        if (type === "error") toast.error(message);
        else if (type === "success") toast.success(message);
        else toast(message);
    }, [])

    return null;

}