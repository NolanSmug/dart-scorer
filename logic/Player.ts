import { MultiplierRing } from "./dartEnums"

export class Player {
    private name: string
    private score: number
    private dartsLeft: number = 3
    private scoresHistory: number[] = []

    constructor(name: string, score: number, dartsLeft: number, scoresHistory: number[]) {
        this.name = name
        this.score = score
        this.dartsLeft = dartsLeft
        this.scoresHistory = scoresHistory
    }

    public getName() {
        return this.name
    }
    public setName(name: string) {
        this.name = name
    }

    public getScore() {
        return this.score
    }
    public setScore(score: number) {
        this.score = score
    }

    public getDartsLeft() {
        return this.dartsLeft
    }
    public resetDartsLeft() {
        this.dartsLeft = 3
    }

    public throwDart(dartScore: number, multiplier?: MultiplierRing): void {
        if (this.dartsLeft === 0) return

        if (this.score - dartScore == 0 && multiplier === MultiplierRing.DOUBLE) {
            // double
            this.score -= dartScore
            this.dartsLeft--
            this.scoresHistory.push(dartScore * 2)
            return
        }
        if (this.score - dartScore <= 1) {
            // bust
            const turnDartsThrown = 3 - this.dartsLeft
            const turnScores = this.scoresHistory.slice(this.scoresHistory.length - turnDartsThrown)
            this.score += turnScores.reduce((a, b) => a + b, 0)
            this.dartsLeft = 0
            this.dartsLeft = 0
            return
        }

        this.score -= dartScore
        this.dartsLeft--
        this.scoresHistory.push(dartScore)
    }

    public undoLastThrow() {
        const lastScore = this.scoresHistory.pop()
        if (lastScore !== undefined) {
            this.score += lastScore
            this.dartsLeft++
        }
    }

    public getScoresHistory() {
        return this.scoresHistory
    }
    public clearScoresHistory() {
        this.scoresHistory = []
    }
}
