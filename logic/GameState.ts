import { MultiplierRing } from "@/components/ui/DartBoard"
import { Player } from "./Player"

export class GameState {
    private players: Player[]
    private currentPlayerIndex: number
    private gameOver: boolean

    constructor(players: Player[], currentPlayerIndex: number) {
        this.players = players
        this.currentPlayerIndex = currentPlayerIndex
        this.gameOver = false
    }

    public getPlayers() {
        return this.players
    }
    public getCurrentPlayerIndex() {
        return this.currentPlayerIndex
    }
    public getCurrentPlayer() {
        return this.players[this.currentPlayerIndex]
    }

    public scoreCurrentPlayer(value: number, multiplier?: MultiplierRing) {
        const currPlayer = this.getCurrentPlayer()
        currPlayer.throwDart(value, multiplier)

        if (currPlayer.getScore() === 0) {
            this.gameOver = true
        }

        if (currPlayer.getDartsLeft() === 0) {
            this.setNextPlayer()
        }
    }

    public undo() {
        if (this.players.every((player) => player.getScoresHistory().length === 0)) {
            return
        }

        if (this.getCurrentPlayer().getDartsLeft() === 3) {
            this.setPrevPlayer()
        }

        this.getCurrentPlayer().undoLastThrow()
    }

    public resetGame() {
        for (const player of this.players) {
            player.resetDartsLeft()
            player.setScore(501)
            player.clearScoresHistory()
        }
        this.currentPlayerIndex = 0
        this.gameOver = false
    }

    private setPrevPlayer() {
        this.currentPlayerIndex = (this.currentPlayerIndex - 1 + this.players.length) % this.players.length
    }

    private setNextPlayer() {
        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length

        const nextPlayer = this.getCurrentPlayer()
        if (nextPlayer.getDartsLeft() === 0) {
            nextPlayer.resetDartsLeft()
        }
    }

    public getGameOver() {
        return this.gameOver
    }
}
