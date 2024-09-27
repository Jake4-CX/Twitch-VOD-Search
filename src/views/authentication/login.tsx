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
import { Input } from "@/components/ui/input";
import DefaultLayout from "@/layouts/defaultLayout";
import { Link, useNavigate } from "react-router-dom";

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useMutation } from "@tanstack/react-query";
import { loginUser } from "@/api/authentication";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { setTokens, setUser } from "@/redux/features/user-slice";
import { AxiosResponse } from "axios";
import { RefreshCw } from "lucide-react";

const formSchema = z.object({
  userEmail: z.string().email("Invalid email address"),
  userPassword: z.string().min(8, "Password must be at least 8 characters long.").max(32, "Password must be less than 32 characters long."),
});

const LoginPage: React.FC = () => {

  const dispatch = useDispatch<AppDispatch>();

  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: loginUser,
    mutationKey: ["loginUser"],
    onSuccess: (data: AxiosResponse) => {
      const userObject: { data: { user: UserDataType, token: TokenDataType }, message: string } = data.data;

      toast.success("Logged in successfully");

      dispatch(setUser(userObject.data.user));
      dispatch(setTokens(userObject.data.token));

      localStorage.setItem("user", JSON.stringify(userObject.data.user));
      localStorage.setItem("tokens", JSON.stringify(userObject.data.token));

      navigate("/dashboard");
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
        <Card className="h-full w-full max-w-sm sm:min-w-[428px]">
          <CardHeader>
            <CardTitle className="text-2xl">Login</CardTitle>
            <CardDescription>
              Enter your email below to login to your account.
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

                <Button className="w-full" disabled={isPending}>
                  {
                    isPending ? (
                      <>
                        <RefreshCw className="animate-spin w-4 h-4 mr-2" />
                      </>
                    ) : (
                      "Login"
                    )
                  }
                </Button>

                <div className="mt-4 text-center text-sm">
                  Don&apos;t have an account?{" "}
                  <Link to="/register" className="underline">
                    Sign up
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

export default LoginPage;