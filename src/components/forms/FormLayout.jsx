
"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function MyForm({
  schema,
  fields=[],
  onSubmit,
  afterSubmit = () => {},
  defaultValues = {},
  buttonText = "Submit",
  className = "",
  showResetAfterSubmit = false,
}) {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues,
    mode: "onChange",
  })

  const [loading, setLoading] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const submitForm = async (data) => {
    setLoading(true)
    setSubmitSuccess(false)
    try {
      const res = await onSubmit(data)
      if (res?.error) {
        form.setError("root", {
          type: "manual",
          message: res.error || "Something went wrong",
        })
      } else {
        setSubmitSuccess(true)
        afterSubmit()
        if (showResetAfterSubmit) {
          form.reset()
        }
      }
    } catch (error) {
      form.setError("root", {
        type: "manual",
        message: error.message || "Submission failed",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(submitForm)}
        className={`space-y-4 ${className}`}
      >
        {fields?.map((field) => (
          <FormField
            key={field.name}
            control={form.control}
            name={field.name}
            render={({ field: rhfField }) => (
              <FormItem>
                <div className="flex justify-between items-center">
                  <FormLabel htmlFor={field.name} className="text-gray-700">
                    {field.label}
                  </FormLabel>
                  {field.optional && (
                    <span className="text-xs text-muted-foreground">Optional</span>
                  )}
                </div>
                <FormControl>
                  <Input
                    id={field.name}
                    type={field.type || "text"}
                    placeholder={field.placeholder}
                    {...rhfField}
                    disabled={loading}
                    className={field.className}
                  />
                </FormControl>
                {field.description && (
                  <FormDescription>{field.description}</FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        ))}

        {form.formState.errors.root && (
          <Alert variant="destructive">
            <AlertDescription>
              {form.formState.errors.root.message}
            </AlertDescription>
          </Alert>
        )}

        {submitSuccess && (
          <Alert variant="success">
            <AlertDescription>
              Operation completed successfully!
            </AlertDescription>
          </Alert>
        )}

        <Button
          className="w-full mt-6"
          type="submit"
          disabled={loading || !form.formState.isValid}
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {buttonText}
        </Button>
      </form>
    </Form>
  )
}