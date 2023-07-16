import logo from './logo.svg';
import './App.css';

import cssLogo from './images/css_logo.png'
import htmlLogo from './images/html_logo.png'
import jsLogo from './images/js_logo.png'
import reactLogo from './images/react_logo.png'

const copyRight = '2020'
const Footer = () => (
  <footer>
    <div className='footer-wrapper'>
      <p>Copyright &copy;{copyRight}</p>
    </div>
  </footer>
)

// User Card Component
const Image1 = () => (
  <div className='Image1'>
    <img src={cssLogo} alt='css Logo' />
    <img src={htmlLogo} alt='html Logo' />
    <img src={jsLogo} alt='js Logo' />
    <img src={reactLogo} alt='react Logo' />
    <h2>Caption 1</h2>
  </div>
)

const App = () => {
  return (
    <div className="App">
      <header className="App-header">
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
        <div>
          <Image1 />
        </div>
        <div>
          <Footer />
        </div>
      </header>
    </div>
  );
}

export default App;
