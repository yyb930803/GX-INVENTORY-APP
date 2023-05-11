import React from 'react';
import { useDispatch } from 'react-redux';
import { View, Dimensions, Alert } from 'react-native';
import ApiObject from '../../support/Api';
import Header from '../../components/Header';
import Button from '../../components/Button';
import Button1 from '../../components/Button1';
import FooterBar from '../../components/FooterBar';
import { PROGRAM_NAME } from '../../constants';
import { setAccessToken, setUser } from '../../reducers/BaseReducer';

const SettingMain = (props) => {
  const dispatch = useDispatch();

  const screenNavigate = (id) => {
    if (id == 2) {
      props.navigation.push('Inventory');
    } else if (id == 4) {
      props.navigation.navigate('SettingMain');
    } else if (id == 6) {
      props.navigation.push('Management');
    }
  };

  const signOutCheck = () => {
    Alert.alert(
      PROGRAM_NAME,
      '你真的退出了吗？',
      [
        { text: '是(Y)', onPress: () => signOut() },
        { text: '否(N)', onPress: () => { } },
      ],
      { cancelable: true },
    );
  };

  const signOut = async () => {
    await ApiObject.logoutAction();
    dispatch(setUser({}));
    dispatch(setAccessToken(''));
    props.navigation.navigate('Login');
  };

  return (
    <View
      style={{
        flex: 1,
        position: 'relative',
        height: Dimensions.get('window').height,
      }}
    >
      <View style={{}}>
        <Header
          {...props}
          BackBtn={'noback'}
          title={'我的信息'}
          proNoName={true}
        />
      </View>

      <View style={{ flex: 1, justifyContent: "space-between", padding: 20 }}>
        <View style={{ alignItems: 'center' }}>
          <Button1
            ButtonTitle={'我的信息'}
            BtnPress={() => {
              props.navigation.push('UserInfo');
            }}
            BTnWidth={320}
          />
          <Button1
            ButtonTitle={'系统设置'}
            BtnPress={() => {
              props.navigation.push('SystemInfo');
            }}
            BTnWidth={320}
          />
        </View>

        <View style={{ alignItems: 'center' }}>
          <Button
            ButtonTitle={'退出'}
            BtnPress={() => signOutCheck()}
            type={'YellowBtn'}
            BTnWidth={320}
          />
        </View>
      </View>

      <FooterBar screenNavigate={screenNavigate} activeBtn={4} />
    </View>
  );
}

export default SettingMain;
