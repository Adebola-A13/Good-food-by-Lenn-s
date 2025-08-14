// Variables globales
let cart = [];
let cartTotal = 0;

// Numéro WhatsApp de la boutique
const whatsappNumber = '22941240011';

// Fonctions utilitaires
function updateCartDisplay() {
    const cartCount = document.getElementById('cartCount');
    const cartItems = document.getElementById('cartItems');
    const cartTotalElement = document.getElementById('cartTotal');
    const checkoutBtn = document.getElementById('checkoutBtn');
    
    // Mettre à jour le nombre d'articles
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // Mettre à jour le total
    cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotalElement.textContent = cartTotal.toLocaleString();
    
    // Mettre à jour l'affichage des articles
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Votre panier est vide</p>';
        checkoutBtn.disabled = true;
    } else {
        checkoutBtn.disabled = false;
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="item-info">
                    <h5>${item.name}</h5>
                    <div class="item-price">${item.price.toLocaleString()} FCFA</div>
                    <div class="quantity-controls">
                        <button class="quantity-btn" onclick="updateQuantity('${item.id}', ${item.quantity - 1})">
                            <i class="fas fa-minus"></i>
                        </button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-btn" onclick="updateQuantity('${item.id}', ${item.quantity + 1})">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                </div>
                <div class="remove-item" onclick="removeFromCart('${item.id}')">
                    <i class="fas fa-trash"></i>
                </div>
            </div>
        `).join('');
    }
}

// Fonction pour ajouter un article au panier
function addToCart(name, price) {
    const id = name.toLowerCase().replace(/\s+/g, '-');
    const existingItem = cart.find(item => item.id === id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: id,
            name: name,
            price: price,
            quantity: 1
        });
    }
    
    updateCartDisplay();
    showNotification(`${name} ajouté au panier !`);
    
    // Animation du bouton
    const addButton = event.target.closest('.add-to-cart');
    addButton.style.transform = 'scale(0.95)';
    setTimeout(() => {
        addButton.style.transform = 'scale(1)';
    }, 150);
}

// Fonction pour mettre à jour la quantité
function updateQuantity(id, newQuantity) {
    if (newQuantity <= 0) {
        removeFromCart(id);
        return;
    }
    
    const item = cart.find(item => item.id === id);
    if (item) {
        item.quantity = newQuantity;
        updateCartDisplay();
    }
}

// Fonction pour supprimer un article du panier
function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCartDisplay();
    showNotification('Article supprimé du panier');
}

// Fonction pour basculer l'affichage du panier
function toggleCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    const overlay = document.getElementById('overlay');
    
    cartSidebar.classList.toggle('open');
    overlay.classList.toggle('active');
    
    // Empêcher le scroll du body quand le panier est ouvert
    if (cartSidebar.classList.contains('open')) {
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';
        document.body.style.height = '100%';
        
        // Prévenir le scroll bounce sur iOS
        document.addEventListener('touchmove', preventScroll, { passive: false });
    } else {
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
        document.body.style.height = '';
        
        // Réactiver le scroll
        document.removeEventListener('touchmove', preventScroll);
    }
}

// Fonction pour prévenir le scroll bounce sur mobile
function preventScroll(e) {
    const cartItems = document.querySelector('.cart-items');
    if (!cartItems.contains(e.target)) {
        e.preventDefault();
    }
}

// Fonction pour afficher les notifications avec animation améliorée
function showNotification(message, type = 'success') {
    // Supprimer la notification existante si elle existe
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.style.transform = 'translateX(500px) scale(0.8)';
        setTimeout(() => existingNotification.remove(), 300);
    }
    
    // Créer la nouvelle notification
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        info: 'fas fa-info-circle'
    };
    
    const colors = {
        success: 'linear-gradient(135deg, #27ae60, #2ecc71)',
        error: 'linear-gradient(135deg, #e74c3c, #c0392b)',
        info: 'linear-gradient(135deg, #3498db, #2980b9)'
    };
    
    notification.innerHTML = `
        <i class="${icons[type]}"></i>
        ${message}
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 120px;
        right: 20px;
        background: ${colors[type]};
        color: white;
        padding: 18px 25px;
        border-radius: 15px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        z-index: 3000;
        transform: translateX(500px) scale(0.8);
        transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        font-weight: 500;
        display: flex;
        align-items: center;
        gap: 12px;
        min-width: 300px;
        max-width: 400px;
    `;
    
    document.body.appendChild(notification);
    
    // Afficher la notification avec animation élastique
    setTimeout(() => {
        notification.style.transform = 'translateX(0) scale(1)';
    }, 100);
    
    // Animation de progression
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: absolute;
        bottom: 0;
        left: 0;
        height: 3px;
        background: rgba(255, 255, 255, 0.3);
        width: 100%;
        border-radius: 0 0 15px 15px;
        animation: progressShrink 3s linear;
    `;
    notification.appendChild(progressBar);
    
    // Masquer la notification après 3 secondes
    setTimeout(() => {
        notification.style.transform = 'translateX(500px) scale(0.8)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 400);
    }, 3000);
    
    // Ajouter l'animation CSS pour la barre de progression
    if (!document.querySelector('#progress-animation')) {
        const style = document.createElement('style');
        style.id = 'progress-animation';
        style.textContent = `
            @keyframes progressShrink {
                from { width: 100%; }
                to { width: 0%; }
            }
        `;
        document.head.appendChild(style);
    }
}

