import { StyleSheet } from "react-native"
import { DartBoard } from "@/components/ui/DartBoard"
import { ThemedView } from "@/components/ThemedView"

export default function HomeScreen() {
    return (
        <ThemedView style={styles.appContainer}>
            <DartBoard />
        </ThemedView>
    )
}

const styles = StyleSheet.create({
    appContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
})
