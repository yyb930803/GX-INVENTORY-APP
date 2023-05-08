import React, { useEffect } from 'react';
import { View, StyleSheet, Keyboard, Pressable, Text } from 'react-native';
import { RNCamera } from 'react-native-camera';

const QRcodeScanScreen = ({ skuScanOK, skuScanCancel }) => {
  useEffect(() => {
    Keyboard.dismiss();
  }, []);

  return (
    <View style={styles.container}>
      <RNCamera
        style={styles.preview}
        onBarCodeRead={({ data }) => skuScanOK(data)}
      />
      <View style={{ width: '100%' }}>
        <Pressable style={{ height: 50, backgroundColor: '#eb6161' }} onPress={skuScanCancel}>
          <Text style={{ textAlign: 'center', lineHeight: 50, color: 'white' }}>CLOSE</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
    width: '100%',
    height: '100%',
    position: 'absolute',
    zIndex: 10,
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
});

export default QRcodeScanScreen;
