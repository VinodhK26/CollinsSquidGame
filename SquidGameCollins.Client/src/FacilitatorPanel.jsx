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
