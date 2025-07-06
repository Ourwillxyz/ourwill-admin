import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";

export default function PollsList() {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPolls() {
      const { data, error } = await supabase
        .from("polls")
        .select("*")
        .order("created_at", { ascending: false });
      setPolls(data || []);
      setLoading(false);
    }
    fetchPolls();
  }, []);

  return (
    <div style={{ maxWidth: 600, margin: "40px auto", padding: 20 }}>
      <h2>All Polls</h2>
      {loading && <p>Loading...</p>}
      {!loading && polls.length === 0 && <p>No polls found.</p>}
      {polls.map((poll) => (
        <div
          key={poll.id}
          style={{
            border: "1px solid #ddd",
            marginBottom: 16,
            padding: 16,
            borderRadius: 8,
          }}
        >
          <strong>{poll.question}</strong>
          <ul>
            {poll.options.map((o, i) => (
              <li key={i}>{o}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
