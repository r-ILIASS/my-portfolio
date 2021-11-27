import NavBar from "./components/NavBar/NavBar";
import Header from "./components/Header/Header";
import "./App.scss";

function App() {
  return (
    <div className="App">
      <NavBar />
      <div class="minusNav">
        <Header />
      </div>
    </div>
  );
}

export default App;
