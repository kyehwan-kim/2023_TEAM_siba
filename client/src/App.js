import "./App.css";
import Router from "./Router";
import Header from "./components/common/Header/Header";
import GlobalStyle from "./components/common/GlobalStyle";
import "bootstrap/dist/css/bootstrap.min.css";
import Blog from "./pages/Blog";
import "../src/styles/media.css";

function App() {
  return (
    <div className="App">
      <GlobalStyle />
      <header className="App-header">
        <Router />
      </header>
      {/* <Blog /> */}
    </div>
  );
}

export default App;
