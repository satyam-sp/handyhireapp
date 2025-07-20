import React from 'react';
import {
    View,
    Dimensions,
} from 'react-native';

import { styles } from './styles'

import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
const { width } = Dimensions.get('window');
const activeJobCardWidth = width * 0.9; // Same as in styles

const CardSkeleton: React.FC = () => {

    return (
        <View style={styles.activeJobCardWrapper}>
            <SkeletonPlaceholder speed={1000} backgroundColor={"#E0E0E0"} highlightColor="#F5F5F5">
                <SkeletonPlaceholder.Item style={styles.activeJobCardSkeleton} borderColor={'black'}>
                    <SkeletonPlaceholder.Item flexDirection="row" alignItems="center" marginBottom={10}>
                        <SkeletonPlaceholder.Item width={24} height={24} borderRadius={12} />
                        <SkeletonPlaceholder.Item marginLeft={10} width={activeJobCardWidth * 0.6} height={20} borderRadius={4} />
                    </SkeletonPlaceholder.Item>
                    <SkeletonPlaceholder.Item width={activeJobCardWidth * 0.7} height={14} borderRadius={4} />
                    <SkeletonPlaceholder.Item marginTop={5} width={activeJobCardWidth * 0.65} height={14} borderRadius={4} />
                    <SkeletonPlaceholder.Item marginTop={5} width={activeJobCardWidth * 0.5} height={14} borderRadius={4} />
                    <SkeletonPlaceholder.Item marginTop={5} width={activeJobCardWidth * 0.4} height={14} borderRadius={4} />
                    <SkeletonPlaceholder.Item marginTop={20} width={120} height={40} borderRadius={8} />
                </SkeletonPlaceholder.Item>
            </SkeletonPlaceholder>
        </View>);
};

export default CardSkeleton;