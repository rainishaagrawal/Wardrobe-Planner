import React, { useState, forwardRef } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import Input from '../common/Input';

const PasswordInput = forwardRef((props, ref) => {
  const [show, setShow] = useState(false);

  return (
    <div style={{ position: 'relative' }}>
      <Input
        type={show ? 'text' : 'password'}
        ref={ref}
        {...props}
        style={{ paddingRight: '40px' }}
      />
      <button
        type="button"
        onClick={() => setShow(!show)}
        aria-label={show ? "Hide password" : "Show password"}
        style={{
          position: 'absolute',
          right: '12px',
          top: props.label ? '36px' : '12px',
          color: 'var(--color-muted)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {show ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );
});

PasswordInput.displayName = 'PasswordInput';

export default PasswordInput;
