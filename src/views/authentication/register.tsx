import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { Input } from "@/components/ui/input";
import DefaultLayout from "@/layouts/defaultLayout";
import { Link, useNavigate } from "react-router-dom";

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useMutation } from "@tanstack/react-query";
import { registerUser } from "@/api/authentication";
import toast from "react-hot-toast";
import { RefreshCw } from "lucide-react";

const formSchema = z.object({
  userEmail: z.string().email("Invalid email address"),
  userPassword: z.string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters long.")
    .max(32, "Password must be less than 32 characters long.")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, "Password must contain at least one uppercase letter, one lowercase letter, and one number.")
    .regex(/^[a-zA-Z\d@?!$^&*]+$/, "Password can only contain Latin letters in any case (a-Z), numbers, and the symbols @?!$^&*."),
  userRole: z.enum(["USER", "ADMIN"]),
});

const RegisterPage: React.FC = () => {

  // const dispatch = useDispatch<AppDispatch>();

  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: registerUser,
    mutationKey: ["registerUser"],
    onSuccess: () => {
      // const userObject: { data: { user: UserDataType, token: TokenDataType }, message: string } = data.data;

      toast.success("Your account has been registered successfully");

      // dispatch(setUser(userObject.data.user));
      // dispatch(setTokens(userObject.data.token));

      // localStorage.setItem("user", JSON.stringify(userObject.data.user));
      // localStorage.setItem("tokens", JSON.stringify(userObject.data.token));

      navigate("/login");
    },
    onError: () => {
      toast.error("Failed to login");
    }
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutate(values);
  }

  return (
    <DefaultLayout>
      <div className="flex justify-center w-full">
        <Card className="mx-auto max-w-sm sm:min-w-[428px]">
          <CardHeader>
            <CardTitle className="text-2xl">Register</CardTitle>
            <CardDescription>
              Enter your information to create an account
            </CardDescription>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <CardContent className="grid gap-4">
                <FormField
                  control={form.control}
                  name="userEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email<span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="example@email.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="userPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password<span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="userRole"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="loadTestType">Account Role<span className="text-red-600">*</span></FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select an account role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {
                            accountRoles.map((item) => (
                              <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>
                            ))
                          }
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button className="w-full" disabled={isPending}>
                  {
                    isPending ? (
                      <>
                        <RefreshCw className="animate-spin w-4 h-4 mr-2" />
                      </>
                    ) : (
                      "Register"
                    )
                  }
                </Button>

                <div className="mt-4 text-center text-sm">
                  Already have an account?{" "}
                  <Link to="/login" className="underline">
                    Sign in
                  </Link>
                </div>
              </CardContent>
            </form>
          </Form>
        </Card>
      </div>
    </DefaultLayout>
  )
}

const accountRoles = [{
  value: "USER",
  label: "User"
}, {
  value: "ADMIN",
  label: "Administrator"
}];

export default RegisterPage;