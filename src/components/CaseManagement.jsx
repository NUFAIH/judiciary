import React, { useEffect, useState } from "react";
import axios from "axios";

const CaseManagement = () => {
  const [cases, setCases] = useState([]);
  const [newCase, setNewCase] = useState({ title: "", status: "pending", judgeId: "", lawyerId: "" });

  useEffect(() => {
    axios.get("http://localhost:5000/cases")
      .then((res) => setCases(res.data))
      .catch((err) => console.error("Error fetching cases:", err));
  }, []);

  const handleCreateCase = async () => {
    try {
      const res = await axios.post("http://localhost:5000/cases", newCase);
      setCases([...cases, { id: res.data.caseId, ...newCase }]);
      setNewCase({ title: "", status: "pending", judgeId: "", lawyerId: "" });
    } catch (err) {
      console.error("Error creating case:", err);
    }
  };

  return (
    <div>
      <h3>Case Management</h3>
      <input type="text" placeholder="Case Title" value={newCase.title} 
        onChange={(e) => setNewCase({ ...newCase, title: e.target.value })} />

      <button onClick={handleCreateCase}>Create Case</button>

      <ul>
        {cases.map((c) => (
          <li key={c.id}>{c.title} - {c.status}</li>
        ))}
      </ul>
    </div>
  );
};

export default CaseManagement;
