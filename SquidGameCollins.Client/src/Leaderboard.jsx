import React, { useEffect, useState } from 'react';
import { HubConnectionBuilder } from '@microsoft/signalr';

export default function Leaderboard() {
    const [progress, setProgress] = useState({});

    useEffect(() => {
        const connection = new HubConnectionBuilder()
            .withUrl("/taskHub") // relative path works since both client & server are on same domain
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
        connection.on("LoadInitialState", (data) => {
            setProgress(data);
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
