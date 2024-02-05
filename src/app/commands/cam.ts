import CameraManager from '../managers/camera-manager';
import { ChatManager } from '../managers/chat-manager';

export function CamCommand(chatManager: ChatManager) {
	chatManager.addCmd(['-cam', '-zoom'], () => CameraManager.getInstance().update(GetTriggerPlayer()));
}
