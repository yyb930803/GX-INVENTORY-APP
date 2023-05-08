import React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import ImagePicker from 'react-native-image-picker';
import { SERVER_URL } from '../constants';

const AvatarImgCameraCapture = ({ imageStr, imageUrl, setImageStr }) => {
  const pickDiffPhoto = () => {
    ImagePicker.showImagePicker({
      title: '请选择图片',
      cancelButtonTitle: '取消',
      takePhotoButtonTitle: '拍照',
      chooseFromLibraryButtonTitle: '相片集',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
      maxWidth: 400,
      maxHeight: 400,
      quality: 0.5,
    }, (response) => {
      if (!response.didCancel) {
        setImageStr(response.data);
      }
    });
  };

  return (
    <View style={{ alignItems: 'center', borderRadius: 35, overflow: 'hidden', marginLeft: 5, flex: 1 }}>
      <TouchableOpacity onPress={() => pickDiffPhoto()}>
        <Image
          source={{ uri: imageStr === '' ? SERVER_URL + imageUrl : `data:image/png;base64,${imageStr}` }}
          style={{
            height: 70,
            width: 70,
            backgroundColor: '#B1B6C2',
          }}
        />
      </TouchableOpacity>
    </View>
  );
}

export default AvatarImgCameraCapture;
