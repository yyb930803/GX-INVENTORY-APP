import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { View, FlatList, Text, Dimensions, StyleSheet, Alert, TextInput } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Button from '../../../components/Button';
import Header from '../../../components/Header';
import FooterBar3 from '../../../components/FooterBar3';
import CStyles from '../../../styles/CommonStyles';
import CommonStyles from '../../../styles/CommonStyles';
import { PROGRAM_NAME } from '../../../constants';
import { DB, tbName } from '../../../hooks/dbHooks';
import SoundObject from '../../../utils/sound';
import DiffEndModal from '../../../components/DiffEndModal';

const DifferenceSurveyEdit = (props) => {
  const { user, project, diffCommodity } = useSelector((state) => state.base);
  const { differenceSurveyTb, gongweiMasterTb } = tbName(user.id);
  const [flatListData, setFlatListData] = useState([]);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(0);
  const [newCount, setNewCount] = useState('');

  const [endModalOpen, setEndModalOpen] = useState(false);
  const [sumCount, setSumCount] = useState(0);

  useEffect(() => {
    getFlatListData();
    getSumCount();
  }, []);

  useEffect(() => {
    getSumCount();
  }, [flatListData]);

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

  const getFlatListData = async () => {
    DB.transaction((tx) => {
      tx.executeSql(
        `SELECT ${differenceSurveyTb}.*, ${gongweiMasterTb}.*  FROM ${differenceSurveyTb} LEFT JOIN ${gongweiMasterTb}
        ON ${gongweiMasterTb}.id = ${differenceSurveyTb}.gongwei_id`,
        [],
        (tx, results) => {
          let tableDataArray = [];

          for (let i = 0; i < results.rows.length; i++) {
            let item = {};

            item.commodity_sku = results.rows.item(i).commodity_sku;
            item.pianqu = results.rows.item(i).pianqu;
            item.gongwei = results.rows.item(i).gongwei.toString().padStart(project.gongwei_max, "0");
            item.row = results.rows.item(i).row;
            item.column = results.rows.item(i).column;
            item.count = results.rows.item(i).count;
            item.delete_flag = results.rows.item(i).delete_flag;
            item.record_id = results.rows.item(i).record_id;

            tableDataArray.push(item);
          }

          setFlatListData(tableDataArray);
        },
      );
    });
  };

  const BackBtnPress = () => {
    setEndModalOpen(true);
  };

  const screenNavigate = (id) => {
    if (id == 1) {
      props.navigation.push('DifferenceSurveyAdd');
    } else if (id == 2) {
      props.navigation.push('DifferenceSurveyEdit');
    } else if (id == 3) {
      props.navigation.push('DifferenceSurveyDelete');
    }
  };

  const editLayerConfirm = () => {
    if (newCount == "") {
      Alert.alert(
        PROGRAM_NAME,
        '请正确输入修改数量位置信息。',
        [{ text: '是(OK)', onPress: () => { } }],
        { cancelable: false },
      );
    } else if (Number(newCount) > project.quantity_max || Number(newCount) < project.quantity_min) {
      SoundObject.playSound('alert');

      Alert.alert(
        PROGRAM_NAME,
        '输入的数量超出设置范围。 是否要输入超出设置范围的数量？',
        [
          { text: '不(N)', onPress: () => setNewCount('') },
          { text: '是(Y)', onPress: () => editLayer() },
        ],
        { cancelable: false },
      );
    } else {
      editLayer();
    }
  }

  const editLayer = () => {
    var date = new Date();
    var scantime = [date.getFullYear(), date.getMonth() + 1, date.getDate()].join('-') + ' ' + [date.getHours(), date.getMinutes(), date.getSeconds()].join(':');

    DB.transaction(tx => {
      tx.executeSql(`UPDATE ${differenceSurveyTb} SET count = ? , delete_flag = 0, scan_time = ?, upload = ? where record_id = ?`,
        [parseInt(newCount), scantime, "new", flatListData[selectedRow].record_id],
        (tx, results) => {
          getFlatListData();
          setEditOpen(false);
          setNewCount('');
        }
      )
    });
  }

  const deleteLayer = (index) => {
    setSelectedRow(index);
    var date = new Date();
    var scantime = [date.getFullYear(), date.getMonth() + 1, date.getDate()].join('-') + ' ' + [date.getHours(), date.getMinutes(), date.getSeconds()].join(':');

    DB.transaction(tx => {
      tx.executeSql(`UPDATE ${differenceSurveyTb} SET delete_flag = 1, scan_time = ?, upload = ? WHERE record_id = ?`,
        [scantime, "new", flatListData[index].record_id],
        (tx, results) => {
          getFlatListData();
        }
      )
    });
  }

  const restoreLayer = (index) => {
    setSelectedRow(index);
    var date = new Date();
    var scantime = [date.getFullYear(), date.getMonth() + 1, date.getDate()].join('-') + ' ' + [date.getHours(), date.getMinutes(), date.getSeconds()].join(':');

    DB.transaction(tx => {
      tx.executeSql(`UPDATE ${differenceSurveyTb} SET delete_flag = 0, scan_time = ?, upload = ? WHERE record_id = ?`,
        [scantime, "new", flatListData[index].record_id],
        (tx, results) => {
          getFlatListData();
        }
      )
    });
  }

  const renderDiffDataView = ({ item, index }) => {
    return (
      <View style={styles.container}>
        <Text style={[styles.title, { flex: 2.5 }]}>{item.commodity_sku}</Text>
        <Text style={[styles.title, { flex: 3 }]}>{item.pianqu} / {item.gongwei} / {item.row} / {item.column}</Text>
        <Text style={[styles.title, { flex: 1 }]}>{item.count}</Text>

        <View style={[styles.title, { flex: 2 }]}>
          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            <TouchableOpacity
              onPress={() => {
                setEditOpen(true);
                setSelectedRow(index);
              }}
              style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingRight: 10 }}>
              <View style={styles.editBtn}>
                <Text style={styles.btnText}>修改</Text>
              </View>
            </TouchableOpacity>

            {item.delete_flag == 1 ? (
              <TouchableOpacity onPress={() => restoreLayer(index)}>
                <View style={styles.restoreBtn}>
                  <Text style={styles.btnText}>恢复</Text>
                </View>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={() => deleteLayer(index)}>
                <View style={styles.deleteBtn}>
                  <Text style={styles.btnText}>删除</Text>
                </View>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={{ position: 'relative', height: Dimensions.get('window').height }}>
      <Header {...props} BtnPress={BackBtnPress} title={'差异调查'} />

      <View style={{ flex: 1 }}>
        <View style={{ paddingHorizontal: 20 }}>
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
          <Text style={[styles.head, { flex: 2.5 }]}>SKU</Text>
          <Text style={[styles.head, { flex: 3 }]}>片区 / 工位 / 层 / 列</Text>
          <Text style={[styles.head, { flex: 1 }]}>数量</Text>
          <Text style={[styles.head, { flex: 2 }]}>运作</Text>
        </View>
        <FlatList
          vertical={true}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          data={flatListData}
          renderItem={renderDiffDataView}
          keyExtractor={(item, index) => index + `${item.id}`}
          removeClippedSubviews={false}
        />
      </View>

      <FooterBar3 screenNavigate={screenNavigate} activeBtn={2} />

      {editOpen && (
        <View style={CStyles.ModalContainer}>
          <View style={CStyles.ModalBack} />
          <View style={{ ...CStyles.ModalBoxBack }}>
            <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
              <Text style={styles.itemArea}>区域: {flatListData[selectedRow].pianqu} / </Text>
              <Text style={styles.itemArea}>工位: {flatListData[selectedRow].gongwei?.toString().padStart(project.gongwei_max, "0")} / </Text>
              <Text style={styles.itemArea}>层: {flatListData[selectedRow].row} / </Text>
              <Text style={styles.itemArea}>列: {flatListData[selectedRow].column} </Text>
            </View>

            <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row', marginVertical: 10 }}>
              <Text style={{ fontSize: 14 }}>
                SKU: {flatListData[selectedRow].commodity_sku}
              </Text>
            </View>

            <View style={styles.container}>
              <Text style={{ ...styles.cell, flex: 1 }}>商品名称</Text>
              <Text style={{ ...styles.cell, flex: 3 }}>{diffCommodity?.commodity_name}</Text>
            </View>
            <View style={styles.container}>
              <Text style={{ ...styles.cell, flex: 1 }}>价搭</Text>
              <Text style={{ ...styles.cell, flex: 3 }}>{diffCommodity.commodity_price ? parseFloat(diffCommodity.commodity_price).toFixed(2).toString() + '元' : ''}</Text>
            </View>
            <View style={styles.container}>
              <Text style={{ ...styles.cell, flex: 1 }}>类别No</Text>
              <Text style={{ ...styles.cell, flex: 3 }}>{diffCommodity?.major_code}</Text>
            </View>
            <View style={styles.container}>
              <Text style={{ ...styles.cell, flex: 1 }}>类别名</Text>
              <Text style={{ ...styles.cell, flex: 3 }}>{diffCommodity?.a_category_name}</Text>
            </View>
            <View style={styles.container}>
              <Text style={{ ...styles.cell, flex: 1 }}>规格</Text>
              <Text style={{ ...styles.cell, flex: 3 }}>{diffCommodity?.size_code}</Text>
            </View>
            <View style={styles.container}>
              <Text style={{ ...styles.cell, flex: 1 }}>单位</Text>
              <Text style={{ ...styles.cell, flex: 3 }}>{diffCommodity?.unit}</Text>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', paddingHorizontal: 10, marginTop: 10 }}>
              <Text style={{ fontSize: 12 }}>
                原数量: {flatListData[selectedRow].count} 个
              </Text>
              <View style={{ flex: 1, justifyContent: 'center', flexDirection: 'row', paddingVertical: 5 }}>
                <Text style={{ ...CStyles.TextStyle, width: 60, textAlign: 'right' }}>修改数量:</Text>
                <TextInput
                  keyboardType={'numeric'}
                  autoFocus={true}
                  value={newCount.toString()}
                  onChangeText={(val) => setNewCount(val.replace(/[^0-9]/g, ''))}
                  placeholder={'修改数量'}
                  style={{ ...CStyles.InputStyle }}
                />
                <Text style={{ ...CStyles.TextStyle, textAlign: 'right' }}> 个</Text>
              </View>
            </View>

            <View style={{ justifyContent: 'space-around', alignItems: 'center', flexDirection: 'row', marginTop: 10 }}>
              <Button
                ButtonTitle={'返回'}
                BtnPress={() => setEditOpen(false)}
                type={'blueBtn'}
                BTnWidth={130}
              />
              <Button
                ButtonTitle={'确定'}
                BtnPress={() => editLayerConfirm()}
                type={'YellowBtn'}
                BTnWidth={130}
              />
            </View>
          </View>
        </View>
      )}

      {endModalOpen && (
        <DiffEndModal setEndModalOpen={setEndModalOpen} navigation={props.navigation} />
      )}
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
    paddingTop: 8,
    height: 30,
    borderWidth: 1,
    borderColor: '#9f9f9f',
    marginTop: 10,
    backgroundColor: '#f1f8ff',
    fontSize: 10,
    textAlign: 'center',
  },

  restoreBtn: {
    backgroundColor: '#F8B502',
    borderRadius: 2,
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

  title: {
    padding: 3,
    borderWidth: 1,
    borderColor: '#9f9f9f',
    textAlign: 'center',
    fontSize: 10,
    backgroundColor: '#f6f8fa',
    textAlignVertical: 'center',
  },

  editBtn: {
    backgroundColor: '#012964',
    borderRadius: 2,
  },

  deleteBtn: {
    backgroundColor: '#f8022e',
    borderRadius: 2,
  },

  btnText: {
    textAlign: 'center',
    fontSize: 10,
    padding: 2,
    color: '#fff',
  },

  itemArea: {
    fontSize: 14,
    textAlign: 'center',
  },
});

export default DifferenceSurveyEdit;
