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
    Box,
    Container,
    useMediaQuery,
    useTheme
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

import Leaderboard from './Leaderboard';
import FacilitatorPanel from './FacilitatorPanel';

const HomePage = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [openFacilitator, setOpenFacilitator] = useState(false);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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
                <Toolbar>
                    <Typography
                        variant={isMobile ? 'h6' : 'h5'}
                        component="div"
                        sx={{ flexGrow: 1, textAlign: 'center', wordBreak: 'break-word' }}
                    >
                        Collin's GroundBreaking Game
                    </Typography>
                    <IconButton
                        edge="end"
                        color="inherit"
                        onClick={handleMenuClick}
                        aria-label="menu"
                    >
                        <MenuIcon />
                    </IconButton>
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleCloseMenu}
                        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                    >
                        <MenuItem onClick={handleOpenFacilitator}>Facilitator Panel</MenuItem>
                    </Menu>
                </Toolbar>
            </AppBar>

            <Container maxWidth="lg" sx={{ py: 3 }}>
                <Leaderboard />
            </Container>

            <Dialog
                open={openFacilitator}
                onClose={handleCloseFacilitator}
                maxWidth="md"
                fullWidth
                scroll="paper"
            >
                <DialogTitle>Facilitator Panel</DialogTitle>
                <DialogContent dividers>
                    <FacilitatorPanel />
                </DialogContent>
            </Dialog>
        </>
    );
};

export default HomePage;
