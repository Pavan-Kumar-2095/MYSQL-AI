import { useState } from "react";
import "./Input.css";
import Footer from "../Components/Footer";

export default function Input() {
  const [databaseName, setDatabaseName] = useState(""); // Store database name
  const [query, setQuery] = useState(""); // Store SQL query
  const [data, setData] = useState(""); // Store result of query execution

  // New state for host, username, and password
  const [host, setHost] = useState(""); // Store host
  const [username, setUsername] = useState(""); // Store username
  const [password, setPassword] = useState(""); // Store password

  // Update database name input
  const handleDatabaseNameChange = (e) => {
    setDatabaseName(e.target.value);
    console.log("Database Name:", e.target.value);
  };

  // Update SQL query input
  const handleQueryChange = (e) => {
    setQuery(e.target.value);
    console.log("Query:", e.target.value);
  };

  // Update host input
  const handleHostChange = (e) => {
    setHost(e.target.value);
    console.log("Host:", e.target.value);
  };

  // Update username input
  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
    console.log("Username:", e.target.value);
  };

  // Update password input
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    console.log("Password:", e.target.value);
  };

  // Copy result to clipboard
  const copyToClipboard = async () => {
    if (data) {
      navigator.clipboard.writeText(data);
    }
  };

  // Function to send query and database name to the backend
  const executeQuery = async () => {
    if (!databaseName || !query || !host || !username || !password) {
      alert("Please enter all the fields: Host, Username, Password, Database Name, and SQL Query.");
      return;
    }

    setData("Loading...");

    const send = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        host: host,
        username: username,
        password: password,
        database: databaseName,
        query: query,
      }),
    };

    try {
      const res = await fetch("http://localhost:5000/query", send);
      const resultData = await res.json();

      if (res.ok) {
        // If result is an array, show it in a table format
        if (Array.isArray(resultData.results)) {
          setData(
            <table>
              <thead>
                <tr>
                  {Object.keys(resultData.results[0]).map((key) => (
                    <th key={key}>{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {resultData.results.map((row, index) => (
                  <tr key={index}>
                    {Object.values(row).map((value, idx) => (
                      <td key={idx}>{value}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          );
        } else {
          // If the result is not an array, treat it as a string or object and display it
          setData(JSON.stringify(resultData.results, null, 2)); // Formatting for readability
        }
      } else {
        setData(`Error: ${resultData.error || "Something went wrong"}`);
      }
    } catch (error) {
      console.log(error.message);
      setData(`Error: ${error.message}`);
    }
  };

  // Clear the inputs and results
  const clear = () => {
    // setDatabaseName("");
    setQuery("");
    // setHost("");
    // setUsername("");
    // setPassword("");
    setData("");
  };

  return (
    <div className="main">
      {/* Sidebar Inputs */}
      <div className="input">
        <div className="input-group">
          <label>Host:</label>
          <input
            type="text"
            placeholder="Enter host"
            value={host}
            onChange={handleHostChange}
            required
          />
        </div>
  
        <div className="input-group">
          <label>Username:</label>
          <input
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={handleUsernameChange}
            required
          />
        </div>
  
        <div className="input-group">
          <label>Password:</label>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={handlePasswordChange}
            required
          />
        </div>
  
        <div className="input-group">
          <label>Database Name:</label>
          <input
            type="text"
            placeholder="Enter database name"
            value={databaseName}
            onChange={handleDatabaseNameChange}
            required
          />
        </div>
  
      </div>
  
      {/* Main Content */}
      <div className="output">
        <div className="query-center">
          <label>SQL Query:</label>
          <input
            type="text"
            placeholder="Enter your SQL query"
            value={query}
            onChange={handleQueryChange}
            size="80"
            required
          />
        </div>

        <div className="button-group">
          <button onClick={executeQuery} className="button">SEND</button>
          <button onClick={clear} className="button">CLEAR</button>
        </div>

  
        <div className="output-result">
          {typeof data === "string" && <pre>{data}</pre>}
          {data && typeof data !== "string" && data}
        </div>
        <button onClick={copyToClipboard} className="button">COPY</button>
      </div>
    </div>
  );
  
}
