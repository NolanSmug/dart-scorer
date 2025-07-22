import { ThemedText } from "@/components/ThemedText"
import { ThemedView } from "@/components/ThemedView"
import { DartBoard } from "@/components/ui/DartBoard"
import { useScoreContext } from "@/contexts/ScoreContext"
import { StyleSheet } from "react-native"

export default function App() {
    const { gameState } = useScoreContext()

    return (
        <ThemedView style={styles.appContainer}>
            <DartBoard />
            <ThemedView style={{ display: "flex", flexDirection: "row", gap: 50 }}>
                <ThemedText style={gameState.getCurrentPlayerIndex() === 0 ? styles.currentPlayer : null}>{`Nolan: ${gameState
                    .getPlayers()[0]
                    .getScore()}`}</ThemedText>
                <ThemedText style={gameState.getCurrentPlayerIndex() === 1 ? styles.currentPlayer : null}>{`Dad: ${gameState
                    .getPlayers()[1]
                    .getScore()}`}</ThemedText>
            </ThemedView>
        </ThemedView>
    )
}

const styles = StyleSheet.create({
    appContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 50,
    },
    currentPlayer: {
        fontWeight: "bold",
        fontSize: 24,
        textDecorationLine: "underline",
        textDecorationColor: "red",
    },
})
