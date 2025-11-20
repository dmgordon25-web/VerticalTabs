# Edge-Style Vertical Tabs Extension

A Chrome Extension that mimics the look and feel of Microsoft Edge's vertical tabs (Light Mode), featuring Tab Groups, Drag & Drop, and Context Menus.

## 1. Prerequisites

You need **Node.js** installed on your computer to build the extension from the source code.

## 2. Installation Instructions

### Step 1: Build the Project

Open your terminal in the project folder and run the following commands:

```bash
# Install dependencies
npm install

# Build the extension
npm run build
```

This will create a `dist` folder containing the compiled files ready for Chrome.

### Step 2: Load into Chrome

1. Open Google Chrome and navigate to `chrome://extensions`.
2. Enable **Developer mode** using the toggle switch in the top right corner.
3. Click the **Load unpacked** button that appears in the top left.
4. Select the `dist` folder that was created in the previous step.

### Step 3: Activate the Side Panel

1. Pin the extension to your toolbar if desired.
2. Click the "Side Panel" icon in the Chrome toolbar (usually next to your profile picture).
3. Select "Edge-Style Vertical Tabs" from the dropdown menu in the side panel.

## Features

*   **Vertical Layout**: Mimics Edge's design.
*   **Tab Groups**: Fully supports Chrome Tab Groups (visualized with colored indicators).
*   **Drag & Drop**: Reorder tabs effortlessly.
*   **Search**: Quickly filter tabs.
*   **Context Menu**: Right-click tabs to Mute, Pin, or open in Split Screen.
*   **Recently Closed**: Access history via the clock icon in the header.
