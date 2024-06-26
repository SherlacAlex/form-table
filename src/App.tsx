import { Provider } from 'react-redux';
import './App.css';
import ListingBody from './Components/Listing-Body';
import { productStore } from './Store/ProductStore';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/notifications/styles.css';
import { Notifications } from '@mantine/notifications'

function App() {
  return (
    <div className="App">
      <Provider store={productStore}>
        <Notifications  position="top-right" zIndex={1000}/>
        <ListingBody/>
      </Provider>
    </div>
  );
}

export default App;
