
const requestMicrophonePermission = async () => {
  try {
    await navigator.mediaDevices.getUserMedia({ audio: true });
    return true;
  } catch (err) {
    console.error("Microphone permission denied", err);
    alert("Microphone access is required for this feature.");
    return false;
  }
};

export { requestMicrophonePermission };
