import { useEffect, useRef } from 'react';
import cable from '../../services/actionCable';
import { getStorageData } from '../../utils/storage-helper';

// Define types for subscription callbacks
interface NotificationData {
  title: string;
  job_id?: number;
  [key: string]: any;
}

export const useInstantJobCable = (subscriptionRef: any, id?: number): void => {

  useEffect(() => {
    const connect = async () => {
      const employee = await getStorageData('user');
      const employeeId = id || employee?.id;

      if (!employeeId) {
        console.warn('Employee ID missing');
        return;
      }

      subscriptionRef.current = cable.subscriptions.create(
        { channel: 'InstantjobNotificationChannel', employee_id: employeeId.toString() },
        {
          connected(): void {
            console.log('✅ Cable connected');
          },
          disconnected(): void {
            console.log('🔌 Cable disconnected');
          },
          received(data: NotificationData): void {
            console.log('🔔 RECEIVED RAW DATA', data);
            debugger;
            try {
              console.log(data?.title || JSON.stringify(data));
            } catch (e) {
              console.error('Failed to parse message', e);
            }
            // Handle notification data (Redux, UI, etc.)
          }
          
        }
      );

    };


    connect();

    return () => {
      if (subscriptionRef.current) {
        cable.subscriptions.remove(subscriptionRef.current);
      }
    };
  }, [id]);
};
