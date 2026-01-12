import React, { useEffect, useState } from 'react';
import { GeneratedDocument } from '../types';
import { getUserDocuments, deleteDocument, deleteAllUserDocuments } from '../services/userService';

interface HistoryViewProps {
  userId: string;
  onSelectDocument: (doc: GeneratedDocument) => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({ userId, onSelectDocument }) => {
  const [documents, setDocuments] = useState<GeneratedDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchDocs();
  }, [userId]);

  const fetchDocs = async () => {
    if (!userId) return;
    setLoading(true);
    const docs = await getUserDocuments(userId);
    setDocuments(docs);
    setLoading(false);
  };

  const handleDelete = async (e: React.MouseEvent, docId: string) => {
    e.stopPropagation(); // Prevent opening the document
    if (!window.confirm("Are you sure you want to delete this document?")) return;

    try {
      await deleteDocument(userId, docId);
      setDocuments(prev => prev.filter(d => d.id !== docId));
    } catch (error) {
      alert("Failed to delete document.");
    }
  };

  const handleDeleteAll = async () => {
    if (documents.length === 0) return;
    if (!window.confirm("Are you sure you want to delete ALL documents? This action cannot be undone.")) return;

    setIsDeleting(true);
    try {
      await deleteAllUserDocuments(userId);
      setDocuments([]);
    } catch (error) {
      alert("Failed to delete all documents.");
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rapid-yellow"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 animate-fade-in">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-4">
        <div className="flex items-center gap-4">
          <div className="h-10 w-2 bg-gradient-to-b from-rapid-yellow to-yellow-600 rounded-full"></div>
          <div>
            <h2 className="text-3xl font-extrabold text-rapid-black">Document History</h2>
            <p className="text-sm text-gray-500 mt-1">Manage your generated contracts and letters</p>
          </div>
        </div>
        
        {documents.length > 0 && (
          <button 
            onClick={handleDeleteAll}
            disabled={isDeleting}
            className="flex items-center gap-2 px-5 py-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors text-sm font-bold border border-red-100 shadow-sm"
          >
            {isDeleting ? (
              <span className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            )}
            Delete All
          </button>
        )}
      </div>
      
      {documents.length === 0 ? (
        <div className="text-center py-24 bg-white/60 backdrop-blur-sm rounded-3xl border border-dashed border-gray-300 shadow-sm">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-rapid-black mb-2">No documents yet</h3>
          <p className="text-gray-500">Generate your first document to see it here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {documents.map((doc, index) => (
            <div 
              key={doc.id} 
              className="bg-white p-6 rounded-2xl border border-gray-100 shadow-card hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer group relative animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => onSelectDocument(doc)}
            >
              <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={(e) => doc.id && handleDelete(e, doc.id)}
                  className="p-2 bg-white text-gray-400 hover:text-red-500 rounded-full shadow-md border border-gray-100 transition-colors"
                  title="Delete Document"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>

              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center group-hover:bg-rapid-yellow group-hover:text-rapid-black text-gray-400 transition-colors duration-300 shadow-inner">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <span className="text-xs font-semibold text-gray-400 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">{doc.createdDate}</span>
              </div>
              <h3 className="text-lg font-bold text-rapid-black mb-3 line-clamp-1 group-hover:text-yellow-600 transition-colors">{doc.title}</h3>
              <p className="text-sm text-gray-500 mb-6 line-clamp-3 leading-relaxed">
                {doc.htmlContent.replace(/<[^>]*>/g, '').substring(0, 120)}...
              </p>
              <div className="text-sm font-bold text-rapid-black flex items-center gap-2 group-hover:gap-3 transition-all pt-4 border-t border-gray-50">
                View Document
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-rapid-yellow" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m-4-4H3" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};