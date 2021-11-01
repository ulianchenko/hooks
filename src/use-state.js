import React, { useState } from 'react';
import ReactDOM from 'react-dom';

const App = () => {
  return (
    <div>
      <HookSwitcher/>
    </div>
  );
};

const HookSwitcher = () => {
  const [color, setColor] = useState('white');
  const [fontSize, setFontSize] = useState(14);
  
  const decreaseFontSize = () => {
    return setFontSize((fontSize) => fontSize - 2);
  }

  return (
    <div style={{fontFamily: 'Arial, sans-serif', padding:'10px', backgroundColor: color, fontSize: `${fontSize}px`}}>
      <p>Hello World</p>
      <button onClick={() => setColor('gray')}>Dark</button>
      <button onClick={() => setColor('white')}>Light</button>
      <button onClick={() => setFontSize((fontSize) => fontSize + 2)}>+ Font Size</button>
      <button onClick={() => decreaseFontSize()}>- Font Size</button>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
