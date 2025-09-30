import { useState } from 'react';
import { Text, View } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';

export default function Index() {
  const [index, setIndex] = useState(0);

  const updateIndex = () => {
    setIndex((prev) => prev + 1);
  };

  const tap = Gesture.Tap().onEnd((event) => {
    console.log('tap', event, index + 1);
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
          <Text style={{ fontSize: 24 }}>{index}</Text>
        </View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
}
