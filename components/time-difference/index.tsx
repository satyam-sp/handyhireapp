// src/components/TimeDifferenceDisplay.tsx
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import duration from 'dayjs/plugin/duration';
import Icon from 'react-native-vector-icons/MaterialIcons'
import InfoTooltip from '../info-tooltip';
import Ionicons from 'react-native-vector-icons/Ionicons'; // Import Ionicons

import { padNumberWithZero } from '../../utils/helper';
// Extend dayjs with plugins
dayjs.extend(customParseFormat);
dayjs.extend(duration);

interface TimeDifferenceDisplayProps {
    slotDate: string; // Expected format: 'YYYY-MM-DD' (e.g., '2025-07-25')
    slotTime: string; // Expected format: 'HH:mm A' (e.g., '10:00 AM') or 'HH:mm' (e.g., '10:00')
}

const TimeDifferenceDisplay: React.FC<TimeDifferenceDisplayProps> = ({ slotDate, slotTime }) => {
    const [timeDiffString, setTimeDiffString] = useState('');
    const [showTooltip, setShowTooltip] = useState(false);
    const [tooltipTargetCoords, setTooltipTargetCoords] = useState({ x: 0, y: 0 });
    const infoIconRef = useRef<any>(null); // Ref for the info icon container

    const handleInfoIconPress = () => {
        if (infoIconRef.current) {
            infoIconRef.current.measureInWindow((x: number, y: number, width: number, height: number) => {
                setTooltipTargetCoords({ x: x + width / 2, y: y }); // Pass center X and top Y of icon
                setShowTooltip(prev => !prev); // Toggle visibility
            });
        }
    };


    useEffect(() => {
        let intervalId: NodeJS.Timeout;

        const calculateTimeDifference = () => {
            const jobDateTimeString = `${slotDate} ${slotTime}`;
            const parseFormats = ['YYYY-MM-DD HH:mm A', 'YYYY-MM-DD HH:mm'];
            const jobDayjs = dayjs(jobDateTimeString, parseFormats);

            if (!jobDayjs.isValid()) {
                setTimeDiffString('Invalid Date/Time');
                return;
            }

            const now = dayjs().add(6, 'hours');;
            const diffSeconds = jobDayjs.diff(now, 'second');

            let result = '';

            if (diffSeconds > 0) {
                // Job is in the future: display days, hours, minutes, seconds
                const durationObj = dayjs.duration(diffSeconds, 'seconds');
                const days = Math.floor(durationObj.asDays());
                const hours = durationObj.hours(); // Remaining hours
                const minutes = durationObj.minutes(); // Remaining minutes
                const seconds = durationObj.seconds(); // Remaining seconds

                const parts = [];
                if (days > 0) {
                    parts.push(`${days} day${days > 1 ? '' : ''}`);
                }
                // Always show hours, minutes, and seconds if there are no days, or if days exist
                // This ensures a continuous countdown format
                if (hours > 0 || days > 0) { // Only show hours if there are hours or days (avoid "0 hours")
                    parts.push(`${padNumberWithZero(hours)} ${hours > 1 ? '' : ''}`);
                }
                if (minutes > 0 || hours > 0 || days > 0) { // Only show minutes if there are minutes or hours/days (avoid "0 minutes")
                    parts.push(`${padNumberWithZero(minutes)} :${minutes > 1 ? '' : ''}`);
                }
                parts.push(`${padNumberWithZero(seconds)} ${seconds > 1 ? '' : ''}`); // Always show seconds

                result = parts.join(' ') + ' left';

            } else if (diffSeconds < 0) {
                // Job is in the past: display days, hours, minutes ago
                const durationObj = dayjs.duration(Math.abs(diffSeconds), 'seconds');
                const days = Math.floor(durationObj.asDays());
                const hours = durationObj.hours();
                const minutes = durationObj.minutes();

                if (days > 0) {
                    result = `Started ${days} day${days > 1 ? 's' : ''} ago`;
                } else if (hours > 0) {
                    result = `Started ${hours} hour${hours > 1 ? 's' : ''} ago`;
                } else if (minutes > 0) {
                    result = `Started ${minutes} minute${minutes > 1 ? 's' : ''} ago`;
                } else {
                    result = `Started just now`;
                }
            } else {
                result = 'Starting now!';
            }
            setTimeDiffString(result.trim());
        };

        // Determine update frequency dynamically for performance vs. responsiveness
        const getUpdateFrequency = () => {
            const jobDateTimeString = `${slotDate} ${slotTime}`;
            const parseFormats = ['YYYY-MM-DD HH:mm A', 'YYYY-MM-DD HH:mm'];
            const jobDayjs = dayjs(jobDateTimeString, parseFormats);

            const diffSeconds = jobDayjs.diff(dayjs(), 'second');

            // Update every second if the job is less than 24 hours away (future or past)
            // Otherwise, update every minute to save resources for long durations.
            if (Math.abs(diffSeconds) < 24 * 3600) { // 24 hours in seconds
                return 1000; // 1 second
            } else {
                return 60000; // 1 minute
            }
        };

        // Initial calculation
        calculateTimeDifference();

        // Set interval with the determined frequency
        intervalId = setInterval(calculateTimeDifference, getUpdateFrequency());

        // Clean up interval on component unmount or prop change
        return () => clearInterval(intervalId);
    }, [slotDate, slotTime]); // Re-run effect if date/time props change

    return (
        <View style={styles.container}>
            <Text style={styles.timeText}><Icon name='timer' size={17} />{timeDiffString}  <TouchableOpacity
                ref={infoIconRef} // Assign ref to the touchable icon
                onPress={handleInfoIconPress}
                style={{marginTop: 8}}
            >
                <Ionicons name="information-circle-outline" size={22} color="#666" />
            </TouchableOpacity></Text>
            <InfoTooltip
                isVisible={showTooltip}
                onClose={() => setShowTooltip(false)}
                targetX={tooltipTargetCoords.x}
                targetY={tooltipTargetCoords.y}
                offsetX={-30} // Adjust these offsets to fine-tune position relative to the icon
                offsetY={-200}
                tooltipWidth={250}
            >
                <Text style={styles.tooltipTextContent}>
                Please note: The timer for this job has ended, so you can no longer revoke applications. Additionally, the chosen employee for this job is now completely booked.
                </Text>
            </InfoTooltip>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 5,
        marginBottom: 10,
        alignItems: 'center',
    },
    timeText: {
        fontSize: 15,
        color: '#00796b',
        fontWeight: '600',
    },
    tooltipTextContent: {
        fontSize: 14,
        color: '#333',
        lineHeight: 20,
    },
});

export default TimeDifferenceDisplay;