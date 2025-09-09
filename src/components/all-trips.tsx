import axios from "axios";
import { useEffect, useState } from "react";

export default function ShowAllTrips() {
  const [trips, setTrips] = useState<any[]>([]);

  useEffect(() => {
    axios.get("/api/trips").then((res) => {
      setTrips(res.data);
    });
  }, []);

  console.log("trips", trips);
  return <div>Show all trips</div>;
}
