import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import CStyles from '../styles/CommonStyles'

const LogButton = (props) => {
  return (
    <TouchableOpacity onPress={() => props.LogBtn()}>
      <View style={props.type == "disable" ? CStyles.DisableLogoBtn : CStyles.YellowLogoBtn}>
        <Text style={props.type == "disable" ? CStyles.DisableLogoBtnText : CStyles.LogoBtnText}> {props.ButtonTitle} </Text>
      </View>
    </TouchableOpacity>
  );
}

export default LogButton;
