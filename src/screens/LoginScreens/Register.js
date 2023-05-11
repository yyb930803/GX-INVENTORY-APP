import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { View, Text, Image, TouchableOpacity, Alert, ScrollView, TextInput } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import DropBox from '../../components/DropBox';
import LogButton from '../../components/LogButton';
import CStyles from '../../styles/CommonStyles';
import ApiObject from '../../support/Api';
import { PROGRAM_NAME } from '../../constants';
import { setScreenLoading } from '../../reducers/BaseReducer';

const Register = (props) => {
  const dispatch = useDispatch();

  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [gender, setGender] = useState('0');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adress, setAdress] = useState('');

  const [rePassword, setRePassword] = useState('');
  const [adressList, setAdressList] = useState([]);
  const [inputValueTF, setInputValueTF] = useState(false);
  const [adressListOpen, setAdressListOpen] = useState(false);
  const [genderListOpen, setGenderListOpen] = useState(false);

  const [genderList, setGenderList] = useState([
    { label: '男', value: '0' },
    { label: '女', value: '1' }
  ]);

  const LogoImg = '../../assets/images/Logo.png';
  const Checkbox_Off = '../../assets/images/Checkbox_Off.png';

  useEffect(() => {
    getAddressList();
  }, []);

  const onAdressListOpen = useCallback(() => {
    setGenderListOpen(false);
  }, []);

  const onGenderListOpen = useCallback(() => {
    setAdressListOpen(false);
  }, []);

  const allDropBoxClose = () => {
    setGenderListOpen(false);
    setAdressListOpen(false);
  }

  const getAddressList = async () => {
    var results = await ApiObject.getAddressList();
    if (results) {
      var tempArray = [];
      for (let i = 0; i < results.length; i++) {
        const element = results[i];
        var tempObject = {};
        tempObject.label = element.city_name;
        tempObject.value = element.id;
        tempArray.push(tempObject);
      }
      setAdressList(tempArray);
    }
  };

  useEffect(() => {
    if (
      name != '' &&
      company != '' &&
      gender != '' &&
      email != '' &&
      phone != '' &&
      rePassword != '' &&
      password != '' &&
      adress != ''
    ) {
      setInputValueTF(true);
    } else {
      setInputValueTF(false);
    }
  }, [name, company, gender, email, phone, rePassword, password, adress]);

  const registerFun = async () => {
    dispatch(setScreenLoading(true));

    const result = await ApiObject.doSignUpAction({
      name: name,
      company: company,
      gender: gender,
      phone: phone,
      email: email,
      password: password,
      adress: adress,
    });

    if (result !== null) {
      AsyncStorage.setItem('phone', phone);
      props.navigation.navigate('PhoneVerifyScreen');
    }

    dispatch(setScreenLoading(false));
  }

  return (
    <ScrollView
      keyboardShouldPersistTaps="always"
      style={{ position: 'relative' }}
    >
      <View style={{ alignItems: 'center', marginTop: 50, marginBottom: 20 }}>
        <Image source={require(LogoImg)} style={{ width: 72, height: 72 }} />
        <View style={{ flexDirection: 'row' }}>
          <Text style={{ fontSize: 36, color: '#012964', fontWeight: 'bold' }}>
            GongXing
          </Text>
          <Text style={{ fontSize: 36, color: '#F8B502', fontWeight: 'bold' }}>
            盘点
          </Text>
        </View>
      </View>

      <View style={{ alignItems: 'center' }}>
        <View style={{ justifyContent: 'center', flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 3 }}>
          <Text style={{ ...CStyles.TextStyle, width: 50, textAlign: 'right' }}>姓名:</Text>
          <TextInput
            value={name}
            onChangeText={(val) => setName(val)}
            placeholder={'姓名'}
            style={{ ...CStyles.InputStyle }}
            onFocus={allDropBoxClose}
          />
        </View>

        <View style={{ justifyContent: 'center', flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 3 }}>
          <Text style={{ ...CStyles.TextStyle, width: 50, textAlign: 'right' }}>所属单位:</Text>
          <TextInput
            value={company}
            onChangeText={(val) => setCompany(val)}
            placeholder={'所属单位'}
            style={{ ...CStyles.InputStyle }}
            onFocus={allDropBoxClose}
          />
        </View>

        <View style={{ justifyContent: 'center', flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 3 }}>
          <Text style={{ ...CStyles.TextStyle, width: 50, textAlign: 'right' }}>常住城市:</Text>
          <DropBox
            zIndex={3000}
            zIndexInverse={1000}
            open={adressListOpen}
            setOpen={setAdressListOpen}
            onOpen={onAdressListOpen}
            value={adress}
            setValue={setAdress}
            items={adressList}
            setItems={setAdressList}
            searchable={true}
            listMode='MODAL'
            // listMode='SCROLLVIEW'
          />
        </View>

        <View style={{ justifyContent: 'center', flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 3 }}>
          <Text style={{ ...CStyles.TextStyle, width: 50, textAlign: 'right' }}>性别:</Text>
          <DropBox
            zIndex={2000}
            zIndexInverse={2000}
            open={genderListOpen}
            setOpen={setGenderListOpen}
            onOpen={onGenderListOpen}
            value={gender}
            setValue={setGender}
            items={genderList}
            setItems={setGenderList}
            searchable={true}
            listMode='MODAL'
          />
        </View>

        <View style={{ justifyContent: 'center', flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 3 }}>
          <Text style={{ ...CStyles.TextStyle, width: 50, textAlign: 'right' }}>电话号码:</Text>
          <TextInput
            keyboardType={'numeric'}
            value={phone}
            onChangeText={(val) => setPhone(val.replace(/[^0-9]/g, ''))}
            placeholder={'电话号码'}
            style={{ ...CStyles.InputStyle }}
            onFocus={allDropBoxClose}
          />
        </View>

        <View style={{ justifyContent: 'center', flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 3 }}>
          <Text style={{ ...CStyles.TextStyle, width: 50, textAlign: 'right' }}>电子邮件:</Text>
          <TextInput
            value={email}
            onChangeText={(val) => setEmail(val)}
            placeholder={'电子邮件'}
            style={{ ...CStyles.InputStyle }}
            onFocus={allDropBoxClose}
          />
        </View>

        <View style={{ justifyContent: 'center', flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 3 }}>
          <Text style={{ ...CStyles.TextStyle, width: 50, textAlign: 'right' }}>密码:</Text>
          <TextInput
            secureTextEntry={true}
            value={password}
            onChangeText={(val) => setPassword(val)}
            placeholder={'密码'}
            style={{ ...CStyles.InputStyle }}
            onFocus={allDropBoxClose}
          />
        </View>

        <View style={{ justifyContent: 'center', flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 3 }}>
          <Text style={{ ...CStyles.TextStyle, width: 50, textAlign: 'right' }}>确认密码:</Text>
          <TextInput
            secureTextEntry={true}
            value={rePassword}
            onChangeText={(val) => setRePassword(val)}
            placeholder={'确认密码'}
            style={{ ...CStyles.InputStyle }}
            onFocus={allDropBoxClose}
          />
        </View>
      </View>

      <View style={{ marginTop: 30, alignItems: 'center' }}>
        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image source={require(Checkbox_Off)} />
          <Text style={{ fontSize: 14, color: '#8D90A6' }}>同意《服务条款》和《隐私政策》</Text>
        </TouchableOpacity>
      </View>

      <View style={{ alignItems: 'center', marginTop: 10 }}>
        {inputValueTF ? (
          <LogButton
            ButtonTitle={'注册'}
            LogBtn={() => registerFun()}
            type={'able'}
          />
        ) : (
          <LogButton
            ButtonTitle={'注册'}
            LogBtn={() => {
              Alert.alert(
                PROGRAM_NAME,
                '请输入用户信息',
                [{ text: 'OK', onPress: () => { } }],
                { cancelable: false },
              );
            }}
            type={'disable'}
          />
        )}
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 50 }}>
        <Text style={{ fontSize: 14, color: '#F8B502', marginRight: 10 }}>
          Already have an account?
        </Text>
        <TouchableOpacity onPress={() => props.navigation.navigate('Login')}>
          <Text style={{ fontSize: 16, color: '#012964', fontWeight: 'bold' }}>
            Sign In
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

export default Register;