// Fonction pour finaliser la commande via WhatsApp
function checkout() {
    if (cart.length === 0) {
        showNotification('Votre panier est vide !');
        return;
    }
    
    // Construire le message pour WhatsApp
    let message = `🍽️ *Nouvelle commande - Good food by Lenn's*\n\n`;
    message += `📋 *Détails de la commande:*\n`;
    
    cart.forEach(item => {
        message += `• ${item.name} x${item.quantity} = ${(item.price * item.quantity).toLocaleString()} FCFA\n`;
    });
    
    message += `\n💰 *Total: ${cartTotal.toLocaleString()} FCFA*\n\n`;
    message += `📍 *Livraison au Bénin*\n`;
    message += `⏰ *Commande passée le: ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}*\n\n`;
    message += `Merci de confirmer cette commande et de m'indiquer l'adresse de livraison. 😊`;
    
    // Encoder le message pour l'URL
    const encodedMessage = encodeURIComponent(message);
    
    // Créer l'URL WhatsApp
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    
    // Ouvrir WhatsApp
    window.open(whatsappURL, '_blank');
    
    // Optionnel: vider le panier après la commande
    showNotification('Redirection vers WhatsApp...');
    
    // Fermer le panier
    setTimeout(() => {
        toggleCart();
    }, 1000);
}

// Fonction pour filtrer les produits par catégorie (pour une future extension)
function filterProducts(category) {
    const products = document.querySelectorAll('.product-card');
    
    products.forEach(product => {
        if (category === 'all' || product.dataset.category === category) {
            product.style.display = 'block';
        } else {
            product.style.display = 'none';
        }
    });
}

// Animation de scroll smooth pour les ancres
function smoothScroll(target) {
    document.querySelector(target).scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

// Gestion du scroll pour l'effet parallaxe du header
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    const scrolled = window.pageYOffset;
    
    if (scrolled > 100) {
        header.style.background = 'linear-gradient(135deg, rgba(255,107,53,0.95), rgba(247,147,30,0.95))';
        header.style.backdropFilter = 'blur(10px)';
    } else {
        header.style.background = 'linear-gradient(135deg, #ff6b35, #f7931e)';
        header.style.backdropFilter = 'none';
    }
});

