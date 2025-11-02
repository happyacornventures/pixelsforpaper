import { Canvas, Line, Rect, useCanvasRef } from '@shopify/react-native-skia';
import { File, Paths } from 'expo-file-system';
import { shareAsync } from 'expo-sharing';
import { useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';

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
      runOnJS(updateGrid)(Math.floor(event.x / 10), Math.floor(event.y / 10), currentLayer, currentColor);
    })
    .onUpdate((event) => {
      runOnJS(updateGrid)(Math.floor(event.x / 10), Math.floor(event.y / 10), currentLayer, currentColor);
      // Handle continuous dragging
    })
    .onEnd((event) => {
      runOnJS(updateGrid)(Math.floor(event.x / 10), Math.floor(event.y / 10), currentLayer, currentColor);
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
          width: sizes[currentSize] * 10,
          height: sizes[currentSize] * 10,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#f0f0f0'
        }}>
          <Canvas style={{ width: sizes[currentSize] * 10, height: sizes[currentSize] * 10 }} ref={canvasRef}>
            <Rect x={0} y={0} width={sizes[currentSize] * 10} height={sizes[currentSize] * 10} color="#f0f0f0" />
            {objGrid.sort((obja, objb) => obja.z - objb.z).map((obj) => (
              <Rect
                key={`${obj.x}-${obj.y}`}
                x={obj.x * 10}
                y={obj.y * 10}
                width={10}
                height={10}
                color={palette[obj.color]}
              />
            ))}
            {/* Vertical lines */}
            {Array.from({ length: sizes[currentSize] }, (_, i) => (
              <Line key={`v${i}`} p1={{ x: i * 10, y: 0 }} p2={{ x: i * 10, y: sizes[currentSize] * 10 }} color="#333" strokeWidth={1} />
            ))}
            {/* Horizontal lines */}
            {Array.from({ length: sizes[currentSize] }, (_, i) => (
              <Line key={`h${i}`} p1={{ x: 0, y: i * 10 }} p2={{ x: sizes[currentSize] * 10, y: i * 10 }} color="#333" strokeWidth={1} />
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
