import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    Checkbox,
    FormControlLabel,
    FormGroup,
    Paper,
    Divider
} from '@mui/material';
import { HubConnectionBuilder } from '@microsoft/signalr';

export default function FacilitatorPanel() {
    const [isConnected, setIsConnected] = useState(false);
    const [connection, setConnection] = useState(null);
    const [taskStatus, setTaskStatus] = useState({});
    const [newTeamName, setNewTeamName] = useState("");

    useEffect(() => {
        const conn = new HubConnectionBuilder()
            .withUrl("/taskHub")
            .withAutomaticReconnect()
            .build();

        conn.on("LoadInitialState", (data) => {
            setTaskStatus(data);
        });

        conn.on("TaskUpdated", ({ teamId, taskId, isCompleted }) => {
            setTaskStatus(prev => {
                const team = prev[teamId] || {};
                return {
                    ...prev,
                    [teamId]: {
                        ...team,
                        [`task${taskId}`]: isCompleted
                    }
                };
            });
        });

        conn.start()
            .then(() => {
                setIsConnected(true);
                setConnection(conn);
            })
            .catch(err => console.error("Connection failed: ", err));

        return () => {
            conn.stop();
        };
    }, []);

    const handleCreateTeam = async () => {
        if (!newTeamName.trim()) return;

        if (connection?.state === "Connected") {
            connection.invoke("CreateTeam", newTeamName)
                .then(() => setNewTeamName(""))
                .catch(err => console.error("Failed to create team:", err));
        }
    };

    const handleCheck = (teamId, taskId) => {
        const parsedTeamId = parseInt(teamId);
        if (connection?.state === "Connected") {
            connection.invoke("MarkTaskCompleted", parsedTeamId, taskId)
                .catch(err => console.error("Invoke failed: ", err));
        } else {
            console.warn("Connection not ready. Try again shortly.");
        }
    };

    return (
        <Box>
            <Typography variant="h5" gutterBottom>
                Facilitator Panel
            </Typography>

            <Box display="flex" alignItems="center" mb={3}>
                <TextField
                    label="Team Name"
                    variant="outlined"
                    size="small"
                    value={newTeamName}
                    onChange={(e) => setNewTeamName(e.target.value)}
                    sx={{ mr: 2 }}
                />
                <Button variant="contained" onClick={handleCreateTeam}>
                    Create Team
                </Button>
            </Box>

            {isConnected ? (
                Object.entries(taskStatus).map(([teamId, teamData]) => (
                    <Paper key={teamId} sx={{ p: 2, mb: 2 }}>
                        <Typography variant="subtitle1" gutterBottom>
                            {teamData.teamName || `Team ${teamId}`}
                        </Typography>
                        <Divider sx={{ mb: 1 }} />
                        <FormGroup row>
                            {[1, 2, 3, 4].map(taskId => (
                                <FormControlLabel
                                    key={taskId}
                                    control={
                                        <Checkbox
                                            checked={teamData?.[`task${taskId}`] || false}
                                            onChange={() => handleCheck(teamId, taskId)}
                                        />
                                    }
                                    label={`Task ${taskId}`}
                                    sx={{ mr: 2 }}
                                />
                            ))}
                        </FormGroup>
                    </Paper>
                ))
            ) : (
                <Typography color="text.secondary">Connecting to server...</Typography>
            )}
        </Box>
    );
}
