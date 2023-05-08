import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { StyleSheet, View, Text, Alert, TextInput, Dimensions } from 'react-native';
import uuid from 'react-native-uuid';
import Button from '../../../components/Button';
import Header from '../../../components/Header';
import CalculatorScreen from '../../../components/CalculatorScreen';
import QRcodeScanScreen from '../../../components/QRcodeScanScreen';
import CStyles from '../../../styles/CommonStyles';
import FooterBar3 from '../../../components/FooterBar3';
import { PROGRAM_NAME, SCAN_INPUT, HAND_INPUT } from '../../../constants';
import { setScreenLoading } from '../../../reducers/BaseReducer';
import { DB, tbName, pipeiSKU } from '../../../hooks/dbHooks';
import SoundObject from '../../../utils/sound';
import DiffEndModal from '../../../components/DiffEndModal';

const DifferenceSurveyAdd = (props) => {
  const dispatch = useDispatch();
  const { user, project } = useSelector(state => state.base);
  const { differenceSurveyTb, gongweiMasterTb } = tbName(user.id);

  const [scanScreen, setScanScreen] = useState(false);
  const [calScreen, setCalScreen] = useState(false);

  const [count, setCount] = useState('');
  const [commoditySku, setCommoditySku] = useState('');
  const [pihao, setPihao] = useState('');
  const [codeInputMethod, setCodeInputMethod] = useState(SCAN_INPUT);

  const [pianqu, setPianqu] = useState('');
  const [gongwei, setGongwei] = useState('');
  const [row, setRow] = useState('');
  const [column, setColumn] = useState('');

  const [gongweiId, setGongweiId] = useState(0);
  const [pipeiItem, setPipeiItem] = useState({});

  const [quantityClose, setQuantityClose] = useState(true);

  const [skuInputFocus, setSkuInputFocus] = useState(true);
  const [countInputFocus, setCountInputFocus] = useState(false);
  const [rowInputFocus, setRowInputFocus] = useState(false);
  const [gongweiInputFocus, setGongweiInputFocus] = useState(false);
  const [columnInputFocus, setColumnInputFocus] = useState(false);

  const [pipeiStatus, setPipeiStatus] = useState(false);
  const [confirm, setConfirm] = useState(false);

  const [endModalOpen, setEndModalOpen] = useState(false);

  const skuRef = useRef(null);
  const countRef = useRef(null);
  const rowRef = useRef(null);
  const gongweiRef = useRef(null);
  const columnRef = useRef(null);

  useEffect(() => {
    dispatch(setScreenLoading(true));

    if (project.quantity_min == project.quantity_max) {
      setCount(project.quantity_min);
    }

    dispatch(setScreenLoading(false));
  }, []);

  useEffect(() => {
    countChanged();
  }, [count]);

  useEffect(() => {
    if (countInputFocus && !pipeiStatus) {
      pipei();
    }
  }, [countInputFocus]);

  useEffect(() => {
    if (rowInputFocus && !pipeiStatus) {
      pipei();
    }
  }, [rowInputFocus]);

  useEffect(() => {
    if (gongweiInputFocus && !pipeiStatus) {
      pipei();
    }
  }, [gongweiInputFocus]);

  useEffect(() => {
    if (columnInputFocus && !pipeiStatus) {
      pipei();
    }
  }, [columnInputFocus]);

  useEffect(() => {
    setPipeiStatus(false);
  }, [commoditySku]);

  useEffect(() => {
    if (commoditySku !== '') {
      setPipeiStatus(true);
    }
  }, [pipeiItem]);

  useEffect(() => {
    DB.transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM ${gongweiMasterTb} WHERE "gongwei" = ?`,
        [Number(gongwei)],
        (tx, results) => {
          if (results.rows.length === 0) {
            setPianqu('');
            setGongweiId(0);
          } else {
            setPianqu(results.rows.item(0).pianqu);
            setGongweiId(results.rows.item(0).id);
          }
        },
      );
    });
  }, [gongwei]);

  useEffect(() => {
    if (pipeiStatus && commoditySku !== '' && Number(count) !== 0 && count !== '' && Number(row) !== 0 && row !== '' && gongwei !== '' && pianqu !== '' && column !== '') {
      setConfirm(true);
    } else {
      setConfirm(false);
    }
  }, [commoditySku, count, row, pipeiStatus, gongwei, pianqu, column]);

  useEffect(() => {
    if (commoditySku.indexOf('\n') !== -1) {
      setCommoditySku(commoditySku.replace(/\n/g, ""));
      countRef.current.focus();
    }
  }, [commoditySku]);

  const countChanged = () => {
    if (Number(count) !== 0 && count !== '' && (Number(count) > project.quantity_max || Number(count) < project.quantity_min)) {
      if (quantityClose) {
        SoundObject.playSound('alert');
        Alert.alert(
          PROGRAM_NAME,
          '输入的数量超出设置范围。 是否要输入超出设置范围的数量？',
          [
            {
              text: '不(N)',
              onPress: () => {
                setCount('');
                countRef.current.focus();
              },
              style: 'cancel'
            },
            {
              text: '是(Y)',
              onPress: () => setQuantityClose(false),
            },
          ],
          { cancelable: false },
        );
      }
    }
  };

  const countCalFunc = (val) => {
    setCount(val);
    setCalScreen(false);
  }

  const countInputChange = (e) => {
    var inp = e.nativeEvent.key;
    SoundObject.playSound(inp);
  };

  const skuScanOKFunc = (val) => {
    setCommoditySku(val);
    setCodeInputMethod(SCAN_INPUT);
    countRef.current.focus();
    setScanScreen(false);
  }

  const skuScanCancelFunc = () => {
    skuRef.current.focus();
    setScanScreen(false);
  }

  const skuHandFunc = (val) => {
    setCommoditySku(val);
    setCodeInputMethod(HAND_INPUT);
  }

  const pipei = async () => {
    if (commoditySku == '') {
      Alert.alert(
        PROGRAM_NAME,
        '请正确输入SKU和数量置信息。',
        [{ text: '是(OK)', onPress: () => skuRef.current.focus() }],
        { cancelable: false },
      );
    } else {
      let result = await pipeiSKU(commoditySku, user.id);
      if (result !== null) {
        setPipeiItem(result);
        if (project.quantity_min == project.quantity_max) {
          gongweiRef.current.focus();
        }
      } else {
        Alert.alert(
          PROGRAM_NAME,
          '条形码不存在',
          [
            {
              text: '不(N)', onPress: () => {
                skuRef.current.focus()
              }, style: 'cancel'
            },
            {
              text: '是(Y)',
              onPress: () => {
                if (project.quantity_min == project.quantity_max) {
                  setPipeiStatus(true);
                  gongweiRef.current.focus();
                }
              },
            },
          ],
          { cancelable: false },
        );
      }
    }
  }

  const screenNavigate = (id) => {
    if (id == 1) {
      props.navigation.push('DifferenceSurveyAdd');
    } else if (id == 2) {
      props.navigation.push('DifferenceSurveyEdit');
    } else if (id == 3) {
      props.navigation.push('DifferenceSurveyDelete');
    }
  };

  const insertRow = () => {
    var date = new Date();
    var scantime =
      [date.getFullYear(), date.getMonth() + 1, date.getDate()].join('-') +
      ' ' +
      [date.getHours(), date.getMinutes(), date.getSeconds()].join(':');
    DB.transaction((tx) => {
      tx.executeSql(
        `INSERT INTO ${differenceSurveyTb} ( 
          "commodity_sku", 
          "commodity_price", 
          "pihao", 
          "codeinput_method",  
          "count", 
          "column", 
          "row",
          "upload",
          "scan_time", 
          "gongwei_id",
          "delete_flag",
          "record_id"
          ) VALUES (?,?,?,?,?,?,?,"new",?,?,?,?)`,
        [
          commoditySku,
          pipeiItem.commodity_price ?? 0,
          pihao,
          codeInputMethod,
          count,
          column,
          row,
          scantime,
          gongweiId,
          0,
          uuid.v4()
        ],
        (tx, results) => {
          setCommoditySku('');
          if (project.quantity_min == project.quantity_max) {
            setCount(project.quantity_min);
          }
          setGongwei('');
          setRow('');
          setColumn('');
          setPihao('');
          setPipeiItem({});
          setCodeInputMethod(SCAN_INPUT);
          setQuantityClose(true);
        },
      );
    });
    skuRef.current.focus();
  };

  const BackBtnPress = async () => {
    setEndModalOpen(true);
  };

  return (
    <>
      {calScreen && <CalculatorScreen closeCal={countCalFunc} cancel={() => setCalScreen(false)} />}
      {scanScreen && <QRcodeScanScreen skuScanOK={skuScanOKFunc} skuScanCancel={skuScanCancelFunc} />}
      <View style={{ position: 'relative', height: Dimensions.get('window').height }}>
        <Header {...props} BtnPress={BackBtnPress} title={'差异调查'} />

        <View style={{ flex: 1 }}>
          <View style={{ justifyContent: 'center', flexDirection: 'row', paddingHorizontal: 30, paddingVertical: 10 }}>
            <Text style={{ ...CStyles.TextStyle, width: 25, textAlign: 'right' }}>SKU:</Text>
            <TextInput
              ref={skuRef}
              value={commoditySku}
              autoFocus={true}
              onBlur={() => setSkuInputFocus(false)}
              onFocus={() => setSkuInputFocus(true)}
              onChangeText={skuHandFunc}
              placeholder={''}
              selectTextOnFocus={true}
              style={CStyles.InputStyle}
              multiline={true}
            />
            <Button
              disabled={!skuInputFocus}
              ButtonTitle={'匹配'}
              BtnPress={pipei}
              type={'blueBtn'}
              BTnWidth={100}
            />
          </View>

          <View style={{ justifyContent: 'center', flexDirection: 'row' }}>
            <Button
              disabled={!skuInputFocus}
              ButtonTitle={'扫描'}
              BtnPress={() => setScanScreen(true)}
              type={'yellowBtn'}
              BTnWidth={300}
            />
          </View>

          <View style={{ justifyContent: 'center', flexDirection: 'row', paddingHorizontal: 30, paddingVertical: 10 }}>
            <Text style={{ ...CStyles.TextStyle, width: 25, textAlign: 'right' }}>数量:</Text>
            <TextInput
              ref={countRef}
              value={count.toString()}
              keyboardType={'numeric'}
              autoFocus={false}
              onBlur={() => setCountInputFocus(false)}
              onFocus={() => setCountInputFocus(true)}
              onChangeText={(val) => setCount(val.replace(/[^0-9]/g, ''))}
              placeholder={''}
              onKeyPress={countInputChange}
              style={CStyles.InputStyle}
            />
            <Button
              disabled={!countInputFocus}
              ButtonTitle={'计算机'}
              BtnPress={() => setCalScreen(true)}
              type={'yellowBtn'}
              BTnWidth={100}
            />
          </View>

          {/* {project.pihao && (
            <View style={{ marginLeft: 5 }}>
              <InputText
                refName={(ref) => {
                  // pihaoRef = ref;
                }}
                inputValue={pihao}
                // autoFocus={countPihao}
                inputChange={(pihao) => {
                  setPihao(pihao);
                }}
                InputTitle={'批号'}
                InputTXTWidth={300}
                type={'Disp'}
                placeholder={''}
              />
            </View>
          )} */}

          <View style={{ justifyContent: 'center', flexDirection: 'row', paddingHorizontal: 30, paddingBottom: 10 }}>
            <Text style={{ ...CStyles.TextStyle, width: 25, textAlign: 'right' }}>工位:</Text>
            <TextInput
              ref={gongweiRef}
              value={gongwei.toString()}
              keyboardType={'numeric'}
              autoFocus={false}
              onBlur={() => setGongweiInputFocus(false)}
              onFocus={() => setGongweiInputFocus(true)}
              onChangeText={(val) => setGongwei(val.replace(/[^0-9]/g, ''))}
              placeholder={''}
              onKeyPress={() => { }}
              style={CStyles.InputStyle}
            />
            <Text style={{ ...CStyles.TextStyle, width: 100, textAlign: 'left' }}>/ 区域:  {pianqu}</Text>
          </View>

          <View style={{ justifyContent: 'center', flexDirection: 'row', paddingHorizontal: 30, paddingBottom: 10 }}>
            <Text style={{ ...CStyles.TextStyle, width: 25, textAlign: 'right' }}>层:</Text>
            <TextInput
              ref={rowRef}
              value={row.toString()}
              keyboardType={'numeric'}
              autoFocus={false}
              onBlur={() => setRowInputFocus(false)}
              onFocus={() => setRowInputFocus(true)}
              onChangeText={(val) => setRow(val.replace(/[^0-9]/g, ''))}
              placeholder={''}
              onKeyPress={() => { }}
              style={CStyles.InputStyle}
            />
            <Text style={{ ...CStyles.TextStyle, width: 100, textAlign: 'left' }}></Text>
          </View>

          <View style={{ justifyContent: 'center', flexDirection: 'row', paddingHorizontal: 30, paddingBottom: 10 }}>
            <Text style={{ ...CStyles.TextStyle, width: 25, textAlign: 'right' }}>列:</Text>
            <TextInput
              ref={columnRef}
              value={column.toString()}
              keyboardType={'numeric'}
              autoFocus={false}
              onBlur={() => setColumnInputFocus(false)}
              onFocus={() => setColumnInputFocus(true)}
              onChangeText={(val) => setColumn(val.replace(/[^0-9]/g, ''))}
              placeholder={''}
              onKeyPress={() => { }}
              style={CStyles.InputStyle}
            />
            <Text style={{ ...CStyles.TextStyle, width: 100, textAlign: 'left' }}></Text>
          </View>

          <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'center' }}>
            <Button
              disabled={!confirm}
              ButtonTitle={'记录数据'}
              BtnPress={() => insertRow()}
              type={'yellowBtn'}
              BTnWidth={300}
            />
          </View>

          <View style={{ marginTop: 20 }}>
            <View style={styles.container}>
              <Text style={{ ...styles.cell, flex: 1 }}>商品名称</Text>
              <Text style={{ ...styles.cell, flex: 3 }}>{pipeiItem?.commodity_name}</Text>
            </View>
            <View style={styles.container}>
              <Text style={{ ...styles.cell, flex: 1 }}>价搭</Text>
              <Text style={{ ...styles.cell, flex: 3 }}>{pipeiItem.commodity_price ? (parseFloat(pipeiItem.commodity_price).toFixed(2).toString()) + '元' : ''}</Text>
            </View>
            <View style={styles.container}>
              <Text style={{ ...styles.cell, flex: 1 }}>类别No</Text>
              <Text style={{ ...styles.cell, flex: 3 }}>{pipeiItem?.major_code}</Text>
            </View>
            <View style={styles.container}>
              <Text style={{ ...styles.cell, flex: 1 }}>类别名</Text>
              <Text style={{ ...styles.cell, flex: 3 }}>{pipeiItem?.a_category_name}</Text>
            </View>
            <View style={styles.container}>
              <Text style={{ ...styles.cell, flex: 1 }}>规格</Text>
              <Text style={{ ...styles.cell, flex: 3 }}>{pipeiItem?.size_code}</Text>
            </View>
            <View style={styles.container}>
              <Text style={{ ...styles.cell, flex: 1 }}>单位</Text>
              <Text style={{ ...styles.cell, flex: 3 }}>{pipeiItem?.unit}</Text>
            </View>
          </View>
        </View>

        <FooterBar3 screenNavigate={screenNavigate} activeBtn={1} />

        {endModalOpen && (
          <DiffEndModal setEndModalOpen={setEndModalOpen} navigation={props.navigation} />
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'center',
  },

  cell: {
    height: 25,
    lineHeight: 25,
    borderWidth: 1,
    borderColor: '#9f9f9f',
    backgroundColor: '#f1f8ff',
    fontSize: 10,
    textAlign: 'center',
  },
});

export default DifferenceSurveyAdd;
