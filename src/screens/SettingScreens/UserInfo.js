import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { View, Text, ScrollView, Alert, Dimensions, TextInput } from 'react-native';
import ApiObject from '../../support/Api';
import Button from '../../components/Button';
import Header from '../../components/Header';
import CStyles from '../../styles/CommonStyles';
import { setScreenLoading, setUser } from '../../reducers/BaseReducer';
import { PROGRAM_NAME, DEFAULT_AVATAR_URL } from '../../constants';
import UserImgCameraCapture from '../../components/UserImgCameraCapture';
import AvatarImgCameraCapture from '../../components/AvatarImgCameraCapture';

const UserInfo = (props) => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.base);

  const [userData, setUserData] = useState({});

  const [pictureBase, setPictureBase] = useState('');
  const [idcardFrontBase, setIdcardFrontBase] = useState('');
  const [idcardBackBase, setIdcardBackBase] = useState('');
  const [laborBase, setLaborBase] = useState('');
  const [collectionBase, setCollectionBase] = useState('');

  // const [adresslist, setAdresslist] = useState([]);
  const [areaData, setAreaData] = useState([]);

  const genderData = [
    { label: '男', value: 0 },
    { label: '女', value: 1 },
  ];

  useEffect(() => {
    // getAddressList();
    getAreasList();
  }, []);

  useEffect(() => {
    setPictureBase(user.picture);
    setIdcardFrontBase(user.idcard_front);
    setIdcardBackBase(user.idcard_back);
    setLaborBase(user.labor);
    setCollectionBase(user.collection);

    setUserData({ ...user, picture: '', idcard_front: '', idcard_back: '', labor: '', collection: '' });
  }, [user]);

  // const getAddressList = async () => {
  //   var results = await ApiObject.getAddressList();
  //   if (results != null) {
  //     var tempArray = [];
  //     for (let i = 0; i < results.length; i++) {
  //       const element = results[i];
  //       var tempObject = {};
  //       tempObject.name = element.city_name;
  //       tempObject.id = element.id;
  //       tempArray.push(tempObject);
  //     }
  //     setAdresslist(tempArray);
  //   }
  // }

  const getAreasList = async () => {
    var areasListData = await ApiObject.getAreasList();
    if (areasListData != null) {
      let tempArray = [];
      for (var i = 0; i < areasListData.length; i++) {
        const element = areasListData[i];
        var tempObject = {};
        tempObject.label = element.name;
        tempObject.value = i + 1;
        tempArray.push(tempObject);
      }
      await setAreaData(tempArray);
    }
  }

  const accountSave = async () => {
    dispatch(setScreenLoading(true));
    var data = await ApiObject.uploadUserData(userData);
    if (data !== null) {
      dispatch(setUser(data));
      Alert.alert(
        PROGRAM_NAME,
        '用户信息更新成功。',
        [{ text: '是(OK)', onPress: () => { } }],
        { cancelable: false },
      );
    }
    dispatch(setScreenLoading(false));
  };

  const BackBtnPress = async () => {
    if (
      user.idcard_num != userData.idcard_num ||
      user.bankcard_num != userData.bankcard_num ||
      user.bank_account != userData.bank_account ||
      userData.picture != '' ||
      userData.idcard_front != '' ||
      userData.idcard_back != '' ||
      userData.collection != '' ||
      userData.labor != ''
    ) {
      Alert.alert(
        PROGRAM_NAME,
        '是否保存更改的信息？',
        [
          {
            text: 'YES',
            onPress: async () => {
              await accountSave();
              props.navigation.push('SettingMain');
            }
          },
          { text: 'NO', onPress: () => props.navigation.push('SettingMain') }
        ],
        { cancelable: false },
      );
    } else {
      props.navigation.push('SettingMain');
    }
  };

  return (
    <View style={{ position: 'relative', height: Dimensions.get('window').height }}>
      <Header {...props} BtnPress={BackBtnPress} title={'我的信息'} proNoName={true} />

      <ScrollView keyboardShouldPersistTaps="always" style={{ flex: 1 }}>
        <View style={{ marginBottom: 5, alignItems: 'center' }}>
          <AvatarImgCameraCapture imageStr={userData?.picture} imageUrl={pictureBase === '' || pictureBase === null ? DEFAULT_AVATAR_URL : pictureBase} setImageStr={(val) => setUserData({ ...userData, picture: val })} />
        </View>

        <View style={{ alignItems: 'center' }}>
          <View style={{ justifyContent: 'space-between', flexDirection: 'row', paddingHorizontal: 30, paddingVertical: 5 }}>
            <Text style={{ ...CStyles.TextStyle, width: 60, textAlign: 'right' }}>姓名:</Text>
            <TextInput
              editable={false}
              value={userData?.name}
              onChangeText={() => { }}
              placeholder={'姓名'}
              style={{ ...CStyles.InputStyle, marginRight: 0 }}
            />
          </View>

          <View style={{ justifyContent: 'center', flexDirection: 'row', paddingHorizontal: 30, paddingVertical: 5 }}>
            <Text style={{ ...CStyles.TextStyle, width: 60, textAlign: 'right' }}>所属单位:</Text>
            <TextInput
              editable={false}
              value={userData?.company}
              onChangeText={() => { }}
              placeholder={'所属单位'}
              style={{ ...CStyles.InputStyle, marginRight: 0 }}
            />
          </View>

          <View style={{ justifyContent: 'center', flexDirection: 'row', paddingHorizontal: 30, paddingVertical: 5 }}>
            <Text style={{ ...CStyles.TextStyle, width: 60, textAlign: 'right' }}>性别:</Text>
            <TextInput
              editable={false}
              value={genderData[userData?.gender]?.label}
              onChangeText={() => { }}
              placeholder={'性别'}
              style={{ ...CStyles.InputStyle, marginRight: 0 }}
            />
          </View>

          <View style={{ justifyContent: 'center', flexDirection: 'row', paddingHorizontal: 30, paddingVertical: 5 }}>
            <Text style={{ ...CStyles.TextStyle, width: 60, textAlign: 'right' }}>所属区域:</Text>
            <TextInput
              editable={false}
              value={areaData[userData?.adress]?.label}
              onChangeText={() => { }}
              placeholder={'所属区域'}
              style={{ ...CStyles.InputStyle, marginRight: 0 }}
            />
          </View>

          <View style={{ justifyContent: 'center', flexDirection: 'row', paddingHorizontal: 30, paddingVertical: 5 }}>
            <Text style={{ ...CStyles.TextStyle, width: 60, textAlign: 'right' }}>手机号:</Text>
            <TextInput
              editable={false}
              value={userData.phone?.toString()}
              onChangeText={(val) => setUserData({ ...userData, phone: val })}
              placeholder={'手机号'}
              style={{ ...CStyles.InputStyle, marginRight: 0 }}
            />
          </View>

          <View style={{ justifyContent: 'center', flexDirection: 'row', paddingHorizontal: 30, paddingVertical: 5 }}>
            <Text style={{ ...CStyles.TextStyle, width: 60, textAlign: 'right' }}>身份证号:</Text>
            <TextInput
              keyboardType={'numeric'}
              value={userData.idcard_num?.toString()}
              onChangeText={(val) => setUserData({ ...userData, idcard_num: val.replace(/[^0-9]/g, '') })}
              placeholder={'身份证号'}
              style={{ ...CStyles.InputStyle, marginRight: 0 }}
            />
          </View>

          <View style={{ justifyContent: 'center', flexDirection: 'row', paddingHorizontal: 30, paddingVertical: 5 }}>
            <Text style={{ ...CStyles.TextStyle, width: 60, textAlign: 'right' }}>开户行:</Text>
            <TextInput
              value={userData?.bank_account}
              onChangeText={(val) => setUserData({ ...userData, bank_account: val })}
              placeholder={'开户行'}
              style={{ ...CStyles.InputStyle, marginRight: 0 }}
            />
          </View>

          <View style={{ justifyContent: 'center', flexDirection: 'row', paddingHorizontal: 30, paddingVertical: 5 }}>
            <Text style={{ ...CStyles.TextStyle, width: 60, textAlign: 'right' }}>银行卡号:</Text>
            <TextInput
              keyboardType={'numeric'}
              value={userData.bankcard_num?.toString()}
              onChangeText={(val) => setUserData({ ...userData, bankcard_num: val.replace(/[^0-9]/g, '') })}
              placeholder={'银行卡号'}
              style={{ ...CStyles.InputStyle, marginRight: 0 }}
            />
          </View>

          <View style={{ justifyContent: 'center', flexDirection: 'row', paddingHorizontal: 30, paddingVertical: 5 }}>
            <Text style={{ ...CStyles.TextStyle, width: 60, textAlign: 'right' }}>身份证正面:</Text>
            <UserImgCameraCapture imageStr={userData?.idcard_front} imageUrl={idcardFrontBase} setImageStr={(val) => setUserData({ ...userData, idcard_front: val })} />
          </View>

          <View style={{ justifyContent: 'center', flexDirection: 'row', paddingHorizontal: 30, paddingVertical: 5 }}>
            <Text style={{ ...CStyles.TextStyle, width: 60, textAlign: 'right' }}>身份证反面:</Text>
            <UserImgCameraCapture imageStr={userData?.idcard_back} imageUrl={idcardBackBase} setImageStr={(val) => setUserData({ ...userData, idcard_back: val })} />
          </View>

          <View style={{ justifyContent: 'center', flexDirection: 'row', paddingHorizontal: 30, paddingVertical: 5 }}>
            <Text style={{ ...CStyles.TextStyle, width: 60, textAlign: 'right' }}>劳务协议:</Text>
            <UserImgCameraCapture imageStr={userData?.labor} imageUrl={laborBase} setImageStr={(val) => setUserData({ ...userData, labor: val })} />
          </View>

          <View style={{ justifyContent: 'center', flexDirection: 'row', paddingHorizontal: 30, paddingVertical: 5 }}>
            <Text style={{ ...CStyles.TextStyle, width: 60, textAlign: 'right' }}>代收协议:</Text>
            <UserImgCameraCapture imageStr={userData?.collection} imageUrl={collectionBase} setImageStr={(val) => setUserData({ ...userData, collection: val })} />
          </View>
        </View>
      </ScrollView>

      <View style={{ alignItems: 'center', padding: 20 }}>
        <Button
          ButtonTitle={'保存'}
          BtnPress={() => accountSave()}
          type={'YellowBtn'}
          BTnWidth={280}
        />
      </View>
    </View>
  );
}

export default UserInfo;
