import { ScoreProvider } from "@/contexts/ScoreContext"
import { useFonts } from "expo-font"
import App from "./App"

export default function index() {
    const [fontsLoaded] = useFonts({
        "CourierPrime-Regular": require("../assets/fonts/CourierPrime-Regular.ttf"),
        BarBenderbold: require("../assets/fonts/BarBenderbold.ttf"),
    })

    if (!fontsLoaded) return null

    return (
        <ScoreProvider>
            <App />
        </ScoreProvider>
    )
}
