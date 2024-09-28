import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogPortal,
  DialogFooter
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { getLocalStoredUserCredentials, setLocalStoredUserCredentials } from "@/api/authentication";

const formSchema = z.object({
  clientId: z.string().min(1, "Client ID must be at least 1 character long"),
  authorization: z.string().min(1, "Authorization must be at least 1 character long"),
});

const SettingsModal: React.FC = () => {

  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clientId: "" || getLocalStoredUserCredentials()?.clientId,
      authorization: "" || getLocalStoredUserCredentials()?.authorization,
    }
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("saving: ", values);
    setLocalStoredUserCredentials(values);
  }

  function onError(errors: any) {
    console.log(errors);
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild className="flex justify-center items-center">
          <Button className="w-full md:w-fit" variant={"default"}>Settings</Button>
        </DialogTrigger>
        <DialogPortal>
          <DialogContent className="max-w-[36rem]">
            <DialogHeader>
              <DialogTitle>Settings</DialogTitle>
              <DialogDescription>
                Fill in your Twitch OAuth credentials to access the Twitch API.
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit, onError)} className="space-y-8">

                <FormField
                  control={form.control}
                  name="clientId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="clientId">Client ID</FormLabel>
                      <Input
                        {...field}
                        type="text"
                        placeholder="Client ID"
                      />
                      <FormMessage {...field} />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="authorization"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="authorization">Authorization</FormLabel>
                      <Input
                        {...field}
                        type="text"
                        placeholder="Authorization"
                      />
                      <FormMessage {...field} />
                    </FormItem>
                  )}
                />

                <DialogFooter>
                  <Button type="submit" variant={"default"}>Save</Button>
                </DialogFooter>

              </form>
            </Form>

          </DialogContent>
        </DialogPortal>
      </Dialog>
    </>
  )

}

export default SettingsModal;