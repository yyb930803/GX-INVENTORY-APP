import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const FooterBar2 = (props) => {
  return (
    <View style={{ flexDirection: 'row', backgroundColor: '#012964', paddingTop: 10, paddingBottom: 10 }}>
      <TouchableOpacity onPress={() => { props.screenNavigate(1) }} style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Icon name="file-edit-outline" size={30} color={props.activeBtn == 1 ? "#F8B502" : "#fff"} />
        <Text style={{ color: props.activeBtn == 1 ? "#F8B502" : "#fff" }}>编辑</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => { props.screenNavigate(2) }} style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Icon name="barcode-scan" size={30} color={props.activeBtn == 2 ? "#F8B502" : "#fff"} />
        <Text style={{ color: props.activeBtn == 2 ? "#F8B502" : "#fff" }}>扫描</Text>
      </TouchableOpacity>
    </View>
  );
}

export default FooterBar2;
