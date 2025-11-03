import { Canvas, Line, Rect, useCanvasRef } from '@shopify/react-native-skia';
import { File, Paths } from 'expo-file-system';
import { shareAsync } from 'expo-sharing';
import { useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';

const canvasSize = 288;

export default function Index() {
  const canvasRef = useCanvasRef();
  const [objGrid, setObjGrid] = useState<{ x: number; y: number; color: number; z: number }[]>([]);
  const [palette] = useState(["#fff", "#333", "#900", "#090","#009"]);
  const [currentColor, setCurrentColor] = useState(1);
  const [currentLayer, setCurrentLayer] = useState(0);
  const [sizes] = useState([8, 16, 24, 32])
  const [currentSize, setCurrentSize] = useState(1);

  const updateGrid = (x: number, y: number, z: number, color: number) => {
    if (x < 0 || x >= sizes[currentSize] || y < 0 || y >= sizes[currentSize]) return;
    if(!objGrid.find(obj=>obj.x===x && obj.y===y && obj.z === z)) setObjGrid([...objGrid, { x, y, z, color }]);
    else setObjGrid(objGrid.map(obj => (obj.x!==x || obj.y!==y || obj.z !== z ? obj : {...obj, color}) ))
  }

  const pan = Gesture.Pan()
    .onBegin((event) => {
      runOnJS(updateGrid)(Math.floor(event.x / (canvasSize / sizes[currentSize])), Math.floor(event.y / (canvasSize / sizes[currentSize])), currentLayer, currentColor);
    })
    .onUpdate((event) => {
      runOnJS(updateGrid)(Math.floor(event.x / (canvasSize / sizes[currentSize])), Math.floor(event.y / (canvasSize / sizes[currentSize])), currentLayer, currentColor);
      // Handle continuous dragging
    })
    .onEnd((event) => {
      runOnJS(updateGrid)(Math.floor(event.x / (canvasSize / sizes[currentSize])), Math.floor(event.y / (canvasSize / sizes[currentSize])), currentLayer, currentColor);
      // Handle when drag is released
    });

  const handleExport = async () => {
    const image = canvasRef.current?.makeImageSnapshot();
    if (image) {
      const file = new File(Paths.cache, 'pixel-art.png');
      const encodedImage = image.encodeToBytes();
      await file.write(encodedImage);
      await shareAsync(file.uri);
    }
  };

  return (
    <GestureHandlerRootView style={{
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    }}>
      <View style={styles.paletteContainer}>
        {sizes.map((size, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.colorSwatch, currentSize === index && styles.selectedColor]}
            onPress={() => setCurrentSize(index)}
          >
            <Text>{size}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <GestureDetector gesture={pan}>
        <View style={{
          width: canvasSize,
          height: canvasSize,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#f0f0f0'
        }}>
          <Canvas style={{ width: canvasSize, height: canvasSize }} ref={canvasRef}>
            <Rect x={0} y={0} width={canvasSize} height={canvasSize } color="#f0f0f0" />
            {objGrid.sort((obja, objb) => obja.z - objb.z).map((obj) => (
              <Rect
                key={`${obj.x}-${obj.y}`}
                x={obj.x * (canvasSize / sizes[currentSize])}
                y={obj.y * (canvasSize / sizes[currentSize])}
                width={canvasSize / sizes[currentSize]}
                height={canvasSize / sizes[currentSize]}
                color={palette[obj.color]}
              />
            ))}
            {/* Vertical lines */}
            {Array.from({ length: sizes[currentSize] + 1 }, (_, i) => (
              <Line key={`v${i}`} p1={{ x: i * (canvasSize / sizes[currentSize]), y: 0 }} p2={{ x: i * (canvasSize / sizes[currentSize]), y: sizes[currentSize] * (canvasSize / sizes[currentSize]) }} color="#333" strokeWidth={1} />
            ))}
            {/* Horizontal lines */}
            {Array.from({ length: sizes[currentSize] + 1 }, (_, i) => (
              <Line key={`h${i}`} p1={{ x: 0, y: i * (canvasSize / sizes[currentSize]) }} p2={{ x: sizes[currentSize] * (canvasSize / sizes[currentSize]), y: i * (canvasSize / sizes[currentSize]) }} color="#333" strokeWidth={1} />
            ))}
          </Canvas>
        </View>
      </GestureDetector>
      <View style={styles.paletteContainer}>
        {palette.map((color, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.colorSwatch, { backgroundColor: color }, currentColor === index && styles.selectedColor]}
            onPress={() => setCurrentColor(index)}
          />
        ))}
      </View>
      <View style={{ marginTop: 20 }}>
        <Button title="Export Image" onPress={handleExport} />
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  paletteContainer: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderWidth: 1,
    borderColor: '#333',
  },
  colorSwatch: {
    width: 30,
    height: 30,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#333',
  },
  selectedColor: {
    borderWidth: 3,
    borderColor: '#0066ff',
  },
});
