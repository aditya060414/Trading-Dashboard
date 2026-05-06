# MarketEx Dashboard

Welcome to the **MarketEx Dashboard**, the comprehensive frontend web application for the MarketEx platform. This dashboard serves as the central hub for users to manage their investments, track live market data, execute trades, and monitor their portfolios in real time.

Built with modern web technologies, the dashboard provides a highly responsive, intuitive, and professional trading experience.

---

---

## Live link
```link
https://trading-dashboard-v2mi.onrender.com
```

---

## Key Features

* **Real-time Market Data:** Live updates for stock prices and market movements utilizing WebSockets.
* **Advanced Charting:** Interactive candlestick and line charts powered by `lightweight-charts` and `chart.js` for deep technical analysis.
* **Portfolio Management:** Detailed views of user holdings, funds, and transaction summaries.
* **Trading Interface:** Seamless buy and sell components to execute orders efficiently.
* **Custom Watchlists:** Users can create and manage watchlists to keep track of their favorite stocks.
* **User Authentication:** Secure login, signup, and profile management (username/password changes) features.
* **Responsive Design:** A polished, user-friendly interface built with Material UI (`@mui/material`) for consistency and responsiveness across devices.

## Technology Stack

* **Core:** [React 19](https://react.dev/)
* **Routing:** [React Router DOM](https://reactrouter.com/) for seamless single-page application navigation.
* **Styling & UI:** [Material UI (MUI)](https://mui.com/) & [Emotion](https://emotion.sh/) for robust component styling, plus [Lucide React](https://lucide.dev/) for iconography.
* **Charting:** 
  * [Lightweight Charts](https://tradingview.github.io/lightweight-charts/) (by TradingView)
  * [Chart.js](https://www.chartjs.org/) & `react-chartjs-2`
* **Data Fetching:** [Axios](https://axios-http.com/) for REST API communication.
* **Real-time Communication:** [WebSocket (`ws`)](https://github.com/websockets/ws) for live market feeds.
* **Notifications:** [React Toastify](https://fkhadra.github.io/react-toastify/) for user-friendly alert messages.

## Project Structure

The core application logic resides in the `src/` directory.

```text
src/
├── components/          # Reusable UI components
│   ├── AuthLayout.js    # Authentication wrappers
│   ├── Dashboard.js     # Main dashboard view
│   ├── CandleChart.js   # Candlestick charting component
│   ├── Holdings.js      # Portfolio holdings view
│   ├── WatchList.js     # User watchlist management
│   ├── BuyComponent.js / SellComponent.js # Order execution
│   └── ...              # Other core components
├── API.js               # Centralized API service configuration
├── Auth.js              # Authentication logic and context
├── ProtectedRoute.jsx   # Route guards for authenticated views
├── index.js             # Application entry point
└── index.css            # Global styling configurations
```

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

Ensure you have Node.js and npm installed on your local machine.
* [Node.js](https://nodejs.org/) (v16 or higher recommended)

### Installation

1. **Navigate to the dashboard directory:**
   ```bash
   cd dashboard
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   Create a `.env` file in the root of the `dashboard` directory and add the necessary environment variables (e.g., API base URLs, WebSocket endpoints).

### Running the Application

To start the development server:

```bash
npm start
```

The application will be available at [http://localhost:3000](http://localhost:3000). The page will automatically reload if you make edits.

### Building for Production

To create an optimized production build:

```bash
npm run build
```

This builds the app for production to the `build` folder, correctly bundling React and optimizing the build for the best performance.


