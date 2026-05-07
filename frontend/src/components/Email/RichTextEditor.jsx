
import React, { useState, useRef, useEffect } from 'react';
import { 
  Bold, Italic, Underline, Type, 
  AlignLeft, AlignCenter, AlignRight, 
  List, ListOrdered, Quote, 
  Undo, Redo, Link as LinkIcon, 
  Image as ImageIcon, Paperclip, 
  ChevronDown, Palette, Send, X,
  Maximize2, Minimize2, MoreVertical
} from 'lucide-react';

const COLORS = [
  '#000000', '#434343', '#666666', '#999999', '#CCCCCC', '#EFEFEF', '#F3F3F3', '#FFFFFF',
  '#980000', '#FF0000', '#FF9900', '#FFFF00', '#00FF00', '#00FFFF', '#4A86E8', '#0000FF',
  '#9900FF', '#FF00FF', '#E6B8AF', '#F4CCCC', '#FCE5CD', '#FFF2CC', '#D9EAD3', '#D0E0E3',
  '#C9DAF8', '#CFE2F3', '#D9D2E9', '#EAD1DC', '#DD7E6B', '#EA9999', '#F9CB9C', '#FFE599',
  '#B6D7A8', '#A2C4C9', '#A4C2F4', '#9FC5E8', '#B4A7D6', '#D5A6BD', '#CC4125', '#E06666',
  '#F6B26B', '#FFD966', '#93C47D', '#76A5AF', '#6D9EEB', '#6FA8DC', '#8E7CC3', '#C27BA0'
];

const FONTS = [
  { name: 'Sans Serif', value: 'sans-serif' },
  { name: 'Serif', value: 'serif' },
  { name: 'Monospace', value: 'monospace' },
  { name: 'Wide', value: 'wide' },
  { name: 'Narrow', value: 'narrow' },
  { name: 'Comic Sans MS', value: 'comic' },
  { name: 'Garamond', value: 'garamond' },
  { name: 'Georgia', value: 'georgia' },
  { name: 'Tahoma', value: 'tahoma' },
  { name: 'Trebuchet MS', value: 'trebuchet' },
  { name: 'Verdana', value: 'verdana' }
];

