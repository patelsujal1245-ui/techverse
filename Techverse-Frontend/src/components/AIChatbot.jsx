import { useState, useEffect, useRef } from 'react'
import { FiMessageSquare, FiX, FiSend, FiInfo, FiCheckCircle, FiCpu, FiDatabase, FiSettings } from 'react-icons/fi'

const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [showNotification, setShowNotification] = useState(true)
  const [inputMessage, setInputMessage] = useState('')
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: 'Hello! I am the TechVerse Support AI. I can register complaints, check refund rules, track orders, or assist with MERN developer troubleshooting. How can I help you today?',
      sender: 'ai',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ])
  const [isTyping, setIsTyping] = useState(false)
  const chatEndRef = useRef(null)
  
  // cancellation survey states
  const [surveyOrderId, setSurveyOrderId] = useState(null)
  const surveyOrderIdRef = useRef(null)

  // Auto-scroll chat area
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isTyping])

  // Custom Event Listener to trigger chatbot from Page UI buttons & order cancel events
  useEffect(() => {
    const handleOpenEvent = (e) => {
      setIsOpen(true)
      setShowNotification(false)
      
      if (e.detail?.topic === 'cancel-reason-survey') {
        const orderIdShort = e.detail.orderId
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now(),
            text: `I see you cancelled Order #${orderIdShort}. To help us improve our services, could you please tell me the reason for your cancellation?`,
            sender: 'ai',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            metadata: 'refund'
          }
        ])
        surveyOrderIdRef.current = orderIdShort
        setSurveyOrderId(orderIdShort)
      } else if (e.detail?.topic) {
        const initText = e.detail.topic
        const userMessage = {
          id: Date.now(),
          text: initText,
          sender: 'user',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
        setMessages((prev) => [...prev, userMessage])
        setIsTyping(true)
        setTimeout(() => {
          const response = getAIResponse(initText)
          const aiMessage = {
            id: Date.now() + 1,
            text: response.text,
            sender: 'ai',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            metadata: response.type
          }
          setMessages((prev) => [...prev, aiMessage])
          setIsTyping(false)
        }, 1200)
      }
    }
    window.addEventListener('open-chatbot', handleOpenEvent)
    return () => window.removeEventListener('open-chatbot', handleOpenEvent)
  }, [])

  const handleToggle = () => {
    setIsOpen(!isOpen)
    setShowNotification(false)
  }

  const getAIResponse = (userText) => {
    const text = userText.toLowerCase().trim()
    
    // Developer Queries (Behavior like Antigravity Coding Assistant)
    if (text.includes('port') || text.includes('run') || text.includes('deploy') || text.includes('start') || text.includes('npm')) {
      return {
        text: "🔧 Deployment instructions:\n1. Backend API: Navigate to 'Techverse-Backend', check that MongoDB is listening on local port 27017, and run 'npm run dev' to spin up Express on port 5000.\n2. Frontend Client: Navigate to 'Techverse-Frontend' and run 'npm run dev' to boot Vite on port 5173.",
        type: 'developer'
      }
    }

    if (text.includes('code') || text.includes('structure') || text.includes('react') || text.includes('files')) {
      return {
        text: "💻 React Codebase Blueprint:\n- Routes & Pages: Managed in 'src/routes/AppRoutes.jsx' and 'src/pages/'.\n- Context Providers: Cart and wishlist items are bound in 'src/context/ShopContext.jsx'.\n- Global Styling: Set in 'src/index.css' & 'src/App.css'.",
        type: 'developer'
      }
    }

    if (text.includes('bug') || text.includes('error') || text.includes('failed') || text.includes('crash')) {
      return {
        text: "⚠️ Developer Debug Guide:\n- If backend APIs return CORS errors, confirm 'VITE_API_URL' in the frontend .env matches 'http://localhost:5000/api'.\n- If client pages crash, open the browser inspect panel (F12) to trace React Hook execution order mismatches.",
        type: 'developer'
      }
    }

    if (text.includes('credentials') || text.includes('login') || text.includes('password') || text.includes('user') || text.includes('admin')) {
      return {
        text: "🔑 Standard testing profiles:\n- Customer User: jane@techverse.com (password: Student123)\n- Admin User: admin@techverse.com (password: Admin123)\nNote: Make sure to log out of your active Admin session before logging in as a Client Customer.",
        type: 'developer'
      }
    }

    if (text.includes('database') || text.includes('mongodb') || text.includes('mongoose') || text.includes('seed')) {
      return {
        text: "🗄️ Database Schemas:\n- Products and Users collections are managed in MongoDB.\n- Product models are defined in 'Techverse-Backend/models/Product.js'.\n- Run 'npm run seed' in backend to clear and populate database with the 61 catalog items.",
        type: 'developer'
      }
    }

    // Customer Queries (Complaints, Refunds, Tracking)
    if (text.includes('complaint') || text.includes('worst') || text.includes('bad') || text.includes('broken') || text.includes('damage') || text.includes('defect') || text.includes('cheat')) {
      return {
        text: "I am deeply sorry to hear about your experience. I have registered a priority grievance ticket for you (Ticket ID: #TV-78401). Our customer satisfaction team will review your account details and contact you via email within 1 hour. We are committed to making this right for you.",
        type: 'complaint'
      }
    }
    
    if (text.includes('refund') || text.includes('return') || text.includes('money') || text.includes('cancel')) {
      return {
        text: "We offer a hassle-free 100% refund policy. For fresh groceries, you can request a return within 24 hours of delivery. For tech products, returns are accepted within 7 days. You can submit a refund request directly on your profile page.",
        type: 'refund'
      }
    }

    if (text.includes('track') || text.includes('order') || text.includes('where is') || text.includes('delivery')) {
      return {
        text: "You can track all active orders under the 'Profile' section by clicking on 'Order History'. Tech products are shipped within 24 hours, and grocery orders are dispatched instantly using local same-day express routes.",
        type: 'tracking'
      }
    }

    if (text.includes('hello') || text.includes('hi') || text.includes('hey') || text.includes('support')) {
      return {
        text: "Hello! I am here to help. You can ask me to lodge a complaint, check return policies, or troubleshoot MERN environment variables. How can I guide you?",
        type: 'general'
      }
    }

    // Default fallback
    return {
      text: "I understand your concern. I have logged your message and forwarded it to our active customer desk. A live support agent will follow up with you shortly. If this is an urgent complaint, please mention 'complaint' so I can assign a ticket number.",
      type: 'fallback'
    }
  }

  const handleSendMessage = (textToSend) => {
    if (!textToSend.trim()) return

    const userMessage = {
      id: Date.now(),
      text: textToSend,
      sender: 'user',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage('')
    setIsTyping(true)

    // Simulate AI typing delay
    setTimeout(() => {
      let response
      
      if (surveyOrderIdRef.current) {
        surveyOrderIdRef.current = null
        setSurveyOrderId(null)
        response = {
          text: `Thank you for your valuable feedback! We have logged your cancellation reason: "${textToSend}". If your payment was completed online, your refund has been initiated and will credit within 24 hours. Can I assist you with anything else?`,
          type: 'refund'
        }
      } else {
        response = getAIResponse(textToSend)
      }
      
      const aiMessage = {
        id: Date.now() + 1,
        text: response.text,
        sender: 'ai',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        metadata: response.type
      }
      setMessages((prev) => [...prev, aiMessage])
      setIsTyping(false)
    }, 1200)
  }

  const handleQuickAction = (actionText) => {
    handleSendMessage(actionText)
  }

  return (
    <div style={{ position: 'fixed', bottom: '30px', right: '30px', zIndex: 1000, fontFamily: 'inherit' }}>
      {/* Floating Action Button */}
      <button
        onClick={handleToggle}
        style={{
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          backgroundColor: 'var(--accent)',
          color: '#fff',
          boxShadow: '0 8px 30px rgba(15, 23, 42, 0.25)',
          display: 'grid',
          placeItems: 'center',
          fontSize: '1.5rem',
          position: 'relative',
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          border: 'none',
          cursor: 'pointer'
        }}
        className="chatbot-trigger"
        title="AI Support Chat"
      >
        {isOpen ? <FiX /> : <FiMessageSquare />}
        {showNotification && !isOpen && (
          <span
            style={{
              position: 'absolute',
              top: '-2px',
              right: '-2px',
              width: '14px',
              height: '14px',
              backgroundColor: '#ef4444',
              borderRadius: '50%',
              border: '2px solid #fff',
              boxShadow: '0 0 8px rgba(239, 68, 68, 0.6)'
            }}
          />
        )}
      </button>

      {/* Chat Window Panel */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            bottom: '80px',
            right: '0',
            width: '380px',
            height: '520px',
            backgroundColor: '#ffffff',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border)',
            boxShadow: '0 20px 50px rgba(15, 23, 42, 0.15)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
          className="chatbot-window"
        >
          {/* Header */}
          <div
            style={{
              padding: '16px 20px',
              backgroundColor: 'var(--accent)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ position: 'relative' }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255,255,255,0.12)',
                    color: '#fff',
                    display: 'grid',
                    placeItems: 'center',
                    fontWeight: '800',
                    fontSize: '1rem'
                  }}
                >
                  TV
                </div>
                <span
                  style={{
                    position: 'absolute',
                    bottom: '0',
                    right: '0',
                    width: '10px',
                    height: '10px',
                    backgroundColor: '#10b981',
                    borderRadius: '50%',
                    border: '2px solid var(--accent)'
                  }}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <strong style={{ fontSize: '0.92rem', fontWeight: 700 }}>TechVerse AI Assistant</strong>
                <span style={{ fontSize: '0.72rem', color: '#a1a1aa' }}>Online • Developer Trained</span>
              </div>
            </div>
            <button
              onClick={handleToggle}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#fff',
                fontSize: '1.2rem',
                cursor: 'pointer',
                opacity: 0.8
              }}
            >
              <FiX />
            </button>
          </div>

          {/* Messages Body */}
          <div
            style={{
              flex: 1,
              padding: '20px',
              overflowY: 'auto',
              backgroundColor: '#f8fafc',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px'
            }}
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '85%',
                  alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start'
                }}
              >
                {/* Bubble */}
                <div
                  style={{
                    padding: '12px 16px',
                    borderRadius: msg.sender === 'user' ? '18px 18px 2px 18px' : '18px 18px 18px 2px',
                    backgroundColor: msg.sender === 'user' ? 'var(--accent)' : '#ffffff',
                    color: msg.sender === 'user' ? '#ffffff' : 'var(--text)',
                    fontSize: '0.88rem',
                    lineHeight: '1.45',
                    boxShadow: msg.sender === 'user' ? 'none' : '0 2px 8px rgba(15, 23, 42, 0.04)',
                    border: msg.sender === 'user' ? 'none' : '1px solid rgba(15, 23, 42, 0.03)',
                    whiteSpace: 'pre-line' // Preserve spacing for developer format guides
                  }}
                >
                  {msg.text}
                  
                  {/* Complaint Ticket Badge */}
                  {msg.metadata === 'complaint' && (
                    <div style={{
                      marginTop: '10px',
                      padding: '8px 12px',
                      backgroundColor: '#fef2f2',
                      border: '1px solid #fecaca',
                      borderRadius: 'var(--radius-sm)',
                      color: '#991b1b',
                      fontSize: '0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      <FiInfo style={{ shrink: 0 }} />
                      <span>Support Ticket successfully generated.</span>
                    </div>
                  )}

                  {/* Return policy badge */}
                  {msg.metadata === 'refund' && (
                    <div style={{
                      marginTop: '10px',
                      padding: '8px 12px',
                      backgroundColor: '#f0fdf4',
                      border: '1px solid #bbf7d0',
                      borderRadius: 'var(--radius-sm)',
                      color: '#166534',
                      fontSize: '0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      <FiCheckCircle style={{ shrink: 0 }} />
                      <span>Compliant with 24h refund guarantee.</span>
                    </div>
                  )}

                  {/* Developer guidance badge */}
                  {msg.metadata === 'developer' && (
                    <div style={{
                      marginTop: '10px',
                      padding: '8px 12px',
                      backgroundColor: '#eff6ff',
                      border: '1px solid #bfdbfe',
                      borderRadius: 'var(--radius-sm)',
                      color: '#1e40af',
                      fontSize: '0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      <FiSettings style={{ shrink: 0 }} />
                      <span>Antigravity Engineering Helper Active.</span>
                    </div>
                  )}
                </div>
                {/* Time */}
                <span
                  style={{
                    fontSize: '0.7rem',
                    color: 'var(--muted)',
                    marginTop: '4px',
                    padding: '0 4px'
                  }}
                >
                  {msg.time}
                </span>
              </div>
            ))}

            {isTyping && (
              <div style={{ display: 'flex', gap: '4px', alignSelf: 'flex-start', padding: '12px 16px', backgroundColor: '#ffffff', borderRadius: '18px 18px 18px 2px', border: '1px solid rgba(15, 23, 42, 0.03)' }}>
                <span className="dot-blink" style={{ width: '6px', height: '6px', backgroundColor: 'var(--muted)', borderRadius: '50%', display: 'inline-block' }} />
                <span className="dot-blink" style={{ width: '6px', height: '6px', backgroundColor: 'var(--muted)', borderRadius: '50%', display: 'inline-block', animationDelay: '0.2s' }} />
                <span className="dot-blink" style={{ width: '6px', height: '6px', backgroundColor: 'var(--muted)', borderRadius: '50%', display: 'inline-block', animationDelay: '0.4s' }} />
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick Reply Actions */}
          <div
            style={{
              padding: '10px 16px',
              backgroundColor: '#ffffff',
              borderTop: '1px solid var(--border)',
              display: 'flex',
              gap: '8px',
              flexWrap: 'nowrap',
              overflowX: 'auto',
              whiteSpace: 'nowrap'
            }}
            className="chatbot-quick-replies"
          >
            {surveyOrderId ? (
              <>
                <button
                  onClick={() => handleQuickAction('Ordered by mistake')}
                  style={{
                    padding: '6px 12px',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    color: '#374151',
                    backgroundColor: '#f3f4f6',
                    border: '1px solid #d1d5db',
                    borderRadius: '99px',
                    cursor: 'pointer'
                  }}
                >
                  Ordered by mistake
                </button>
                <button
                  onClick={() => handleQuickAction('Delivery is taking too long')}
                  style={{
                    padding: '6px 12px',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    color: '#374151',
                    backgroundColor: '#f3f4f6',
                    border: '1px solid #d1d5db',
                    borderRadius: '99px',
                    cursor: 'pointer'
                  }}
                >
                  Delivery too slow
                </button>
                <button
                  onClick={() => handleQuickAction('Found cheaper elsewhere')}
                  style={{
                    padding: '6px 12px',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    color: '#374151',
                    backgroundColor: '#f3f4f6',
                    border: '1px solid #d1d5db',
                    borderRadius: '99px',
                    cursor: 'pointer'
                  }}
                >
                  Cheaper elsewhere
                </button>
                <button
                  onClick={() => handleQuickAction('Changed my mind')}
                  style={{
                    padding: '6px 12px',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    color: '#374151',
                    backgroundColor: '#f3f4f6',
                    border: '1px solid #d1d5db',
                    borderRadius: '99px',
                    cursor: 'pointer'
                  }}
                >
                  Changed my mind
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => handleQuickAction('Lodge a complaint')}
                  style={{
                    padding: '6px 12px',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    color: '#b91c1c',
                    backgroundColor: '#fef2f2',
                    border: '1px solid #fca5a5',
                    borderRadius: '99px',
                    cursor: 'pointer'
                  }}
                >
                  ⚠️ Lodge Complaint
                </button>
                <button
                  onClick={() => handleQuickAction('Track my delivery')}
                  style={{
                    padding: '6px 12px',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    color: '#1e3a8a',
                    backgroundColor: '#eff6ff',
                    border: '1px solid #bfdbfe',
                    borderRadius: '99px',
                    cursor: 'pointer'
                  }}
                >
                  📦 Track Order
                </button>
                <button
                  onClick={() => handleQuickAction('Developer Ports & Deployment')}
                  style={{
                    padding: '6px 12px',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    color: '#1e40af',
                    backgroundColor: '#eff6ff',
                    border: '1px solid #bfdbfe',
                    borderRadius: '99px',
                    cursor: 'pointer'
                  }}
                >
                  ⚙️ Server Ports
                </button>
                <button
                  onClick={() => handleQuickAction('Default login credentials')}
                  style={{
                    padding: '6px 12px',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    color: '#854d0e',
                    backgroundColor: '#fffbeb',
                    border: '1px solid #fde047',
                    borderRadius: '99px',
                    cursor: 'pointer'
                  }}
                >
                  🔑 Test Accounts
                </button>
              </>
            )}
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSendMessage(inputMessage)
            }}
            style={{
              padding: '16px 20px',
              backgroundColor: '#ffffff',
              borderTop: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type query or MERN question..."
              style={{
                flex: 1,
                padding: '10px 16px',
                border: '1px solid var(--border)',
                borderRadius: '99px',
                fontSize: '0.88rem',
                outline: 'none',
                backgroundColor: 'var(--bg-soft)',
                color: 'var(--text)'
              }}
            />
            <button
              type="submit"
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                backgroundColor: 'var(--accent)',
                color: '#fff',
                display: 'grid',
                placeItems: 'center',
                fontSize: '1rem',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              <FiSend />
            </button>
          </form>
        </div>
      )}
    </div>
  )
}

export default AIChatbot
