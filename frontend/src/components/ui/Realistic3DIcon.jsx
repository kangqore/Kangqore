import React from 'react';

/**
 * Realistic3DIcon - A component that wraps an icon in a 3D solid element container.
 * @param {Object} props
 * @param {React.ElementType} props.icon - The Lucide icon component or any React element.
 * @param {string} props.className - Tailwind classes for the outer container.
 * @param {string} props.iconSize - Tailwind classes for the SVG icon.
 * @param {'light' | 'brand' | 'cyan' | 'dark' | 'glass'} props.theme - The 3D theme to apply.
 */
const Realistic3DIcon = ({ icon: Icon, className = "w-12 h-12", iconSize = "w-6 h-6", theme = "light" }) => {
  const themeClasses = {
    light: "solid-3d-element",
    brand: "solid-3d-element solid-3d-brand",
    cyan: "solid-3d-element solid-3d-cyan",
    dark: "solid-3d-element solid-3d-dark",
    glass: "solid-3d-element bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-inner"
  };

  const renderIcon = () => {
    if (!Icon) return null;
    
    // Robust check for component types (Function components or special objects like forwardRef/memo)
    // We avoid React.isValidElement because it can fail if multiple React instances exist.
    // Elements always have a 'props' object, while component types do not.
    const isComponentType = typeof Icon === 'function' || 
                           (typeof Icon === 'object' && Icon.$$typeof && !Icon.props);
    
    if (isComponentType) {
      const Component = Icon;
      return <Component className={iconSize} strokeWidth={1.5} />;
    }

    // If it's an element or any other renderable, just return it
    return Icon;
  };

  return (
    <div className={`realistic-3d-icon-container ${className}`}>
      <div className={`w-full h-full rounded-2xl flex items-center justify-center ${themeClasses[theme]}`}>
        {renderIcon()}
      </div>
    </div>
  );
};

export default Realistic3DIcon;
