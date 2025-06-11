import React, { useEffect, useState } from 'react';
import { HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';


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

        conn.on("TaskUpdated", ({ teamId, taskId }) => {
            setTaskStatus(prev => {
                const team = prev[teamId] || {};
                return {
                    ...prev,
                    [teamId]: {
                        ...team,
                        [`task${taskId}`]: true
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

        const response = await fetch("/api/leaderboard/create", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ teamName: newTeamName })
        });

        if (response.ok) {
            setNewTeamName("");

            // 🔁 Broadcast refresh to all clients via SignalR
            if (connection?.state === "Connected") {
                connection.invoke("RequestStateRefresh")
                    .catch(err => console.error("Refresh failed", err));
            }
        } else {
            console.error("Failed to create team");
        }
    };

    const handleCheck = (teamId, taskId) => {
        if (connection?.state === "Connected") {
            connection.invoke("MarkTaskCompleted", teamId, taskId)
                .catch(err => console.error("Invoke failed: ", err));
        } else {
            console.warn("Connection not ready. Try again shortly.");
        }
    };

    return (
        <div>
            <h3>Facilitator Panel</h3>
            <div style={{ marginBottom: "20px" }}>
                <input
                    type="text"
                    placeholder="Enter team name"
                    value={newTeamName}
                    onChange={(e) => setNewTeamName(e.target.value)}
                    style={{ marginRight: "10px" }}
                />
                <button onClick={handleCreateTeam}>Create Team</button>
            </div>
            {isConnected ? (
                Object.entries(taskStatus).map(([teamId, teamData]) => (
                    <div key={teamId}>
                        {teamData.teamName || `Team ${teamId}`}:
                        {[1, 2, 3, 4].map(taskId => (
                            <label key={taskId} style={{ marginRight: "10px" }}>
                                <input
                                    type="checkbox"
                                    checked={teamData?.[`task${taskId}`] || false}
                                    onChange={() => handleCheck(teamId, taskId)}
                                />
                                Task {taskId}
                            </label>
                        ))}
                    </div>
                ))
            ) : (
                <p>Connecting to server...</p>
            )}
        </div>
    );
}
