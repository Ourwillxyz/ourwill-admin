import { useEffect, useState } from "react";

export default function PollsList() {
  const [polls, setPolls] = useState([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("polls");
      setPolls(stored ? JSON.parse(stored) : []);
    }
  }, []);

  return (
    <div style={{ maxWidth: 600, margin: "40px auto", padding: 20 }}>
      <h2>All Polls</h2>
      {polls.length === 0 && <p>No polls found.</p>}
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
