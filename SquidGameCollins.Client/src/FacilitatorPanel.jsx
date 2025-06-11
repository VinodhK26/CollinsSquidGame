import React, { useEffect, useState } from 'react';
import { HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';


export default function FacilitatorPanel() {
    const [isConnected, setIsConnected] = useState(false);
    const [taskStatus, setTaskStatus] = useState({});

    let connection = new HubConnectionBuilder()
        .withUrl("/taskHub")  // Use the correct relative path to the SignalR Hub
        .withAutomaticReconnect()
        .build();

    connection.on("TaskUpdated", ({ teamId, taskId }) => {
        setTaskStatus(prev => {
            const team = prev[teamId] || { teamName: `Team ${teamId}` };
            return {
                ...prev,
                [teamId]: {
                    ...team,
                    [`task${taskId}`]: true
                }
            };
        });
    });

    connection.on("LoadInitialState", (data) => {
        setTaskStatus(data);
    });

    useEffect(() => {
        connection
            .start()
            .then(() => setIsConnected(true))
            .catch(err => console.error("Connection failed: ", err));

        // Optional: Cleanup connection on component unmount
        return () => {
            connection.stop();
        };
    }, []);

    const handleCheck = (teamId, taskId) => {
        if (connection.state === HubConnectionState.Connected) {
            connection.invoke("MarkTaskCompleted", teamId, taskId)
                .catch(err => console.error("Invoke failed: ", err));
        } else {
            console.warn("Connection not ready. Try again shortly.");
        }
    };

    return (
        <div>
            <h3>Facilitator Panel</h3>
            {isConnected ? (
                [1, 2, 3, 4, 5].map(teamId => (
                    <div key={teamId}>
                        Team {teamId}:
                        {[1, 2, 3, 4].map(taskId => (
                            <label key={taskId} style={{ marginRight: "10px" }}>
                                <input
                                    type="checkbox"
                                    checked={taskStatus?.[teamId]?.[`task${taskId}`] || false}
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
