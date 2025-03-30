import React from 'react'
import { useFormContext } from 'react-hook-form'

import { formatPlan } from '@/lib/utils';

import { FormData } from '../sign-up-form'

export default function Confirmation() {
  const form = useFormContext<FormData>();

  return (
    <div className="grid grid-cols-2 text-sm break-words gap-4">
      <div className="space-y-6 max-w-[20ch]">
        <div className="flex flex-col gap-1">
          <span className="text-muted-foreground">
            Name
          </span>
          <span className="text-foreground">
            {form.getValues().name}
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-muted-foreground">
            Email
          </span>
          <span className="text-foreground">
            {form.getValues().email}
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-muted-foreground">
            User Role
          </span>
          <span className="text-foreground">
            {form.getValues().userRole}
          </span>
        </div>
        {form.getValues().teamMemberInvites && (
          <div className="flex flex-col gap-1">
            <span className="text-muted-foreground">
              Team Members Invited
            </span>
            <span className="text-foreground">
              {form.getValues().teamMemberInvites?.map((invite) => (
                <div key={invite.email}>
                  {invite.email}
                </div>
              ))}
            </span>
          </div>
        )}
      </div>
      <div className="space-y-6  max-w-[20ch]">
        <div className="flex flex-col gap-1">
          <span className="text-muted-foreground">
            Organization Name
          </span>
          <span className="text-foreground">
            {form.getValues().organizationName}
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-muted-foreground">
            Organization Size
          </span>
          <span className="text-foreground">
            {form.getValues().organizationSize}
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-muted-foreground">
            Organization Category
          </span>
          <span className="text-foreground">
            {form.getValues().organizationCategory}
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-muted-foreground">
            Pricing Plan
          </span>
          <span className="text-foreground">
            {formatPlan(form.getValues().pricingPlan)}
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-muted-foreground">
            Joined the mailing list?
          </span>
          <span className="text-foreground">
            {form.getValues().acceptMailingList ? 'Yes' : 'No'}
          </span>
        </div>
      </div>
    </div>
  )
}
