import React from 'react';
import FacilitatorPanel from './FacilitatorPanel';
import Leaderboard from './Leaderboard';

function App() {
    return (
        <div className="App">
            <h1>Squid Game Leaderboard</h1>
            <FacilitatorPanel />
            <Leaderboard />
        </div>
    );
}

export default App;
