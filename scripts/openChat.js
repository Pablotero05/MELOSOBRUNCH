/*document.addEventListener('DOMContentLoaded', () => {
    const chat = document.getElementById('floating-chat');
    const toggle = document.getElementById('chat-toggle');
    const close = document.getElementById('chat-close');
    const input = document.getElementById('chatInput');
    const send = document.getElementById('sendButton');
    const display = document.getElementById('chatDisplay');

    // Toggle chat
    const toggleChat = () => chat.classList.toggle('open');
    toggle.addEventListener('click', toggleChat);
    close.addEventListener('click', toggleChat);

    // Enviar mensaje (Enter o botón)
    const sendMessage = () => {
        const msg = input.value.trim();
        if (!msg) return;
        
        // Mensaje usuario
        const userMsg = document.createElement('div');
        userMsg.className = 'chat-message self-end bg-blue-500 text-white max-w-[85%] rounded-lg px-3 py-1.5 text-sm';
        userMsg.textContent = msg;
        display.appendChild(userMsg);
        
        // Simular bot (reemplaza por tu n8n API)
        setTimeout(() => {
            const botMsg = document.createElement('div');
            botMsg.className = 'chat-message self-start bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 max-w-[85%] rounded-lg px-3 py-1.5 text-sm';
            botMsg.textContent = '¡Gracias por tu mensaje! (Conecta aquí tu n8n webhook)';
            display.appendChild(botMsg);
        }, 800);
        
        input.value = '';
        display.scrollTop = display.scrollHeight;
        input.focus();
    };
    
    send.addEventListener('click', sendMessage);
    input.addEventListener('keypress', e => e.key === 'Enter' && sendMessage());

    // Focus auto al abrir
    toggle.addEventListener('click', () => setTimeout(() => input.focus(), 400));
});*/


document.addEventListener('DOMContentLoaded', () => {
    const chat = document.getElementById('floating-chat');
    const toggle = document.getElementById('chat-toggle');
    const close = document.getElementById('chat-close');
    const input = document.getElementById('chatInput');
    const send = document.getElementById('sendButton');
    const display = document.getElementById('chatDisplay');

    // ID de sesión único (para conversaciones contextuales en n8n)
    const sessionId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);

    // Toggle chat
    const toggleChat = () => chat.classList.toggle('open');
    toggle.addEventListener('click', toggleChat);
    close.addEventListener('click', toggleChat);

    // Mostrar "escribiendo..." del bot
    const showTyping = () => {
        const typing = document.createElement('div');
        typing.id = 'typing-indicator';
        typing.className = 'chat-message self-start bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 max-w-[85%] rounded-lg px-3 py-1.5 text-sm opacity-0 animate-pulse';
        typing.innerHTML = '<div class="flex items-center space-x-1"><div class="w-2 h-2 bg-zinc-400 rounded-full animate-bounce"></div><div class="w-2 h-2 bg-zinc-400 rounded-full animate-bounce" style="animation-delay: 0.1s"></div><div class="w-2 h-2 bg-zinc-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div><span class="text-xs ml-2">Escribiendo...</span></div>';
        display.appendChild(typing);
        setTimeout(() => typing.classList.add('opacity-100'), 100);
        return typing;
    };

    // Enviar mensaje a n8n
    const sendMessage = async () => {
        const msg = input.value.trim();
        if (!msg) return;

        // Mensaje usuario (inmediato)
        const userMsg = document.createElement('div');
        userMsg.className = 'chat-message self-end bg-meloso-primary-color text-white max-w-[60%] rounded-lg px-3 m text-sm';
        userMsg.textContent = msg;
        display.appendChild(userMsg);

        // Limpiar input + scroll
        input.value = '';
        display.scrollTop = display.scrollHeight;
        input.focus();

        // Indicador "escribiendo"
        const typingIndicator = showTyping();

        try {
            // POST a tu n8n webhook
            const response = await fetch('https://zeltia-app.com/webhook/8f61c22c-0a61-4153-99e6-8f11c336c70d/chat', {  // ← CAMBIA ESTA URL
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chatInput: msg,
                    sessionId: sessionId,
                    timestamp: new Date().toISOString(),
                    userAgent: navigator.userAgent.slice(0, 200),
                    referrer: window.location.href
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const data = await response.json();
            
            // Quitar typing
            typingIndicator.remove();

            // Mensaje bot (formato flexible n8n)
            const botMsg = document.createElement('div');
            botMsg.className = 'chat-message self-start bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 max-w-[85%] rounded-lg px-3 py-1.5 text-sm';
            
            // Soporta múltiples formatos de respuesta n8n:
            let botText = '';
            if (data.output) botText = data.output;
            else if (data.message) botText = data.message;
            else if (data.response) botText = data.response;
            else if (typeof data === 'string') botText = data;
            else botText = JSON.stringify(data);
            
            botMsg.innerHTML = botText.replace(/\n/g, '<br>');
            display.appendChild(botMsg);
            
        } catch (error) {
            // Fallback si n8n falla
            typingIndicator.remove();
            const errorMsg = document.createElement('div');
            errorMsg.className = 'chat-message self-start bg-orange-100 dark:bg-orange-900/50 text-orange-800 dark:text-orange-200 max-w-[85%] rounded-lg px-3 py-1.5 text-sm border border-orange-200 dark:border-orange-800';
            errorMsg.textContent = '¡Ups! Error conectando con el bot. Revisa la consola.';
            display.appendChild(errorMsg);
            console.error('n8n Error:', error);
        }

        display.scrollTop = display.scrollHeight;
    };

    send.addEventListener('click', sendMessage);
    input.addEventListener('keypress', e => e.key === 'Enter' && !e.shiftKey && sendMessage());

    // Focus auto al abrir
    toggle.addEventListener('click', () => setTimeout(() => input.focus(), 400));
});
