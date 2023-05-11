import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { View, Text, Image, Alert, TouchableOpacity, TextInput } from 'react-native';
import Button from '../../../components/Button';
import Header from '../../../components/Header';
import CStyles from '../../../styles/CommonStyles';
import { PROGRAM_NAME } from '../../../constants';
import { setProject, setScreenLoading } from '../../../reducers/BaseReducer';
import ApiObject from '../../../support/Api';
import SoundObject from '../../../utils/sound';

const InventoryInit = (props) => {
  const dispatch = useDispatch();
  const { project } = useSelector((state) => state.base);

  const [minGongWei, setMinGongWei] = useState('');
  const [maxGongWei, setMaxGongWei] = useState('');
  const [maxSKU, setMaxSKU] = useState('');
  const [symbol, setSymbol] = useState(0);
  const [alphabet, setAlphabet] = useState(0);

  const checkImage = '../../../assets/images/checkImage.png';
  const uncheckImage = '../../../assets/images/uncheckImage.png';

  useEffect(() => {
    setMinGongWei(project.gongwei_min);
    setMaxGongWei(project.gongwei_max);
    setMaxSKU(project.max_sku);
    setSymbol(project.symbol);
    setAlphabet(project.alphabet);
  }, [project]);

  const defaultInput = async () => {
    dispatch(setScreenLoading(true));

    var result = await ApiObject.getProjectInfo({ qrcode: project.qrcode });
    if (result !== null) {
      dispatch(setProject(result));
    }

    dispatch(setScreenLoading(false));
  }

  const toNextStep = async () => {
    if (minGongWei == '' || maxGongWei == '' || maxSKU == '') {
      Alert.alert(
        PROGRAM_NAME,
        '所有输入字段不能为空。',
        [{ text: '是(OK)', onPress: () => { } }],
        { cancelable: false },
      );
    } else if (Number(maxGongWei) < Number(minGongWei)) {
      Alert.alert(
        PROGRAM_NAME,
        '请输入确切的工位位数限制。',
        [{ text: '是(OK)', onPress: () => { } }],
        { cancelable: false },
      );
    } else {
      dispatch(setProject({
        ...project,
        gongwei_min: minGongWei,
        gongwei_max: maxGongWei,
        max_sku: maxSKU,
        symbol: symbol,
        alphabet: alphabet,
      }));
      props.navigation.push('AreaValue');
    }
  }

  const BackBtnPress = async () => {
    props.navigation.push('AreaValue')
  }

  const inputChange = function (e) {
    var inp = e.nativeEvent.key;
    SoundObject.playSound(inp);
  }

  return (
    <View style={{ position: 'relative' }}>
      <View style={{}}>
        <Header {...props} BtnPress={BackBtnPress} title={'盘点'} />
      </View>

      <Text style={{ ...CStyles.TxTStyle, textAlign: 'center', fontSize: 20, marginBottom: 20 }}>设置货架号</Text>

      <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'flex-start', paddingHorizontal: 20 }}>
        <View style={{ justifyContent: 'center', flexDirection: 'row', paddingVertical: 5, width: '90%', paddingHorizontal: 10 }}>
          <Text style={{ ...CStyles.TextStyle, textAlign: 'right', width: 60 }}>最小位数:</Text>
          <TextInput
            keyboardType={'numeric'}
            value={minGongWei.toString()}
            onChangeText={(val) => setMinGongWei(val.replace(/[^0-9]/g, ''))}
            placeholder={'最小位数'}
            onKeyPress={inputChange}
            style={{ ...CStyles.InputStyle, marginRight: 0 }}
          />
        </View>
      </View>

      <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'flex-start', paddingHorizontal: 20 }}>
        <View style={{ justifyContent: 'center', flexDirection: 'row', paddingVertical: 5, width: '90%', paddingHorizontal: 10 }}>
          <Text style={{ ...CStyles.TextStyle, textAlign: 'right', width: 60 }}>最大位数:</Text>
          <TextInput
            keyboardType={'numeric'}
            value={maxGongWei.toString()}
            onChangeText={(val) => setMaxGongWei(val.replace(/[^0-9]/g, ''))}
            placeholder={'最大位数'}
            onKeyPress={inputChange}
            style={{ ...CStyles.InputStyle, marginRight: 0 }}
          />
        </View>
      </View>

      <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'flex-start', paddingHorizontal: 20 }}>
        <View style={{ justifyContent: 'center', flexDirection: 'row', paddingVertical: 5, width: '90%', paddingHorizontal: 10 }}>
          <Text style={{ ...CStyles.TextStyle, textAlign: 'right', width: 60 }}>最大SKU数:</Text>
          <TextInput
            keyboardType={'numeric'}
            value={maxSKU.toString()}
            onChangeText={(val) => setMaxSKU(val.replace(/[^0-9]/g, ''))}
            placeholder={'最大SKU数'}
            onKeyPress={inputChange}
            style={{ ...CStyles.InputStyle, marginRight: 0 }}
          />
        </View>
      </View>

      <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'center', marginVertical: 20 }}>
        <TouchableOpacity
          onPress={() => setAlphabet(!alphabet)}
          style={{ flexDirection: 'row', alignContent: 'center', justifyContent: 'space-between', width: 90, marginHorizontal: 20 }}
        >
          {alphabet == 0 ?
            <Image source={require(uncheckImage)} style={{ width: 30, height: 30 }} /> :
            <Image source={require(checkImage)} style={{ width: 30, height: 30 }} />
          }
          <Text style={{ marginTop: 2 }}>带字母</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setSymbol(!symbol)}
          style={{ flexDirection: 'row', alignContent: 'center', justifyContent: 'space-between', width: 90, marginHorizontal: 20 }}
        >
          {symbol == 0 ?
            <Image source={require(uncheckImage)} style={{ width: 30, height: 30 }} /> :
            <Image source={require(checkImage)} style={{ width: 30, height: 30 }} />
          }
          <Text style={{ marginTop: 2 }}>带符号</Text>
        </TouchableOpacity>
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20, paddingHorizontal: 50 }}>
        <Button ButtonTitle={"恢复默认值"} BtnPress={() => defaultInput()} type={"blueBtn"} BTnWidth={120} />
        <Button ButtonTitle={"确定"} BtnPress={() => toNextStep()} type={"yellowBtn"} BTnWidth={120} />
      </View>
    </View>
  );
}

export default InventoryInit;
