import { useState } from "react";

export default function CreatePoll() {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [message, setMessage] = useState("");

  const handleOptionChange = (idx, value) => {
    const newOptions = [...options];
    newOptions[idx] = value;
    setOptions(newOptions);
  };

  const addOption = () => {
    setOptions([...options, ""]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage(
      `Poll created! Question: "${question}", Options: ${options
        .filter((o) => o)
        .join(", ")}`
    );
    setQuestion("");
    setOptions(["", ""]);
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
        <button type="submit">Create Poll</button>
      </form>
      {message && <div style={{ marginTop: 20, color: "green" }}>{message}</div>}
    </div>
  );
}
