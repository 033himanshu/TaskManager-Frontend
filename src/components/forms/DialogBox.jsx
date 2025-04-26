"use client"

import { Dialog } from "@radix-ui/react-dialog"
import { DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"
import MyForm from "./FormLayout"

export default function DialogBox({
  isDialogOpen,
  setIsDialogOpen,
  title,
  schema,
  defaultValues,
  fields,
  handleSubmit,
  buttonText
}) {
  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <MyForm
          schema={schema}
          defaultValues={defaultValues}
          fields={fields}
          onSubmit={handleSubmit}
          buttonText={buttonText}
          onCancel={() => setIsDialogOpen(false)} // Fixed prop name here
        />
      </DialogContent>
    </Dialog>
  )
}