import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const FooterBar3 = (props) => {
    return (
        <View style={{ flexDirection: 'row', backgroundColor: '#012964', paddingTop: 10, paddingBottom: 10 }}>
            <TouchableOpacity onPress={() => { props.screenNavigate(1) }} style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="plus-box-multiple-outline" size={30} color={props.activeBtn == 1 ? "#F8B502" : "#fff"} />
                <Text style={{ color: props.activeBtn == 1 ? "#F8B502" : "#fff" }}>新增</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => { props.screenNavigate(2) }} style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="file-edit-outline" size={30} color={props.activeBtn == 2 ? "#F8B502" : "#fff"} />
                <Text style={{ color: props.activeBtn == 2 ? "#F8B502" : "#fff" }}>调查</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => { props.screenNavigate(3) }} style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="material-design" size={30} color={props.activeBtn == 3 ? "#F8B502" : "#fff"} />
                <Text style={{ color: props.activeBtn == 3 ? "#F8B502" : "#fff" }}>签字&备注</Text>
            </TouchableOpacity>
        </View>
    );
}

export default FooterBar3;
