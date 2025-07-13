import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const getRepoData = async () => {
    console.log("fetching data");

    const result = await fetch("http://localhost:3000/api/trips", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer secret",
      },
    });

    const data = await result.json();
    console.log(data);
    const response = { name: "heloo" };
    return response;
  };
  const { isPending, error, data } = useQuery({
    queryKey: ["repoData"],
    queryFn: getRepoData,
  });

  if (isPending) return "Loading...";

  if (error) return "An error has occurred: " + error.message;

  return (
    <div>
      <h1>{data.name}</h1>
      <Button className="">Click me</Button>
    </div>
  );
}
