import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

/** /faq opens the floating FAQ chatbot and returns home — no separate FAQ page. */
export default function Faq() {
  const { openChat } = useApp();

  useEffect(() => {
    openChat();
  }, [openChat]);

  return <Navigate to="/" replace />;
}
