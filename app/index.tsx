import { Canvas, Line, Rect } from '@shopify/react-native-skia';
import { useState } from 'react';
import { View } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';

export default function Index() {
  const [grid, setGrid] = useState(() => Array.from({ length: 8 }, () => Array.from({ length: 8 }, () => false)))

  const updateGrid = (x: number, y: number) => {
    setGrid((prev) => {
      const newGrid = prev.map(row => row.slice());
      newGrid[y][x] = !newGrid[y][x];
      return newGrid;
    });
  }

  const pan = Gesture.Pan()
    .onBegin((event) => {
      console.log('Drag started at:', event.x, event.y);
      // Handle the initial click/press
    })
    .onUpdate((event) => {
      console.log('Dragging to:', event.x, event.y);
      // Handle continuous dragging
    })
    .onEnd((event) => {
      console.log('Drag ended at:', event.x, event.y);
      // Handle when drag is released
    });

  const tap = Gesture.Tap().onEnd((event) => {
    runOnJS(updateGrid)(Math.floor(event.x / 30), Math.floor(event.y / 30));
  });

  const combinedGesture = Gesture.Race(tap, pan);

  return (
    <GestureHandlerRootView style={{
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    }}>
      <GestureDetector gesture={combinedGesture}>
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
                  x={cellIndex * 30}
                  y={rowIndex * 30}
                  width={30}
                  height={30}
                  color={cell ? "#333" : "#fff"}
                />
              ))
            )}
                        {/* Vertical lines */}
            {Array.from({ length: 9 }, (_, i) => (
              <Line key={`v${i}`} p1={{ x: i * 30, y: 0 }} p2={{ x: i * 30, y: 240 }} color="#333" strokeWidth={1} />
            ))}
            {/* Horizontal lines */}
            {Array.from({ length: 9 }, (_, i) => (
              <Line key={`h${i}`} p1={{ x: 0, y: i * 30 }} p2={{ x: 240, y: i * 30 }} color="#333" strokeWidth={1} />
            ))}
          </Canvas>
        </View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
}
