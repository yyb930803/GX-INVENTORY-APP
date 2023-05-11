import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { View, FlatList, Text, StyleSheet, TouchableOpacity, Alert, Dimensions, TextInput } from 'react-native';
import ApiObject from '../../../support/Api';
import Header from '../../../components/Header';
import DropBox from '../../../components/DropBox';
import CStyles from '../../../styles/CommonStyles';
import { DB, tbName, insertDifferenceSurvey } from '../../../hooks/dbHooks';
import { PROGRAM_NAME } from '../../../constants';
import { setDiffBia, setDiffCommodity, setDiffPhotos, setMistakes, setScreenLoading } from '../../../reducers/BaseReducer';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const DifferenceSurvey = (props) => {
  const dispatch = useDispatch();
  const { user, project } = useSelector((state) => state.base);
  const { categoryMasterTb } = tbName(user.id);

  const [firstlistData, setFirstlistData] = useState([]);
  const [flatListData, setFlatListData] = useState([]);

  const [diffCode, setDiffCode] = useState('');

  const [category, setCategory] = useState('all');
  const [categoryList, setCategoryList] = useState([]);
  const [categoryListOpen, setCategoryListOpen] = useState(false);

  const [diffType, setDiffType] = useState('all');
  const [diffTypeList, setDiffTypeList] = useState([
    { label: '全部', value: 'all' },
    { label: '盘盈', value: 'surplus' },
    { label: '盘亏', value: 'deficit' },
  ]);
  const [diffTypeListOpen, setDiffTypeListOpen] = useState(false);

  const [sortBase, setSortBase] = useState('commodity_code');

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    search();
  }, [category, diffCode, diffType, firstlistData, sortBase]);

  const init = async () => {
    DB.transaction((tx) => {
      tx.executeSql(
        `SELECT * from ${categoryMasterTb}`,
        [],
        async (tx, results) => {
          let list = [{ label: '全部', value: 'all' }];
          for (let i = 0; i < results.rows.length; i++) {
            let temp = {};
            temp.label = results.rows.item(i).a_category_name;
            temp.value = results.rows.item(i).a_category_code;
            list.push(temp);
          }
          setCategoryList(list);
        }
      )
    });

    var result = await ApiObject.getCodelist({ qrcode: project.qrcode });
    if (result !== null) {
      setFirstlistData(result);
    }
  };

  const search = async () => {
    let tempList = [];
    tempList = await inputCategoryChange();
    tempList = await inputDiffTypeChange(tempList);
    tempList = await inputDiffCodeChange(tempList);
    result = await sortData(tempList);
    setFlatListData(result);
  }

  const inputCategoryChange = () => {
    var tempList = [];

    if (category == 'all') {
      tempList = firstlistData;
    } else {
      for (let index = 0; index < firstlistData.length; index++) {
        if (firstlistData[index].major_code == category) {
          tempList.push(firstlistData[index]);
        }
      }
    }

    return tempList;
  };

  const inputDiffTypeChange = (data) => {
    let tempList = [];

    if (diffType == "all") {
      tempList = data;
    } else if (diffType == "deficit") {
      const result = data.filter(item => parseFloat(item.diff_count).toFixed(2) < 0);
      tempList = result.reverse();
    } else if (diffType == "surplus") {
      const result = data.filter(item => parseFloat(item.diff_count).toFixed(2) > 0);
      tempList = result.reverse();
    }

    return tempList;
  }

  const inputDiffCodeChange = (data) => {
    let tempList = [];

    if (diffCode !== "") {
      const result = data.filter(item => item.commodity_code.includes(diffCode));
      tempList = result.reverse();
    } else {
      tempList = data;
    }

    return tempList;
  };

  const BackBtnPress = () => {
    props.navigation.push('Inventory');
  };

  const completeDiffBtn = () => {
    Alert.alert(
      PROGRAM_NAME,
      '它已经完成了。',
      [{ text: '是(Y)', onPress: () => { } }],
      { cancelable: false },
    );
  };

  const otherUserDiffBtn = () => {
    Alert.alert(
      PROGRAM_NAME,
      '另一个用户正在调查。',
      [{ text: '是(Y)', onPress: () => { } }],
      { cancelable: false },
    );
  };

  const sortData = async (list) => {
    var firstArray = [];
    var secondArray = [];
    var thirdArray = [];
    var fourthArray = [];
    var fifthArray = [];
    for (let index = 0; index < list.length; index++) {
      let item = list[index];
      if (item.user_id == null && item.diff_user_id == null) firstArray.push(item);
      else if (item.user_id == null && item.diff_user_id != null && item.diff_user_id == user.id) secondArray.push(item);
      else if (item.user_id == null && item.diff_user_id != null && item.diff_user_id != user.id) thirdArray.push(item);
      else if (item.user_id != null && item.user_id == user.id) fourthArray.push(item);
      else if (item.user_id != null && item.user_id != user.id) fifthArray.push(item);
    }
    if (sortBase === 'commodity_code') {
      firstArray.sort((a, b) => a.commodity_code.localeCompare(b.commodity_code));
      secondArray.sort((a, b) => a.commodity_code.localeCompare(b.commodity_code));
      thirdArray.sort((a, b) => a.commodity_code.localeCompare(b.commodity_code));
      fourthArray.sort((a, b) => a.commodity_code.localeCompare(b.commodity_code));
      fifthArray.sort((a, b) => a.commodity_code.localeCompare(b.commodity_code));
    }
    if (sortBase === 'commodity_name') {
      firstArray.sort((a, b) => (a.commodity_name ?? '').localeCompare(b.commodity_name));
      secondArray.sort((a, b) => (a.commodity_name ?? '').localeCompare(b.commodity_name));
      thirdArray.sort((a, b) => (a.commodity_name ?? '').localeCompare(b.commodity_name));
      fourthArray.sort((a, b) => (a.commodity_name ?? '').localeCompare(b.commodity_name));
      fifthArray.sort((a, b) => (a.commodity_name ?? '').localeCompare(b.commodity_name));
    }
    if (sortBase === 'diff_count') {
      firstArray.sort((a, b) => a.diff_count - b.diff_count);
      secondArray.sort((a, b) => a.diff_count - b.diff_count);
      thirdArray.sort((a, b) => a.diff_count - b.diff_count);
      fourthArray.sort((a, b) => a.diff_count - b.diff_count);
      fifthArray.sort((a, b) => a.diff_count - b.diff_count);
    }
    if (sortBase === 'diff_amount') {
      firstArray.sort((a, b) => a.diff_amount - b.diff_amount);
      secondArray.sort((a, b) => a.diff_amount - b.diff_amount);
      thirdArray.sort((a, b) => a.diff_amount - b.diff_amount);
      fourthArray.sort((a, b) => a.diff_amount - b.diff_amount);
      fifthArray.sort((a, b) => a.diff_amount - b.diff_amount);
    }
    var data = fifthArray.concat(fourthArray, thirdArray, secondArray, firstArray);
    return data;
  }

  const toNewNextEdit = async (index) => {
    dispatch(setScreenLoading(true));

    var data = await ApiObject.getSKUlist({ commodity_code: flatListData[index].commodity_code, qrcode: project.qrcode });

    if (data !== null) {
      insertDifferenceSurvey(user.id, data);

      dispatch(setDiffCommodity(flatListData[index]));

      let photos = flatListData[index].diff_photo !== null ? JSON.parse(flatListData[index].diff_photo).map((photo) => ({ imageUrl: photo, imageStr: '' })) : [];
      dispatch(setDiffPhotos(photos));

      let mistakes = flatListData[index].diff_cause_id !== null ? JSON.parse(flatListData[index].diff_cause_id) : [];
      dispatch(setMistakes(mistakes));

      dispatch(setDiffBia(flatListData[index].diff_bia));

      props.navigation.push('DifferenceSurveyEdit');
    }

    dispatch(setScreenLoading(false));
  };

  const renderDiffDataView = ({ item, index }) => {
    return (
      <View style={styles.container}>
        <Text style={[styles.title, { flex: 2 }]}>{item.commodity_code}</Text>
        <Text style={[styles.title, { flex: 3 }]}>{item.commodity_name ?? "不在档"}</Text>
        <Text style={[styles.title, { flex: 2 }]}>{item.diff_count}</Text>
        <Text style={[styles.title, { flex: 2 }]}>{item.diff_amount}</Text>

        <View style={[styles.title, { flex: 1 }]}>
          {item.user_id == null && item.diff_user_id == null ? (
            <TouchableOpacity
              onPress={() => toNewNextEdit(index)}
              style={{ alignItems: 'center', justifyContent: 'center' }}
            >
              <View style={styles.editBtn}>
                <Text style={styles.btnText}>调查</Text>
              </View>
            </TouchableOpacity>
          ) : item.user_id == null && item.diff_user_id != null && item.diff_user_id == user.id ? (
            <TouchableOpacity
              onPress={() => toNewNextEdit(index)}
              style={{ alignItems: 'center', justifyContent: 'center' }}
            >
              <View style={styles.meProgressBtn}>
                <Text style={styles.btnText}>完成</Text>
              </View>
            </TouchableOpacity>
          ) : item.user_id == null && item.diff_user_id != null && item.diff_user_id != user.id ? (
            <TouchableOpacity
              onPress={() => completeDiffBtn()}
              style={{ alignItems: 'center', justifyContent: 'center' }}
            >
              <View style={styles.completeBtn}>
                <Text style={styles.btnText}>完成</Text>
              </View>
            </TouchableOpacity>
          ) : item.user_id != null && item.user_id == user.id ? (
            <TouchableOpacity
              onPress={() => toNewNextEdit(index)}
              style={{ alignItems: 'center', justifyContent: 'center' }}
            >
              <View style={styles.meProgressBtn}>
                <Text style={styles.btnText}>进行</Text>
              </View>
            </TouchableOpacity>
          ) : item.user_id != null && item.user_id != user.id ? (
            <TouchableOpacity
              onPress={() => otherUserDiffBtn()}
              style={{ alignItems: 'center', justifyContent: 'center' }}
            >
              <View style={styles.progressBtn}>
                <Text style={styles.btnText}>进行</Text>
              </View>
            </TouchableOpacity>
          ) : <></>}
        </View>
      </View>
    )
  };

  return (
    <View style={{ position: 'relative', height: Dimensions.get('screen').height }}>
      <Header {...props} BtnPress={BackBtnPress} title={'差异调查'} />

      <View style={{ flex: 1 }}>
        <View style={{ justifyContent: 'center', flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 3 }}>
          <Text style={{ ...CStyles.TextStyle, textAlign: 'right' }}>商品类别:</Text>
          <DropBox
            zIndex={3000}
            zIndexInverse={1000}
            open={categoryListOpen}
            setOpen={setCategoryListOpen}
            value={category}
            setValue={setCategory}
            items={categoryList}
            setItems={setCategoryList}
            searchable={true}
            listMode='MODAL'
          />

          <Text style={{ ...CStyles.TextStyle, textAlign: 'right' }}>盈亏:</Text>
          <DropBox
            zIndex={2000}
            zIndexInverse={2000}
            open={diffTypeListOpen}
            setOpen={setDiffTypeListOpen}
            value={diffType}
            setValue={setDiffType}
            items={diffTypeList}
            setItems={setDiffTypeList}
            searchable={true}
            listMode='MODAL'
          />
        </View>

        <View style={{ justifyContent: 'center', flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 3 }}>
          <Text style={CStyles.TextStyle}>商品编码:</Text>
          <TextInput
            value={diffCode}
            autoFocus={false}
            keyboardType="numeric"
            onChangeText={setDiffCode}
            placeholder={''}
            style={CStyles.InputStyle}
          />
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          <Text style={{ ...CStyles.TxTStyle, marginRight: 20 }}>
            差异调查总数: {firstlistData.length}
          </Text>
          <Text style={CStyles.TxTStyle}>
            差异调查搜索数: {flatListData.length}
          </Text>
        </View>

        <View style={styles.container}>
          <Text style={[styles.head, { flex: 2, height: 35 }]} onPress={() => setSortBase('commodity_code')}>
            商品编码{sortBase === 'commodity_code' && <Icon name="chevron-down" size={10} color="black" />}
          </Text>
          <Text style={[styles.head, { flex: 3, height: 35 }]} onPress={() => setSortBase('commodity_name')}>
            商品名称{sortBase === 'commodity_name' && <Icon name="chevron-down" size={10} color="black" />}
          </Text>
          <Text style={[styles.head, { flex: 2, height: 35 }]} onPress={() => setSortBase('diff_count')}>
            差异数量{sortBase === 'diff_count' && <Icon name="chevron-down" size={10} color="black" />}
          </Text>
          <Text style={[styles.head, { flex: 2, height: 35 }]} onPress={() => setSortBase('diff_amount')}>
            差异金额{sortBase === 'diff_amount' && <Icon name="chevron-down" size={10} color="black" />}
          </Text>
          <Text style={[styles.head, { flex: 1, height: 35 }]}>
            运作
          </Text>
        </View>
        <FlatList
          vertical={true}
          showsHorizontalScrollIndicator={true}
          showsVerticalScrollIndicator={true}
          persistentScrollbar={true}
          scrollEnabled={true}
          scrollbar
          data={flatListData}
          renderItem={renderDiffDataView}
          keyExtractor={(item, index) => index + `${item.id}`}
          removeClippedSubviews={false}
          style={{ marginBottom: 50 }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingLeft: 10,
    paddingRight: 10,
    flexDirection: 'row',
  },

  head: {
    padding: 3,
    height: 30,
    borderWidth: 1,
    borderColor: '#9f9f9f',
    marginTop: 10,
    backgroundColor: '#f1f8ff',
    fontSize: 10,
    textAlign: 'center',
    textAlignVertical: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },

  title: {
    padding: 3,
    borderWidth: 1,
    borderColor: '#9f9f9f',
    textAlign: 'center',
    fontSize: 10,
    backgroundColor: '#f6f8fa',
    textAlignVertical: 'center',
  },

  completeBtn: {
    backgroundColor: '#f8022e',
    borderRadius: 5,
  },

  progressBtn: {
    backgroundColor: '#0000ff',
    borderRadius: 5,
  },

  meProgressBtn: {
    backgroundColor: '#00f0f0',
    borderRadius: 5,
  },

  editBtn: {
    backgroundColor: '#F8B502',
    borderRadius: 5,
  },

  btnText: {
    textAlign: 'center',
    fontSize: 10,
    padding: 5,
    color: '#fff',
  },
});

export default DifferenceSurvey;
