import { Canvas, Line, Rect } from '@shopify/react-native-skia';
import { useState } from 'react';
import { View } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';

export default function Index() {
  const [grid, setGrid] = useState(() => Array.from({ length: 24 }, () => Array.from({ length: 24 }, () => "#fff")))
  const [palette] = useState(["#fff", "#333"]);
  const [currentColor, setCurrentColor] = useState(1);

  const updateGrid = (x: number, y: number, value?: string) => {
    if (x < 0 || x >= 24 || y < 0 || y >= 24) return;
    setGrid((prev) => {
      const newGrid = prev.map(row => row.slice());
      newGrid[y][x] = value ?? (newGrid[y][x] === "#fff" ? "#333" : "#fff");
      return newGrid;
    });
  }

  const pan = Gesture.Pan()
    .onBegin((event) => {
      console.log('Drag started at:', Math.floor(event.x / 10), Math.floor(event.y / 10));
      runOnJS(updateGrid)(Math.floor(event.x / 10), Math.floor(event.y / 10), "#333");
      // Handle the initial click/press
    })
    .onUpdate((event) => {
      console.log('Dragging to:', Math.floor(event.x / 10), Math.floor(event.y / 10));
      runOnJS(updateGrid)(Math.floor(event.x / 10), Math.floor(event.y / 10), "#333");
      // Handle continuous dragging
    })
    .onEnd((event) => {
      console.log('Drag ended at:', Math.floor(event.x / 10), Math.floor(event.y / 10));
      runOnJS(updateGrid)(Math.floor(event.x / 10), Math.floor(event.y / 10), "#333");
      // Handle when drag is released
    });

  const tap = Gesture.Tap().onEnd((event) => {
    runOnJS(updateGrid)(Math.floor(event.x / 10), Math.floor(event.y / 10), "#333");
  });

  const combinedGesture = Gesture.Race(pan);

  return (
    <GestureHandlerRootView style={{
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    }}>
      <GestureDetector gesture={pan}>
        <View style={{
          width: 240,
          height: 240,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#f0f0f0'
        }}>
          <Canvas style={{ width: 240, height: 240 }}>
            <Rect x={0} y={0} width={240} height={240} color="#f0f0f0" />
            {/** 8x8 grid here */}
            {grid.map((row, rowIndex) =>
              row.map((cell, cellIndex) => (
                <Rect
                  key={`${rowIndex}-${cellIndex}`}
                  x={cellIndex * 10}
                  y={rowIndex * 10}
                  width={10}
                  height={10}
                  color={cell}
                />
              ))
            )}
                        {/* Vertical lines */}
            {Array.from({ length: 24 }, (_, i) => (
              <Line key={`v${i}`} p1={{ x: i * 10, y: 0 }} p2={{ x: i * 10, y: 240 }} color="#333" strokeWidth={1} />
            ))}
            {/* Horizontal lines */}
            {Array.from({ length: 24 }, (_, i) => (
              <Line key={`h${i}`} p1={{ x: 0, y: i * 10 }} p2={{ x: 240, y: i * 10 }} color="#333" strokeWidth={1} />
            ))}
          </Canvas>
        </View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
}
