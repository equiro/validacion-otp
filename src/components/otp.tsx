// src/components/OtpForm.tsx
import React, { useState, useEffect, ChangeEvent, KeyboardEvent } from 'react';

// Helper function to focus the next or previous input
const focus = (index: number, direction: "next" | "prev", inputs: HTMLInputElement[]) => {
  if (direction === "next" && index < inputs.length - 1) {
    inputs[index + 1].focus();
  } else if (direction === "prev" && index > 0) {
    inputs[index - 1].focus();
  }
};

const OtpForm: React.FC = () => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [isValid, setIsValid] = useState(false);
  const codeFromUrl = new URLSearchParams(window.location.search).get("code") || "";

  // Check if the OTP is valid
  useEffect(() => {
    setIsValid(otp.join("") === codeFromUrl);
  }, [otp, codeFromUrl]);

  // Handle input change
  const handleChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    if (/^\d$/.test(value) || value === "") {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Focus next input if current input is filled
      if (value && index < otp.length - 1) {
        focus(index, "next", Array.from(document.querySelectorAll("input")));
      }
    }
  };
  const handleClick = () => {
    if (isValid) {
      alert("¡El código es correcto!");
    } else {
      alert("Lo sentimos, el código es incorrecto.");
    }
  };
  const handleVolver = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'ArrowRight') {
      focus(index, 'next', Array.from(document.querySelectorAll('input')));
    } else if (e.key === 'ArrowLeft') {
      focus(index, 'prev', Array.from(document.querySelectorAll('input')));
    } else if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        const newOtp = [...otp];
        newOtp[index - 1] = '';
        setOtp(newOtp);
        focus(index, 'prev', Array.from(document.querySelectorAll('input')));
      }
    }
  };

  // Handle paste
  const handlePegar = (e: React.ClipboardEvent<HTMLInputElement>, index: number) => {
    const pastedData = e.clipboardData.getData('Text');
    if (/^\d{4}$/.test(pastedData)) {
      setOtp(pastedData.split(''));
      (document.querySelectorAll('input')[index + 3] as HTMLInputElement).focus();
    }
  };

  return (
    <div className="main flex flex-col items-center justify-center min-h-screen bg-gray-100">
      
      <h4 className="text-2xl font-bold mb-6">Digite su código</h4>
      <form className="flex gap-2">

      <div className="flex space-x-2">
      {otp.map((digit, index) => (
        <input
        key={index}
        id={`otp-input-${index}`}
        type="text"
        value={digit}
        onChange={(e) => handleChange(e, index)}
        onKeyDown={(e) => handleVolver(e, index)}
        onPaste={(e) => handlePegar(e, index)}
        className="input input-bordered input-primary w-4 h-4 text-center text-lg mx-2" 
        maxLength={1}
      />
      ))}
    </div>
      </form>
      <div className='mt-16'>
      <button
       onClick={handleClick}
       disabled={!isValid}
        className={ ` button mt-4 px-4 py-2 rounded-md text-white ${isValid ? 'bg-green-500' : 'bg-gray-400 cursor-not-allowed'}`}
      >

        Ingresar
      </button>
      </div>
    </div>
  );
};

export default OtpForm;
