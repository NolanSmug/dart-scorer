import { GameState } from "@/logic/GameState"
import { Player } from "@/logic/Player"
import React, { createContext, useContext, useState } from "react"

interface ScoreContextProps {
    gameState: GameState
    setGameState: React.Dispatch<React.SetStateAction<GameState>>
}

const ScoreContext = createContext<ScoreContextProps | null>(null)

export const ScoreProvider = ({ children }: { children: React.ReactNode }) => {
    const player1 = new Player("Nolan", 501, 3, [])
    const player2 = new Player("Dad", 501, 3, [])
    const players: Player[] = [player1, player2]

    const [gameState, setGameState] = useState<GameState>(new GameState(players, 0))

    return <ScoreContext.Provider value={{ gameState, setGameState }}>{children}</ScoreContext.Provider>
}

export function useScoreContext(): ScoreContextProps {
    const context = useContext(ScoreContext)
    if (!context) {
        throw new Error("useScoreContext must be used within a ScoreProvider")
    }
    return context
}
