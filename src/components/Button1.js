import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import CStyles from '../styles/CommonStyles'

const Button1 = (props) => {
  return (
    <View style={{ width: props.BTnWidth }}>
      <TouchableOpacity onPress={() => { props.BtnPress() }}>
        <View style={CStyles.grayBtn}>
          <Text style={CStyles.grayText}> {props.ButtonTitle} </Text>
          <Icon name="right" size={20} color="#000" style={CStyles.grayIcon} />
        </View>
      </TouchableOpacity>
    </View>
  );
}

export default Button1;
