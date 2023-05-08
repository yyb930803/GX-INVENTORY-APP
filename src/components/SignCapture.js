import React from 'react';
import { View, Image, TouchableOpacity, Text } from 'react-native';
import { SERVER_URL } from '../constants';
import { useEffect } from 'react';

const SignCapture = ({ imageStr, imageUrl, navigation, type, width = 240, height = 160 }) => {
  return (
    <View style={{ alignItems: 'center', borderRadius: 8, overflow: 'hidden', flex: 1 }}>
      <TouchableOpacity onPress={() => navigation.push('SignatureScreen', { type: type })}>
        <Image
          source={{ uri: imageStr === '' ? SERVER_URL + imageUrl : `data:image/png;base64,${imageStr}` }}
          style={{
            height: height,
            width: width,
            backgroundColor: '#B1B6C2',
          }}
        />
      </TouchableOpacity>
    </View>
  );
}

export default SignCapture;
