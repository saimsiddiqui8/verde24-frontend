import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { QueryClient, QueryClientProvider } from "react-query";
import { store, persistor } from "./redux/store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { Loading } from "./components";
// import { useEffect } from "react";
// import io from 'socket.io-client';



const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60000,
      cacheTime: 600000,
    },
  },
});

function App() {

  // useEffect(() => {
  //   const socket = io('http://localhost:8000/');

  //   socket.on('connect', () => {
  //     console.log('Connected to sockets');
  //   });

  //   return () => {
  //     socket.disconnect();
  //   };
  // }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <QueryClientProvider client={queryClient}>
          <Loading />
          <RouterProvider router={router} />
        </QueryClientProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;
