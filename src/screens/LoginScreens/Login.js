import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { View, Text, Image, TouchableOpacity, Alert, TextInput } from 'react-native';
import LogButton from '../../components/LogButton';
import ApiObject from '../../support/Api';
import CStyles from '../../styles/CommonStyles';
import { PROGRAM_NAME } from '../../constants';
import { setScreenLoading, setAccessToken, setUser } from '../../reducers/BaseReducer';

const Login = (props) => {
  const dispatch = useDispatch();
  const [inputValueTF, setInputValueTF] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const LogoImg = '../../assets/images/Logo.png';
  const Checkbox_Off = '../../assets/images/Checkbox_Off.png';

  useEffect(() => {
    if (email != "" && password != "") {
      setInputValueTF(true);
    } else {
      setInputValueTF(false);
    }
  }, [email, password]);

  const loginFunc = async () => {
    dispatch(setScreenLoading(true));

    const result = await ApiObject.doSignInAction({ email: email, password: password });
    if (result !== null) {
      dispatch(setAccessToken(result.access_token));
      dispatch(setUser(result.current_user));

      Alert.alert(
        PROGRAM_NAME,
        '登录成功。',
        [{ text: '是(OK)', onPress: () => props.navigation.navigate('Management') }],
        { cancelable: false },
      );
    }

    dispatch(setScreenLoading(false));
  }

  return (
    <View style={{ position: 'relative', minHeight: '100%', paddingTop: 40 }}>
      <View style={{ alignItems: 'center' }}>
        <Image source={require(LogoImg)} />

        <View style={{ flexDirection: 'row' }}>
          <Text style={{ fontSize: 36, color: '#012964', fontWeight: 'bold' }}>GongXing</Text>

          <Text style={{ fontSize: 36, color: '#F8B502', fontWeight: 'bold' }}>盘点</Text>
        </View>
      </View>

      <View style={{ alignItems: 'center', marginTop: 30 }}>
        <View style={{ justifyContent: 'space-between', flexDirection: 'row', paddingHorizontal: 30, paddingVertical: 5 }}>
          <TextInput
            value={email}
            onChangeText={(val) => setEmail(val)}
            placeholder={'电子邮件'}
            style={{ ...CStyles.InputStyle, marginRight: 0 }}
          />
        </View>

        <View style={{ justifyContent: 'center', flexDirection: 'row', paddingHorizontal: 30, paddingVertical: 5 }}>
          <TextInput
            value={password}
            secureTextEntry={true}
            onChangeText={(val) => setPassword(val)}
            placeholder={'请输入密码'}
            style={{ ...CStyles.InputStyle, marginRight: 0 }}
          />
        </View>

        <View style={{ flexDirection: 'row', marginTop: 20, marginLeft: 30, marginRight: 30 }}>
          <TouchableOpacity style={{ flex: 1, alignItems: 'flex-start' }} onPress={() => props.navigation.navigate('Register')}>
            <Text style={{ fontSize: 16, color: '#F8B502' }}>创建帐号</Text>
          </TouchableOpacity>

          <TouchableOpacity style={{ flex: 1, alignItems: 'flex-end' }} onPress={() => props.navigation.navigate("InputPhoneScreen")}>
            <Text style={{ fontSize: 16, color: '#012964' }}>忘记密码</Text>
          </TouchableOpacity>
        </View>

        <View style={{ marginTop: 150 }}>
          <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image source={require(Checkbox_Off)} />
            <Text style={{ fontSize: 14, color: '#8D90A6' }}>同意《服务条款》和《隐私政策》</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ alignItems: 'center', marginBottom: 50 }}>
        {inputValueTF ?
          <LogButton ButtonTitle={"登入"} LogBtn={() => loginFunc()} type={"able"} />
          :
          <LogButton ButtonTitle={"登入"} LogBtn={() => {
            Alert.alert(
              PROGRAM_NAME,
              '请输入电子邮件和密码',
              [{ text: 'OK', onPress: () => { } }],
              { cancelable: false },
            );
          }} type={"disable"} />
        }
      </View>
    </View>
  );
}

export default Login;
