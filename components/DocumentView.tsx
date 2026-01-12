import React, { useRef, useState } from 'react';
import { GeneratedDocument, SignatureData } from '../types';

declare global {
  interface Window {
    html2pdf: any;
  }
}

interface DocumentViewProps {
  document: GeneratedDocument;
  signature: SignatureData | null;
  onOpenSignature: () => void;
  onReset: () => void;
  onUpdate: (updatedDoc: GeneratedDocument) => void;
}

export const DocumentView: React.FC<DocumentViewProps> = ({ 
  document, 
  signature, 
  onOpenSignature, 
  onReset,
  onUpdate 
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const paperRef = useRef<HTMLDivElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [email, setEmail] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const printDocument = () => {
    window.print();
  };

  const handleToggleEdit = () => {
    if (isEditing) {
      if (contentRef.current) {
        onUpdate({
          ...document,
          htmlContent: contentRef.current.innerHTML
        });
      }
      setIsEditing(false);
    } else {
      setIsEditing(true);
      setTimeout(() => {
        contentRef.current?.focus();
      }, 0);
    }
  };

  const handleCancelEdit = () => {
    if (contentRef.current) {
      contentRef.current.innerHTML = document.htmlContent;
    }
    setIsEditing(false);
  };

  const handleSendToWebhook = async () => {
    if (!email || !email.includes('@')) {
      alert("Please enter a valid email address.");
      return;
    }

    if (!paperRef.current || !window.html2pdf) {
      alert("PDF generation library not loaded or document not ready.");
      return;
    }

    setIsSending(true);

    try {
      const element = paperRef.current;
      const opt = {
        margin: [10, 10, 10, 10],
        filename: `${document.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      const pdfBlob = await window.html2pdf().set(opt).from(element).output('blob');
      const tempDiv = window.document.createElement("div");
      tempDiv.innerHTML = document.htmlContent;
      const textContent = `Title: ${document.title}\nDate: ${document.createdDate}\n\n${tempDiv.innerText}`;
      const textBlob = new Blob([textContent], { type: 'text/plain' });

      const formData = new FormData();
      formData.append('email', email);
      formData.append('file', pdfBlob, 'document.pdf');
      formData.append('text_file', textBlob, 'document.txt');
      formData.append('title', document.title);
      formData.append('textContent', textContent);
      
      const response = await fetch('https://president.app.n8n.cloud/webhook/dd5f9ba2-4761-4920-a86a-c18d9e99dd9c', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 4000);
      } else {
        throw new Error('Webhook responded with error');
      }

    } catch (error) {
      console.error('Error sending document:', error);
      alert('Failed to send document. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto animate-slide-up pb-20 relative">
      
      {/* Success Notification */}
      {showSuccess && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 bg-green-600 text-white px-8 py-4 rounded-xl shadow-2xl animate-fade-in flex items-center gap-3 border border-white/20">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <div>
            <p className="font-bold text-lg">Sent Successfully!</p>
          </div>
        </div>
      )}

      {/* Toolbar - Light Theme */}
      <div className="flex flex-wrap items-center justify-between mb-8 px-4 no-print gap-y-4 bg-white p-4 rounded-2xl border border-rapid-border shadow-soft">
        <div className="flex items-center space-x-4 mb-2 md:mb-0">
          <button 
            onClick={isEditing ? handleCancelEdit : onReset}
            className={`flex items-center transition-colors text-sm font-medium ${isEditing ? 'text-red-500 hover:text-red-600' : 'text-gray-500 hover:text-rapid-black'}`}
          >
            {isEditing ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                Cancel
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Back
              </>
            )}
          </button>
        </div>

        <div className="flex flex-wrap gap-3 items-center">
          <button
            onClick={handleToggleEdit}
            disabled={isSending}
            className={`px-4 py-2 rounded-lg transition-all flex items-center text-sm font-medium ${
              isEditing 
                ? 'bg-green-600 text-white hover:bg-green-500' 
                : 'bg-gray-100 border border-transparent text-rapid-black hover:bg-gray-200'
            }`}
          >
            {isEditing ? 'Save Changes' : 'Edit Text'}
          </button>

          <button 
            onClick={onOpenSignature}
            disabled={isEditing || isSending}
            className={`px-4 py-2 border border-gray-200 rounded-lg flex items-center transition-all text-sm font-medium ${
              isEditing || isSending
                ? 'opacity-50 cursor-not-allowed' 
                : 'bg-white text-rapid-black hover:border-rapid-yellow hover:shadow-sm'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            {signature ? 'Redraw' : 'Sign'}
          </button>

          <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-1 border border-gray-200">
            <input 
              type="email" 
              placeholder="Recipient Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isEditing || isSending}
              className="px-3 py-1 bg-transparent text-sm focus:outline-none text-rapid-black w-48 placeholder-gray-400"
            />
            <button 
              onClick={handleSendToWebhook}
              disabled={isEditing || isSending || !email}
              className={`px-4 py-2 rounded-md flex items-center transition-all text-sm font-semibold ${
                isEditing || isSending || !email
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                  : 'bg-rapid-yellow text-rapid-black hover:bg-yellow-400'
              }`}
            >
              {isSending ? 'Sending...' : 'Send'}
            </button>
          </div>
          
          <button 
            onClick={printDocument}
            disabled={isEditing || isSending}
            className="px-4 py-2 rounded-lg bg-gray-100 text-rapid-black hover:bg-gray-200 transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </button>
        </div>
      </div>

      {/* Paper Representation */}
      <div 
        ref={paperRef}
        className={`bg-white text-slate-900 shadow-2xl paper-shadow min-h-[11in] p-8 md:p-16 relative mx-auto font-serif leading-relaxed transition-all duration-300 border border-gray-200 ${
        isEditing ? 'ring-4 ring-rapid-yellow/30 scale-[1.005]' : ''
      }`}>
        
        <div className="max-w-[7.5in] mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold uppercase tracking-wide text-slate-900">{document.title}</h1>
            <p className="text-slate-500 mt-2 text-sm italic">{document.createdDate}</p>
          </div>

          <div 
            ref={contentRef}
            contentEditable={isEditing}
            suppressContentEditableWarning={true}
            className={`prose prose-slate max-w-none prose-p:text-justify prose-h2:text-xl prose-h2:font-semibold prose-h2:mt-6 prose-h2:mb-3 prose-ul:list-disc prose-ul:ml-5 prose-li:mb-2 text-slate-800 ${
              isEditing ? 'cursor-text focus:outline-none' : ''
            }`}
            dangerouslySetInnerHTML={{ __html: document.htmlContent }}
          />

          <div className="mt-20 flex justify-end">
            <div className="w-64 border-t border-slate-400 pt-4 relative">
              <p className="text-slate-600 font-semibold mb-1">Sincerely,</p>
              
              {signature && (
                <div className="absolute -top-16 left-0 w-48 h-24 pointer-events-none mix-blend-multiply">
                   <img 
                    src={signature.dataUrl} 
                    alt="Signature" 
                    className="w-full h-full object-contain" 
                  />
                </div>
              )}
              
              <div className="mt-8 text-sm text-slate-400">[Authorized Signature]</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};