"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { sales } from "@/lib/placeholder-data"
import { useSettings } from "@/contexts/settings-context";

export function RecentSales() {
  const { settings } = useSettings();
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('')
  }
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: settings?.currency || "USD",
    }).format(amount);
  }

  return (
    <div className="space-y-8">
        {sales.map((sale) => (
            <div className="flex items-center" key={sale.email}>
                <Avatar className="h-9 w-9">
                    <AvatarImage src={sale.avatar} alt="Avatar" />
                    <AvatarFallback>{getInitials(sale.name)}</AvatarFallback>
                </Avatar>
                <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">{sale.name}</p>
                    <p className="text-sm text-muted-foreground">
                        {sale.email}
                    </p>
                </div>
                <div className="ml-auto font-medium">+{formatCurrency(sale.amount)}</div>
            </div>
        ))}
    </div>
  )
}
