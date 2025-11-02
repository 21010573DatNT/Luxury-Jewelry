import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { persistor, store } from './Redux/store';
import { PersistGate } from 'redux-persist/integration/react'
import ScrollToTop from "./helper/ScrollToTop";

const root = ReactDOM.createRoot(document.getElementById("root"));
const queryClient = new QueryClient();
root.render(
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <QueryClientProvider client={queryClient}>
                <BrowserRouter>
                    <ScrollToTop />
                    <App />
                </BrowserRouter>
                {/* React Query Devtools đã được ẩn để không hiển thị floating button */}
            </QueryClientProvider>
        </PersistGate>
    </Provider>
);


