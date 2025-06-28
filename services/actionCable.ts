// services/actionCable.ts
import { createConsumer } from '@rails/actioncable';

const cable = createConsumer('wss://fab0-2401-4900-1c09-1211-b5fa-2298-fb28-8cd4.ngrok-free.app/cable');
(cable as any).connection.monitor.debug = true;

export default cable;
