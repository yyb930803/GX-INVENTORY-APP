import React, { useState } from 'react';
import { View, Text, Image, Alert, TextInput } from 'react-native';
import { useDispatch } from 'react-redux';
import LogButton from '../../components/LogButton';
import ApiObject from '../../support/Api';
import { PROGRAM_NAME } from '../../constants';
import { setScreenLoading } from '../../reducers/BaseReducer';
import CStyles from '../../styles/CommonStyles';

const ForgotPasswordScreen = (props) => {
  const dispatch = useDispatch();
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');

  const LogoImg = '../../assets/images/Logo.png';

  const changePassword = async () => {
    if (password == '' || rePassword == '') {
      Alert.alert(
        PROGRAM_NAME,
        '请输入密码。',
        [{ text: '是(OK)', onPress: () => { } }],
        { cancelable: false },
      );
    } else if (password != rePassword) {
      Alert.alert(
        PROGRAM_NAME,
        '请输入正确的密码。',
        [{ text: '是(OK)', onPress: () => { } }],
        { cancelable: false },
      );
    } else {
      dispatch(setScreenLoading(true));

      const result = await ApiObject.changePasswordAction({ password: password });
      if (result !== null) {
        Alert.alert(
          PROGRAM_NAME,
          '密码修改成功。',
          [{ text: '是(OK)', onPress: () => props.navigation.navigate('Inventory') }],
          { cancelable: false },
        );
      }

      dispatch(setScreenLoading(false));
    }
  }

  return (
    <View style={{ position: 'relative' }}>
      <View style={{ alignItems: 'center', marginTop: 50 }}>
        <Image source={require(LogoImg)} style={{ width: 72, height: 72 }} />

        <View style={{ flexDirection: 'row' }}>
          <Text style={{ fontSize: 36, color: '#012964', fontWeight: 'bold' }}>GongXing</Text>

          <Text style={{ fontSize: 36, color: '#F8B502', fontWeight: 'bold' }}>盘点</Text>
        </View>
      </View>

      <View style={{ alignItems: 'center', marginTop: 30 }}>
        <View style={{ justifyContent: 'center', flexDirection: 'row', paddingHorizontal: 40, paddingVertical: 5 }}>
          <Text style={{ ...CStyles.TextStyle, width: 50, textAlign: 'right' }}>密码:</Text>
          <TextInput
            secureTextEntry={true}
            value={password}
            onChangeText={(val) => setPassword(val)}
            placeholder={'密码'}
            style={{ ...CStyles.InputStyle, marginRight: 0 }}
          />
        </View>
        <View style={{ justifyContent: 'center', flexDirection: 'row', paddingHorizontal: 40, paddingVertical: 5 }}>
          <Text style={{ ...CStyles.TextStyle, width: 50, textAlign: 'right' }}>确认密码:</Text>
          <TextInput
            secureTextEntry={true}
            value={rePassword}
            onChangeText={(val) => setRePassword(val)}
            placeholder={'确认密码'}
            style={{ ...CStyles.InputStyle, marginRight: 0 }}
          />
        </View>

        <View style={{ alignItems: 'center', marginTop: 10 }}>
          <LogButton ButtonTitle={"更改密码"} LogBtn={() => changePassword()} type={"able"} />
        </View>
      </View>
    </View>
  );
}

export default ForgotPasswordScreen;
