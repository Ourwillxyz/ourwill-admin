import { useState } from "react";
import { supabase } from "../utils/supabaseClient";

export default function CreatePoll() {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleOptionChange = (idx, value) => {
    const newOptions = [...options];
    newOptions[idx] = value;
    setOptions(newOptions);
  };

  const addOption = () => {
    setOptions([...options, ""]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const pollData = {
      question,
      options: options.filter((o) => o.trim() !== ""),
    };

    const { error } = await supabase.from("polls").insert([pollData]);

    setLoading(false);

    if (error) {
      setMessage("Error creating poll: " + error.message);
    } else {
      setMessage("Poll created!");
      setQuestion("");
      setOptions(["", ""]);
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: "40px auto", padding: 20, boxShadow: "0 0 10px #eee" }}>
      <h2>Create a Poll</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Poll Question:</label>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            required
            style={{ width: "100%", marginBottom: 10, padding: 8 }}
          />
        </div>
        <div>
          <label>Options:</label>
          {options.map((opt, idx) => (
            <input
              key={idx}
              type="text"
              value={opt}
              onChange={(e) => handleOptionChange(idx, e.target.value)}
              required={idx < 2}
              placeholder={`Option ${idx + 1}`}
              style={{ width: "100%", marginBottom: 8, padding: 8 }}
            />
          ))}
          <button type="button" onClick={addOption} style={{ marginBottom: 10 }}>
            Add Option
          </button>
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Poll"}
        </button>
      </form>
      {message && <div style={{ marginTop: 20, color: message.startsWith("Error") ? "red" : "green" }}>{message}</div>}
    </div>
  );
}
