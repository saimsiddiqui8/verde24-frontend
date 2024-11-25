import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { QueryClient, QueryClientProvider } from "react-query";
import { store, persistor } from "./redux/store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { Loading } from "./components";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  "pk_test_51Q84ITDXm8Pt3arOOI28hj5W9JPohSimaAfVeGxCPCf9N86B5rK1POKOhQpOsNmeaid1cbRAU06yzV8eienwD10B00KDT12v4S",
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60000,
      cacheTime: 600000,
    },
  },
});

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <QueryClientProvider client={queryClient}>
          <Elements stripe={stripePromise}>
            <Loading />
            <RouterProvider router={router} />
          </Elements>
        </QueryClientProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;
