import { Canvas, Line, Rect } from '@shopify/react-native-skia';
import { useState } from 'react';
import { Text, View } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';

export default function Index() {
  const [grid, setGrid] = useState(() => Array.from({ length: 8 }, () => Array.from({ length: 8 }, () => false)))
  const [index, setIndex] = useState(0);

  const updateIndex = () => {
    setIndex((prev) => prev + 1);
  };

  const updateGrid = (x: number, y: number) => {
    setGrid((prev) => {
      const newGrid = prev.map(row => row.slice());
      newGrid[y][x] = !newGrid[y][x];
      return newGrid;
    });
  }

  const tap = Gesture.Tap().onEnd((event) => {
    console.log('tap', event, index + 1);
    console.log('tap happened at', event.x, event.y);
    console.log('tapped cell:', Math.floor(event.x / 30), Math.floor(event.y / 30));
    runOnJS(updateGrid)(Math.floor(event.x / 30), Math.floor(event.y / 30));
    runOnJS(updateIndex)();
  });

  return (
    <GestureHandlerRootView style={{
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    }}>
      <GestureDetector gesture={tap}>
        <View style={{
          width: 240,
          height: 240,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#f0f0f0'
        }}>
          <Canvas style={{ width: 240, height: 240 }}>
            <Rect x={0} y={0} width={240} height={240} color="#f0f0f0" />
            {/* Vertical lines */}
            {Array.from({ length: 9 }, (_, i) => (
              <Line key={`v${i}`} p1={{ x: i * 30, y: 0 }} p2={{ x: i * 30, y: 240 }} color="#333" strokeWidth={1} />
            ))}
            {/* Horizontal lines */}
            {Array.from({ length: 9 }, (_, i) => (
              <Line key={`h${i}`} p1={{ x: 0, y: i * 30 }} p2={{ x: 240, y: i * 30 }} color="#333" strokeWidth={1} />
            ))}
            {/** 8x8 grid here */}
            {grid.map((row, rowIndex) =>
              row.map((cell, cellIndex) => (
                <Rect
                  key={`${rowIndex}-${cellIndex}`}
                  x={cellIndex * 30}
                  y={rowIndex * 30}
                  width={24}
                  height={24}
                  color={cell ? "#333" : "#fff"}
                />
              ))
            )}
          </Canvas>
        </View>
      </GestureDetector>
      <Text style={{ fontSize: 24 }}>{index}</Text>
    </GestureHandlerRootView>
  );
}
