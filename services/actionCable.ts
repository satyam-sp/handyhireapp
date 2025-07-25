// services/actionCable.ts
import { createConsumer } from '@rails/actioncable';

const cable = createConsumer('wss://99b2b4ff54d5.ngrok-free.app/cable');
(cable as any).connection.monitor.debug = true;

export default cable;
