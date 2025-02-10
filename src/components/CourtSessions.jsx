import React, { useEffect, useState } from "react";
import axios from "axios";

const CourtSessions = () => {
  const [sessions, setSessions] = useState([]);
  const [judges, setJudges] = useState([]);
  const [lawyers, setLawyers] = useState([]);
  const [newSession, setNewSession] = useState({
    caseId: "",
    judgeId: "",
    lawyerId: "",
    date: "",
    time: "",
    status: "scheduled",
  });

  useEffect(() => {
    // Fetch court sessions
    axios.get("http://localhost:5000/sessions")
      .then((res) => setSessions(res.data))
      .catch((err) => console.error("Error fetching sessions:", err));

    // Fetch available judges
    axios.get("http://localhost:5000/users?role=judge")
      .then((res) => setJudges(res.data))
      .catch((err) => console.error("Error fetching judges:", err));

    // Fetch available lawyers
    axios.get("http://localhost:5000/users?role=lawyer")
      .then((res) => setLawyers(res.data))
      .catch((err) => console.error("Error fetching lawyers:", err));
  }, []);

  const handleCreateSession = async () => {
    try {
      const res = await axios.post("http://localhost:5000/sessions", newSession);
      setSessions([...sessions, { id: res.data.sessionId, ...newSession }]);
      setNewSession({ caseId: "", judgeId: "", lawyerId: "", date: "", time: "", status: "scheduled" });
    } catch (err) {
      console.error("Error creating session:", err);
    }
  };

  const handleCancelSession = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/sessions/${id}`);
      setSessions(sessions.filter(session => session.id !== id));
    } catch (err) {
      console.error("Error canceling session:", err);
    }
  };

  return (
    <div>
      <h3>⚖️ Court Sessions Management</h3>

      {/* Create New Court Session */}
      <div>
        <h4>Schedule a Court Hearing</h4>
        <input
          type="text"
          placeholder="Case ID"
          value={newSession.caseId}
          onChange={(e) => setNewSession({ ...newSession, caseId: e.target.value })}
        />
        <select
          value={newSession.judgeId}
          onChange={(e) => setNewSession({ ...newSession, judgeId: e.target.value })}
        >
          <option value="">Select Judge</option>
          {judges.map((judge) => (
            <option key={judge.id} value={judge.id}>{judge.username}</option>
          ))}
        </select>

        <select
          value={newSession.lawyerId}
          onChange={(e) => setNewSession({ ...newSession, lawyerId: e.target.value })}
        >
          <option value="">Select Lawyer</option>
          {lawyers.map((lawyer) => (
            <option key={lawyer.id} value={lawyer.id}>{lawyer.username}</option>
          ))}
        </select>

        <input
          type="date"
          value={newSession.date}
          onChange={(e) => setNewSession({ ...newSession, date: e.target.value })}
        />

        <input
          type="time"
          value={newSession.time}
          onChange={(e) => setNewSession({ ...newSession, time: e.target.value })}
        />

        <button onClick={handleCreateSession}>Schedule Hearing</button>
      </div>

      {/* Display Scheduled Sessions */}
      <h4>Upcoming Court Hearings</h4>
      <ul>
        {sessions.map((session) => (
          <li key={session.id}>
            Case ID: {session.caseId} | Judge: {session.judgeId} | Lawyer: {session.lawyerId} | 
            Date: {session.date} | Time: {session.time} | Status: {session.status}
            <button onClick={() => handleCancelSession(session.id)}>Cancel</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CourtSessions;
