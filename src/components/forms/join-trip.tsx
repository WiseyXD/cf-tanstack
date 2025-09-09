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
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";

const joinTripSchema = z.object({
  name: z.string().min(3, "Name is too short").max(20, "Name is too long"),
  shareCode: z
    .string()
    .min(3, "Share code is too short")
    .max(20, "Share code is too long"),
});

type JoinTripFormData = z.infer<typeof joinTripSchema>;

interface JoinTripPayload {
  name: string;
  shareCode: string;
}

export function JoinTrip() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const joinForm = useForm<JoinTripFormData>({
    resolver: zodResolver(joinTripSchema),
    defaultValues: {
      name: "",
      shareCode: "",
    },
  });

  const joinTripMutation = useMutation({
    mutationFn: async (data: JoinTripPayload) => {
      const response = await axios.post("/api/trips/join", data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer secret", // Consider moving to environment variable
        },
      });
      return response.data;
    },
    onSuccess: () => {
      console.log("Successfully joined trip");
      joinForm.reset();
      setIsDialogOpen(false);
    },
    onError: (error) => {
      console.error("Failed to join trip:", error);
    },
  });

  const onSubmit = (data: JoinTripFormData) => {
    joinTripMutation.mutate(data);
  };

  return (
    <div className="flex flex-col justify-center items-center space-y-4">
      <h1 className="text-2xl font-bold">Join a Trip</h1>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">Join Trip</Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Join an Existing Trip</DialogTitle>
            <DialogDescription>
              Enter your name and the share code provided by the trip organizer
              to join the trip.
            </DialogDescription>
          </DialogHeader>

          <Form {...joinForm}>
            <form
              onSubmit={joinForm.handleSubmit(onSubmit)}
              className="space-y-6"
            >
              <FormField
                control={joinForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your name"
                        {...field}
                        disabled={joinTripMutation.isPending}
                      />
                    </FormControl>
                    <FormDescription>
                      This is how you'll appear to other trip members.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={joinForm.control}
                name="shareCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Share Code</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter trip share code"
                        {...field}
                        disabled={joinTripMutation.isPending}
                        className="font-mono"
                      />
                    </FormControl>
                    <FormDescription>
                      The unique code shared by the trip organizer.
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
                  disabled={joinTripMutation.isPending}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={joinTripMutation.isPending}>
                  {joinTripMutation.isPending ? "Joining..." : "Join Trip"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
