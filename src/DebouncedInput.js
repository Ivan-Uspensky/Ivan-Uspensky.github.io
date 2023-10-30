import { useState, useEffect } from "react";

export const DebouncedInput = ({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
  }) => {
  
  const [value, setValue] = useState(initialValue);
  
  useEffect(() => {
    setValue(initialValue)
  }, [initialValue]);
  
  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)

    return () => clearTimeout(timeout)
  }, [value, debounce, onChange])
  
  return (
    <input {...props} value={value} onChange={e => setValue(e.target.value)} />
  )
}

