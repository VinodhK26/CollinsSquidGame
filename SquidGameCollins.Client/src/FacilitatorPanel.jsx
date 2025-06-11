import React, { useEffect, useState } from 'react';
import { HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';

let connection = new HubConnectionBuilder()
    .withUrl("https://collinslbsqgame.up.railway.app")
    .withAutomaticReconnect()
    .build();

export default function FacilitatorPanel() {
    const [isConnected, setIsConnected] = useState(false);

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
                                <input type="checkbox" onChange={() => handleCheck(teamId, taskId)} />
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
