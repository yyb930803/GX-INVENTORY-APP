import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { View, Text, Alert, TextInput } from 'react-native';
import Button from '../../../components/Button';
import Header from '../../../components/Header';
import CStyles from '../../../styles/CommonStyles';
import { PROGRAM_NAME } from '../../../constants';
import { setProject, setScreenLoading } from '../../../reducers/BaseReducer';
import ApiObject from '../../../support/Api';
import SoundObject from '../../../utils/sound';

const QuantityInit = (props) => {
  const dispatch = useDispatch();
  const { project } = useSelector((state) => state.base);

  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');
  const [decimalNum, setDecimalNum] = useState('');

  useEffect(() => {
    setMinAmount(project.quantity_min);
    setMaxAmount(project.quantity_max);
    setDecimalNum(project.decimal_num);
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
    if (minAmount == '' || maxAmount == '' || decimalNum == '') {
      Alert.alert(
        PROGRAM_NAME,
        '所有输入字段不能为空。',
        [{ text: '是(OK)', onPress: () => { } }],
        { cancelable: false },
      );
    } else if (Number(maxAmount) < Number(minAmount)) {
      Alert.alert(
        PROGRAM_NAME,
        '请输入确切的数量位数限制。',
        [{ text: '是(OK)', onPress: () => { } }],
        { cancelable: false },
      );
    } else {
      dispatch(setProject({
        ...project,
        quantity_min: minAmount,
        quantity_max: maxAmount,
        decimal_num: decimalNum,
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

      <Text style={{ ...CStyles.TxTStyle, textAlign: 'center', fontSize: 20, marginBottom: 20 }}>设置数量范围</Text>

      <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'flex-start', paddingHorizontal: 20 }}>
        <View style={{ justifyContent: 'center', flexDirection: 'row', paddingVertical: 5, width: '90%', paddingHorizontal: 10 }}>
          <Text style={{ ...CStyles.TextStyle, textAlign: 'right', width: 60 }}>最小数量:</Text>
          <TextInput
            keyboardType={'numeric'}
            value={minAmount.toString()}
            onChangeText={(val) => setMinAmount(val.replace(/[^0-9]/g, ''))}
            placeholder={'最小数量'}
            onKeyPress={inputChange}
            style={{ ...CStyles.InputStyle, marginRight: 0 }}
          />
        </View>
      </View>

      <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'flex-start', paddingHorizontal: 20 }}>
        <View style={{ justifyContent: 'center', flexDirection: 'row', paddingVertical: 5, width: '90%', paddingHorizontal: 10 }}>
          <Text style={{ ...CStyles.TextStyle, textAlign: 'right', width: 60 }}>最大数量:</Text>
          <TextInput
            keyboardType={'numeric'}
            value={maxAmount.toString()}
            onChangeText={(val) => setMaxAmount(val.replace(/[^0-9]/g, ''))}
            placeholder={'最大数量'}
            onKeyPress={inputChange}
            style={{ ...CStyles.InputStyle, marginRight: 0 }}
          />
        </View>
      </View>

      <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'flex-start', paddingHorizontal: 20 }}>
        <View style={{ justifyContent: 'center', flexDirection: 'row', paddingVertical: 5, width: '90%', paddingHorizontal: 10 }}>
          <Text style={{ ...CStyles.TextStyle, textAlign: 'right', width: 60 }}>小数点后位数:</Text>
          <TextInput
            keyboardType={'numeric'}
            value={decimalNum.toString()}
            onChangeText={(val) => setDecimalNum(val.replace(/[^0-9]/g, ''))}
            placeholder={'小数点后位数'}
            onKeyPress={inputChange}
            style={{ ...CStyles.InputStyle, marginRight: 0 }}
          />
        </View>
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20, paddingHorizontal: 50 }}>
        <Button ButtonTitle={"恢复默认值"} BtnPress={() => defaultInput()} type={"blueBtn"} BTnWidth={120} />
        <Button ButtonTitle={"确定"} BtnPress={() => toNextStep()} type={"yellowBtn"} BTnWidth={120} />
      </View>
    </View>
  );
}

export default QuantityInit;
