import { createContext, useState } from "react";

const Player = createContext();

const PlayerContext = ({children}) => {
    const [currentTrack, SetCurrentTrack] = useState(null);
    return (
        <Player.Provider value={{currentTrack, SetCurrentTrack}}>
            {children}
        </Player.Provider>
    )
}

export {PlayerContext, Player}