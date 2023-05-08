import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { View, Text, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import Modal from 'react-native-modal';
import { PROGRAM_NAME, SERVER_URL } from '../constants';

const Header = (props) => {
  const { user, project } = useSelector(state => state.base);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const renderAvatarImage = () => {
    if (user?.picture != '' && user?.picture != null) {
      return (
        <Image style={styles.avatar} source={{ uri: SERVER_URL + user.picture }} />
      );
    } else {
      return (
        <Image style={styles.avatar} source={require('../assets/images/male.jpg')} />
      );
    }
  }

  const toProjectScan = async () => {
    setIsModalVisible(false);
    if (project != null) {
      Alert.alert(
        PROGRAM_NAME,
        '您没有退出当前项目 无法加入新的项目！',
        [{ text: '是(Y)', onPress: () => { } }],
        { cancelable: false },
      );
      return;
    } else {
      props.navigation.push('ProjectMainScreen');
    }
  };

  const toNextScene = async nextScene => {
    setIsModalVisible(false);
    props.navigation.push(nextScene);
  };

  return (
    <View>
      <Modal isVisible={isModalVisible}>
        <View style={styles.modalView}>
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={() => setIsModalVisible(false)}
          >
            <Image
              source={require('../assets/images/close.png')}
              style={{ width: 15, height: 15 }}
            />
          </TouchableOpacity>
          <Text
            style={{
              ...styles.TitleTxt,
              fontSize: 25,
              marginBottom: 10,
              fontWeight: 'bold',
            }}
          >
            操作菜单
          </Text>
          <TouchableOpacity
            style={styles.navigationBtn}
            onPress={() => {
              setIsModalVisible(false);
              props.navigation.push('Inventory');
            }}
          >
            <Text style={styles.TitleTxt}>主页面</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.navigationBtn}
            onPress={() => toProjectScan()}
          >
            <Text style={styles.TitleTxt}>登录项目</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.navigationBtn}
            onPress={() => toNextScene('AreaValue')}
          >
            <Text style={styles.TitleTxt}>进入初盘</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.navigationBtn}
            onPress={() => toNextScene('InventoryReview')}
          >
            <Text style={styles.TitleTxt}>进入复盘</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.navigationBtn}
            onPress={() => toNextScene('DifferenceSurvey')}
          >
            <Text style={styles.TitleTxt}>差异调查</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'space-between',
          flexDirection: 'row',
          padding: 5,
        }}
      >
        <Image
          style={styles.menuIcon}
          source={require('../assets/images/menuIcon.png')}
        />
        <Text
          style={{
            fontSize: 20,
            color: '#000',
            fontWeight: 'bold',
          }}
        >
          {props.title}
        </Text>
        {renderAvatarImage()}
      </View>
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
          backgroundColor: '#012964',
          padding: 3,
        }}
      >
        <Text
          style={{
            fontSize: 13,
            color: '#fff',
            fontWeight: 'bold',
            textAlign: 'center',
          }}
        >
          {project.client_name ? project.client_name + '/' + project.store_name + '/' + project.start_time : '---没有进行中---'}
        </Text>
      </View>
      {props.BackBtn !== 'noback' && (
        <View style={{ padding: 10 }}>
          <TouchableOpacity
            onPress={() => props.BtnPress()}
            style={{
              height: 25,
              width: 25,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#d6d3d3',
              borderRadius: 20,
            }}
          >
            <Icon name="left" size={20} color="#000" style={{}} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
  },

  menuIcon: {
    width: 30,
    height: 30,
  },

  modalView: {
    width: '90%',
    height: 370,
    borderRadius: 10,
    alignSelf: 'center',
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },

  closeBtn: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 30,
    height: 30,
  },

  navigationBtn: {
    borderWidth: 2,
    borderColor: '#012964',
    borderRadius: 20,
    width: '80%',
    height: 40,
    alignContent: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },

  TitleTxt: {
    fontSize: 20,
    textAlign: 'center',
  },
});

export default Header;
