import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch } from 'react-redux';
import { uploadEmployeeImage } from '../../slices/register.slice';
import EmpAvatar from '../../assets/svgs/employee-avatar.svg'


const ProfileImage = () => {
    const dispatch = useDispatch();
    const [imageUri, setImageUri] = useState(null);

    const handlePickImage = async () => {
        try {
            const img = await ImagePicker.openPicker({
                width: 300,
                height: 300,
                cropping: true,
                mediaType: 'photo',
                cropperCircleOverlay: true, // ✅ Enables circular crop mask

            });

            setImageUri(img.path as any);
            uploadImage(img)
        } catch (error) {
            console.error('Image pick error:', error);
        }
    };


    const uploadImage = (image: any) => {
        dispatch(uploadEmployeeImage(image) as any)
    }

  



        return ( <View style={styles.container}>
            <View>
            {imageUri ? <Image source={{ uri: imageUri }} style={styles.avatar} />: <View style={styles.avatar}><EmpAvatar /></View> }
           
              <TouchableOpacity style={styles.iconWrapper} onPress={handlePickImage}>
              <Icon name="pencil" size={28} color="#007bff" />
              </TouchableOpacity>
            </View></View>)

    }
    const styles = StyleSheet.create({
        container: {
          alignItems: 'center',
          marginTop: 30,
        },
        avatar: {
          width: 100,
          height: 100,
          borderRadius: 50,
          backgroundColor: '#f0f0f0',
          justifyContent: 'center',
          alignItems: 'center'
        },
        iconWrapper: {
          position: 'absolute',
          right: -5,
          bottom: -5,
          backgroundColor: '#fff',
          borderRadius: 15,
        },
        loader: {
          position: 'absolute',
          top: '40%',
          left: '40%',
        },
      });
    export default ProfileImage;
