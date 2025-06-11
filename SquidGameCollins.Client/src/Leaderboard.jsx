import React, { useEffect, useState } from 'react';
import { HubConnectionBuilder } from '@microsoft/signalr';

const CheckMark = () => (
    <span style={{ color: 'green', fontWeight: 'bold' }}>✔</span>
);

export default function Leaderboard() {
    const [progress, setProgress] = useState({});

    useEffect(() => {
        const connection = new HubConnectionBuilder()
            .withUrl("/taskHub")
            .withAutomaticReconnect()
            .build();

        connection.on("TaskUpdated", ({ teamId, taskId, isCompleted }) => {
            setProgress(prev => {
                const team = prev[teamId] || { teamName: `Team ${teamId}` };
                return {
                    ...prev,
                    [teamId]: {
                        ...team,
                        [`task${taskId}`]: isCompleted
                    }
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

    const renderCell = (completed) =>
        completed === true ? <CheckMark /> : <span>&nbsp;</span>;

    return (
        <div>
            <h3>Live Leaderboard</h3>
            <table style={{ borderCollapse: 'collapse', width: '100%' }}>
                <thead>
                    <tr>
                        <th style={thStyle}>Team Name</th>
                        <th style={thStyle}>Task 1</th>
                        <th style={thStyle}>Task 2</th>
                        <th style={thStyle}>Task 3</th>
                        <th style={thStyle}>Task 4</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.entries(progress).map(([teamId, teamData]) => (
                        <tr key={teamId}>
                            <td style={tdStyle}>{teamData.teamName || `Team ${teamId}`}</td>
                            <td style={tdStyle}>{renderCell(teamData.task1)}</td>
                            <td style={tdStyle}>{renderCell(teamData.task2)}</td>
                            <td style={tdStyle}>{renderCell(teamData.task3)}</td>
                            <td style={tdStyle}>{renderCell(teamData.task4)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

const thStyle = {
    border: '1px solid #ccc',
    padding: '8px',
    background: '#f0f0f0',
    textAlign: 'left'
};

const tdStyle = {
    border: '1px solid #ccc',
    padding: '8px',
    textAlign: 'center'
};
