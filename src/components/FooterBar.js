import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const FooterBar = (props) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: '#012964',
        paddingTop: 10,
        paddingBottom: 10,
      }}
    >
      <TouchableOpacity
        onPress={() => {
          props.screenNavigate(2);
        }}
        style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
      >
        {props.activeBtn == 2 ? (
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="layers" size={30} color="#F8B502" />
            <Text style={{ color: '#F8B502' }}> 盘点 </Text>
          </View>
        ) : (
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="layers" size={30} color="#fff" />
            <Text style={{ color: '#fff' }}> 盘点 </Text>
          </View>
        )}
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          props.screenNavigate(6);
        }}
        style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
      >
        {props.activeBtn == 6 ? (
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="calendar-account-outline" size={30} color="#F8B502" />
            <Text style={{ color: '#F8B502' }}> 日程管理 </Text>
          </View>
        ) : (
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="calendar-account-outline" size={30} color="#fff" />
            <Text style={{ color: '#fff' }}> 日程管理 </Text>
          </View>
        )}
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          props.screenNavigate(4);
        }}
        style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
      >
        {props.activeBtn == 4 ? (
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="account-circle-outline" size={30} color="#F8B502" />
            <Text style={{ color: '#F8B502' }}> 我的 </Text>
          </View>
        ) : (
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="account-circle-outline" size={30} color="#fff" />
            <Text style={{ color: '#fff' }}> 我的 </Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}

export default FooterBar;
