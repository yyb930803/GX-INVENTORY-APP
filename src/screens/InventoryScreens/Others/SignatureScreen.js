import React, { useRef } from 'react';
import { useDispatch } from 'react-redux';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import SignatureCapture from 'react-native-signature-capture';
import { PROGRAM_NAME } from '../../../constants';
import { setSign1, setSign2, setSign3 } from '../../../reducers/BaseReducer';

const SignatureScreen = (props) => {
  const dispatch = useDispatch();
  const signRef = useRef(null);

  const saveSign = () => {
    Alert.alert(
      PROGRAM_NAME,
      '您要保存并完成电子签名吗？',
      [
        { text: '是(Y)', onPress: () => signRef.current.saveImage() },
        { text: '否(N)', onPress: () => { } },
      ],
      { cancelable: false },
    );
  }

  const resetSign = () => {
    signRef.current.resetImage();
  }

  const onSaveEvent = (result) => {
    if (props.navigation.state.params.type == 'sign1') {
      dispatch(setSign1(result.encoded.replace(/\s/g, '')));
    } else if (props.navigation.state.params.type == 'sign2') {
      dispatch(setSign2(result.encoded.replace(/\s/g, '')));
    } else if (props.navigation.state.params.type == 'sign3') {
      dispatch(setSign3(result.encoded.replace(/\s/g, '')));
    }

    props.navigation.push('DifferenceSurveyDelete');
  }

  return (
    <View style={{ position: 'relative' }}>
      <SignatureCapture
        style={styles.signature}
        ref={signRef}
        onSaveEvent={onSaveEvent}
        saveImageFileInExtStorage={false}
        showNativeButtons={false}
        showTitleLabel={false}
        viewMode={'portrait'}
      />

      <View style={{ flexDirection: 'row', backgroundColor: '#F0F0F0' }}>
        <TouchableOpacity style={styles.buttonStyle} onPress={() => saveSign()}>
          <Text style={{ color: 'white', fontSize: 14 }}>保存</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonStyle} onPress={() => resetSign()}>
          <Text style={{ color: 'white', fontSize: 14 }}>删除</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  signature: {
    width: '100%',
    height: 200,
    borderColor: '#000033',
    borderWidth: 5,
  },
  buttonStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 32,
    backgroundColor: 'rgb(3,157,231)',
    margin: 10,
    borderRadius: 5,
  },
});

export default SignatureScreen;
