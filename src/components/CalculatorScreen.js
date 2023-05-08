import React, { useEffect, useState } from 'react';
import { View, Pressable, Text, Keyboard } from 'react-native';
import Calculator from '../screens/calculator/index';

const CalculatorScreen = ({ closeCal, cancel }) => {
  const [result, setResult] = useState(0);

  useEffect(() => {
    Keyboard.dismiss();
  }, []);

  return (
    <View style={{
      flex: 1,
      width: '100%',
      height: '100%',
      backgroundColor: "#e4e8eeaa",
      justifyContent: "center",
      position: 'absolute',
      zIndex: 10,
    }}>
      <View style={{ flex: 1, position: 'absolute', width: '100%', height: '65%', bottom: 0 }}>
        <Calculator
          resultFun={setResult}
          showLiveResult={true}
          scientific={false}
          theme="light"
          customize={{
            borderRadius: 5,
            spacing: 3,
          }}
        />
        <View style={{ flexDirection: 'row', backgroundColor: 'white' }}>
          <View style={{ width: '50%', padding: 3 }}>
            <Pressable style={{ height: 50, backgroundColor: '#eb6161', borderRadius: 5 }} onPress={() => cancel()}>
              <Text style={{ textAlign: 'center', lineHeight: 50, color: 'white' }}>CLOSE</Text>
            </Pressable>
          </View>
          <View style={{ width: '50%', padding: 3 }}>
            <Pressable style={{ height: 50, backgroundColor: '#4285f4', borderRadius: 5 }} onPress={() => closeCal(result)}>
              <Text style={{ textAlign: 'center', lineHeight: 50, color: 'white' }}>OK</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  )
}

export default CalculatorScreen;
