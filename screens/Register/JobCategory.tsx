import React, { useCallback, useMemo, useRef, useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Animated } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import RNPickerSelect from 'react-native-picker-select';
import BottomPopup from '../../components/BottomPopup';
import IconButton from '../../components/IconButton';
import ImageCheckbox from '../../components/ImageCheckbox';
import { job_categories } from './constant';
import { appendEmployeeRegisterData } from '../../slices/register.slice';
import { useDispatch } from 'react-redux';
const { height } = Dimensions.get('window');

export const imageMap: Record<string, any> = {
    category1: require('../../assets/job_c/category_1.png'),
    category2: require('../../assets/job_c/category_2.png'),
    category3: require('../../assets/job_c/category_3.png'),
    category4: require('../../assets/job_c/category_4.png'),
    category5: require('../../assets/job_c/category_5.png'),
    category6: require('../../assets/job_c/category_6.png'),
};


const JobCategory = ({ onNext , control }: any) => {
    const dispatch =  useDispatch();
    const [visible, setVisible] = useState(false)
    const [categoryTitle, setCategoryTitle] = useState('')


    const slideAnim = useRef(new Animated.Value(height)).current;


    const onSubmit = (data: any) => {
        dispatch(appendEmployeeRegisterData(data))
        onNext(data);
    };

    const handleVisible = useCallback((value: boolean) => {
        setVisible(value)
        setCategoryTitle('')

    }, [])

    const openModal = useCallback((title: string) => {
        setCategoryTitle(title);
        setVisible(true);
        
        // Delay the animation slightly to allow modal to mount first
        setTimeout(() => {
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }).start();
        }, 300); // 50ms is usually enough
      }, []);
      


    const checkboxData = useCallback((value: any, onChange: any) => {

        return <View style={styles.grid1}>
        {job_categories[categoryTitle]?.map((item: any, index: number) => (
          <View key={index} style={styles.gridItem1}>
            <ImageCheckbox
              label={item.title}
              value={item.id}
              imageSource={item.image}
              selected={value.includes(item.id)}
              onChange={(val: any) => {
                const newValue = value.includes(val)
                  ? value.filter((v: any) => v !== val)
                  : [...value, val];

                onChange(newValue);
              }}
            />
          </View>
        ))}
      </View>

    },[categoryTitle])


    return (
        <>
        <Text style={styles.label}>Job Categories</Text>
        <View style={styles.grid}>
            {Object.keys(job_categories).map((title, index) => <View style={styles.gridItem} key={title}>
                <IconButton
                    title={title}
                    imageSource={imageMap[`category${index + 1}`]}
                    onPress={() => openModal(title)}
                />
            </View>)}
        </View>

        <BottomPopup
            slideAnim={slideAnim}
            handleVisible={handleVisible}
            visible={visible}
            title={categoryTitle}
        ><Controller
        control={control}
        name={'job_categories'}
        rules={{ required: true }}
        render={({ field: { onChange, value = [] } }) => (
            checkboxData(value, onChange)
        )}
      />

        </BottomPopup>

    </>
    );
};

const styles = StyleSheet.create({
    label: { marginTop: 16, fontWeight: 'bold' },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 12,
        borderRadius: 8,
        marginTop: 6,
    },
 
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    gridItem: {
        width: '33.33%',
        padding: 8,
        alignItems: 'center',
    },
    grid1: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
    },
    gridItem1: {
        width: '33.33%',
        padding: 8,
        alignItems: 'center',
    },
});



export default JobCategory;