const RichTextEditor = ({ 
  value, 
  onChange, 
  onSend, 
  onAttach, 
  isCompose = false,
  placeholder = "Write your message here..."
}) => {
  const textareaRef = useRef(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showFontPicker, setShowFontPicker] = useState(false);
  const [colorMode, setColorMode] = useState('text'); // 'text' or 'bg'
  const [history, setHistory] = useState([value]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Sync external value changes if not caused by internal edit (simple check)
  useEffect(() => {
    if (value !== history[historyIndex]) {
       // Only push if significantly different to avoid loop, 
       // but for a controlled component we usually just trust the prop.
       // Here we'll just keep history for undo/redo
    }
  }, [value]);

  const updateValue = (newValue) => {
    const newHistory = [...history.slice(0, historyIndex + 1), newValue];
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    onChange(newValue);
  };

  const undo = () => {
    if (historyIndex > 0) {
      const prevValue = history[historyIndex - 1];
      setHistoryIndex(historyIndex - 1);
      onChange(prevValue);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const nextValue = history[historyIndex + 1];
      setHistoryIndex(historyIndex + 1);
      onChange(nextValue);
    }
  };

  const applyFormat = (type, val = null) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    let formattedText = '';
    let cursorOffset = 0;

    switch (type) {
      case 'bold':
        formattedText = `**${selectedText || 'bold'}**`;
        cursorOffset = selectedText ? 0 : -2;
        break;
      case 'italic':
        formattedText = `*${selectedText || 'italic'}*`;
        cursorOffset = selectedText ? 0 : -1;
        break;
      case 'underline':
        formattedText = `__${selectedText || 'underline'}__`;
        cursorOffset = selectedText ? 0 : -2;
        break;
      case 'strike':
        formattedText = `~~${selectedText || 'strike'}~~`;
        cursorOffset = selectedText ? 0 : -2;
        break;
      case 'font':
        formattedText = `{{font:${val}}}${selectedText || 'text'}{{/font}}`;
        break;
      case 'size':
        formattedText = `{{size:${val}}}${selectedText || 'text'}{{/size}}`;
        break;
      case 'align':
        formattedText = `\n{{align:${val}}}\n${selectedText || 'text'}\n{{/align}}\n`;
        break;
      case 'color':
        formattedText = `{{color:${val}}}${selectedText || 'text'}{{/color}}`;
        break;
      case 'bg':
        formattedText = `{{bg:${val}}}${selectedText || 'text'}{{/bg}}`;
        break;
      case 'list-bullet':
        formattedText = `\n• ${selectedText || 'Item'}`;
        break;
      case 'list-number':
        formattedText = `\n1. ${selectedText || 'Item'}`;
        break;
      case 'quote':
        formattedText = `\n> ${selectedText || 'Quote'}`;
        break;
      case 'link':
        const url = prompt('Enter URL:', 'https://');
        if (!url) return;
        formattedText = `[${selectedText || 'link'}](${url})`;
        break;
      default:
        return;
    }

    const newValue = value.substring(0, start) + formattedText + value.substring(end);
    updateValue(newValue);

    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + formattedText.length + cursorOffset;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
    
    setShowColorPicker(false);
    setShowFontPicker(false);
  };

  return (
    <div className="flex flex-col h-full border border-gray-200 rounded-lg overflow-hidden bg-white dark:bg-gray-900 dark:border-gray-800 shadow-sm z-50">
      {/* Toolbar */}
      <div className="flex items-center gap-1 p-2 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 border-b border-gray-200 flex-wrap z-50">
        <button onClick={undo} className="p-1.5 hover:bg-gray-200 rounded text-gray-600 dark:text-gray-400" title="Undo">
          <Undo size={16} />
        </button>
        <button onClick={redo} className="p-1.5 hover:bg-gray-200 rounded text-gray-600 dark:text-gray-400" title="Redo">
          <Redo size={16} />
        </button>
        
        <div className="w-px h-5 bg-gray-300 mx-1" />
        
        <div className="relative">
          <button 
            onClick={() => setShowFontPicker(!showFontPicker)}
            className="flex items-center gap-1 px-2 py-1 hover:bg-gray-200 rounded text-sm text-gray-700 dark:text-gray-300 font-medium"
          >
            Sans Serif <ChevronDown size={12} />
          </button>
          
          {showFontPicker && (
            <div className="absolute top-full left-0 mt-1 w-40 bg-white dark:bg-gray-900 dark:border-gray-800 border border-gray-200 rounded-lg shadow-xl py-1 z-50 max-h-60 overflow-y-auto">
              {FONTS.map(font => (
                <button
                  key={font.value}
                  onClick={() => applyFormat('font', font.value)}
                  className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:bg-[#0a0a0c] text-sm"
                  style={{ fontFamily: font.value }}
                >
                  {font.name}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="w-px h-5 bg-gray-300 mx-1" />

        <button onClick={() => applyFormat('bold')} className="p-1.5 hover:bg-gray-200 rounded text-gray-700 dark:text-gray-300 font-bold" title="Bold">
          <Bold size={16} />
        </button>
        <button onClick={() => applyFormat('italic')} className="p-1.5 hover:bg-gray-200 rounded text-gray-700 dark:text-gray-300 italic" title="Italic">
          <Italic size={16} />
        </button>
        <button onClick={() => applyFormat('underline')} className="p-1.5 hover:bg-gray-200 rounded text-gray-700 dark:text-gray-300 underline" title="Underline">
          <Underline size={16} />
        </button>
        
        <div className="relative">
            <button 
                onClick={() => setShowColorPicker(!showColorPicker)} 
                className="p-1.5 hover:bg-gray-200 rounded text-gray-700 dark:text-gray-300 flex items-center gap-1"
                title="Text Color"
            >
                <div className="flex flex-col items-center">
                    <span className="font-bold text-sm leading-none">A</span>
                    <div className="w-4 h-1 bg-black mt-0.5"></div>
                </div>
                <ChevronDown size={10} />
            </button>

            {showColorPicker && (
                <div className="absolute top-full left-0 mt-1 p-3 bg-white dark:bg-gray-900 dark:border-gray-800 border border-gray-200 rounded-lg shadow-xl z-50 w-64">
                    <div className="flex items-center justify-between mb-2">
                         <div className="flex bg-gray-100 dark:bg-[#0a0a0c] rounded p-0.5">
                             <button 
                                onClick={() => setColorMode('text')}
                                className={`px-3 py-1 text-xs rounded ${colorMode === 'text' ? 'bg-white dark:bg-gray-900 dark:border-gray-800 shadow-sm font-medium' : 'text-gray-500'}`}
                             >
                                Text
                             </button>
                             <button 
                                onClick={() => setColorMode('bg')}
                                className={`px-3 py-1 text-xs rounded ${colorMode === 'bg' ? 'bg-white dark:bg-gray-900 dark:border-gray-800 shadow-sm font-medium' : 'text-gray-500'}`}
                             >
                                Background
                             </button>
                         </div>
                    </div>
                    
                    <div className="grid grid-cols-8 gap-1">
                        {COLORS.map(color => (
                            <button
                                key={color}
                                onClick={() => applyFormat(colorMode === 'text' ? 'color' : 'bg', color)}
                                className="w-6 h-6 rounded-sm border border-gray-100 hover:scale-110 transition-transform"
                                style={{ backgroundColor: color }}
                                title={color}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>

        <div className="w-px h-5 bg-gray-300 mx-1" />

        <button onClick={() => applyFormat('align', 'left')} className="p-1.5 hover:bg-gray-200 rounded text-gray-600 dark:text-gray-400" title="Align Left">
          <AlignLeft size={16} />
        </button>
        <button onClick={() => applyFormat('align', 'center')} className="p-1.5 hover:bg-gray-200 rounded text-gray-600 dark:text-gray-400" title="Align Center">
          <AlignCenter size={16} />
        </button>
        <button onClick={() => applyFormat('align', 'right')} className="p-1.5 hover:bg-gray-200 rounded text-gray-600 dark:text-gray-400" title="Align Right">
          <AlignRight size={16} />
        </button>

        <div className="w-px h-5 bg-gray-300 mx-1" />

        <button onClick={() => applyFormat('list-bullet')} className="p-1.5 hover:bg-gray-200 rounded text-gray-600 dark:text-gray-400" title="Bullet List">
          <List size={16} />
        </button>
        <button onClick={() => applyFormat('list-number')} className="p-1.5 hover:bg-gray-200 rounded text-gray-600 dark:text-gray-400" title="Numbered List">
          <ListOrdered size={16} />
        </button>
        <button onClick={() => applyFormat('quote')} className="p-1.5 hover:bg-gray-200 rounded text-gray-600 dark:text-gray-400" title="Quote">
          <Quote size={16} />
        </button>
        
         <div className="w-px h-5 bg-gray-300 mx-1" />
         
         <button onClick={() => applyFormat('link')} className="p-1.5 hover:bg-gray-200 rounded text-gray-600 dark:text-gray-400" title="Insert Link">
            <LinkIcon size={16} />
        </button>
      </div>

      {/* Editor Area */}
      <div className="flex-1 relative bg-white dark:bg-black">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => updateValue(e.target.value)}
          placeholder={placeholder}
          className="w-full h-full p-4 resize-none focus:outline-none font-sans text-base text-gray-800 dark:text-gray-50 leading-relaxed"
          style={{ minHeight: isCompose ? '300px' : '120px' }}
        />
      </div>

      {/* Footer / Send Area */}
      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 border-t border-gray-200">
        <div className="flex items-center gap-2">
            <button 
                onClick={onSend}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-medium transition-colors shadow-sm"
            >
                Send <Send size={16} />
            </button>
            <div className="h-6 w-px bg-gray-300 mx-2"></div>
            <button 
                onClick={onAttach}
                className="p-2 hover:bg-gray-200 rounded text-gray-600 dark:text-gray-400 transition-colors"
                title="Attach Files"
            >
                <Paperclip size={20} />
            </button>
        </div>
      </div>
    </div>
  );
};

export default RichTextEditor;
