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

export default function MyForm({
  schema,
  fields,
  onSubmit,
  afterSubmit=()=>{},
  defaultValues = {},
  buttonText = "Submit",
  className = "",
}) {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues,
  })
  const [loading, setLoading] = useState(false)
  const submitForm = async (data) => {
    setLoading(true)
    try {
      const res = await onSubmit(data)
      console.log(res)
      if (res?.error) {
        form.setError("root", {
          type: "manual",
          message: res.error || "Something went wrong",
        })
      } else {
        afterSubmit()
        form.reset()
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
        className={`space-y-6 ${className}`}
      >
        {fields.map((field) => (
          <FormField
            key={field.name}
            control={form.control}
            name={field.name}
            render={({ field: rhfField }) => (
              <FormItem>
                <FormLabel htmlFor={field.name} className="text-gray-700">{field.label}</FormLabel>
                <FormControl>
                  <Input
                    id={field.name}
                    type={field.type || "text"}
                    placeholder={field.placeholder}
                    {...rhfField}
                    disabled={loading} // Disable inputs during loading
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
          <p className="text-center text-sm text-red-500">
            {form.formState.errors.root.message}
          </p>
        )}

        <Button
          className="w-full"
          type="submit"
          disabled={loading} // Disable button during loading
        >
          {loading ? "Submitting..." : buttonText}
        </Button>
      </form>
    </Form>
  )
}
