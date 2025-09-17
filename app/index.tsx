
import { Text, View } from "react-native";
import { Canvas, Rect, Line } from "@shopify/react-native-skia";

export default function Index() {
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
      </Canvas>
      <Text>8x8 Pixel Art Canvas</Text>
    </View>
  );
}
