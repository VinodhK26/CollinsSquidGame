import React, { useEffect, useState } from 'react';
import { HubConnectionBuilder } from '@microsoft/signalr';

export default function Leaderboard() {
    const [progress, setProgress] = useState({});

    useEffect(() => {
        const connection = new HubConnectionBuilder()
            .withUrl("https://localhost:5001/taskHub") // or your backend
            .withAutomaticReconnect()
            .build();

        connection.on("TaskUpdated", ({ teamId, taskId }) => {
            setProgress(prev => {
                const team = prev[teamId] || {};
                return {
                    ...prev,
                    [teamId]: { ...team, [taskId]: true }
                };
            });
        });

        connection.start().catch(console.error);

        return () => {
            connection.stop();
        };
    }, []);

    return (
        <div>
            <h3>Live Leaderboard</h3>
            {Object.entries(progress).map(([teamId, tasks]) => (
                <div key={teamId}>
                    Team {teamId}: {Object.keys(tasks).length} tasks completed
                </div>
            ))}
        </div>
    );
}
