import React, { useState } from 'react';
import { View, Text, Dimensions } from 'react-native';


const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const App = () => {
  const [result, setResult] = useState(0)
  return (
    <View style={{ flex: 1, width: screenWidth, height: screenHeight }}>
      <Text>{result}</Text>
    </View>
  )
}

export default App;