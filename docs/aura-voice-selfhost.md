# Self-Hosting Aura Voice with Whisper.cpp and Piper

This document provides instructions for setting up and running the self-hosted speech-to-text (STT) and text-to-speech (TTS) services for Aura Voice.

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Running the Services

The STT and TTS services are defined in the `docker-compose.yml` file. To run them, simply start the Docker containers:

```bash
docker-compose up -d
```

This will start two services:
- `stt`: A Whisper.cpp server for speech-to-text.
- `tts`: A Piper server for text-to-speech.

The first time you run this command, Docker will download the necessary images and models, which may take some time.

## Configuration

You can customize the models and voices used by the services by creating a `docker-compose.override.yml` file.

### STT Model Selection (Whisper.cpp)

The `stt` service uses Whisper.cpp for speech recognition. You can choose from several models with varying sizes and performance characteristics. The default model is `base.en`.

To use a different model, modify the `command` in your `docker-compose.override.yml`:

```yaml
services:
  stt:
    command: ["--model", "small.en", "--threads", "4", "--port", "9000", "--language", "en"]
```

Available models include `tiny.en`, `base.en`, `small.en`, and `medium.en`. Larger models are more accurate but require more resources and have higher latency.

For a full list of available models, see the [Whisper.cpp documentation](https://github.com/ggerganov/whisper.cpp#available-models-and-languages).

### TTS Voice Selection (Piper)

The `tts` service uses Piper for text-to-speech. You can choose from a wide variety of voices. The default voice is `en_US-libritts-high`.

To use a different voice, modify the `command` in your `docker-compose.override.yml`:

```yaml
services:
  tts:
    command: ["--voice", "en_US-lessac-medium"]
```

You can find a list of available voices and listen to samples on the [Piper samples page](https://rhasspy.github.io/piper-samples/).

## Expected Latency

The latency of the STT service depends heavily on the hardware you are using.

-   **CPU:** On a modern CPU, you can expect a latency of a few seconds for short audio clips. The `threads` parameter in the `command` can be adjusted to match the number of available CPU cores for better performance.
-   **GPU:** For lower latency, you can run the Whisper.cpp container on a machine with a compatible NVIDIA GPU. This requires a different Docker image and setup. For more details, refer to the official `ggerganov/whisper.cpp` Docker Hub page.

## Browser Support

The `AuraVoicePanel` component uses the following browser APIs:

-   `navigator.mediaDevices.getUserMedia`: For accessing the microphone.
-   `MediaRecorder`: For recording audio.

These APIs are supported by all modern browsers, including Chrome, Firefox, Safari, and Edge. However, the user must grant permission for the site to access their microphone. If permission is denied, the voice panel will show an error message.
