import React, { useState } from 'react';
import {
  X,
  Mail,
  User,
  Send,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('General Inquiry');
  const [message, setMessage] = useState('');
  const [honeypot, setHoneypot] = useState(''); // Anti-bot trap for Netlify Forms
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Basic front-end check
    if (!name.trim()) {
      setErrorMessage('Please enter your name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (!message.trim() || message.trim().length < 5) {
      setErrorMessage('Please provide a message with at least 5 characters.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Netlify Forms AJAX submission per official docs:
      // https://docs.netlify.com/manage/forms/setup/
      const formPayload: Record<string, string> = {
        'form-name': 'contact',
        'bot-field': honeypot.trim(),
        name: name.trim(),
        email: email.trim(),
        subject: subject.trim(),
        message: message.trim(),
      };

      const response = await fetch('/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(formPayload).toString(),
      });

      if (!response.ok) {
        // Fallback for local environments or custom routing
        const fallbackResponse = await fetch('/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim(),
            subject: subject.trim(),
            message: message.trim(),
            honeypot: honeypot.trim(),
          }),
        });

        if (!fallbackResponse.ok) {
          throw new Error('Unable to send message at this time. Please try again.');
        }
      }

      setIsSuccess(true);
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred while sending. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setName('');
    setEmail('');
    setSubject('General Inquiry');
    setMessage('');
    setHoneypot('');
    setIsSuccess(false);
    setErrorMessage(null);
    onClose();
  };

  return (
    <div
      id="contact-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={handleResetAndClose}
    >
      <div
        id="contact-modal-container"
        className="w-full max-w-lg bg-[#111C10] text-white border border-[#233F1F] rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-[#213B1E] flex items-center justify-between bg-[#152714]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#1E3B18] border border-[#58A72F]/50 flex items-center justify-center text-[#66DE37] shadow-inner shrink-0">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white font-display uppercase tracking-tight">
                Contact Us
              </h2>
              <p className="text-xs text-[#A6D496]">
                Questions, brewery suggestions, or feedback
              </p>
            </div>
          </div>

          <button
            type="button"
            id="contact-modal-close-btn"
            onClick={handleResetAndClose}
            className="w-9 h-9 rounded-xl bg-[#1F371B] hover:bg-[#2B4E26] text-[#DDF1D2] hover:text-white flex items-center justify-center transition-colors cursor-pointer border border-[#31572B]"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6">
          {isSuccess ? (
            <div className="py-6 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#1C3A18] border-2 border-[#58A72F] text-[#66DE37] flex items-center justify-center mx-auto shadow-lg animate-in zoom-in-75">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-black text-white font-display uppercase tracking-tight">
                  Message Sent!
                </h3>
                <p className="text-sm text-[#C6E2BD] max-w-sm mx-auto leading-relaxed">
                  Thank you for reaching out, <span className="font-bold text-white">{name}</span>.{' '}
                  Your inquiry has been received and routed directly to our inbox. We will reply to{' '}
                  <span className="font-bold text-[#66DE37] underline">{email}</span> shortly.
                </p>
              </div>

              <div className="pt-4 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="px-6 py-2.5 rounded-xl bg-[#58A72F] hover:bg-[#68BF38] text-white font-bold text-sm tracking-wide transition-all cursor-pointer shadow-md"
                >
                  Done
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsSuccess(false);
                    setMessage('');
                  }}
                  className="px-4 py-2.5 rounded-xl bg-[#1E331B] hover:bg-[#264422] text-[#A6D496] font-semibold text-xs transition-colors cursor-pointer"
                >
                  Send Another Message
                </button>
              </div>
            </div>
          ) : (
            <form
              name="contact"
              method="POST"
              action="/"
              data-netlify="true"
              data-netlify-honeypot="bot-field"
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              {/* Hidden Netlify Forms identification fields for SPA */}
              <input type="hidden" name="form-name" value="contact" />

              {errorMessage && (
                <div className="p-3 rounded-xl bg-red-900/40 border border-red-500/60 text-red-200 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Bot trap hidden honeypot field for Netlify Forms (invisible to real users) */}
              <p className="hidden" aria-hidden="true">
                <label>
                  Don't fill this out if you're human:{' '}
                  <input
                    type="text"
                    name="bot-field"
                    tabIndex={-1}
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                    autoComplete="off"
                  />
                </label>
              </p>

              {/* Name */}
              <div>
                <label htmlFor="contact-name" className="block text-xs font-bold text-[#A6D496] uppercase tracking-wider mb-1.5 font-brand">
                  Your Name <span className="text-[#F59E0B]">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#719667]">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    id="contact-name"
                    name="name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Alex Miller"
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-[#172715] border border-[#2B4B24] text-white placeholder-[#5C7F53] text-sm focus:outline-none focus:border-[#58A72F] focus:ring-1 focus:ring-[#58A72F] transition-colors"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="contact-email" className="block text-xs font-bold text-[#A6D496] uppercase tracking-wider mb-1.5 font-brand">
                  Your Email Address <span className="text-[#F59E0B]">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#719667]">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    id="contact-email"
                    name="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. alex@example.com"
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-[#172715] border border-[#2B4B24] text-white placeholder-[#5C7F53] text-sm focus:outline-none focus:border-[#58A72F] focus:ring-1 focus:ring-[#58A72F] transition-colors"
                  />
                </div>
                <p className="text-[11px] text-[#7E9E74] mt-1">
                  We'll reply directly to this email address.
                </p>
              </div>

              {/* Topic / Subject */}
              <div>
                <label htmlFor="contact-subject" className="block text-xs font-bold text-[#A6D496] uppercase tracking-wider mb-1.5 font-brand">
                  Inquiry Topic
                </label>
                <select
                  id="contact-subject"
                  name="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#172715] border border-[#2B4B24] text-white text-sm focus:outline-none focus:border-[#58A72F] focus:ring-1 focus:ring-[#58A72F] transition-colors cursor-pointer"
                >
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Brewery Route Suggestion">Brewery Route Suggestion / Correction</option>
                  <option value="Add or Update a Microbrewery">Add or Update a Microbrewery</option>
                  <option value="Feature Request or Feedback">Feature Request or Feedback</option>
                  <option value="Partnership or Media">Partnership or Media</option>
                </select>
              </div>

              {/* Message */}
              <div>
                <label htmlFor="contact-message" className="block text-xs font-bold text-[#A6D496] uppercase tracking-wider mb-1.5 font-brand">
                  Message <span className="text-[#F59E0B]">*</span>
                </label>
                <div className="relative">
                  <textarea
                    id="contact-message"
                    name="message"
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us what's on your mind, suggest a favorite local taproom, or ask any road trip questions..."
                    className="w-full p-3 rounded-xl bg-[#172715] border border-[#2B4B24] text-white placeholder-[#5C7F53] text-sm focus:outline-none focus:border-[#58A72F] focus:ring-1 focus:ring-[#58A72F] transition-colors resize-none"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-4 rounded-xl bg-[#D97706] hover:bg-[#B45309] disabled:bg-[#4D3814] text-white font-bold text-sm tracking-wide font-brand transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg hover:shadow-[#D97706]/30 border border-[#F59E0B]"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>SENDING MESSAGE...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 text-white" />
                      <span>SEND MESSAGE</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
