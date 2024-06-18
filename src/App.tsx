import { Provider } from 'react-redux';
import './App.css';
import ListingBody from './Components/Listing-Body';
import { productStore } from './Store/ProductStore';
import '@mantine/core/styles.css';

function App() {
  return (
    <div className="App">
      <Provider store={productStore}>
        <ListingBody/>
      </Provider>
    </div>
  );
}

export default App;
