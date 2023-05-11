import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { View, Text, Alert, Dimensions, TextInput } from 'react-native';
import ApiObject from '../../../support/Api';
import CStyles from '../../../styles/CommonStyles';
import Button from '../../../components/Button';
import Header from '../../../components/Header';
import QRcodeScanScreen from '../../../components/QRcodeScanScreen';
import { REV_TYPE, PROGRAM_NAME } from '../../../constants';
import { DB, tbName } from '../../../hooks/dbHooks';
import SoundObject from '../../../utils/sound';
import { setScreenLoading, setGongweiPos } from '../../../reducers/BaseReducer';

const InventoryReview = (props) => {
  const dispatch = useDispatch();
  const { user, project, gongweiPos } = useSelector((state) => state.base);
  const { gongweiMasterTb, inventoryReviewTb } = tbName(user.id);

  const [openScan, setOpenScan] = useState(false);
  const [gongwei, setGongwei] = useState('');

  const toNextStep = async () => {
    dispatch(setScreenLoading(true));

    if (gongwei != '') {
      DB.transaction((tx) => {
        tx.executeSql(
          `SELECT * FROM ${gongweiMasterTb} WHERE gongwei = ?`,
          [Number(gongwei)],
          (tx, results) => {
            if (results.rows.length > 0) {
              gongWeiWorkCheck(results.rows.item(0));
            } else {
              Alert.alert(
                PROGRAM_NAME,
                '此工位不存在。',
                [{ text: '是(Y)', onPress: () => { } }],
                { cancelable: false },
              );
            }
          },
        );
      });
    } else {
      Alert.alert(
        PROGRAM_NAME,
        '请正确输入工位位置信息。',
        [{ text: '是(ok)', onPress: () => { } }],
        { cancelable: false },
      );
    }

    dispatch(setScreenLoading(false));
  };

  const gongWeiWorkCheck = async (gongweiItem) => {
    dispatch(setScreenLoading(true));

    var result = await ApiObject.gongweiCheck({ qrcode: project.qrcode, position: gongweiItem.gongwei, work_type: REV_TYPE, force: false });

    if (result !== null) {
      if (result == 'reApiForce') {
        result = await ApiObject.gongweiCheck({ qrcode: project.qrcode, position: gongweiItem.gongwei, work_type: REV_TYPE, force: true });
        if (result !== null) {
          await gotoInventoryMain(gongweiItem);
        }
      } else {
        await gotoInventoryMain(gongweiItem);
      }
    }

    dispatch(setScreenLoading(false));
  };

  const gotoInventoryMain = async (gongweiItem) => {
    dispatch(setGongweiPos(gongweiItem));
    await getGongweiData(gongweiItem);
  }

  const getGongweiData = async (gongweiItem) => {
    var data = await ApiObject.gongweiScandata({ qrcode: project.qrcode, gongwei_id: gongweiItem.id });

    if (data !== null) {
      DB.transaction((tx) => {
        tx.executeSql(
          `DELETE FROM ${inventoryReviewTb}`,
          [],
          (tx, results) => { },
        );
      });

      if (data.length > 0) {
        DB.transaction((tx) => {
          for (let i = 0; i < data.length; i++) {
            tx.executeSql(
              `SELECT * FROM ${inventoryReviewTb} WHERE record_id=?`,
              [data[i].record_id],
              (tx, results) => {
                if (results.rows.length == 0) {
                  tx.executeSql(
                    `
                      INSERT INTO ${inventoryReviewTb} ("record_id", "commodity_sku", "commodity_price", "codeinput_method", "pihao", "count",  "gongwei_id", "column", "row", "scan_time", "mistakes_id", "mistakes_type","delete_flag","commodity_name","upload") 
                      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,"uploaded")
                    `,
                    [
                      data[i].record_id,
                      data[i].commodity_sku,
                      data[i].commodity_price,
                      data[i].codeinput_method,
                      data[i].pihao,
                      data[i].count,
                      data[i].gongwei_id,
                      data[i].column,
                      data[i].row,
                      data[i].scan_time,
                      data[i].mistakes_id,
                      data[i].mistakes_type,
                      data[i].delete_flag,
                      data[i].commodity_name
                    ],
                    async (tx, results) => {
                      if (i == data.length - 1) {
                        props.navigation.push('InventoryReviewEditList');
                      }
                    },
                  );
                } else {
                  tx.executeSql(
                    `
                      UPDATE ${inventoryReviewTb} SET record_id = ?, commodity_sku = ? , commodity_price = ?, codeinput_method = ?, pihao = ?, count = ?, mistakes_id = ?, mistakes_type = ?, delete_flag = ?, commodity_name = ? 
                      WHERE gongwei_id = ? AND column = ? AND row = ?
                    `,
                    [
                      data[i].record_id,
                      data[i].commodity_sku,
                      data[i].commodity_price,
                      data[i].codeinput_method,
                      data[i].pihao,
                      data[i].count,
                      data[i].mistakes_id,
                      data[i].mistakes_type,
                      data[i].delete_flag,
                      data[i].commodity_name,
                      data[i].gongwei_id,
                      data[i].column,
                      data[i].row,
                    ],
                    async (txn, resultns) => {
                      if (i == data.length - 1) {
                        props.navigation.push('InventoryReviewEditList');
                      }
                    },
                  );
                }
              },
            );
          }
        });
      } else {
        props.navigation.push('InventoryReviewEditList');
      }
    }
  };

  const gongweiInputChange = (e) => {
    var inp = e.nativeEvent.key;
    SoundObject.playSound(inp);
  };

  const soundplaycontrol = async (value) => {
    if (gongwei.length < value.length && value[value.length - 2] == value[value.length - 1]) {
      SoundObject.playSound('alert');
    }
    setGongwei(value.replace(/[^0-9]/g, ''));
  };

  const BackBtnPress = () => {
    props.navigation.push('Inventory');
  };

  return (
    <>
      {openScan && <QRcodeScanScreen skuScanOK={(val) => {
        setGongwei(val);
        setOpenScan(false);
      }} skuScanCancel={() => setOpenScan(false)} />}
      <View style={{ position: 'relative', height: Dimensions.get('window').height }}>
        <Header {...props} BtnPress={BackBtnPress} title={'盘点复查'} />

        <View style={{ flex: 1, position: 'relative' }}>
          <View style={{ justifyContent: 'center', flexDirection: 'row', paddingHorizontal: 30, paddingVertical: 10 }}>
            <Text style={CStyles.TextStyle}>工位:</Text>
            <TextInput
              value={gongwei}
              autoFocus={true}
              keyboardType="numeric"
              onChangeText={soundplaycontrol}
              onKeyPress={gongweiInputChange}
              placeholder={''}
              style={CStyles.InputStyle}
              maxLength={15}
            />
            <Button
              ButtonTitle={'扫描'}
              BtnPress={() => setOpenScan(true)}
              type={'yellowBtn'}
              BTnWidth={70}
            />
          </View>
          <View
            style={{
              marginTop: 10,
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row',
            }}
          >
            <Button
              ButtonTitle={'下一步'}
              BtnPress={() => toNextStep()}
              type={'blueBtn'}
              BTnWidth={320}
            />
          </View>
        </View>
      </View>
    </>
  );
}

export default InventoryReview;
