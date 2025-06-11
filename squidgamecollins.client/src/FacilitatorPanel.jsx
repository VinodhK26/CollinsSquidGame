import React from 'react';
import { HubConnectionBuilder } from '@microsoft/signalr';

const connection = new HubConnectionBuilder()
    .withUrl("https://localhost:5001/taskHub") // or your API URL
    .withAutomaticReconnect()
    .build();

connection.start().catch(console.error);

export default function FacilitatorPanel() {
    const handleCheck = (teamId, taskId) => {
        connection.invoke("MarkTaskCompleted", teamId, taskId).catch(console.error);
    };

    return (
        <div>
            <h3>Facilitator Panel</h3>
            {[1, 2, 3, 4, 5].map(teamId => (
                <div key={teamId}>
                    Team {teamId}:
                    {[1, 2, 3, 4].map(taskId => (
                        <label key={taskId}>
                            <input type="checkbox" onChange={() => handleCheck(teamId, taskId)} />
                            Task {taskId}
                        </label>
                    ))}
                </div>
            ))}
        </div>
    );
}
