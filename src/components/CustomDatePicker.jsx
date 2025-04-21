import React, { useRef, useState, useEffect } from 'react';
import { DatePicker } from 'element-react';

/**
 * 自定义 DatePicker 组件，解决 getBoundingClientRect 错误
 */
const CustomDatePicker = (props) => {
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    // 延迟渲染实际 DatePicker 组件，确保 DOM 已经准备好
    const timer = setTimeout(() => {
      setMounted(true);
    }, 300); // 添加 300ms 延迟
    
    return () => {
      clearTimeout(timer);
      setMounted(false);
    };
  }, []);

  const handleClick = () => {
    if (!mounted) {
      // 如果点击占位符时组件还未准备好，立即挂载
      setMounted(true);
    }
  };

  if (!mounted) {
    // 初始渲染时返回一个占位符，样式相同但不会触发错误
    return (
      <div 
        className={`custom-date-picker-placeholder ${props.className || ''}`}
        ref={containerRef}
        style={{ width: '100%' }}
        onClick={handleClick}
      >
        <div className="el-input">
          <input 
            type="text" 
            readOnly 
            className="el-input__inner" 
            placeholder={props.placeholder || "选择日期"} 
            style={{ width: '100%', cursor: 'pointer' }}
          />
        </div>
      </div>
    );
  }

  // 当组件挂载后再渲染实际的 DatePicker 组件
  return <DatePicker {...props} />;
};

export default CustomDatePicker; 