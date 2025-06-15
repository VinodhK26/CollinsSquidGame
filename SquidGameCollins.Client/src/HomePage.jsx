import React, { useState } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Menu,
    MenuItem,
    Dialog,
    DialogTitle,
    DialogContent,
    Box
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

import Leaderboard from './Leaderboard';
import FacilitatorPanel from './FacilitatorPanel';

const HomePage = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [openFacilitator, setOpenFacilitator] = useState(false);

    const handleMenuClick = (event) => setAnchorEl(event.currentTarget);
    const handleCloseMenu = () => setAnchorEl(null);
    const handleOpenFacilitator = () => {
        setOpenFacilitator(true);
        handleCloseMenu();
    };
    const handleCloseFacilitator = () => setOpenFacilitator(false);

    return (
        <>
            <AppBar position="static">
                <Toolbar sx={{ justifyContent: "space-between" }}>
                    <Box sx={{ flex: 1 }} /> {/* Placeholder for left spacing */}
                    <Typography variant="h6" component="div" sx={{ flex: 1, textAlign: 'center' }}>
                        Collin's GroundBreaking Game
                    </Typography>
                    <IconButton edge="end" color="inherit" onClick={handleMenuClick}>
                        <MenuIcon />
                    </IconButton>
                    <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu}>
                        <MenuItem onClick={handleOpenFacilitator}>Facilitator Panel</MenuItem>
                    </Menu>
                </Toolbar>
            </AppBar>

            <Box p={2}>
                <Leaderboard />
            </Box>

            <Dialog open={openFacilitator} onClose={handleCloseFacilitator} maxWidth="md" fullWidth>
                <DialogTitle>Facilitator Panel</DialogTitle>
                <DialogContent>
                    <FacilitatorPanel />
                </DialogContent>
            </Dialog>
        </>
    );
};

export default HomePage;
