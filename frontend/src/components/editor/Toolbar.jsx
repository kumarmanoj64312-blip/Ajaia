// Small inline icons scoped to the toolbar (bold/italic/underline glyphs and
// list markers aren't in the shared icon set since they're only used here).
function IconBold(props) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.8} {...props}>
      <path d="M6 4h5a2.7 2.7 0 0 1 0 5.4H6V4Zm0 5.4h5.6a2.8 2.8 0 0 1 0 5.6H6V9.4Z" strokeLinejoin="round" />
    </svg>
  );
}
function IconItalic(props) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" {...props}>
      <path d="M9 4h6M5 16h6M12 4 8 16" />
    </svg>
  );
}
function IconUnderline(props) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" {...props}>
      <path d="M5 4v5a5 5 0 0 0 10 0V4M4 16h12" />
    </svg>
  );
}
function IconBulletList(props) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" {...props}>
      <circle cx="4" cy="5" r="1" fill="currentColor" stroke="none" />
      <circle cx="4" cy="10" r="1" fill="currentColor" stroke="none" />
      <circle cx="4" cy="15" r="1" fill="currentColor" stroke="none" />
      <path d="M8 5h8M8 10h8M8 15h8" />
    </svg>
  );
}
function IconOrderedList(props) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" {...props}>
      <path d="M8 5h8M8 10h8M8 15h8" />
      <text x="1.5" y="6.5" fontSize="4.5" fill="currentColor" stroke="none">1</text>
      <text x="1.5" y="11.5" fontSize="4.5" fill="currentColor" stroke="none">2</text>
      <text x="1.5" y="16.5" fontSize="4.5" fill="currentColor" stroke="none">3</text>
    </svg>
  );
}

function ToolbarButton({ active, onClick, disabled, label, children, wide = false }) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={active}
      disabled={disabled}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className={`flex h-7 items-center justify-center rounded-md text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-30 ${
        wide ? 'px-2' : 'w-7'
      } ${active ? 'bg-brand-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <span className="mx-1 h-5 w-px bg-slate-200" />;
}

export default function Toolbar({ editor, readOnly }) {
  if (!editor) return null;

  const disabled = readOnly;

  return (
    <div className="flex flex-wrap items-center gap-0.5 border-b border-slate-200 bg-slate-50/60 px-2.5 py-1.5">
      <ToolbarButton
        label="Bold"
        active={editor.isActive('bold')}
        disabled={disabled}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <IconBold className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        label="Italic"
        active={editor.isActive('italic')}
        disabled={disabled}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <IconItalic className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        label="Underline"
        active={editor.isActive('underline')}
        disabled={disabled}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <IconUnderline className="h-4 w-4" />
      </ToolbarButton>

      <Divider />

      {[1, 2, 3].map((level) => (
        <ToolbarButton
          key={level}
          label={`Heading ${level}`}
          active={editor.isActive('heading', { level })}
          disabled={disabled}
          wide
          onClick={() => editor.chain().focus().toggleHeading({ level }).run()}
        >
          H{level}
        </ToolbarButton>
      ))}
      <ToolbarButton
        label="Paragraph"
        active={editor.isActive('paragraph') && !editor.isActive('bulletList') && !editor.isActive('orderedList')}
        disabled={disabled}
        wide
        onClick={() => editor.chain().focus().setParagraph().run()}
      >
        P
      </ToolbarButton>

      <Divider />

      <ToolbarButton
        label="Bulleted list"
        active={editor.isActive('bulletList')}
        disabled={disabled}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <IconBulletList className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        label="Numbered list"
        active={editor.isActive('orderedList')}
        disabled={disabled}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <IconOrderedList className="h-4 w-4" />
      </ToolbarButton>
    </div>
  );
}
