import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import CStyles from '../styles/CommonStyles';
import Icon from 'react-native-vector-icons/Ionicons';

const Button = (props) => {
  return (
    <View style={{ width: props.BTnWidth }}>
      <TouchableOpacity
        onPress={() => props.BtnPress()}
        disabled={props.disabled}
      >
        <View
          opacity={props.disabled ? 0.5 : 1}
          style={{
            ...props.type == 'blueBtn' ? CStyles.BlueBtn : CStyles.YellowBtn, flexDirection: 'row'
          }}
        >
          <Text style={CStyles.BtnText}>{props.ButtonTitle}</Text>
          {props.notification && <Icon name="notifications" size={20} color="red" />}
        </View>
      </TouchableOpacity>
    </View>
  );
}

export default Button;
