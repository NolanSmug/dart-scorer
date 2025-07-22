import { useScoreContext } from "@/contexts/ScoreContext"
import { GameState } from "@/logic/GameState"
import React from "react"

import { Button, Text as FontText, StyleSheet } from "react-native"
import { Gesture, GestureDetector, GestureHandlerRootView } from "react-native-gesture-handler"
import Animated, { useAnimatedStyle, useSharedValue } from "react-native-reanimated"
import Svg, { Circle, Path, Text } from "react-native-svg"

export type Slice = {
    percentage: number
    color: string
    value: number
}

export enum MultiplierRing {
    MISS,
    DOUBLE,
    TRIPLE,
}

export const DartBoard = () => {
    const { gameState, setGameState } = useScoreContext()
    const [isGameOver, setGameOver] = React.useState(false)

    const DART_BOARD_VALUES: number[] = [6, 10, 15, 2, 17, 3, 19, 7, 16, 8, 11, 14, 9, 12, 5, 20, 1, 18, 4, 13]
    let slices: Slice[] = []
    for (let i = 0; i < 20; i++) {
        if (i % 2 === 0) {
            slices.push({ percentage: 0.05, color: "tan", value: DART_BOARD_VALUES[i] })
        } else {
            slices.push({ percentage: 0.05, color: "black", value: DART_BOARD_VALUES[i] })
        }
    }

    function undoLastThrow() {
        gameState.undo()
        setGameState(new GameState(gameState.getPlayers(), gameState.getCurrentPlayerIndex()))
    }

    function updateScore(value: number, multiplier?: MultiplierRing) {
        gameState.scoreCurrentPlayer(value, multiplier)
        setGameState(new GameState(gameState.getPlayers(), gameState.getCurrentPlayerIndex()))

        if (gameState.getGameOver()) {
            setGameOver(true)
        }
    }

    function resetGame() {
        gameState.resetGame()
        setGameState(new GameState(gameState.getPlayers(), gameState.getCurrentPlayerIndex()))
        setGameOver(false)
    }

    const drawSlice = (slice: Slice, index: number) => {
        const sliceAngle = (2 * Math.PI) / 20
        const startAngle = index * sliceAngle - Math.PI / 20
        const endAngle = startAngle + sliceAngle
        const midAngle = (startAngle + endAngle) / 2

        const startX = Math.cos(startAngle)
        const startY = Math.sin(startAngle)

        const endX = Math.cos(endAngle)
        const endY = Math.sin(endAngle)

        const labelX = Math.cos(midAngle) * 1.05
        const labelY = Math.sin(midAngle) * 1.05

        const labelAngle = (midAngle * 180) / Math.PI + 90

        return (
            <React.Fragment key={index}>
                <Path
                    d={`M ${startX} ${startY} A 1 1 0 0 1 ${endX} ${endY} L 0 0 Z`}
                    fill={slice.color}
                    onPress={() => updateScore(slice.value)}
                />
                <Path
                    d={drawMultiplierRing(MultiplierRing.DOUBLE, startAngle, endAngle)}
                    fill={index % 2 === 0 ? "green" : "red"}
                    stroke={"darkgrey"}
                    strokeWidth={0.005}
                    onPress={() => updateScore(slice.value * 2, MultiplierRing.DOUBLE)}
                />
                <Path
                    d={drawMultiplierRing(MultiplierRing.TRIPLE, startAngle, endAngle)}
                    fill={index % 2 === 0 ? "green" : "red"}
                    stroke={"darkgrey"}
                    strokeWidth={0.005}
                    onPress={() => updateScore(slice.value * 3, MultiplierRing.TRIPLE)}
                />
                <Text
                    x={labelX}
                    y={labelY}
                    fill="white"
                    fontSize={0.18}
                    textAnchor="middle"
                    alignmentBaseline="middle"
                    transform={`rotate(${labelAngle} ${labelX} ${labelY})`}
                    fontWeight={400}
                    fontFamily={"CourierPrime-Regular"}
                >
                    {slice.value}
                </Text>
            </React.Fragment>
        )
    }

    function drawMultiplierRing(multiplier: MultiplierRing, startAngle: number, endAngle: number) {
        const startR = multiplier === MultiplierRing.DOUBLE ? 1.0 : 0.68
        const endR = startR - 0.06 // creates the thickness of the multiplier ring

        const startX1 = Math.cos(startAngle) * startR
        const startY1 = Math.sin(startAngle) * startR
        const endX1 = Math.cos(endAngle) * startR
        const endY1 = Math.sin(endAngle) * startR

        const startX2 = Math.cos(endAngle) * endR
        const startY2 = Math.sin(endAngle) * endR
        const endX2 = Math.cos(startAngle) * endR
        const endY2 = Math.sin(startAngle) * endR

        return `M ${startX1} ${startY1}
            A ${startR} ${startR} 0 0 1 ${endX1} ${endY1}
            L ${startX2} ${startY2}
            A ${endR} ${endR} 0 0 0 ${endX2} ${endY2}
            Z`
    }

    const translateX = useSharedValue(0)
    const translateY = useSharedValue(0)
    const savedTranslateX = useSharedValue(0)
    const savedTranslateY = useSharedValue(0)

    const MAX_PAN = 400
    const MIN_ZOOM_SCALE = 1
    const MAX_ZOOM_SCALE = 5

    const scale = useSharedValue(1)
    const savedScale = useSharedValue(1)

    const pinchGesture = Gesture.Pinch()
        .onUpdate((e) => {
            let newScale = savedScale.value * e.scale
            newScale = Math.min(MAX_ZOOM_SCALE, Math.max(MIN_ZOOM_SCALE, newScale))
            scale.value = newScale
        })
        .onEnd(() => {
            savedScale.value = scale.value

            if (Math.abs(scale.value - 1) < 0.01) {
                // Snap back to center if zoomed out fully
                translateX.value = 0
                translateY.value = 0
                savedTranslateX.value = 0
                savedTranslateY.value = 0
            }
        })

    const panGesture = Gesture.Pan()
        .onUpdate((e) => {
            if (scale.value > 1.01) {
                translateX.value = Math.min(MAX_PAN, Math.max(-MAX_PAN, savedTranslateX.value + e.translationX))
                translateY.value = Math.min(MAX_PAN, Math.max(-MAX_PAN, savedTranslateY.value + e.translationY))
            }
        })
        .onEnd(() => {
            if (scale.value > 1.01) {
                savedTranslateX.value = translateX.value
                savedTranslateY.value = translateY.value
            }
        })
    const composedGesture = Gesture.Simultaneous(pinchGesture, panGesture)

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }, { translateY: translateY.value }, { scale: scale.value }],
    }))

    if (isGameOver) {
        return (
            <div style={styles.gameOver}>
                <FontText style={{ fontFamily: "CourierPrime-Regular", fontSize: 28, color: "white" }}>
                    {gameState.getCurrentPlayer().getName()} wins!
                </FontText>
                <Button onPress={() => resetGame()} title="New Game" />
            </div>
        )
    }

    return (
        <GestureHandlerRootView>
            <GestureDetector gesture={composedGesture}>
                <Animated.View style={[styles.svgWrapper, animatedStyle]} collapsable={false}>
                    <Svg viewBox="-1.685 -1.685 3.37 3.37" preserveAspectRatio="xMidYMid" height={400} width={400}>
                        <Circle cx={0} cy={0} r={1.33} fill="none" stroke="darkblue" strokeWidth={0.67} onPress={() => updateScore(0)} />
                        <Text x={0} y={-1.45} fontSize={0.2} fill="white" textAnchor="middle" alignmentBaseline="middle">
                            WINMAU
                        </Text>
                        <Circle cx={0} cy={0} r={1.01} fill="none" stroke="black" strokeWidth={0.67} onPress={() => updateScore(0)} />
                        {slices.map((slice, index) => drawSlice(slice, index))}
                        <Circle cx={0} cy={0} r={0.16} fill="green" stroke="darkgrey" strokeWidth={0.005} onPress={() => updateScore(25)} />
                        <Circle
                            cx={0}
                            cy={0}
                            r={0.08}
                            fill="red"
                            stroke="darkgrey"
                            strokeWidth={0.005}
                            onPress={() => updateScore(50, MultiplierRing.DOUBLE)}
                        />
                    </Svg>
                    <Button onPress={() => undoLastThrow()} title={"Undo"}></Button>
                    <Button
                        onPress={() => {
                            gameState.resetGame()
                            setGameState(new GameState(gameState.getPlayers(), gameState.getCurrentPlayerIndex()))
                        }}
                        title={"Reset"}
                    ></Button>
                </Animated.View>
            </GestureDetector>
        </GestureHandlerRootView>
    )
}

const styles = StyleSheet.create({
    sliceContainer: {
        position: "relative",
    },
    container: {
        flex: 1,
        top: "25%",
    },
    svgWrapper: {
        flex: 1,
        justifyContent: "center",
        alignSelf: "center",
    },
    gameOver: {
        display: "flex",
        flexDirection: "column",
        padding: 40,
        alignItems: "center",
    },
})
