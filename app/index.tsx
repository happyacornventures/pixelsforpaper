
import { Canvas, Line, Rect } from "@shopify/react-native-skia";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";

export default function Index() {
  // Initialize 8x8 grid with all cells as false (empty)
  const [grid, setGrid] = useState<boolean[][]>(
    Array.from({ length: 8 }, () => Array.from({ length: 8 }, () => false))
  );

  const handleCanvasPress = (event: any) => {
    const { locationX, locationY } = event.nativeEvent;
    const col = Math.floor(locationX / 30);
    const row = Math.floor(locationY / 30);

    console.log('Absolute coordinates:', { x: locationX, y: locationY });
    console.log('Grid coordinates:', { row, col });
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
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
        {/* Filled pixels based on grid state */}
        {grid.map((row, rowIndex) =>
          row.map((filled, colIndex) =>
            filled ? (
              <Rect
                key={`pixel-${rowIndex}-${colIndex}`}
                x={colIndex * 30 + 1}
                y={rowIndex * 30 + 1}
                width={28}
                height={28}
                color="#333"
              />
            ) : null
          )
        )}
      </Canvas>
      <Text>8x8 Pixel Art Canvas</Text>
    </View>
  );
}
