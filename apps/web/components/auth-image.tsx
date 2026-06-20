import React from 'react';

export function AuthImage() {
  return (
    <div className="relative hidden bg-muted border-2 border-black md:block">
      <img
        src="/kunal123.png"
        alt="Authentication background"
        className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.85]"
      />
    </div>
  );
}
