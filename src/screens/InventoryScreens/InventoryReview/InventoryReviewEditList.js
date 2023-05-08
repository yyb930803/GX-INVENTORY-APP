import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, Alert, Dimensions, TextInput } from 'react-native';
import ApiObject from '../../../support/Api';
import Button from '../../../components/Button';
import FooterBar2 from '../../../components/FooterBar2';
import Header from '../../../components/Header';
import DropBox from '../../../components/DropBox';
import CStyles from '../../../styles/CommonStyles';
import { REV_TYPE, PROGRAM_NAME } from '../../../constants';
import { DB, tbName, pipeiSKU } from '../../../hooks/dbHooks';
import SoundObject from '../../../utils/sound';
import { setScreenLoading, setGongweiPos } from '../../../reducers/BaseReducer';
import RevEndModal from '../../../components/RevEndModal';

const checked = require('../../../assets/images/checked.png');
const unchecked = require('../../../assets/images/unchecked.png');

const InventoryReviewEditList = (props) => {
  const dispatch = useDispatch();
  const { user, project, gongweiPos } = useSelector((state) => state.base);
  const { inventoryReviewTb } = tbName(user.id);

  const [row, setRow] = useState(0);
  const [rowList, setRowList] = useState([]);
  const [rowListOpen, setRowListOpen] = useState(false);

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [restoreOpen, setRestoreOpen] = useState(false);
  const [rowDeleteOpen, setRowDeleteOpen] = useState(false);
  const [rowRestoreOpen, setRowRestoreOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(0);
  const [ownIssues, setOwnIssues] = useState(0);
  const [mistake, setMistake] = useState('');
  const [mistakeList, setMistakeList] = useState([]);
  const [mistakeListOpen, setMistakeListOpen] = useState(false);
  const [flatListData, setFlatListData] = useState([]);
  const [pipeiItem, setPipeiItem] = useState(null);
  const [newCount, setNewCount] = useState('');

  const [endModalOpen, setEndModalOpen] = useState(false);

  useEffect(() => {
    dispatch(setScreenLoading(true));

    getMistakesList();
    getFlatListData();

    DB.transaction(async tx => {
      tx.executeSql(`SELECT "row" FROM ${inventoryReviewTb} WHERE gongwei_id = ? GROUP BY  "row"`,
        [gongweiPos.id],
        async (tx, results) => {
          let list = [];
          list.push({ label: "全部", value: 0 });
          for (let i = 0; i < results.rows.length; i++) {
            let temp = {};
            temp.label = results.rows.item(i).row;
            temp.value = results.rows.item(i).row;
            list.push(temp);
          }
          setRowList(list);
        }
      )
    });

    dispatch(setScreenLoading(false));
  }, []);

  useEffect(() => {
    getFlatListData();
  }, [row]);

  useEffect(() => {
    const pipeiFunc = async () => {
      let selectedItem = flatListData[selectedRow];
      if (selectedItem) {
        setPipeiItem(await pipeiSKU(selectedItem.commodity_sku, user.id));
      }
    }

    pipeiFunc();
  }, [selectedRow]);

  const getMistakesList = async () => {
    var result = await ApiObject.getMistakesCausesList({ qrcode: project.qrcode });
    if (result !== null) {
      let list = [];
      for (let i = 0; i < result.length; i++) {
        let temp = {};
        const element = result[i];
        temp.value = element.id;
        temp.label = element.name;
        list.push(temp);
      }
      setMistakeList(list);
    }
  };

  const getFlatListData = async () => {
    DB.transaction((tx) => {
      tx.executeSql(
        row == 0 ? `SELECT * FROM ${inventoryReviewTb} WHERE gongwei_id = ?` : `SELECT * FROM ${inventoryReviewTb} WHERE "row" = ? AND gongwei_id = ?`,
        row == 0 ? [gongweiPos.id] : [row, gongweiPos.id],
        async (tx, results) => {
          var list = [];
          for (let i = 0; i < results.rows.length; i++) {
            let item = {};
            item.row = results.rows.item(i).row;
            item.column = results.rows.item(i).column;
            item.commodity_sku = results.rows.item(i).commodity_sku;
            item.commodity_name = results.rows.item(i).commodity_name;
            item.count = results.rows.item(i).count;
            item.delete_flag = results.rows.item(i).delete_flag;
            item.record_id = results.rows.item(i).record_id;
            list.push(item);
          }
          setFlatListData(list);
        },
      );
    });
  };

  const screenNavigate = (id) => {
    if (id == 1) {
      props.navigation.push('InventoryReviewEditList');
    } else if (id == 2) {
      props.navigation.push('InventoryReviewAdd');
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
      tx.executeSql(
        `UPDATE ${inventoryReviewTb} SET count = ? , delete_flag = 0, upload = "new", scan_time = ?, mistakes_id = ?, mistakes_type = ? where record_id = ?`,
        [parseInt(newCount), scantime, mistake, ownIssues, flatListData[selectedRow].record_id],
        (tx, results) => {
          getFlatListData();
          setEditOpen(false);
          setNewCount('');
          setMistake('');
          setOwnIssues('');
        }
      )
    });
  }

  const deleteLayer = () => {
    var date = new Date();
    var scantime = [date.getFullYear(), date.getMonth() + 1, date.getDate()].join('-') + ' ' + [date.getHours(), date.getMinutes(), date.getSeconds()].join(':');

    DB.transaction(tx => {
      tx.executeSql(
        `UPDATE ${inventoryReviewTb} SET delete_flag = 1, upload = "new", scan_time = ?, mistakes_id = ?, mistakes_type = ? where record_id = ?`,
        [scantime, mistake, ownIssues, flatListData[selectedRow].record_id],
        (tx, results) => {
          getFlatListData();
          setDeleteOpen(false);
          setMistake('');
          setOwnIssues('');
        }
      )
    });
  }

  const restoreLayer = () => {
    var date = new Date();
    var scantime = [date.getFullYear(), date.getMonth() + 1, date.getDate()].join('-') + ' ' + [date.getHours(), date.getMinutes(), date.getSeconds()].join(':');

    DB.transaction(tx => {
      tx.executeSql(
        `UPDATE ${inventoryReviewTb} SET delete_flag = 0, upload = "new", scan_time = ?, mistakes_id = ?, mistakes_type = ? WHERE record_id = ?`,
        [scantime, mistake, ownIssues, flatListData[selectedRow].record_id],
        (tx, results) => {
          getFlatListData();
          setRestoreOpen(false);
          setMistake('');
          setOwnIssues('');
        }
      )
    });
  }

  const renderDiffDataView = ({ item, index }) => (
    <View style={styles.container} key={index}>
      <Text style={[styles.title, { flex: 1, textAlignVertical: 'center' }]}>
        {item.row}/{item.column}
      </Text>
      <Text style={[styles.title, { flex: 4, textAlignVertical: 'center' }]}>
        {item.commodity_sku}{"\n"}{item.commodity_name ?? "不在档"}
      </Text>
      <Text style={[styles.title, { flex: 1.5, textAlignVertical: 'center' }]}>
        {item.count}
      </Text>
      <View style={[styles.title, { flex: 2, alignItems: 'center', flexDirection: 'row', justifyContent: 'center' }]}>
        <TouchableOpacity
          onPress={() => {
            setEditOpen(true);
            setSelectedRow(index);
          }}
          style={{ paddingRight: 10 }}
        >
          <View style={styles.editBtn}>
            <Text style={styles.btnText}>修改</Text>
          </View>
        </TouchableOpacity>
        {item.delete_flag == 1 ? (
          <TouchableOpacity
            onPress={() => {
              setRestoreOpen(true);
              setSelectedRow(index);
            }}
          >
            <View style={styles.restoreBtn}>
              <Text style={styles.btnText}>恢复</Text>
            </View>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => {
              setDeleteOpen(true);
              setSelectedRow(index);
            }}
          >
            <View style={styles.deleteBtn}>
              <Text style={styles.btnText}>删除</Text>
            </View>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const modalInfoPart = () => (
    <>
      <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
        <Text style={styles.itemArea}>区域: {gongweiPos.pianqu} / </Text>
        <Text style={styles.itemArea}>工位: {gongweiPos.gongwei?.toString().padStart(project.gongwei_max, "0")} / </Text>
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
        <Text style={{ ...styles.cell, flex: 3 }}>{pipeiItem?.commodity_name}</Text>
      </View>
      <View style={styles.container}>
        <Text style={{ ...styles.cell, flex: 1 }}>价搭</Text>
        <Text style={{ ...styles.cell, flex: 3 }}>{pipeiItem ? (parseFloat(pipeiItem.commodity_price).toFixed(2).toString()) + '元' : ''}</Text>
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
    </>
  );

  const modalMistakePart = () => (
    <>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          marginVertical: 10,
        }}>
        <TouchableOpacity
          onPress={() => setOwnIssues(0)}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 14,
          }}>
          <Image
            source={ownIssues == 0 ? checked : unchecked}
            style={{
              width: 20,
              height: 20,
              marginRight: 10,
            }}
          />
          <Text style={{ fontSize: 12 }}>自己责任</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setOwnIssues(1)}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 14,
          }}>
          <Image
            source={ownIssues == 1 ? checked : unchecked}
            style={{
              width: 20,
              height: 20,
              marginRight: 10,
            }}
          />
          <Text style={{ fontSize: 12 }}>店铺责任</Text>
        </TouchableOpacity>
      </View>
      <View style={{ alignItems: 'center', justifyContent: 'center', paddingHorizontal: 30, flexDirection: 'row' }}>
        <Text style={{ ...CStyles.TextStyle, textAlign: 'right' }}>错误原因:</Text>
        <DropBox
          zIndex={10}
          zIndexInverse={10}
          open={mistakeListOpen}
          setOpen={setMistakeListOpen}
          value={mistake}
          setValue={setMistake}
          items={mistakeList}
          setItems={setMistakeList}
          searchable={false}
          listMode='SCROLLVIEW'
        />
      </View>
    </>
  );

  const deleteRow = () => {
    if (flatListData.length == 0) {
      Alert.alert(
        PROGRAM_NAME,
        '没有数据。',
        [{ text: '是(OK)', onPress: () => { } }],
        { cancelable: false },
      );
    } else {
      var date = new Date();
      var scantime = [date.getFullYear(), date.getMonth() + 1, date.getDate()].join('-') + ' ' + [date.getHours(), date.getMinutes(), date.getSeconds()].join(':');

      if (row == 0) {
        DB.transaction((tx) => {
          tx.executeSql(
            `UPDATE ${inventoryReviewTb} SET delete_flag = 1, scan_time = ?, upload = ?, mistakes_id = ?, mistakes_type = ? WHERE gongwei_id =?`,
            [scantime, "new", mistake, ownIssues, gongweiPos.id],
            (tx, results) => {
              getFlatListData();
              setRowDeleteOpen(false);
            },
          );
        });
      } else {
        DB.transaction((tx) => {
          tx.executeSql(
            `UPDATE ${inventoryReviewTb} SET delete_flag = 1, scan_time = ?, upload = ?, mistakes_id = ?, mistakes_type = ? WHERE row = ? AND gongwei_id =?`,
            [scantime, "new", mistake, ownIssues, row, gongweiPos.id],
            (tx, results) => {
              getFlatListData();
              setRowRestoreOpen(false);
            },
          );
        });
      }
    }
  };

  const recoverRow = () => {
    if (flatListData.length == 0) {
      Alert.alert(
        PROGRAM_NAME,
        '没有数据。',
        [{ text: '是(OK)', onPress: () => { } }],
        { cancelable: false },
      );
    } else {
      var date = new Date();
      var scantime = [date.getFullYear(), date.getMonth() + 1, date.getDate()].join('-') + ' ' + [date.getHours(), date.getMinutes(), date.getSeconds()].join(':');

      if (row == 0) {
        DB.transaction((tx) => {
          tx.executeSql(
            `UPDATE ${inventoryReviewTb} SET delete_flag = 0 , scan_time = ?, upload = ?, mistakes_id = ?, mistakes_type = ? WHERE gongwei_id=?`,
            [scantime, "new", mistake, ownIssues, gongweiPos.id],
            (tx, results) => {
              getFlatListData();
              setRowRestoreOpen(false);
            },
          );
        });
      } else {
        DB.transaction((tx) => {
          tx.executeSql(
            `UPDATE ${inventoryReviewTb} SET delete_flag = 0 , scan_time = ?, upload = ?, mistakes_id = ?, mistakes_type = ? WHERE row = ? AND gongwei_id=?`,
            [scantime, "new", mistake, ownIssues, row, gongweiPos.id],
            (tx, results) => {
              getFlatListData();
              setRowRestoreOpen(false);
            },
          );
        });
      }
    }
  };

  return (
    <View style={{ position: 'relative', height: Dimensions.get('window').height }}>
      <Header {...props} BtnPress={() => setEndModalOpen(true)} title={'盘点复查'} />

      <View style={{ flex: 1 }}>
        <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'center' }}>
          <Text style={{ fontSize: 12 }}>区域: {gongweiPos.pianqu} / </Text>
          <Text style={{ fontSize: 12 }}>工位: {gongweiPos.gongwei?.toString().padStart(project.gongwei_max, "0")}</Text>
        </View>

        <View style={{ alignItems: 'center', justifyContent: 'center', paddingHorizontal: 30, paddingVertical: 10, flexDirection: 'row' }}>
          <Text style={{ ...CStyles.TextStyle, textAlign: 'right' }}>层:</Text>
          <DropBox
            zIndex={10}
            zIndexInverse={10}
            open={rowListOpen}
            setOpen={setRowListOpen}
            value={row}
            setValue={setRow}
            items={rowList}
            setItems={setRowList}
            searchable={false}
            listMode='SCROLLVIEW'
          />
        </View>

        <View style={styles.container}>
          <Text style={[styles.head, { flex: 1 }]}>层/列</Text>
          <Text style={[styles.head, { flex: 4 }]}>SKU/名称</Text>
          <Text style={[styles.head, { flex: 1.5 }]}>数量</Text>
          <Text style={[styles.head, { flex: 2 }]}>操作</Text>
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

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 20,
            marginVertical: 10,
          }}
        >
          <Button
            ButtonTitle={'恢复层'}
            BtnPress={() => setRowRestoreOpen(true)}
            type={'yellowBtn'}
            BTnWidth={150}
          />
          <Button
            ButtonTitle={'删除层'}
            BtnPress={() => setRowDeleteOpen(true)}
            type={'blueBtn'}
            BTnWidth={150}
          />
        </View>

        {/* <View
          style={{
            marginVertical: 10,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Button
            ButtonTitle={'工位完成'}
            BtnPress={async () => {
              await ApiObject.endInspection({ qrcode: project.qrcode, gongwei_id: gongweiPos.id });
              toNextGongWei();
            }}
            type={'yellowBtn'}
            BTnWidth={320}
          />
        </View> */}
      </View>

      <FooterBar2 screenNavigate={screenNavigate} activeBtn={1} />

      {editOpen && (
        <View style={CStyles.ModalContainer}>
          <View style={CStyles.ModalBack} />
          <View style={{ ...CStyles.ModalBoxBack }}>
            {modalInfoPart()}

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

            {modalMistakePart()}

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

      {deleteOpen && (
        <View style={CStyles.ModalContainer}>
          <View style={CStyles.ModalBack} />
          <View style={{ ...CStyles.ModalBoxBack }}>
            {modalInfoPart()}

            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', paddingHorizontal: 10, marginTop: 10 }}>
              <Text style={{ fontSize: 12 }}>
                原数量: {flatListData[selectedRow].count} 个
              </Text>
            </View>

            {modalMistakePart()}

            <View style={{ justifyContent: 'space-around', alignItems: 'center', flexDirection: 'row', marginTop: 10 }}>
              <Button
                ButtonTitle={'返回'}
                BtnPress={() => setDeleteOpen(false)}
                type={'blueBtn'}
                BTnWidth={130}
              />
              <Button
                ButtonTitle={'删除'}
                BtnPress={() => deleteLayer()}
                type={'YellowBtn'}
                BTnWidth={130}
              />
            </View>
          </View>
        </View>
      )}

      {restoreOpen && (
        <View style={CStyles.ModalContainer}>
          <View style={CStyles.ModalBack} />
          <View style={{ ...CStyles.ModalBoxBack }}>
            {modalInfoPart()}

            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', paddingHorizontal: 10, marginTop: 10 }}>
              <Text style={{ fontSize: 12 }}>
                原数量: {flatListData[selectedRow].count} 个
              </Text>
            </View>

            {modalMistakePart()}

            <View style={{ justifyContent: 'space-around', alignItems: 'center', flexDirection: 'row', marginTop: 10 }}>
              <Button
                ButtonTitle={'返回'}
                BtnPress={() => setRestoreOpen(false)}
                type={'blueBtn'}
                BTnWidth={130}
              />
              <Button
                ButtonTitle={'恢复'}
                BtnPress={() => restoreLayer()}
                type={'YellowBtn'}
                BTnWidth={130}
              />
            </View>
          </View>
        </View>
      )}

      {rowDeleteOpen && (
        <View style={CStyles.ModalContainer}>
          <View style={CStyles.ModalBack} />
          <View style={{ ...CStyles.ModalBoxBack }}>
            <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
              <Text style={styles.itemArea}>区域: {gongweiPos.pianqu} / </Text>
              <Text style={styles.itemArea}>工位: {gongweiPos.gongwei?.toString().padStart(project.gongwei_max, "0")} / </Text>
              <Text style={styles.itemArea}>层: {row}</Text>
            </View>

            {modalMistakePart()}

            <View style={{ justifyContent: 'space-around', alignItems: 'center', flexDirection: 'row', marginTop: 10 }}>
              <Button
                ButtonTitle={'返回'}
                BtnPress={() => setRowDeleteOpen(false)}
                type={'blueBtn'}
                BTnWidth={130}
              />
              <Button
                ButtonTitle={'删除'}
                BtnPress={() => deleteRow()}
                type={'YellowBtn'}
                BTnWidth={130}
              />
            </View>
          </View>
        </View>
      )}

      {rowRestoreOpen && (
        <View style={CStyles.ModalContainer}>
          <View style={CStyles.ModalBack} />
          <View style={{ ...CStyles.ModalBoxBack }}>
            <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
              <Text style={styles.itemArea}>区域: {gongweiPos.pianqu} / </Text>
              <Text style={styles.itemArea}>工位: {gongweiPos.gongwei?.toString().padStart(project.gongwei_max, "0")} / </Text>
              <Text style={styles.itemArea}>层: {row}</Text>
            </View>

            {modalMistakePart()}

            <View style={{ justifyContent: 'space-around', alignItems: 'center', flexDirection: 'row', marginTop: 10 }}>
              <Button
                ButtonTitle={'返回'}
                BtnPress={() => setRowRestoreOpen(false)}
                type={'blueBtn'}
                BTnWidth={130}
              />
              <Button
                ButtonTitle={'恢复'}
                BtnPress={() => recoverRow()}
                type={'YellowBtn'}
                BTnWidth={130}
              />
            </View>
          </View>
        </View>
      )}

      {endModalOpen && (
        <RevEndModal setEndModalOpen={setEndModalOpen} navigation={props.navigation} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
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

  restoreBtn: {
    backgroundColor: '#F8B502',
    borderRadius: 2,
  },

  btnText: {
    padding: 2,
    textAlign: 'center',
    color: '#fff',
    fontSize: 10,
  },

  itemArea: {
    fontSize: 14,
    textAlign: 'center',
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

export default InventoryReviewEditList;
