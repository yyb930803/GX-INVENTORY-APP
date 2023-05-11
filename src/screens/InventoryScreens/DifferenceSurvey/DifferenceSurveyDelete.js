import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { View, Text, TouchableOpacity, TextInput, Dimensions, ScrollView, Alert, FlatList, StyleSheet } from 'react-native';
import ApiObject from '../../../support/Api';
import Button from '../../../components/Button';
import Header from '../../../components/Header';
import FooterBar3 from '../../../components/FooterBar3';
import DropBox from '../../../components/DropBox';
import CStyles from '../../../styles/CommonStyles';
import CommonStyles from '../../../styles/CommonStyles';
import { setDiffPhotos, setMistakes, setDiffBia } from '../../../reducers/BaseReducer';
import UserImgCameraCapture from '../../../components/UserImgCameraCapture';
import SignCapture from '../../../components/SignCapture';
import DiffEndModal from '../../../components/DiffEndModal';
import { PROGRAM_NAME } from '../../../constants';
import { DB, tbName } from '../../../hooks/dbHooks';

const DifferenceSurveyDelete = (props) => {
  const dispatch = useDispatch();
  const { user, project, diffCommodity, diffPhotos, mistakes, diffBia, sign1, sign2, sign3 } = useSelector((state) => state.base);
  const { differenceSurveyTb } = tbName(user.id);

  const [count, setCount] = useState('');

  const [mistake, setMistake] = useState(1);
  const [mistakeList, setMistakeList] = useState([]);
  const [mistakeListOpen, setMistakeListOpen] = useState(false);

  const [endModalOpen, setEndModalOpen] = useState(false);

  const [sumCount, setSumCount] = useState(0);

  useEffect(() => {
    getMistakeList();
    getSumCount();
  }, []);

  const getSumCount = () => {
    DB.transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM ${differenceSurveyTb} WHERE delete_flag = 0`,
        [],
        (tx, results) => {
          var diff_PDCount = 0;
          for (let i = 0; i < results.rows.length; i++) {
            diff_PDCount = diff_PDCount + results.rows.item(i).count;
          }

          setSumCount(diff_PDCount);
        },
      );
    });
  }

  const getMistakeList = async () => {
    var list = [];
    var data = await ApiObject.getDiffCausesList({ qrcode: project.qrcode });
    if (data !== null) {
      for (let i = 0; i < data.length; i++) {
        var temp = {};
        const element = data[i];

        var label
        if (element.type == 0) {
          label = "可还原:" + element.name
        } else if (element.type == 1) {
          label = "不可还原:" + element.name
        } else {
          label = element.name
        }

        temp.label = label;
        temp.value = element.id;

        list.push(temp);
      }
      setMistakeList(list);
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

  const changeDiffPhoto = (val, index) => {
    const newDiffPhotos = diffPhotos.map((item, i) => {
      if (index === i) {
        return { imageUrl: item.imageUrl, imageStr: val };
      }
      return item;
    });
    dispatch(setDiffPhotos(newDiffPhotos));
  };

  const addDiffPhoto = (val) => {
    const newDiffPhoto = { imageUrl: '', imageStr: val };
    const newDiffPhotos = [...diffPhotos, newDiffPhoto];
    dispatch(setDiffPhotos(newDiffPhotos));
  }

  const BackBtnPress = () => {
    setEndModalOpen(true);
  };

  const photoDel = (index) => {
    Alert.alert(
      PROGRAM_NAME,
      '你确定你要删除？',
      [
        {
          text: '是(Y)', onPress: () => {
            const newDiffPhotos = diffPhotos.filter((item, i) => i !== index);
            dispatch(setDiffPhotos(newDiffPhotos));
          }
        },
        { text: '不(N)', onPress: () => { } },
      ],
      { cancelable: false },
    );
  }

  const addMistake = () => {
    if (count !== '' && Number(count) !== 0) {
      dispatch(setMistakes([...mistakes, { id: mistake, count: Number(count) }]));
      setMistake(1);
      setCount('');
    }
  }

  const delMistake = (index) => {
    const newMistakes = mistakes.filter((item, i) => i !== index);
    dispatch(setMistakes(newMistakes));
  }

  const renderMistakeView = ({ item, index }) => (
    <View style={styles.container} key={index}>
      <Text style={[styles.title, { flex: 3, textAlignVertical: 'center' }]}>
        {mistakeList?.find(m => m?.value == item?.id)?.label}
      </Text>
      <Text style={[styles.title, { flex: 1, textAlignVertical: 'center' }]}>
        {item.count}
      </Text>
      <View style={[styles.title, { flex: 1, alignItems: 'center', flexDirection: 'row', justifyContent: 'center' }]}>
        <TouchableOpacity
          onPress={() => delMistake(index)}
        >
          <View style={styles.deleteBtn}>
            <Text style={styles.btnText}>删除</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={{ position: 'relative', height: Dimensions.get('window').height }}>
      <Header {...props} BtnPress={BackBtnPress} title={'差异调查'} />

      <ScrollView style={{ flex: 1 }}>
        <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
          <View style={{ flexDirection: 'row' }}>
            <Text style={CommonStyles.txt_Style1}>商品码: {diffCommodity.commodity_code}</Text>
            <Text style={CommonStyles.txt_Style1}>商品价格： {diffCommodity.commodity_price}</Text>
          </View>

          <View style={{ flexDirection: 'row' }}>
            <Text style={CommonStyles.txt_Style1}>商品名称： {diffCommodity.commodity_name}</Text>
          </View>

          <View style={{ flexDirection: 'row' }}>
            <Text style={CommonStyles.txt_Style1}>库存数量: {diffCommodity.expect_count}</Text>
            <Text style={CommonStyles.txt_Style1}>差异数量: {sumCount - diffCommodity.expect_count}</Text>
          </View>

          <View style={{ flexDirection: 'row' }}>
            <Text style={CommonStyles.txt_Style1}>盘点数量: {sumCount}</Text>
            <Text style={CommonStyles.txt_Style1}>差异金钱: {(Number(sumCount) - Number(diffCommodity.expect_count)) * (diffCommodity.commodity_price ? parseFloat(diffCommodity.commodity_price).toFixed(2) : 0)}</Text>
          </View>
        </View>

        <View style={styles.container}>
          <Text style={[styles.head, { flex: 3 }]}>错误原因</Text>
          <Text style={[styles.head, { flex: 1 }]}>数量</Text>
          <Text style={[styles.head, { flex: 1 }]}>操作</Text>
        </View>
        <FlatList
          vertical={true}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          data={mistakes}
          renderItem={renderMistakeView}
          keyExtractor={(item, index) => index + `${item.id}`}
          removeClippedSubviews={false}
        />

        <View style={{ alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20, paddingVertical: 10, flexDirection: 'row' }}>
          <Text style={{ ...CStyles.TextStyle, width: 45, textAlign: 'right' }}>错误原因:</Text>
          <DropBox
            zIndex={1000}
            zIndexInverse={1000}
            open={mistakeListOpen}
            setOpen={setMistakeListOpen}
            value={mistake}
            setValue={setMistake}
            items={mistakeList}
            setItems={setMistakeList}
            searchable={true}
            listMode='MODAL'
          />

          <Text style={CStyles.TextStyle}>数量:</Text>
          <TextInput
            value={count.toString()}
            keyboardType="numeric"
            onChangeText={(val) => setCount(val.replace(/[^0-9]/g, ''))}
            style={CStyles.InputStyle}
          />
        </View>

        <View style={{ alignItems: 'flex-end', paddingHorizontal: 30, paddingVertical: 0 }}>
          <TouchableOpacity
            onPress={() => addMistake()}
            style={{ backgroundColor: '#F8B502', alignItems: 'center', paddingVertical: 5, paddingHorizontal: 10, borderRadius: 15 }}
          >
            <Text style={{ color: 'white' }}>添加错误原因</Text>
          </TouchableOpacity>
        </View>

        <View style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row', marginVertical: 10, paddingHorizontal: 20 }}>
          <Text style={{ ...CStyles.TextStyle, width: 45, textAlign: 'right' }}>备注:</Text>
          <TextInput
            value={diffBia}
            onChangeText={(val) => dispatch(setDiffBia(val))}
            style={CStyles.InputStyle}
          />
        </View>

        <View style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row', paddingHorizontal: 20 }}>
          <View style={{ flexDirection: 'column' }}>
            <Text style={{ ...CStyles.TextStyle, textAlign: 'left', paddingLeft: 3 }}>商场员工:</Text>
            <SignCapture imageStr={sign1} imageUrl={diffCommodity.sign1} navigation={props.navigation} type={'sign1'} width={100} height={60} />
          </View>

          <View style={{ flexDirection: 'column', paddingLeft: 5 }}>
            <Text style={{ ...CStyles.TextStyle, textAlign: 'left', paddingLeft: 3 }}>公司员工:</Text>
            <SignCapture imageStr={sign2} imageUrl={diffCommodity.sign2} navigation={props.navigation} type={'sign2'} width={100} height={60} />
          </View>

          <View style={{ flexDirection: 'column', paddingLeft: 5 }}>
            <Text style={{ ...CStyles.TextStyle, textAlign: 'left', paddingLeft: 3 }}>盘点员:</Text>
            <SignCapture imageStr={sign3} imageUrl={diffCommodity.sign3} navigation={props.navigation} type={'sign3'} width={100} height={60} />
          </View>
        </View>

        <View style={{ flexDirection: 'column', paddingHorizontal: 30, paddingVertical: 5, marginTop: 10 }}>
          <Text style={{ ...CStyles.TextStyle, textAlign: 'left' }}>照片数据:</Text>
          {diffPhotos.map((item, index) => (
            <View key={index} style={{ paddingVertical: 5 }}>
              <UserImgCameraCapture imageStr={item.imageStr} imageUrl={item.imageUrl} setImageStr={(val) => changeDiffPhoto(val, index)} photoDel={() => photoDel(index)} />
            </View>
          ))}
          <View style={{ paddingVertical: 5 }}>
            <UserImgCameraCapture imageStr={''} imageUrl={''} setImageStr={(val) => addDiffPhoto(val)} />
          </View>
        </View>
      </ScrollView>

      <View style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row', paddingVertical: 10 }}>
        <Button
          ButtonTitle={'调查结束'}
          BtnPress={() => setEndModalOpen(true)}
          type={'blueBtn'}
          BTnWidth={250}
        />
      </View>

      <FooterBar3 screenNavigate={screenNavigate} activeBtn={3} />

      {endModalOpen && (
        <DiffEndModal setEndModalOpen={setEndModalOpen} navigation={props.navigation} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'center',
  },

  head: {
    padding: 2,
    paddingTop: 8,
    height: 30,
    borderWidth: 1,
    borderColor: '#9f9f9f',
    backgroundColor: '#f1f8ff',
    fontSize: 10,
    textAlign: 'center',
  },

  title: {
    padding: 2,
    borderWidth: 1,
    borderColor: '#9f9f9f',
    textAlign: 'center',
    fontSize: 10,
    backgroundColor: '#fff',
  },

  deleteBtn: {
    backgroundColor: '#f8022e',
    borderRadius: 2,
  },

  editBtn: {
    backgroundColor: '#012964',
    borderRadius: 4,
  },

  btnText: {
    padding: 2,
    textAlign: 'center',
    color: '#fff',
    fontSize: 10,
  },
});

export default DifferenceSurveyDelete;
