import { useState, useRef } from "react";
import { Bold, Italic, Underline, Link as LinkIcon, Image as ImageIcon, Code, List, ListOrdered, Eye, Edit2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownEditorProps {
    value: string;
    onChange: (value: string) => void;
}

export function MarkdownEditor({ value, onChange }: MarkdownEditorProps) {
    const [isPreview, setIsPreview] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const insertText = (before: string, after: string = "") => {
        if (isPreview) return;
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = value.substring(start, end);
        const newText = value.substring(0, start) + before + selectedText + after + value.substring(end);
        
        onChange(newText);
        
        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start + before.length, end + before.length);
        }, 0);
    };

    return (
        <div className="border rounded-md bg-background focus-within:ring-2 focus-within:ring-ring focus-within:border-transparent overflow-hidden">
            <div className="flex flex-wrap items-center justify-between p-2 border-b bg-muted/30">
                <div className="flex items-center gap-1">
                    <button type="button" onClick={() => setIsPreview(false)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-colors ${!isPreview ? "bg-background shadow-sm border" : "text-muted-foreground hover:bg-muted"}`}>
                        <Edit2 className="w-3.5 h-3.5" /> Write
                    </button>
                    <button type="button" onClick={() => setIsPreview(true)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-colors ${isPreview ? "bg-background shadow-sm border" : "text-muted-foreground hover:bg-muted"}`}>
                        <Eye className="w-3.5 h-3.5" /> Preview
                    </button>
                </div>
                
                {!isPreview && (
                    <div className="flex items-center gap-1">
                        <button type="button" onClick={() => insertText("**", "**")} className="p-1.5 hover:bg-muted rounded text-muted-foreground" title="Bold"><Bold className="w-4 h-4" /></button>
                        <button type="button" onClick={() => insertText("*", "*")} className="p-1.5 hover:bg-muted rounded text-muted-foreground" title="Italic"><Italic className="w-4 h-4" /></button>
                        <button type="button" onClick={() => insertText("<u>", "</u>")} className="p-1.5 hover:bg-muted rounded text-muted-foreground" title="Underline"><Underline className="w-4 h-4" /></button>
                        <div className="w-px h-4 bg-border mx-1" />
                        <button type="button" onClick={() => insertText("[", "](url)")} className="p-1.5 hover:bg-muted rounded text-muted-foreground" title="Link"><LinkIcon className="w-4 h-4" /></button>
                        <button type="button" onClick={() => insertText("![alt text](", ")")} className="p-1.5 hover:bg-muted rounded text-muted-foreground" title="Image"><ImageIcon className="w-4 h-4" /></button>
                        <div className="w-px h-4 bg-border mx-1" />
                        <button type="button" onClick={() => insertText("`", "`")} className="p-1.5 hover:bg-muted rounded text-muted-foreground" title="Code"><Code className="w-4 h-4" /></button>
                        <div className="w-px h-4 bg-border mx-1" />
                        <button type="button" onClick={() => insertText("- ")} className="p-1.5 hover:bg-muted rounded text-muted-foreground" title="Bulleted List"><List className="w-4 h-4" /></button>
                        <button type="button" onClick={() => insertText("1. ")} className="p-1.5 hover:bg-muted rounded text-muted-foreground" title="Numbered List"><ListOrdered className="w-4 h-4" /></button>
                    </div>
                )}
            </div>
            
            <div className="min-h-[200px]">
                {isPreview ? (
                    <div className="p-4 prose prose-sm dark:prose-invert max-w-none">
                        {value ? (
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {value}
                            </ReactMarkdown>
                        ) : (
                            <p className="text-muted-foreground italic">Nothing to preview</p>
                        )}
                    </div>
                ) : (
                    <textarea
                        ref={textareaRef}
                        className="w-full h-[200px] p-4 text-sm bg-transparent resize-y outline-none"
                        placeholder="Leave a description..."
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                    />
                )}
            </div>
        </div>
    );
}
