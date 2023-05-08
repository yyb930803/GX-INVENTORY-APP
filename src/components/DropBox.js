import React from 'react';
import CStyles from '../styles/CommonStyles';
import DropDownPicker from 'react-native-dropdown-picker';

const DropBox = ({ open, setOpen, onOpen, value, setValue, items, setItems, searchable, zIndex, zIndexInverse, listMode }) => {
  return (
    <DropDownPicker
      zIndex={zIndex}
      zIndexInverse={zIndexInverse}
      open={open}
      items={items}
      setOpen={setOpen}
      onOpen={onOpen}
      value={value}
      setValue={setValue}
      setItems={setItems}
      searchable={searchable}
      itemSeparator={true}
      listMode={listMode}
      scrollViewProps={{
        nestedScrollEnabled: true,
      }}
      textStyle={{
        fontSize: 10
      }}
      props={{
        style: {
          ...CStyles.InputStyle,
          flexDirection: 'row',
          marginHorizontal: 0,
          borderColor: '#dedbdb',
          paddingRight: 5,
          borderBottomLeftRadius: open ? 0 : 8,
          borderBottomRightRadius: open ? 0 : 8,
        }
      }}
      arrowIconStyle={{
        width: 15,
        height: 15,
      }}
      closeIconStyle={{
        width: 30,
        height: 30,
      }}
      tickIconStyle={{
        width: 15,
        height: 15
      }}
      containerProps={{
        style: {
          flex: 1,
          paddingHorizontal: 5,
          zIndex: zIndex,
        }
      }}
      dropDownContainerStyle={{
        borderColor: "#dfdfdf",
        marginLeft: 5,
      }}
      searchTextInputProps={{
        style: CStyles.InputStyle
      }}
      searchContainerStyle={{
        borderBottomColor: "#dfdfdf",
        paddingHorizontal: 0,
        paddingVertical: 5
      }}
      selectedItemContainerStyle={{
        backgroundColor: "#dfdfdf"
      }}
      itemSeparatorStyle={{
        backgroundColor: "#dfdfdf"
      }}
    />
  );
};

export default DropBox;
