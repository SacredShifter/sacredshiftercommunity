# Shift Documentation

This document provides an overview of the Shift module, also known as the Liberation module. It covers the scene structure, how to add new nodes, how chapters are mapped in the video player, and performance tips.

## Scene Structure

The Shift module is a state machine-driven experience that guides the user through a series of scenes. The state machine is defined in `src/modules/liberation/machine.ts`. Each state in the machine corresponds to a scene, and the transitions between states are triggered by user actions or other events.

The scenes themselves are implemented as React components in `src/modules/liberation/scenes/`. The `SceneRouter` component in `src/modules/liberation/scenes/SceneRouter.tsx` is responsible for rendering the current scene based on the state of the `liberationMachine`.

The main scenes are:
- `Intro`: The starting point of the experience.
- `Fear`: The first challenge for the user.
- `Crossing`: A transition scene.
- `Expansion`: A scene for growth and learning.
- `Integration`: The final scene where the user integrates their experience.

## Adding New Nodes

To add a new node (scene) to the Shift module, you need to follow these steps:

1.  **Create a new scene component:** Create a new React component for your scene in the `src/modules/liberation/scenes/` directory.
2.  **Add the scene to the state machine:** Open `src/modules/liberation/machine.ts` and add a new state for your scene. You'll need to define the state and the transitions to and from it.
3.  **Update the `getNextScene` function:** If your new scene is part of the main progression, add it to the `progression` object in the `getNextScene` function in `src/modules/liberation/machine.ts`.
4.  **Add the scene to the `SceneRouter`:** Open `src/modules/liberation/scenes/SceneRouter.tsx` and add a case for your new scene in the `switch` statement. This will render your component when the state machine is in the corresponding state.

## Chapter Mapping

The video player in the YouTube library supports chapters. Chapters are parsed from the video description. The `VideoChapters` component in `src/components/YouTubeLibrary/VideoChapters.tsx` is responsible for this.

The component uses a regular expression to find timestamps in the format `HH:MM:SS` or `MM:SS`. Each line that contains a timestamp is treated as a chapter. The text on the line after the timestamp is used as the chapter title.

When a user clicks on a chapter, the `handleChapterClick` function in `src/components/YouTubeLibrary/VideoPlayerModal.tsx` is called. This function uses the YouTube IFrame Player API to seek to the specified time in the video. It also logs a `media_chapter_jump` event to the telemetry system.

## Performance Tips

The Shift module uses Three.js and WebGL, which can be performance-intensive. Here are some tips for maintaining good performance:

*   **Optimize your models:** Use low-poly models and bake lighting into textures when possible.
*   **Use Drei's performance utilities:** The `usePerformanceMonitor` and `PerformanceMonitor` components from `@react-three/drei` can help you adapt the visual quality of your scene based on the user's device performance.
*   **Be mindful of draw calls:** Each object in your scene adds to the number of draw calls. Try to merge geometries where possible.
*   **Use instancing for repeated objects:** If you have many identical objects in your scene, use instanced rendering to improve performance.
*   **Lazy load assets:** Use React's `lazy` and `Suspense` to load assets only when they are needed.
