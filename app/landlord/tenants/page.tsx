"use client"

import { useLandlordTenants } from "@/hooks/use-landlord-data"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Mail, Phone, User } from "lucide-react"

export default function LandlordTenants() {
  const { data: tenants, isLoading } = useLandlordTenants()

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Tenants</h1>
          <p className="text-muted-foreground">Manage your tenant information</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-balance">Tenants</h1>
        <p className="text-muted-foreground text-balance">Manage your tenant information</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {tenants?.map((tenant) => (
          <Card key={tenant.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={tenant.avatar || "/placeholder.svg"} />
                  <AvatarFallback>
                    {tenant.firstName[0]}
                    {tenant.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-3">
                  <div>
                    <h3 className="font-semibold text-lg">
                      {tenant.firstName} {tenant.lastName}
                    </h3>
                    <Badge variant="secondary" className="text-xs">
                      Active Tenant
                    </Badge>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      <span>{tenant.email}</span>
                    </div>
                    {tenant.phone && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Phone className="h-4 w-4" />
                        <span>{tenant.phone}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )) || (
          <Card className="col-span-full">
            <CardContent className="p-12 text-center">
              <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No tenants yet</p>
              <p className="text-sm text-muted-foreground mt-2">Tenants will appear here once they register</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
