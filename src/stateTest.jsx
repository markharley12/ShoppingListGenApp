import React, { useState, useEffect } from 'react';

function MyComponent() {
  // State to hold the resolved value from the promise
  const [resolvedValue, setResolvedValue] = useState(null);

  useEffect(() => {
    // Simulating an asynchronous operation with a Promise
    const fetchData = () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve('Hello, world!');
        }, 2000); // Resolves after 2 seconds
      });
    };

    // Call the asynchronous function and update the state with the resolved value
    fetchData().then((data) => {
      setResolvedValue(data);
    });
  }, []);

  return (
    <div>
      {/* Conditional rendering based on the resolvedValue */}
      {resolvedValue ? <p>Resolved Value: {resolvedValue}</p> : <p>Loading...</p>}
    </div>
  );
}

export default MyComponent;
