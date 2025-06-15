import React, { useEffect, useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Box
} from '@mui/material';
import { HubConnectionBuilder } from '@microsoft/signalr';

const CheckMark = () => (
    <Typography color="success.main" fontWeight="bold">✔</Typography>
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

    const renderCell = (completed) => (
        completed === true ? <CheckMark /> : <Box>&nbsp;</Box>
    );

    return (
        <Box>
            <Typography variant="h5" gutterBottom>
                Live Team Activity Leaderboard
            </Typography>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell><strong>Team Name</strong></TableCell>
                            <TableCell align="center">Challenge 1</TableCell>
                            <TableCell align="center">Challenge 2</TableCell>
                            <TableCell align="center">Challenge 3</TableCell>
                            <TableCell align="center">Challenge 4</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Object.entries(progress).map(([teamId, teamData]) => (
                            <TableRow key={teamId}>
                                <TableCell>{teamData.teamName || `Team ${teamId}`}</TableCell>
                                <TableCell align="center">{renderCell(teamData.task1)}</TableCell>
                                <TableCell align="center">{renderCell(teamData.task2)}</TableCell>
                                <TableCell align="center">{renderCell(teamData.task3)}</TableCell>
                                <TableCell align="center">{renderCell(teamData.task4)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}
