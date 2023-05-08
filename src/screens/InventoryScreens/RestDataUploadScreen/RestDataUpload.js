import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { View, Text, Alert } from 'react-native';
import ApiObject from '../../../support/Api';
import Header from '../../../components/Header';
import Button from '../../../components/Button';
import CStyles from '../../../styles/CommonStyles';
import { PROGRAM_NAME } from '../../../constants';
import { setScreenLoading } from '../../../reducers/BaseReducer';
import { getInvNewData, getRevNewData, getDiffNewData } from '../../../hooks/dbHooks';

const RestDataUpload = (props) => {
  const dispatch = useDispatch();
  const { user, project } = useSelector(state => state.base);

  const [invNewData, setInvNewData] = useState([]);
  const [revNewData, setRevNewData] = useState([]);
  const [diffNewData, setDiffNewData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const invNewRows = await getInvNewData(user.id);
      const revNewRows = await getRevNewData(user.id);
      const diffNewRows = await getDiffNewData(user.id);

      setInvNewData(invNewRows);
      setRevNewData(revNewRows);
      setDiffNewData(diffNewRows);
    };

    dispatch(setScreenLoading(true));
    fetchData();
    dispatch(setScreenLoading(false));
  }, []);

  const BackBtnPress = () => {
    props.navigation.push('Inventory');
  };

  const uploadRestData = async () => {
    dispatch(setScreenLoading(true));

    await ApiObject.uploadScanData({ data: invNewData, work_type: 1, qrcode: project.qrcode });
    await ApiObject.uploadScanData({ data: revNewData, work_type: 2, qrcode: project.qrcode });
    await ApiObject.uploadScanData({ data: diffNewData, work_type: 3, qrcode: project.qrcode });
    Alert.alert(
      PROGRAM_NAME,
      '其余数据已成功上传。',
      [{ text: '是(Y)', onPress: () => { } }],
      { cancelable: false },
    );

    dispatch(setScreenLoading(false));
  };

  return (
    <View style={{ position: 'relative' }}>
      <View style={{}}>
        <Header
          {...props}
          BtnPress={BackBtnPress}
          title={'剩余数据'}
        />
      </View>
      <View style={{ marginTop: 10, paddingHorizontal: 30 }}>
        <Text style={CStyles.TxTStyle}>
          盘点剩余数据数: {invNewData.length}
        </Text>
        <Text style={CStyles.TxTStyle}>
          盘点复查剩余数据数: {revNewData.length}
        </Text>
        <Text style={CStyles.TxTStyle}>
          差异调查剩余数据数: {diffNewData.length}
        </Text>
      </View>
      {(invNewData.length > 0 || revNewData.length > 0 || diffNewData.length > 0) && (
        <View
          style={{
            marginTop: 30,
            exDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Button
            ButtonTitle={'剩余数据上载'}
            BtnPress={() => uploadRestData()}
            type={'yellowBtn'}
            BTnWidth={300}
          />
        </View>
      )}
    </View>
  );
}

export default RestDataUpload;
