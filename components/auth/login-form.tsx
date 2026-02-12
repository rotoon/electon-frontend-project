"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useLoginMutation } from "@/hooks/use-auth";
import { formatCitizenId } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
  citizenId: z
    .string()
    .transform((val) => val.replace(/-/g, "")) // Remove hyphens before validation
    .pipe(z.string().length(13, "เลขบัตรประชาชนต้องมี 13 หลัก")),
  password: z.string().min(6, "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร"),
});

export function LoginForm() {
  const loginMutation = useLoginMutation();

  // 1. Setup Form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      citizenId: "",
      password: "",
    },
  });

  // 2. Form Submit Handler
  function onSubmit(values: z.infer<typeof formSchema>) {
    loginMutation.mutate(values);
  }

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="citizenId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>เลขบัตรประจำตัวประชาชน</FormLabel>
                <FormControl>
                  <Input
                    placeholder="1-2345-67890-12-3"
                    maxLength={17}
                    {...field}
                    onChange={(e) => {
                      const formatted = formatCitizenId(e.target.value);
                      field.onChange(formatted);
                    }}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>รหัสผ่าน</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="******" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-full"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
