# Kisan Mitra Agro Hub

Kisan Mitra Agro Hub is a comprehensive digital assistant designed to empower farmers with critical agricultural information and tools. This application integrates advanced features like AI-driven crop disease detection, real-time market prices, and a personalized farming assistant to support decision-making in agriculture.

## Key Features

- **Crop Doctor**: Identify plant diseases using AI/ML models by simply uploading or scanning a photo of the affected crop. Be aware of model limitations and always verify with local experts.
- **My Farm Today**: A smart summary dashboard providing daily insights, weather updates, and personalized farming tips.
- **Market Prices**: Access real-time and historical market price trends for various crops to make informed selling decisions.
- **Farming Chatbot**: An interactive AI chatbot to answer farming-related queries and provide guidance on best practices.
- **Smart Alerts System**: Receive timely alerts regarding weather changes, potential pest outbreaks, and important farming schedules.
- **Scan History Timeline**: Keep track of all your past crop scans and diagnoses for better disease management.

## Tech Stack

- **Frontend**: React, TypeScript, Vite
- **Styling**: Tailwind CSS
- **Backend/Database**: Supabase
- **Mobile**: Capacitor (for Android APK generation)
- **AI Integration**: Custom ML models and AI services

## Getting Started

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/GOWTHAMBHARGAV08/KISAN-MITRA-APP.git
    ```
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Run the development server**:
    ```bash
    npm run dev
    ```

## Building for Android

To build the Android APK:

1.  Build the web assets:
    ```bash
    npm run build
    ```
2.  Sync with Capacitor:
    ```bash
    npx cap sync
    ```
3.  Open in Android Studio:
    ```bash
    npx cap open android
    ```

## Contributing

contributions are welcome! Please fork the repository and submit a pull request.

## License

[MIT License](LICENSE)
