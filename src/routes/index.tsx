import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const getRepoData = async () => {
    console.log("fetching data");
    const response = { name: "aryan" };
    return response;
  };
  const { isPending, error, data } = useQuery({
    queryKey: ["repoData"],
    queryFn: getRepoData,
    staleTime: Infinity,
  });

  if (isPending) return "Loading...";

  if (error) return "An error has occurred: " + error.message;

  return (
    <div>
      <h1>{data.name}</h1>
    </div>
  );
}
