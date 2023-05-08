import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Header from '../../components/Header';
import FooterBar from '../../components/FooterBar';
import ApiObject from '../../support/Api';
import { setScreenLoading } from '../../reducers/BaseReducer';

const SettingMain = (props) => {
  const dispatch = useDispatch();
  const { project } = useSelector(state => state.base);

  const [listData, setListData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    dispatch(setScreenLoading(true));

    var data = await ApiObject.getProjectManageList();

    if (data) {
      for (let i = 0; i < data.length; i++) {
        const element = data[i]
        if (element.state_id == 2) {
          element.state_id = 3
        } else if (element.state_id == 3) {
          element.state_id = 2
        }
      }
      data.sort((a, b) => (a.state_id > b.state_id) ? 1 : ((b.state_id > a.state_id) ? -1 : 0))
      setListData(data);
    }

    dispatch(setScreenLoading(false));
  }

  const screenNavigate = (id) => {
    if (id == 2) {
      props.navigation.push('Inventory');
    } else if (id == 4) {
      props.navigation.navigate('SettingMain');
    } else if (id == 6) {
      props.navigation.push('Management');
    }
  };

  const renderDiffDataView = ({ item, index }) => {
    var status = ''
    var projectFlag = false
    if (item.state_id == 3) {
      status = '待开始'
    } else if (item.state_id == 2) {
      status = '进行中'
    } else if (item.state_id == 4) {
      status = '已完成'
    } else if (item.state_id == 5) {
      status = '删除的'
    }
    if (project?.id == item.id) {
      projectFlag = true
    }

    return (
      <TouchableOpacity key={index} disabled={!projectFlag} style={{ flexDirection: 'row', zIndex: 500 }} onPress={() => { props.navigation.push("Inventory") }}>
        <Text style={[styles.title, { flex: 1.2, backgroundColor: projectFlag ? 'green' : 'white' }]}>{item.store_name}</Text>
        <Text style={[styles.title, { flex: 1, backgroundColor: projectFlag ? 'green' : 'white' }]}>{item.store_address}</Text>
        <Text style={[styles.title, { flex: 1, backgroundColor: projectFlag ? 'green' : 'white' }]}>{item.leader_name}</Text>
        <Text style={[styles.title, { flex: 1, backgroundColor: projectFlag ? 'green' : 'white' }]}>{item.client_name}</Text>
        <Text style={[styles.title, { flex: 1.3, backgroundColor: projectFlag ? 'green' : 'white' }]}>{item.start_time == null ? item.prefer_starttime : item.start_time}</Text>
        <Text style={[styles.title, { flex: 0.8, backgroundColor: projectFlag ? 'green' : 'white' }]}>{status}</Text>
      </TouchableOpacity >
    )
  };

  return (
    <View
      style={{
        flex: 1,
        position: 'relative',
        height: Dimensions.get('window').height,
      }}
    >
      <View style={{}}>
        <Header
          {...props}
          BackBtn={'noback'}
          title={'日程管理'}
          proNoName={true}
        />
      </View>

      <View style={{ flex: 1, justifyContent: "space-between", padding: 10 }}>
        <View style={{ flexDirection: 'row' }}>
          <Text style={[styles.head, { flex: 1.2 }]}>门店名称</Text>
          <Text style={[styles.head, { flex: 1 }]}>门店地址</Text>
          <Text style={[styles.head, { flex: 1 }]}>领队名称</Text>
          <Text style={[styles.head, { flex: 1 }]}>客户名称</Text>
          <Text style={[styles.head, { flex: 1.3 }]}>开始时间</Text>
          <Text style={[styles.head, { flex: 0.8 }]}>状态</Text>
        </View>

        <FlatList
          vertical={true}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          data={listData}
          renderItem={renderDiffDataView}
          keyExtractor={(item, index) => index + `${item.id}`}
          removeClippedSubviews={false}
        />
      </View>

      <FooterBar screenNavigate={screenNavigate} activeBtn={6} />
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    borderWidth: 1,
    borderColor: '#9f9f9f',
    textAlign: 'center',
    fontSize: 10,
    backgroundColor: '#f6f8fa',
    textAlignVertical: 'center'
  },

  head: {
    borderWidth: 1,
    borderColor: '#9f9f9f',
    textAlign: 'center',
    fontSize: 10,
    backgroundColor: '#f1f8ff',
    textAlignVertical: 'center',
    height: 30,
    marginTop: 5,
  },
})

export default SettingMain;
