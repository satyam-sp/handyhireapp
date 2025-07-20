// services/actionCable.ts
import { createConsumer } from '@rails/actioncable';

const cable = createConsumer('wss://eb9aea6edb69.ngrok-free.app/cable');
(cable as any).connection.monitor.debug = true;

export default cable;