// Animation d'apparition des produits au scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.classList.add('visible');
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0) scale(1)';
            }, index * 100); // Délai échelonné pour un effet cascade
        }
    });
}, observerOptions);

// Observer tous les produits et éléments
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded'); // Debug
    
    // Vérifier que la fonction scrollToCategory est disponible globalement
    window.scrollToCategory = scrollToCategory;
    
    // Vérifier que tous les éléments nécessaires existent
    const categories = ['shawarma', 'panini', 'cakes', 'yaourt'];
    categories.forEach(cat => {
        const element = document.getElementById(`${cat}-first`);
        const preview = document.querySelector(`[onclick="scrollToCategory('${cat}')"]`);
        console.log(`${cat}:`, { element, preview }); // Debug
        
        // Ajouter un event listener alternatif si onclick ne fonctionne pas
        if (preview && !preview.hasAttribute('data-listener-added')) {
            preview.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                scrollToCategory(cat);
            });
            preview.setAttribute('data-listener-added', 'true');
            console.log(`Added event listener for ${cat}`);
        }
    });
    
    // Animation initiale des produits
    const products = document.querySelectorAll('.product-card');
    products.forEach((product, index) => {
        product.style.opacity = '0';
        product.style.transform = 'translateY(50px) scale(0.9)';
        product.style.transition = `all 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) ${index * 0.1}s`;
        product.classList.add('fade-in');
        observer.observe(product);
    });
    
    // Animation des sections
    const sections = document.querySelectorAll('.category, .footer-section');
    sections.forEach(section => {
        section.classList.add('fade-in');
        observer.observe(section);
    });
    
    // Animation de typing améliorée pour le titre
    const heroTitle = document.querySelector('.hero-content h2');
    const heroText = heroTitle.textContent;
    heroTitle.textContent = '';
    heroTitle.style.borderRight = '3px solid rgba(255, 255, 255, 0.8)';
    
    let i = 0;
    const typing = setInterval(() => {
        if (i < heroText.length) {
            heroTitle.textContent += heroText.charAt(i);
            i++;
        } else {
            clearInterval(typing);
            // Effet de clignotement du curseur
            setInterval(() => {
                heroTitle.style.borderRight = heroTitle.style.borderRight === 'none' 
                    ? '3px solid rgba(255, 255, 255, 0.8)' 
                    : 'none';
            }, 1000);
        }
    }, 80);
    
    // Chargement lazy des images avec animation
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    lazyImages.forEach(img => {
        img.addEventListener('load', () => {
            img.classList.add('loaded');
        });
    });
    
    // Parallax effect pour le hero
    let ticking = false;
    function updateParallax() {
        const scrolled = window.pageYOffset;
        const parallax = document.querySelector('.hero-content');
        const speed = 0.5;
        
        if (parallax) {
            parallax.style.transform = `translateY(${scrolled * speed}px)`;
        }
        
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick);
});

// Gestion des touches du clavier
document.addEventListener('keydown', (e) => {
    // Fermer le panier avec la touche Escape
    if (e.key === 'Escape') {
        const cartSidebar = document.getElementById('cartSidebar');
        if (cartSidebar.classList.contains('open')) {
            toggleCart();
        }
    }
});

// Gestion du redimensionnement de la fenêtre
window.addEventListener('resize', () => {
    const cartSidebar = document.getElementById('cartSidebar');
    if (window.innerWidth > 768 && cartSidebar.classList.contains('open')) {
        // Ajuster la largeur du panier sur les grands écrans
        cartSidebar.style.width = '400px';
    } else if (window.innerWidth <= 768) {
        // Pleine largeur sur mobile
        cartSidebar.style.width = '100%';
    }
});

// Fonction pour sauvegarder le panier dans le localStorage
function saveCartToStorage() {
    localStorage.setItem('goodFoodCart', JSON.stringify(cart));
}

