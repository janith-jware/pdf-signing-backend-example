import React, { useRef } from 'react';
import SignaturePad from 'signature_pad';
import axios from 'axios';

const SignaturePadComponent = () => {
  const canvasRef = useRef(null);
  const padRef = useRef(null);

  React.useEffect(() => {
    padRef.current = new SignaturePad(canvasRef.current);
  }, []);

  const handleClear = () => {
    padRef.current.clear();
  };

  const handleSubmit = async () => {
    if (padRef.current.isEmpty()) {
      alert('Please provide a signature first.');
      return;
    }

    const signature = padRef.current.toDataURL();
    try {
      const response = await axios.post(
        'http://localhost:5000/sign',
        { signature },
        { responseType: 'blob' }
      );
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'signed_contract.pdf';
      link.click();
    } catch (err) {
      alert('Error signing contract');
    }
  };

  return (
    <div>
      <h3>Sign Below:</h3>
      <canvas
        ref={canvasRef}
        width={400}
        height={150}
        style={{ border: '1px solid black' }}
      ></canvas>
      <div>
        <button onClick={handleClear}>Clear</button>
        <button onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  );
};

export default SignaturePadComponent;
