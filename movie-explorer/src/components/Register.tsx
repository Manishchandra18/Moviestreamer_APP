import React, { useState } from "react";
import { Box, Button, TextField, Typography, Paper, Chip } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../utils/user";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [interestInput, setInterestInput] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleAddInterest = () => {
    if (interestInput && !interests.includes(interestInput)) {
      setInterests([...interests, interestInput]);
      setInterestInput("");
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password || !name) {
      setError("Please fill all fields.");
      return;
    }
    try {
      registerUser({ username, password, name, interests });
      navigate("/login");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", minWidth: "100vw", bgcolor: "#181818", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Paper sx={{ p: 4, minWidth: '100vw', minHeight: '100vh', bgcolor: "#181818", color: "white", borderRadius: 0, boxShadow: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <Box sx={{ width: '100%', maxWidth: 400, mx: 'auto', '@media (min-width:1200px)': { marginLeft: 'auto', marginRight: 'auto', left: 0, right: 0 } }}>
          <Typography variant="h4" fontWeight={700} mb={2} align="center">Register</Typography>
          <form onSubmit={handleRegister}>
            <TextField label="Username" variant="outlined" fullWidth value={username} onChange={e => setUsername(e.target.value)} sx={{ mb: 2, input: { color: "white" } }} InputLabelProps={{ style: { color: "#aaa" } }} />
            <TextField label="Password" type="password" variant="outlined" fullWidth value={password} onChange={e => setPassword(e.target.value)} sx={{ mb: 2, input: { color: "white" } }} InputLabelProps={{ style: { color: "#aaa" } }} />
            <TextField label="Name" variant="outlined" fullWidth value={name} onChange={e => setName(e.target.value)} sx={{ mb: 2, input: { color: "white" } }} InputLabelProps={{ style: { color: "#aaa" } }} />
            <Box sx={{ display: "flex", mb: 2 }}>
              <TextField label="Add Interest" variant="outlined" value={interestInput} onChange={e => setInterestInput(e.target.value)} sx={{ flex: 1, input: { color: "white" } }} InputLabelProps={{ style: { color: "#aaa" } }} />
              <Button onClick={handleAddInterest} sx={{ ml: 1 }} variant="contained">Add</Button>
            </Box>
            <Box sx={{ mb: 2 }}>
              {interests.map(interest => (
                <Chip key={interest} label={interest} onDelete={() => setInterests(interests.filter(i => i !== interest))} sx={{ mr: 1, mb: 1 }} />
              ))}
            </Box>
            {error && <Typography color="error" mb={2}>{error}</Typography>}
            <Button type="submit" variant="contained" color="primary" fullWidth sx={{ fontWeight: 700, mt: 1 }}>Register</Button>
          </form>
          <Button color="secondary" fullWidth sx={{ mt: 2 }} onClick={() => navigate("/login")}>Already have an account? Login</Button>
        </Box>
      </Paper>
    </Box>
  );
}
