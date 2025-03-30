import { useFieldArray, useFormContext } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";

import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { userRoles } from "@/lib/schema";

import { FormData } from "../sign-up-form";

export default function TeamManagement() {
  const form = useFormContext<FormData>();

  // Store invites as a field array
  const { fields: invites, append: addInvite, remove: removeInvite } = useFieldArray({
    control: form.control,
    name: "teamMemberInvites",
  })

  return (
    <div className="space-y-10">
      <FormField
        control={form.control}
        name="userRole"
        render={({ field }) => (
          <FormItem>
            <div className="flex flex-row items-center justify-between">
              <FormLabel>Your Role</FormLabel>
              <FormMessage />
            </div>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger size="sm" className="w-full">
                  <SelectValue />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {userRoles.map((role, index) => (
                  <SelectItem key={`${role}-${index}`} value={role}>{role}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormItem>
        )}
      />

      <div className="space-y-4">
        <div className="flex flex-row items-center justify-between">
          <FormLabel>Invite Team Members</FormLabel>
          <FormDescription>You can also skip this for now</FormDescription>
        </div>
        {invites.map((field, index) => (
          <div key={field.id} className="flex items-end gap-3">
            <FormField
              control={form.control}
              name={`teamMemberInvites.${index}.email`}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <div className="flex flex-row items-center w-full justify-between">
                    <FormLabel>Invite Email</FormLabel>
                    <FormMessage />
                  </div>
                  <FormControl>
                    <Input
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => removeInvite(index)}
              className="hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2 className="h-5 w-5" />
            </Button>
          </div>
        ))}

        <Button
          type="button"
          variant="outline"
          className="w-full border-dashed border"
          onClick={() => addInvite({ email: "" })}
        >
          <Plus className="h-5 w-5" />
          Add Team Member
        </Button>
      </div>
    </div>
  )
}
