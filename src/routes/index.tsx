import { createFileRoute } from "@tanstack/react-router";
import { CreateTrip } from "@/components/forms/create-trip";
import { JoinTrip } from "@/components/forms/join-trip";
import ShowAllTrips from "@/components/all-trips";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <>
      <div className="flex w-full h-screen justify-center items-center gap-x-12">
        <CreateTrip />
        <JoinTrip />
      </div>
      <ShowAllTrips />
    </>
  );
}
