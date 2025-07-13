import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "../ui/textarea";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";

const createTripSchema = z.object({
  name: z.string().min(3, "Name is too short").max(20, "Name is too long"),
  description: z
    .string()
    .min(3, "Description is too short")
    .max(200, "Description is too long"),
});

type CreateTripFormData = z.infer<typeof createTripSchema>;

interface CreateTripPayload {
  name: string;
  description: string;
}

export function CreateTrip() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<CreateTripFormData>({
    resolver: zodResolver(createTripSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const createTripMutation = useMutation({
    mutationFn: async (data: CreateTripPayload) => {
      const response = await axios.post("/api/trips", data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer secret", // Consider moving to environment variable
        },
      });
      return response.data;
    },
    onSuccess: () => {
      form.reset();
      setIsDialogOpen(false);
    },
    onError: (error) => {
      console.error("Failed to create trip:", error);
    },
  });

  const onSubmit = (data: CreateTripFormData) => {
    createTripMutation.mutate(data);
  };

  return (
    <div className="flex flex-col justify-center items-center space-y-4">
      <h1 className="text-2xl font-bold">Create a Trip</h1>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button>Create Trip</Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create a New Trip</DialogTitle>
            <DialogDescription>
              Fill in the details below to create your trip.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Trip Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Weekend Getaway"
                        {...field}
                        disabled={createTripMutation.isPending}
                      />
                    </FormControl>
                    <FormDescription>
                      Give your trip a memorable name.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your trip plans..."
                        className="resize-none"
                        rows={3}
                        {...field}
                        disabled={createTripMutation.isPending}
                      />
                    </FormControl>
                    <FormDescription>
                      Provide a brief description of your trip.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  disabled={createTripMutation.isPending}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={createTripMutation.isPending}>
                  {createTripMutation.isPending ? "Creating..." : "Create Trip"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
