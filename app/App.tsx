import { ThemedText } from "@/components/ThemedText"
import { ThemedView } from "@/components/ThemedView"
import { DartBoard } from "@/components/ui/DartBoard"
import { useScoreContext } from "@/contexts/ScoreContext"
import { useRef, useState } from "react"
import { GestureResponderEvent, StyleSheet, View } from "react-native"

export default function App() {
    const { gameState } = useScoreContext()

    const [circles, setCircles] = useState<{ id: number; x: number; y: number; score: number }[]>([])
    const circleIdRef = useRef(0)

    const handleTouch = (event: GestureResponderEvent) => {
        const { pageX, pageY } = event.nativeEvent
        const circleId = circleIdRef.current++

        const newCircle = {
            id: circleId,
            x: pageX,
            y: pageY,
            score: 60,
        }
        // console.log(newCircle.score)

        setCircles((prev) => [...prev, newCircle])
        setTimeout(() => {
            if (circles.length === 2) {
                setCircles([])
            }
        }, 300)
    }

    return (
        <ThemedView style={styles.appContainer} onTouchEndCapture={handleTouch}>
            <DartBoard />
            {circles.map((circle) => (
                <View
                    key={circle.id}
                    style={{
                        position: "absolute",
                        left: circle.x - 10,
                        top: circle.y - 10,
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        backgroundColor: "black",
                        opacity: 0.67,
                        borderWidth: 1,
                        borderColor: "red",
                        zIndex: 1000,
                    }}
                >
                    {/* <ThemedText style={{ color: "black" }}>{circle.score}</ThemedText> */}
                </View>
            ))}
            {/* TODO: allow user to create and edit players */}
            <ThemedView style={{ display: "flex", flexDirection: "row", gap: 50 }}>
                <ThemedText style={gameState.getCurrentPlayerIndex() === 0 ? styles.currentPlayer : null}>{`Player 1: ${gameState
                    .getPlayers()[0]
                    .getScore()}`}</ThemedText>
                <ThemedText style={gameState.getCurrentPlayerIndex() === 1 ? styles.currentPlayer : null}>{`Player 2: ${gameState
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
