import React, { useRef, useCallback } from 'react';
import { 
  Bold, Italic, Underline, List, ListOrdered, 
  Link2, Quote, Code, Heading1, Heading2, Heading3,
  AlignLeft, Undo, Redo, RemoveFormatting
} from 'lucide-react';

/**
 * Simple Rich Text Editor Component
 * Compatible with React 19 - uses contentEditable instead of deprecated findDOMNode
 */
const RichTextEditor = ({ value, onChange, placeholder = "Start writing..." }) => {
  const editorRef = useRef(null);

  // Execute document command
  const execCommand = useCallback((command, value = null) => {
    document.execCommand(command, false, value);
    // Trigger onChange after command
    if (editorRef.current && onChange) {
      onChange(editorRef.current.innerHTML);
    }
    // Keep focus on editor
    editorRef.current?.focus();
  }, [onChange]);

  // Handle content changes
  const handleInput = useCallback(() => {
    if (editorRef.current && onChange) {
      onChange(editorRef.current.innerHTML);
    }
  }, [onChange]);

  // Insert link
  const insertLink = useCallback(() => {
    const url = prompt('Enter URL:');
    if (url) {
      execCommand('createLink', url);
    }
  }, [execCommand]);

  // Toolbar button component
  const ToolbarButton = ({ onClick, icon: Icon, title, active = false }) => (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`p-2 rounded hover:bg-gray-200 transition-colors ${
        active ? 'bg-gray-200 text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'
      }`}
    >
      <Icon className="w-4 h-4" />
    </button>
  );

  // Toolbar separator
  const Separator = () => (
    <div className="w-px h-6 bg-gray-300 mx-1" />
  );

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white dark:bg-gray-900 dark:border-gray-800">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 p-2 border-b border-gray-200 bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
        {/* Headings */}
        <ToolbarButton 
          onClick={() => execCommand('formatBlock', 'h1')} 
          icon={Heading1} 
          title="Heading 1" 
        />
        <ToolbarButton 
          onClick={() => execCommand('formatBlock', 'h2')} 
          icon={Heading2} 
          title="Heading 2" 
        />
        <ToolbarButton 
          onClick={() => execCommand('formatBlock', 'h3')} 
          icon={Heading3} 
          title="Heading 3" 
        />
        <ToolbarButton 
          onClick={() => execCommand('formatBlock', 'p')} 
          icon={AlignLeft} 
          title="Paragraph" 
        />
        
        <Separator />
        
        {/* Text formatting */}
        <ToolbarButton 
          onClick={() => execCommand('bold')} 
          icon={Bold} 
          title="Bold (Ctrl+B)" 
        />
        <ToolbarButton 
          onClick={() => execCommand('italic')} 
          icon={Italic} 
          title="Italic (Ctrl+I)" 
        />
        <ToolbarButton 
          onClick={() => execCommand('underline')} 
          icon={Underline} 
          title="Underline (Ctrl+U)" 
        />
        
        <Separator />
        
        {/* Lists */}
        <ToolbarButton 
          onClick={() => execCommand('insertUnorderedList')} 
          icon={List} 
          title="Bullet List" 
        />
        <ToolbarButton 
          onClick={() => execCommand('insertOrderedList')} 
          icon={ListOrdered} 
          title="Numbered List" 
        />
        
        <Separator />
        
        {/* Special formatting */}
        <ToolbarButton 
          onClick={() => execCommand('formatBlock', 'blockquote')} 
          icon={Quote} 
          title="Quote" 
        />
        <ToolbarButton 
          onClick={() => execCommand('formatBlock', 'pre')} 
          icon={Code} 
          title="Code Block" 
        />
        <ToolbarButton 
          onClick={insertLink} 
          icon={Link2} 
          title="Insert Link" 
        />
        
        <Separator />
        
        {/* Undo/Redo */}
        <ToolbarButton 
          onClick={() => execCommand('undo')} 
          icon={Undo} 
          title="Undo (Ctrl+Z)" 
        />
        <ToolbarButton 
          onClick={() => execCommand('redo')} 
          icon={Redo} 
          title="Redo (Ctrl+Y)" 
        />
        <ToolbarButton 
          onClick={() => execCommand('removeFormat')} 
          icon={RemoveFormatting} 
          title="Clear Formatting" 
        />
      </div>
      
      {/* Editor Area */}
      <div
        ref={editorRef}
        contentEditable
        className="min-h-[200px] p-4 outline-none prose prose-sm max-w-none
          focus:ring-2 focus:ring-gray-900 focus:ring-inset
          [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mb-4 [&_h1]:mt-2
          [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mb-3 [&_h2]:mt-2
          [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mb-2 [&_h3]:mt-2
          [&_p]:mb-2 [&_p]:leading-relaxed
          [&_ul]:list-disc [&_ul]:ml-4 [&_ul]:mb-2
          [&_ol]:list-decimal [&_ol]:ml-4 [&_ol]:mb-2
          [&_li]:mb-1
          [&_blockquote]:border-l-4 [&_blockquote]:border-gray-300 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-gray-600 [&_blockquote]:my-2
          [&_pre]:bg-gray-100 [&_pre]:p-3 [&_pre]:rounded [&_pre]:font-mono [&_pre]:text-sm [&_pre]:overflow-x-auto [&_pre]:my-2
          [&_a]:text-brand-blue [&_a]:underline
          [&_strong]:font-bold
          [&_em]:italic
          [&_u]:underline"
        onInput={handleInput}
        onBlur={handleInput}
        dangerouslySetInnerHTML={{ __html: value || '' }}
        data-placeholder={placeholder}
        suppressContentEditableWarning
      />
      
      {/* Empty state placeholder */}
      <style>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;