// Fonction pour faire défiler vers une catégorie spécifique
function scrollToCategory(category) {
    console.log(`Scrolling to category: ${category}`); // Debug
    
    // Chercher le premier produit de la catégorie
    const firstProduct = document.getElementById(`${category}-first`);
    console.log(`Found element:`, firstProduct); // Debug
    
    if (firstProduct) {
        // Calculer la position cible
        const headerHeight = document.querySelector('.header').offsetHeight || 100;
        const elementTop = firstProduct.getBoundingClientRect().top + window.pageYOffset;
        const targetPosition = elementTop - headerHeight - 30;
        
        console.log(`Scrolling to position: ${targetPosition}`); // Debug
        
        // Scroll simple et fiable
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
        
        // Effet de highlight après un délai
        setTimeout(() => {
            firstProduct.style.transition = 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            firstProduct.style.transform = 'scale(1.05)';
            firstProduct.style.boxShadow = '0 20px 40px rgba(255, 107, 53, 0.4)';
            firstProduct.style.border = '3px solid rgba(255, 107, 53, 0.6)';
            
            // Retour à la normale après 2 secondes
            setTimeout(() => {
                firstProduct.style.transform = 'scale(1)';
                firstProduct.style.boxShadow = '';
                firstProduct.style.border = '';
            }, 2000);
        }, 800);
        
        // Notification
        const categoryNames = {
            'shawarma': 'Shawarma 🌯',
            'panini': 'Panini 🥪', 
            'cakes': 'Cakes 🍰',
            'yaourt': 'Yaourt 🥛'
        };
        
        showNotification(`Direction ${categoryNames[category]} !`, 'success');
        
    } else {
        console.error(`Element with id ${category}-first not found`);
        showNotification('Erreur de navigation', 'error');
    }
}

// Fonction pour charger le panier depuis le localStorage
function loadCartFromStorage() {
    const savedCart = localStorage.getItem('goodFoodCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartDisplay();
    }
}

// Sauvegarder automatiquement le panier à chaque modification
const originalAddToCart = addToCart;
const originalUpdateQuantity = updateQuantity;
const originalRemoveFromCart = removeFromCart;

addToCart = function(name, price) {
    originalAddToCart(name, price);
    saveCartToStorage();
};

updateQuantity = function(id, newQuantity) {
    originalUpdateQuantity(id, newQuantity);
    saveCartToStorage();
};

removeFromCart = function(id) {
    originalRemoveFromCart(id);
    saveCartToStorage();
};

// Charger le panier au chargement de la page
window.addEventListener('load', () => {
    loadCartFromStorage();
});

// Fonction pour partager la page (pour une future extension)
function sharePage() {
    if (navigator.share) {
        navigator.share({
            title: 'Good food by Lenn\'s',
            text: 'Découvrez les délicieuses spécialités de Good food by Lenn\'s !',
            url: window.location.href
        });
    } else {
        // Fallback pour les navigateurs qui ne supportent pas l'API de partage
        const url = window.location.href;
        navigator.clipboard.writeText(url).then(() => {
            showNotification('Lien copié dans le presse-papiers !');
        });
    }
}

// Easter egg - Animation spéciale quand on clique 5 fois sur le logo
let logoClicks = 0;
document.querySelector('.logo').addEventListener('click', () => {
    logoClicks++;
    if (logoClicks === 5) {
        const logo = document.querySelector('.logo');
        logo.style.animation = 'spin 2s ease-in-out';
        showNotification('🎉 Vous avez trouvé l\'easter egg ! Profitez de -5% sur votre prochaine commande avec le code LOGO5 !');
        setTimeout(() => {
            logo.style.animation = '';
        }, 2000);
        logoClicks = 0;
    }
});

// Animation de rotation pour l'easter egg
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        0% { transform: rotate(0deg) scale(1); }
        50% { transform: rotate(180deg) scale(1.1); }
        100% { transform: rotate(360deg) scale(1); }
    }
`;
document.head.appendChild(style);
