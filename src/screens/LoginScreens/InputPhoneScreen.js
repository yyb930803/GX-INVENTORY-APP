import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { View, Text, Image, TouchableOpacity, Alert, TextInput } from 'react-native';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import LogButton from '../../components/LogButton';
import ApiObject from '../../support/Api';
import { PROGRAM_NAME } from '../../constants';
import CStyles from '../../styles/CommonStyles';
import { setScreenLoading, setAccessToken, setUser } from '../../reducers/BaseReducer';

const InputPhoneScreen = (props) => {
  const dispatch = useDispatch();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verifyCode, setVerifyCode] = useState('');
  const [smsFlag, setSmsFlag] = useState(false);

  const LogoImg = '../../assets/images/Logo.png';

  const getCodeFun = async () => {
    if (phoneNumber == "") {
      Alert.alert(
        PROGRAM_NAME,
        '请输入电话号码。',
        [{ text: '是(OK)', onPress: () => { } }],
        { cancelable: false },
      );
    } else {
      dispatch(setScreenLoading(true));

      const result = await ApiObject.resendCodeAction({ phone: phoneNumber });
      if (result !== null) {
        Alert.alert(
          PROGRAM_NAME,
          '您将收到验证码。 请稍等。',
          [{ text: '是(OK)', onPress: () => setSmsFlag(true) }],
          { cancelable: false },
        );
      }

      dispatch(setScreenLoading(false));
    }
  }

  const resendCode = async () => {
    dispatch(setScreenLoading(true));
    await ApiObject.resendCodeAction({ phone: phoneNumber });
    dispatch(setScreenLoading(false));
  }

  const registerFun = async () => {
    dispatch(setScreenLoading(true));

    const result = await ApiObject.verifyAction({ code: verifyCode, phone: phoneNumber });
    if (result) {
      dispatch(setAccessToken(result.access_token));
      dispatch(setUser(result.current_user));

      Alert.alert(
        PROGRAM_NAME,
        '验证成功。',
        [{ text: '是(OK)', onPress: () => props.navigation.navigate('ForgotPasswordScreen') }],
        { cancelable: false },
      );
    }

    dispatch(setScreenLoading(false));
  }

  return (
    <View style={{ position: 'relative', alignItems: 'center', marginTop: 50 }}>
      <Image source={require(LogoImg)} />

      <View style={{ flexDirection: 'row' }}>
        <Text style={{ fontSize: 36, color: '#012964', fontWeight: 'bold' }}>GongXing</Text>
        <Text style={{ fontSize: 36, color: '#F8B502', fontWeight: 'bold' }}>盘点</Text>
      </View>

      {smsFlag ? (
        <View style={{ alignItems: 'center' }}>
          <Text style={{ fontSize: 15, color: '#012964' }}>您将收到验证码到{phoneNumber}。</Text>
          <OTPInputView
            style={{ width: 250, height: 150 }}
            pinCount={4}
            autoFocusOnLoad
            codeInputFieldStyle={{
              width: 45,
              height: 45,
              borderColor: "gray",
              color: '#000',
              fontSize: 20
            }}
            onCodeChanged={(val) => setVerifyCode(val)}
            code={verifyCode}
          />
          <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 30, zIndex: 1000 }}>
            <Text style={{ fontSize: 15, color: '#012964', }}>您还没有收到验证码？</Text>
            <TouchableOpacity onPress={() => resendCode()}>
              <Text style={{ fontSize: 15, color: '#F8B502', fontWeight: 'bold' }}> 重发</Text>
            </TouchableOpacity>
          </View>
          <View style={{ alignItems: 'center', marginTop: 10 }}>
            {verifyCode.length === 4 ?
              <LogButton ButtonTitle={"確定"} LogBtn={() => registerFun()} type={"able"} />
              :
              <LogButton ButtonTitle={"確定"}
                LogBtn={() => {
                  Alert.alert(
                    PROGRAM_NAME,
                    '请输入验证码。',
                    [{ text: 'OK', onPress: () => { } }],
                    { cancelable: false },
                  );
                }}
                type={"disable"}
              />
            }
          </View>
        </View>
      ) : (
        <View>
          <View style={{ justifyContent: 'center', flexDirection: 'row', marginTop: 50 }}>
            <Text style={{ ...CStyles.TextStyle, width: 50 }}>电话号码:</Text>
            <TextInput
              keyboardType={'numeric'}
              value={phoneNumber}
              onChangeText={(val) => setPhoneNumber(val.replace(/[^0-9]/g, ''))}
              placeholder={'电话号码'}
              style={{ ...CStyles.InputStyle }}
            />
          </View>
          <View style={{ alignItems: 'center', marginTop: 10 }}>
            <LogButton ButtonTitle={"发送"} LogBtn={() => getCodeFun()} type={"able"} />
          </View>
        </View>
      )}
    </View>
  );
}

export default InputPhoneScreen;
