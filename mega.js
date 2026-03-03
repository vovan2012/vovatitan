// Ожидаем полную загрузку DOM-дерева, чтобы гарантировать доступ ко всем элементам.
document.addEventListener('DOMContentLoaded', function() {
    // 1. Надпись "Мега Мессенджер" выходит за границы панели.
    const headerTitle = document.querySelector('header h1');
    if (headerTitle) {
        headerTitle.style.whiteSpace = 'nowrap';
        headerTitle.style.textOverflow = 'ellipsis';
        headerTitle.style.display = 'block';
        headerTitle.style.overflow = 'hidden';
    }

    // 2. Пропал премиум.
    const subscriptionMenuItem = document.querySelector('nav ul li:nth-child(3) a');
    if (subscriptionMenuItem) {
        subscriptionMenuItem.textContent = 'Premium';
        subscriptionMenuItem.id = 'premium-button';

        const premiumSection = document.getElementById('premium-features-section');
        if (premiumSection) {
            // Сбрасываем состояние при загрузке
            premiumSection.classList.remove('visible');
            premiumSection.style.opacity = '0';
            premiumSection.style.display = 'none';
            premiumSection.style.transform = 'translateY(20px)';

            subscriptionMenuItem.addEventListener('click', function(event) {
                event.preventDefault();

                const isVisible = premiumSection.classList.contains('visible');

                if (isVisible) {
                    // Скрываем секцию
                    premiumSection.style.opacity = '0';
                    premiumSection.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        premiumSection.style.display = 'none';
                    }, 300);
                } else {
                    // Показываем секцию
                    premiumSection.style.display = 'block';
                    setTimeout(() => {
                        premiumSection.style.opacity = '1';
                        premiumSection.style.transform = 'translateY(0)';
                    }, 10);
                }

                premiumSection.classList.toggle('visible');
            });
        }
    }

    // 3. Надпись "Мега Мессенджер" в разделах необязательна.
    const redundantHeader = document.querySelector('.section-title');
    if (redundantHeader) {
        redundantHeader.style.display = 'none';
    }

    // 4. Панель сворачивается при отведении мышки.
    const sidebar = document.querySelector('.nav-panel');
    if (sidebar) {
        const collapsedWidth = '100px';
        const expandedWidth = '250px';

        sidebar.style.width = collapsedWidth;
        sidebar.style.overflow = 'hidden';
        sidebar.style.transition = 'width 0.3s ease-in-out';

        sidebar.addEventListener('mouseenter', function() {
            this.style.width = expandedWidth;
        });

        sidebar.addEventListener('mouseleave', function() {
            this.style.width = collapsedWidth;
        });
    }

    // 5. Чат с GPT.
    const messageInput = document.getElementById('message-input');
    const sendButton = document.querySelector('.send-button');
    const chatMessagesContainer = document.querySelector('.chat-messages');

    if (messageInput && sendButton && chatMessagesContainer) {
        const addMessageToChat = (sender, text, isUser = false) => {
            const messageElement = document.createElement('div');
            messageElement.classList.add('message');
            if (isUser) {
                messageElement.classList.add('user-message');
            } else {
                messageElement.classList.add('bot-message');
            }

            messageElement.innerHTML = `
                <div class="message-avatar"></div>
                <div class="message-content">
                    <div class="message-sender">${sender}</div>
                    <div class="message-text">${text}</div>
                </div>
            `;
            chatMessagesContainer.appendChild(messageElement);
            chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
        };

        const sendMessage = async () => {
            const messageText = messageInput.value.trim();
            if (messageText) {
                addMessageToChat('Вы', messageText, true);
                messageInput.value = '';

                try {
                    const response = await fetch('/api/chat', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ message: messageText })
                    });
                    const data = await response.json();
                    if (data.reply) {
                        addMessageToChat('GPT', data.reply, false);
                    } else {
                        addMessageToChat('Система', 'Произошла ошибка при получении ответа.', false);
                    }
                } catch (error) {
                    console.error('Ошибка отправки сообщения:', error);
                    addMessageToChat('Система', 'Ошибка соединения с сервером.', false);
                }
            }
        };

        sendButton.addEventListener('click', sendMessage);
        messageInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                sendMessage();
            }
        });
    }

    // Видеоплеер
    const videoItems = document.querySelectorAll('.video-item');
    const mainVideoPlayer = document.getElementById('main-video-player');

    if (videoItems.length > 0 && mainVideoPlayer) {
        videoItems.forEach(item => {
            item.addEventListener('click', function() {
                const videoSrc = this.getAttribute('data-video-src');
                if (videoSrc) {
                    mainVideoPlayer.src = videoSrc;
                    mainVideoPlayer.style.display = 'block';
                    mainVideoPlayer.load();
                    mainVideoPlayer.play();
                }
            });
        });
    } else if (mainVideoPlayer) {
        mainVideoPlayer.style.display = 'none';
    }
});
