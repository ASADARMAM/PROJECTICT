// Wait for Firebase to be ready before initializing Firebase-dependent features
window.addEventListener('firebase-ready', function() {
    console.log('Initializing Firebase-dependent features');

    // Set persistence to LOCAL
    window.auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
        .then(() => {
            console.log('Firebase persistence set to LOCAL');
            initializeFirebaseFeatures();
        })
        .catch((error) => {
            console.error('Error setting persistence:', error);
            initializeFirebaseFeatures(); // Still initialize features even if persistence fails
        });
});

function initializeFirebaseFeatures() {
    // Initialize Firebase Auth state observer and get user data
    if (window.auth) {
        window.auth.onAuthStateChanged(async (user) => {
            console.log('Auth state changed:', user ? user.email : 'No user');
            
            if (user) {
                try {
                    // Check instructor status
                    const instructorDoc = await window.db.collection('instructors').doc(user.uid).get();
                    const userDoc = await window.db.collection('users').doc(user.uid).get();
                    const userData = userDoc.data();
                    
                    isInstructorUser = instructorDoc.exists;
                    
                    if (isInstructorUser) {
                        console.log('User is an instructor');
                        addInstructorMenuItems();
                    } else {
                        console.log('User is not an instructor');
                        removeInstructorMenuItems();
                    }

                    // Update navigation with user info
                    updateNavigation(true, userData?.name || user.email);
                    
                    // Update course buttons
                    updateCourseButtons();
                } catch (error) {
                    console.error('Error in auth state change:', error);
                    removeInstructorMenuItems();
                }
            } else {
                console.log('User signed out');
                isInstructorUser = false;
                removeInstructorMenuItems();
                updateNavigation(false);
            }
        });
    } else {
        console.error('Firebase Auth not initialized');
    }
}

// --- Footer Google Map Functionality ---
window.initFooterMap = function() {
    const mapCenter = { lat: 33.5712346, lng: 73.2174665 };
    const map = new google.maps.Map(document.getElementById('footerMap'), {
        center: mapCenter,
        zoom: 15,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
    });
    const marker = new google.maps.Marker({
        position: mapCenter,
        map,
        title: 'IBADAT International University',
        icon: {
            url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
            scaledSize: new google.maps.Size(40, 40)
        }
    });
    const infoWindow = new google.maps.InfoWindow({
        content: '<strong>IBADAT International University</strong><br>Islamabad, Pakistan'
    });
    marker.addListener('click', function() {
        infoWindow.open(map, marker);
    });
    // Open info window by default
    infoWindow.open(map, marker);
};

// All code below now runs in the global scope (DOMContentLoaded removed)
// Add scroll progress bar
const progressBar = document.createElement('div');
progressBar.className = 'scroll-progress';
document.body.appendChild(progressBar);

// Update progress bar on scroll
window.addEventListener('scroll', () => {
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = (window.scrollY / windowHeight) * 100;
    progressBar.style.width = progress + '%';
});

// Navbar scroll effect
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Initialize AOS for scroll animations
document.addEventListener('DOMContentLoaded', function() {
  AOS.init({
    duration: 800, // Animation duration
    easing: 'ease-in-out', // Easing function
    once: true, // Whether animation should happen only once
  });

    // Hero Slider Initialization
    initializeHeroSlider();
});

// Hero Slider Functionality
function initializeHeroSlider() {
    let currentSlide = 0;
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.hero-dot');
    const totalSlides = slides.length;
    let slideInterval = null;

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.remove('active');
            slide.style.display = 'none';
            if (i === index) {
                slide.classList.add('active');
                slide.style.display = 'flex';
            }
        });
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
        // Update hero class for special background handling
        const hero = document.querySelector('.hero');
        if (index === 1) {
            hero.classList.add('join-us-active');
        } else {
            hero.classList.remove('join-us-active');
        }
        currentSlide = index;
        console.log('[HeroSlider] Showing slide', index);
    }

    function nextSlide() {
        const nextIndex = (currentSlide + 1) % totalSlides;
        showSlide(nextIndex);
        console.log('[HeroSlider] Auto-advanced to slide', nextIndex);
    }

    function startSlideShow() {
        if (slideInterval) {
            clearInterval(slideInterval);
            console.log('[HeroSlider] Cleared previous interval');
        }
        slideInterval = setInterval(nextSlide, 5000);
        console.log('[HeroSlider] Started slideshow interval:', slideInterval);
    }

    // Add click handlers for dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
            startSlideShow();
            console.log('[HeroSlider] Dot clicked, moved to slide', index);
        });
    });

    // Initialize slider
    if (slides.length > 0 && dots.length > 0) {
        showSlide(0);
        startSlideShow();
        // Pause slideshow when user hovers over the hero section
        const heroSection = document.querySelector('.hero');
        if (heroSection) {
            heroSection.addEventListener('mouseenter', () => {
                if (slideInterval) {
                    clearInterval(slideInterval);
                    console.log('[HeroSlider] Paused on hover');
                }
            });
            heroSection.addEventListener('mouseleave', () => {
                startSlideShow();
                console.log('[HeroSlider] Resumed on mouse leave');
            });
        }
    } else {
        console.warn('[HeroSlider] Slides or dots not found');
    }
}

// Enhanced scroll animations
const animateElements = document.querySelectorAll('.animate-on-scroll');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

// Observe elements for animation
const sectionsToAnimate = document.querySelectorAll('.animate-on-scroll, .hero-content, .course-card, .feature, .about-section, .contact-section');
sectionsToAnimate.forEach(section => {
    observer.observe(section);
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        // Check if the link is part of the modal's internal navigation or the profile link
        if (this.id === 'showSignup' || this.id === 'showLogin' || this.id === 'profileLink') {
            e.preventDefault(); // Prevent default only for these specific links
            return; // Handle these links in their respective logic below
        }

        e.preventDefault();
        const targetId = this.getAttribute('href');
        // Handle links that point to sections on the current page
        if (targetId.startsWith('#') && targetId.length > 1) {
             const targetElement = document.querySelector(targetId);
             if (targetElement) {
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        } else if (targetId === '#home') {
             window.scrollTo({
                top: 0,
                behavior: 'smooth'
             });
        }
    });
});

// Add loading animation
const loading = document.createElement('div');
loading.className = 'loading';
loading.innerHTML = '<div class="spinner"></div>';
document.body.appendChild(loading);

window.addEventListener('load', () => {
    loading.classList.add('hidden');
    setTimeout(() => {
        loading.remove();
    }, 500);
});

// Enhanced hover effects for course cards
const courseCards = document.querySelectorAll('.course-card');
courseCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px) scale(1.02)';
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
    });
});

// Add parallax effect to hero section
const hero = document.querySelector('.hero');
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    if (hero) {
        hero.style.backgroundPositionY = (scrolled * 0.5) + 'px';
    }
});

// Form validation and submission
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value
        };
        
        // Add loading state to button
        const submitBtn = this.querySelector('.submit-btn');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        // Simulate form submission (replace with actual API call)
        setTimeout(() => {
            alert('Thank you for your message! We will get back to you soon.');
            contactForm.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 1500);
    });
}

// Add mobile menu toggle
const menuToggle = document.createElement('button');
menuToggle.className = 'menu-toggle';
menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
navbar.appendChild(menuToggle);

menuToggle.addEventListener('click', () => {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('active');
    menuToggle.classList.toggle('active');
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    const navLinks = document.querySelector('.nav-links');
    const menuToggle = document.querySelector('.menu-toggle');
    if (!e.target.closest('.nav-links') && !e.target.closest('.menu-toggle')) {
        navLinks.classList.remove('active');
        menuToggle.classList.remove('active');
    }
});

// Get the login and signup buttons from navigation
const loginBtnNav = document.querySelector('.login-btn');
const signupBtnNav = document.querySelector('.signup-btn');

// Get the modals
const loginModal = document.getElementById('loginModal');
const signupModal = document.getElementById('signupModal');

// Function to open a modal
function openModal(modal) {
    if (modal) {
    modal.style.display = 'block';
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
    }
}

// Function to close a modal
function closeModal(modal) {
    if (modal) {
    modal.classList.remove('show');
    setTimeout(() => {
        modal.style.display = 'none';
        }, 300);
    }
}

// Add click event listeners to the navigation buttons
if (loginBtnNav) {
    loginBtnNav.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('Login button clicked');
        openModal(loginModal);
    });
}

if (signupBtnNav) {
    signupBtnNav.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('Signup button clicked');
        openModal(signupModal);
    });
}

// Close button functionality
document.querySelectorAll('.close-button').forEach(button => {
    button.addEventListener('click', function() {
        const modal = this.closest('.modal');
        closeModal(modal);
    });
});

// Click outside to close
window.addEventListener('click', function(event) {
    if (event.target.classList.contains('modal')) {
        closeModal(event.target);
    }
});

// Get the forgot password modal and link
const forgotPasswordModal = document.getElementById('forgotPasswordModal');
const showForgotPasswordLink = document.getElementById('showForgotPassword');

// Get the <span> element that closes the modal
const closeForgotPasswordBtn = document.getElementById('closeForgotPassword');

// Get the links to switch between modals
const showSignupLink = document.getElementById('showSignup');
const showLoginLink = document.getElementById('showLogin');
const showLoginFromForgotLink = document.getElementById('showLoginFromForgot');

// When the user clicks the 'Forgot Password?' link, show the forgot password modal and hide login
if (showForgotPasswordLink) {
    showForgotPasswordLink.addEventListener('click', function(event) {
        event.preventDefault();
        closeModal(loginModal);
        openModal(forgotPasswordModal);
    });
}

// When the user clicks the 'Login' link from forgot password modal, show login and hide forgot password
if (showLoginFromForgotLink) {
    showLoginFromForgotLink.addEventListener('click', function(event) {
        event.preventDefault();
        closeModal(forgotPasswordModal);
        openModal(loginModal);
    });
}

// Handle switching between login and signup modals
if (showSignupLink) {
    showSignupLink.addEventListener('click', function(event) {
        event.preventDefault();

        const loginContent = loginModal.querySelector('.modal-content');
        const signupContent = signupModal.querySelector('.modal-content');

        // Animate login modal content out
        loginContent.classList.add('float-out-up');
        loginContent.classList.remove('float-in-down'); // Ensure no conflicting animation class

        // Wait for the float-out animation duration before switching
        setTimeout(() => {
            loginModal.classList.remove('show');
            loginModal.style.display = 'none';
            loginContent.classList.remove('float-out-up'); // Clean up animation class

            // Animate signup modal content in
            signupModal.style.display = 'block';
            setTimeout(() => {
                 signupModal.classList.add('show');
                 signupContent.classList.add('float-in-down');
                 signupContent.classList.remove('float-out-up'); // Ensure no conflicting animation class
            }, 10); // Short delay to allow display: block

        }, 300); // Matches CSS animation duration
    });
}

if (showLoginLink) {
    showLoginLink.addEventListener('click', function(event) {
        event.preventDefault();

        const loginContent = loginModal.querySelector('.modal-content');
        const signupContent = signupModal.querySelector('.modal-content');

        // Animate signup modal content out
        signupContent.classList.add('float-out-up');
         signupContent.classList.remove('float-in-down'); // Ensure no conflicting animation class

        // Wait for the float-out animation duration before switching
        setTimeout(() => {
            signupModal.classList.remove('show');
            signupModal.style.display = 'none';
             signupContent.classList.remove('float-out-up'); // Clean up animation class

            // Animate login modal content in
            loginModal.style.display = 'block';
             setTimeout(() => {
                 loginModal.classList.add('show');
                 loginContent.classList.add('float-in-down');
                 loginContent.classList.remove('float-out-up'); // Ensure no conflicting animation class
            }, 10); // Short delay to allow display: block

        }, 300); // Matches CSS animation duration
    });
}

// State variable for login status
let isLoggedIn = false;

// Get logged-out and logged-in navigation items
const loggedOutNavItems = document.querySelectorAll('.logged-out-nav');
const loggedInNavItems = document.querySelectorAll('.logged-in-nav');
const logoutBtn = document.getElementById('logoutBtn');
const loggedInUsernameSpan = document.getElementById('loggedInUsername');

// Get user dropdown elements
const userMenuContainer = document.querySelector('.user-menu-container');
const userInfoTrigger = document.querySelector('.user-info-trigger');
const dropdownMenu = document.querySelector('.dropdown-menu');
const profileLink = document.getElementById('profileLink');

// Get user profile section and save button
const userProfileSection = document.getElementById('user-profile');
const saveProfileBtn = document.getElementById('saveProfileBtn');

// Map course IDs to their corresponding course pages
const coursePages = {
    'web-development': 'course-web-development.html',
    'mobile-development': 'course-mobile-app-development.html',
    'data-science': 'course-data-science-machine-learning.html',
    'cloud-computing': 'course-cloud-computing-devops.html'
};

// Function to update navigation state and login status
function updateNavigation(isLoggedInStatus, username = 'User') {
    console.log('Updating navigation:', { isLoggedInStatus, username });
    isLoggedIn = isLoggedInStatus;

    const loggedOutNavItems = document.querySelectorAll('.logged-out-nav');
    const loggedInNavItems = document.querySelectorAll('.logged-in-nav');
    const userMenuContainer = document.querySelector('.user-menu-container');
    const loggedInUsernameSpan = document.getElementById('loggedInUsername');

    if (isLoggedIn) {
        loggedOutNavItems.forEach(item => item.style.display = 'none');
        if (userMenuContainer) {
            userMenuContainer.style.display = 'flex';
        }
        loggedInNavItems.forEach(item => {
            if (!item.classList.contains('user-menu-container')) {
                item.style.display = 'list-item';
            }
        });
        if (loggedInUsernameSpan) {
            loggedInUsernameSpan.textContent = username;
        }
    } else {
        loggedOutNavItems.forEach(item => item.style.display = 'list-item');
        if (userMenuContainer) {
            userMenuContainer.style.display = 'none';
        }
        loggedInNavItems.forEach(item => item.style.display = 'none');
        if (loggedInUsernameSpan) {
            loggedInUsernameSpan.textContent = 'User';
        }
    }
}

// Handle form submissions with Firebase
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const forgotPasswordForm = document.getElementById('forgotPasswordForm');
const customNotification = document.getElementById('customNotification');
const notificationMessage = document.getElementById('notificationMessage');

// Function to show custom notification
function showNotification(message, type = 'success') {
    notificationMessage.textContent = message;
    // Set background color based on type (can add more types like 'error')
    customNotification.style.backgroundColor = (type === 'success') ? '#28a745' : '#dc3545';
    customNotification.classList.remove('hide');
    customNotification.classList.add('show');

    // Automatically hide after 3 seconds
    setTimeout(() => {
        customNotification.classList.remove('show');
        customNotification.classList.add('hide');
    }, 3000);
}

// Global state to track instructor status
let isInstructorUser = false;

// Function to add instructor menu items
function addInstructorMenuItems() {
    const dropdownMenu = document.querySelector('.dropdown-menu ul');
    if (dropdownMenu) {
        // Remove any existing instructor items first
        removeInstructorMenuItems();
        
        // Add instructor items
        dropdownMenu.innerHTML += `
            <li><a href="#" id="instructorDashboard">Instructor Dashboard</a></li>
            <li><a href="#" id="manageCourses">Manage Courses</a></li>
            <li><a href="#" id="viewStudents">View Students</a></li>
        `;
    }
}

// Function to remove instructor menu items
function removeInstructorMenuItems() {
    const dropdownMenu = document.querySelector('.dropdown-menu ul');
    if (dropdownMenu) {
        const instructorItems = dropdownMenu.querySelectorAll('#instructorDashboard, #manageCourses, #viewStudents');
        instructorItems.forEach(item => {
            if (item.parentElement) {
                item.parentElement.remove();
            }
        });
    }
}

// Login form handler
if (loginForm) {
    console.log('Login form found');
    loginForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        console.log('Login form submitted');
        
        const email = document.getElementById('modal-email').value;
        const password = document.getElementById('modal-password').value;
        const isInstructorLogin = document.getElementById('instructor-checkbox').checked;

        if (!email || !password) {
            showNotification('Please fill in all fields', 'error');
            return;
        }

        try {
            console.log('Attempting login...');
            const userCredential = await window.auth.signInWithEmailAndPassword(email, password);
            const user = userCredential.user;
            
            console.log('User logged in:', user.email);
            
            // Check instructor status
            const instructorDoc = await window.db.collection('instructors').doc(user.uid).get();
            
            if (isInstructorLogin && !instructorDoc.exists) {
                console.log('Instructor login failed - not registered as instructor');
                await window.auth.signOut();
                removeInstructorMenuItems();
                showNotification('You are not registered as an instructor', 'error');
                return;
            }
            
            if (instructorDoc.exists) {
                console.log('Instructor status verified');
                isInstructorUser = true;
                addInstructorMenuItems();
            } else {
                console.log('Not an instructor account');
                isInstructorUser = false;
                removeInstructorMenuItems();
            }
            
            // Get user data
            const userDoc = await window.db.collection('users').doc(user.uid).get();
            const userData = userDoc.data();
            
            showNotification('Login successful!');
            closeModal(loginModal);
            updateNavigation(true, userData?.name || user.email);
            
        } catch (error) {
            console.error('Login error:', error);
            showNotification(error.message, 'error');
        }
    });
} else {
    console.error('Login form not found');
}

// Signup form handler
if (signupForm) {
    signupForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        const email = document.getElementById('modal-signup-email').value;
        const password = document.getElementById('modal-signup-password').value;
        const confirmPassword = document.getElementById('modal-confirm-password').value;
        const name = document.getElementById('modal-name').value;
        const isInstructor = document.getElementById('signup-instructor-checkbox').checked;
        const instructorCode = document.getElementById('instructor-code').value;

        if (password !== confirmPassword) {
            showNotification('Passwords do not match', 'error');
            return;
        }

        if (isInstructor && instructorCode !== 'IBADAT2024') {
            showNotification('Invalid instructor code', 'error');
            return;
        }

        try {
            const userCredential = await window.auth.createUserWithEmailAndPassword(email, password);
            const user = userCredential.user;

            // Create user profile
            await window.db.collection('users').doc(user.uid).set({
                name: name,
                email: email,
                role: isInstructor ? 'instructor' : 'student',
                createdAt: new Date().toISOString()
            });

            // If instructor, create instructor profile
            if (isInstructor) {
                await window.db.collection('instructors').doc(user.uid).set({
                    name: name,
                    email: email,
                    courses: [],
                    createdAt: new Date().toISOString()
                });
            }

            showNotification('Signup successful!');
            closeModal(signupModal);
            updateNavigation(true, name);
        } catch (error) {
            showNotification(error.message, 'error');
        }
    });
}

// Logout handler
if (logoutBtn) {
    logoutBtn.addEventListener('click', async function(e) {
        e.preventDefault();
        try {
            // Close any open modals or dashboards first
            const modals = document.querySelectorAll('.modal');
            modals.forEach(modal => closeModal(modal));

            // Sign out from Firebase
            await window.auth.signOut();
            
            // Reset state variables
            isInstructorUser = false;
            
            // Update UI
            updateNavigation(false);
            showNotification('Logged out successfully');
            
            // Clear any sensitive data from localStorage
            localStorage.removeItem('lastLoginTime');
            localStorage.removeItem('userPreferences');
            
            // Force reload to clear any cached state and reinitialize Firestore
            window.location.reload();
            
        } catch (error) {
            console.error('Error during logout:', error);
            showNotification('Error logging out: ' + error.message, 'error');
        }
    });
}

// Enhanced Instructor Dashboard
function createInstructorDashboard() {
    const dashboardModal = document.createElement('div');
    dashboardModal.className = 'modal';
    dashboardModal.id = 'instructorDashboardModal';
    dashboardModal.innerHTML = `
        <div class="modal-content instructor-dashboard">
            <span class="close-button">&times;</span>
            <h2>Instructor Dashboard</h2>
            <div class="dashboard-tabs">
                <button class="tab-btn active" data-tab="courses">Manage Courses</button>
                <button class="tab-btn" data-tab="students">Student Data</button>
            </div>
            <div class="tab-content">
                <div id="courses" class="tab-pane active">
                    <button id="addCourseBtn" class="action-btn">Add New Course</button>
                    <div id="coursesList" class="courses-list">
                        Loading courses...
                    </div>
                </div>
                <div id="students" class="tab-pane">
                    <div class="student-filters">
                        <select id="courseFilter">
                            <option value="">All Courses</option>
                        </select>
                        <input type="text" id="studentSearch" placeholder="Search students...">
                    </div>
                    <div id="studentsList" class="students-list">
                        Loading student data...
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(dashboardModal);
    setupDashboardEventListeners(dashboardModal);
    return dashboardModal;
}

function setupDashboardEventListeners(dashboard) {
    // Close button functionality
    const closeBtn = dashboard.querySelector('.close-button');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            closeModal(dashboard);
        });
    }

    // Tab switching
    const tabBtns = dashboard.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.dataset.tab;
            tabBtns.forEach(b => b.classList.remove('active'));
            dashboard.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
            btn.classList.add('active');
            dashboard.querySelector(`#${tabId}`).classList.add('active');

            if (tabId === 'courses') {
                loadCourses();
            } else if (tabId === 'students') {
                loadStudentData();
            }
        });
    });

    // Add course button
    const addCourseBtn = dashboard.querySelector('#addCourseBtn');
    if (addCourseBtn) {
        addCourseBtn.addEventListener('click', showAddCourseForm);
    }

    // Course filter for students
    const courseFilter = dashboard.querySelector('#courseFilter');
    if (courseFilter) {
        courseFilter.addEventListener('change', () => loadStudentData(courseFilter.value));
    }

    // Student search
    const studentSearch = dashboard.querySelector('#studentSearch');
    if (studentSearch) {
        studentSearch.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const studentItems = document.querySelectorAll('.student-item');
            studentItems.forEach(item => {
                const studentName = item.querySelector('h4').textContent.toLowerCase();
                item.style.display = studentName.includes(searchTerm) ? 'block' : 'none';
            });
        });
    }
}

// Show Add Course Form
function showAddCourseForm() {
    const formModal = document.createElement('div');
    formModal.className = 'modal';
    formModal.innerHTML = `
        <div class="modal-content">
            <span class="close-button">&times;</span>
            <h2>Add New Course</h2>
            <form id="addCourseForm">
                <div class="form-group">
                    <label for="courseName">Course Name *</label>
                    <input type="text" id="courseName" placeholder="e.g., Web Development Fundamentals" required>
                </div>
                <div class="form-group">
                    <label for="courseDescription">Course Description *</label>
                    <textarea id="courseDescription" placeholder="Enter a detailed course description..." required></textarea>
                </div>
                <div class="form-group">
                    <label for="courseDuration">Duration (weeks) *</label>
                    <input type="number" id="courseDuration" min="1" max="52" placeholder="e.g., 12" required>
                </div>
                <div class="form-group">
                    <label for="courseImage">Course Image URL</label>
                    <input type="url" id="courseImage" placeholder="https://example.com/course-image.jpg">
                    <small>Leave empty to use default image</small>
                </div>
                <button type="submit" class="submit-btn">Add Course</button>
            </form>
        </div>
    `;
    document.body.appendChild(formModal);
    openModal(formModal);

    // Handle form submission
    const form = formModal.querySelector('#addCourseForm');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const courseData = {
            name: form.querySelector('#courseName').value.trim(),
            description: form.querySelector('#courseDescription').value.trim(),
            duration: parseInt(form.querySelector('#courseDuration').value, 10),
            imageUrl: form.querySelector('#courseImage').value.trim() || 'https://placehold.co/600x400?text=Course+Image',
            instructorId: window.auth.currentUser.uid,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        try {
            await window.db.collection('courses').add(courseData);
            showNotification('Course added successfully!');
            closeModal(formModal);
            loadCourses(); // Refresh courses list
        } catch (error) {
            console.error('Error adding course:', error);
            showNotification('Error adding course: ' + error.message, 'error');
        }
    });

    // Close button functionality
    const closeBtn = formModal.querySelector('.close-button');
    closeBtn.addEventListener('click', () => {
        closeModal(formModal);
    });
}

// Load and display courses
async function loadCourses() {
    const coursesList = document.getElementById('coursesList');
    if (!coursesList) return;

    try {
        // Show loading state
        coursesList.innerHTML = '<div class="loading">Loading courses...</div>';
        
        // Get courses from Firestore
        const coursesRef = window.db.collection('courses');
        const coursesSnapshot = await coursesRef.get();
        
        if (coursesSnapshot.empty) {
            coursesList.innerHTML = '<div class="no-data">No courses found. Click "Add New Course" to create one.</div>';
            return;
        }

        let coursesHTML = '';
        const defaultCourseImage = 'https://placehold.co/600x400?text=Course+Image';
        
        coursesSnapshot.forEach(doc => {
            const course = doc.data();
            const courseId = doc.id;
            
            // Use nullish coalescing to provide default values
            const name = course.name ?? 'Untitled Course';
            const description = course.description ?? 'No description available';
            const duration = course.duration ?? 0;
            const imageUrl = course.imageUrl || defaultCourseImage;

            coursesHTML += `
                <div class="course-item" data-id="${courseId}">
                    <div class="course-image">
                        <img src="${imageUrl}" alt="${name}" 
                             onerror="this.onerror=null; this.src='${defaultCourseImage}';">
                    </div>
                    <div class="course-info">
                        <h3>${name}</h3>
                        <p>${description}</p>
                        <span>${duration} weeks</span>
                    </div>
                    <div class="course-actions">
                        <button class="edit-course btn btn-primary">Edit</button>
                        <button class="delete-course btn btn-danger">Delete</button>
                    </div>
                </div>
            `;
        });

        coursesList.innerHTML = coursesHTML;

        // Add event listeners for edit and delete buttons
        document.querySelectorAll('.delete-course').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const courseId = e.target.closest('.course-item').dataset.id;
                if (confirm('Are you sure you want to delete this course?')) {
                    try {
                        await window.db.collection('courses').doc(courseId).delete();
                        showNotification('Course deleted successfully!');
                        loadCourses(); // Refresh list
        } catch (error) {
                        showNotification('Error deleting course: ' + error.message, 'error');
                    }
                }
            });
        });

        // Edit course functionality
        document.querySelectorAll('.edit-course').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const courseItem = e.target.closest('.course-item');
                const courseId = courseItem.dataset.id;
                const courseDoc = await window.db.collection('courses').doc(courseId).get();
                if (courseDoc.exists) {
                    showEditCourseForm(courseId, courseDoc.data());
                }
            });
        });

    } catch (error) {
        console.error('Error loading courses:', error);
        coursesList.innerHTML = '<div class="error">Error loading courses. Please try again.</div>';
        showNotification('Error loading courses: ' + error.message, 'error');
    }
}

// Load and display student data
async function loadStudentData(courseFilter = '') {
    const studentsList = document.getElementById('studentsList');
    if (!studentsList) return;

    try {
        // Show loading state
        studentsList.innerHTML = '<div class="loading">Loading student data...</div>';
        
        // Get all users from Firestore
        const usersRef = window.db.collection('users');
        const studentsSnapshot = await usersRef.where('role', '==', 'student').get();
        
        if (studentsSnapshot.empty) {
            studentsList.innerHTML = '<div class="no-data">No students found</div>';
            return;
        }

        let studentsHTML = '';
        studentsSnapshot.forEach(doc => {
            const student = doc.data();
            const enrolledCourses = student.enrolledCourses || [];
            
            // If courseFilter is set, only show students enrolled in that course
            if (!courseFilter || enrolledCourses.includes(courseFilter)) {
                const progress = student.progress || {};
                const coursesHTML = enrolledCourses.map(courseId => {
                    const courseProgress = progress[courseId] || 0;
                    return `
                        <div class="course-progress">
                            <span class="course-name">${getCourseTitle(courseId)}</span>
                            <div class="progress-bar">
                                <div class="progress" style="width: ${courseProgress}%"></div>
                            </div>
                            <span class="progress-text">${courseProgress}% complete</span>
                        </div>
                    `;
                }).join('');

                studentsHTML += `
                    <div class="student-item">
                        <div class="student-info">
                            <h4>${student.name || 'Unnamed Student'}</h4>
                            <p>${student.email}</p>
                            <p>Enrolled in ${enrolledCourses.length} course(s)</p>
                        </div>
                        <div class="courses">
                            ${coursesHTML}
                        </div>
                    </div>
                `;
            }
        });

        if (studentsHTML) {
            studentsList.innerHTML = studentsHTML;
        } else {
            studentsList.innerHTML = '<div class="no-data">No students found for the selected course</div>';
        }
    } catch (error) {
        console.error('Error loading student data:', error);
        studentsList.innerHTML = '<div class="error">Error loading student data. Please try again.</div>';
        showNotification('Error loading student data: ' + error.message, 'error');
    }
}

// Event listener for instructor dashboard link
document.addEventListener('click', async (e) => {
    if (e.target.id === 'instructorDashboard') {
        e.preventDefault();
        console.log('Opening instructor dashboard...');
        const dashboard = createInstructorDashboard();
        openModal(dashboard);
        console.log('Loading courses...');
        await loadCourses();
        console.log('Loading student data...');
        await loadStudentData();
        console.log('Dashboard initialization complete');
    }
});

// Function to handle course enrollment/viewing
async function handleCourseAction(courseId, isLoggedIn, button) {
    console.log('Handling course action:', { courseId, isLoggedIn });
    
    if (!isLoggedIn) {
        showNotification('Please log in to access courses', 'error');
        openModal(loginModal);
        return;
    }

    const user = window.auth?.currentUser;
    if (!user) {
        showNotification('Please log in to access courses', 'error');
        openModal(loginModal);
        return;
    }

    try {
        // Get user document reference
        const userRef = window.db.collection('users').doc(user.uid);
        const userDoc = await userRef.get();
        
        if (!userDoc.exists) {
            console.error('User document not found');
            showNotification('Error accessing user data', 'error');
            return;
        }

        const userData = userDoc.data();
        let enrolledCourses = userData.enrolledCourses || [];
        console.log('Current enrolled courses:', enrolledCourses);

        // If button text is "Enroll Now"
        if (button.textContent === 'Enroll Now') {
            console.log('Enrolling in course:', courseId);
            
            if (!enrolledCourses.includes(courseId)) {
                // Add the course to enrolled courses
                enrolledCourses.push(courseId);
                
                // Update the user document
                await userRef.update({
                    enrolledCourses: enrolledCourses
                });
                
                console.log('Successfully enrolled in course');
                showNotification('Successfully enrolled in the course!');
                
                // Update button
                button.textContent = 'View Course';
                button.setAttribute('data-viewing', 'true');
            } else {
                console.log('Already enrolled in this course');
                 showNotification('You are already enrolled in this course!');
                button.textContent = 'View Course';
                 button.setAttribute('data-viewing', 'true');
            }
        } 
        // If button text is "View Course"
        else if (button.textContent === 'View Course') {
            console.log('Viewing course:', courseId);
             const coursePage = coursePages[courseId];
             if (coursePage) {
                 window.location.href = coursePage;
             } else {
                showNotification('Course page not found', 'error');
             }
        }

        // Update all course buttons
         updateCourseButtons();

    } catch (error) {
        console.error('Error handling course action:', error);
        showNotification('Error processing your request. Please try again.', 'error');
    }
}

// Update course buttons based on enrollment status
async function updateCourseButtons() {
    console.log('Updating course buttons');
    const user = window.auth?.currentUser;
    
    if (!user) {
        console.log('No user logged in, resetting buttons to Enroll Now');
        document.querySelectorAll('.enroll-btn').forEach(button => {
            button.textContent = 'Enroll Now';
            button.removeAttribute('data-viewing');
        });
        return;
    }

    try {
        const userDoc = await window.db.collection('users').doc(user.uid).get();
        if (!userDoc.exists) {
            console.error('User document not found');
            return;
        }

        const userData = userDoc.data();
        const enrolledCourses = userData.enrolledCourses || [];
        console.log('Enrolled courses:', enrolledCourses);

        document.querySelectorAll('.enroll-btn').forEach(button => {
            const courseId = button.getAttribute('data-course-id');
            console.log('Checking course:', courseId);
            
            if (enrolledCourses.includes(courseId)) {
                console.log('User is enrolled in:', courseId);
                button.textContent = 'View Course';
                button.setAttribute('data-viewing', 'true');
            } else {
                console.log('User is not enrolled in:', courseId);
                button.textContent = 'Enroll Now';
                button.removeAttribute('data-viewing');
            }
        });
    } catch (error) {
        console.error('Error updating course buttons:', error);
    }
}

// Add click handlers for enroll buttons
document.querySelectorAll('.enroll-btn').forEach(button => {
    button.addEventListener('click', function(event) {
        event.preventDefault();
        const courseId = this.getAttribute('data-course-id');
        const user = window.auth?.currentUser;
            handleCourseAction(courseId, !!user, this);
    });
});

// Initialize course buttons on page load
document.addEventListener('DOMContentLoaded', () => {
    updateCourseButtons();
});

// Function to toggle dropdown visibility
function toggleDropdown() {
    if (userMenuContainer) {
        console.log('Toggling dropdown');
        userMenuContainer.classList.toggle('show');
        userInfoTrigger.classList.toggle('active');
    }
}

// Add event listener to user info trigger
if (userInfoTrigger) {
    userInfoTrigger.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('User info trigger clicked');
        toggleDropdown();
    });
}

// Function to handle My Courses link click
const myCoursesLink = document.querySelector('.dropdown-menu ul li:first-child a');
if (myCoursesLink) {
    console.log('My Courses link found');
    myCoursesLink.addEventListener('click', async function(event) { // Added async here
        event.preventDefault();
        event.stopPropagation();
        console.log('My Courses link clicked');
        const user = window.auth?.currentUser;
        if (!user) {
            showNotification('Please log in to view your courses');
            openModal(loginModal);
            return;
        }

        const userDocRef = doc(window.db, 'users', user.uid);

        try {
            const userDocSnap = await getDoc(userDocRef);
            let enrolledCourses = [];

            if (userDocSnap.exists()) {
                const userData = userDocSnap.data();
                if (userData && userData.enrolledCourses) {
                    enrolledCourses = userData.enrolledCourses;
                }
            }

            console.log('Enrolled courses:', enrolledCourses);

            if (enrolledCourses.length === 0) {
                showNotification('You have not enrolled in any courses yet');
                return;
            }


            // Create and show enrolled courses modal
            const coursesModal = document.createElement('div');
            coursesModal.className = 'modal';
            coursesModal.innerHTML = `
                <div class="modal-content">
                    <span class="close-button">&times;</span>
                    <h2>My Enrolled Courses</h2>
                    <div class="enrolled-courses-list">
                        ${enrolledCourses.map(courseId => {
                            const courseNames = {
                                'web-development': 'Web Development Fundamentals',
                                'mobile-development': 'Mobile App Development',
                                'data-science': 'Data Science & Machine Learning',
                                'cloud-computing': 'Cloud Computing & DevOps'
                            };
                            return `
                                <div class="enrolled-course-item">
                                    <h3>${courseNames[courseId]}</h3>
                                    <a href="${coursePages[courseId]}" class="view-course-btn">Continue Learning</a>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            `;

            document.body.appendChild(coursesModal);
            coursesModal.style.display = 'block';
            setTimeout(() => coursesModal.classList.add('show'), 10);

            // Close button functionality
            const closeButton = coursesModal.querySelector('.close-button');
            closeButton.addEventListener('click', () => {
                coursesModal.classList.remove('show');
                setTimeout(() => {
                    coursesModal.remove();
                }, 300);
            });

            // Click outside to close
            coursesModal.addEventListener('click', (e) => {
                if (e.target === coursesModal) {
                    coursesModal.classList.remove('show');
                    setTimeout(() => {
                        coursesModal.remove();
                    }, 300);
                }
            });
        } catch (error) {
            console.error('Error fetching enrolled courses:', error);
            showNotification('Error fetching enrolled courses.', 'error');
        }
    });
} else {
    console.log('My Courses link not found');
}

// Function to show a specific section and hide others
function showSection(sectionId) {
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.style.display = 'none'; // Hide all sections explicitly
    });

    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.style.display = 'block'; // Show the target section
    }
}

// Handle My Profile link click
if (profileLink) {
    profileLink.addEventListener('click', function(event) {
        event.preventDefault();
        toggleDropdown(); // Close dropdown
        profileModal.style.display = 'block';
        setTimeout(() => {
            profileModal.classList.add('show');
        }, 10);
    });
}

// Profile functionality
const profileModal = document.getElementById('profileModal');
const profileForm = document.getElementById('profileForm');
const closeProfile = document.getElementById('closeProfile');

// Profile picture handling
function initializeProfilePicture() {
    const profilePicContainer = document.querySelector('.profile-avatar');
    if (!profilePicContainer) return;

    const changeProfilePicBtn = document.getElementById('changeProfilePicBtn');
    const picOptionButtons = document.querySelector('.pic-option-buttons');
    const cameraInput = document.getElementById('cameraInput');
    const galleryInput = document.getElementById('galleryInput');
    const profilePicDisplay = document.getElementById('profilePicDisplay');
    const defaultBtn = document.querySelector('.default-btn');
    const cameraBtn = document.querySelector('.camera-btn');
    const galleryBtn = document.querySelector('.gallery-btn');

    // Load existing profile picture if any
    const user = window.auth?.currentUser;
    if (user) {
        window.db.collection('users').doc(user.uid).get().then(doc => {
            if (doc.exists && doc.data().profilePicBase64) {
                profilePicDisplay.src = doc.data().profilePicBase64;
            }
        });
    }

    // Toggle picture options
    changeProfilePicBtn.addEventListener('click', () => {
        picOptionButtons.style.display = picOptionButtons.style.display === 'none' ? 'block' : 'none';
    });

    // Close options when clicking outside
    document.addEventListener('click', (e) => {
        if (!profilePicContainer.contains(e.target)) {
            picOptionButtons.style.display = 'none';
        }
    });

    // Camera button click
    cameraBtn.addEventListener('click', () => {
        cameraInput.click();
        picOptionButtons.style.display = 'none';
    });

    // Gallery button click
    galleryBtn.addEventListener('click', () => {
        galleryInput.click();
        picOptionButtons.style.display = 'none';
    });

    // Default button click
    defaultBtn.addEventListener('click', async () => {
        try {
            const user = window.auth.currentUser;
            if (!user) throw new Error('No user logged in');

            // Update profile picture in UI
            profilePicDisplay.src = 'images/default-avatar.png';

            // Update user profile
            await window.db.collection('users').doc(user.uid).update({
                profilePicBase64: null
            });

            // Update navigation profile picture
            const navProfilePic = document.querySelector('.nav-profile-pic');
            if (navProfilePic) {
                navProfilePic.src = 'images/default-avatar.png';
            }

            showNotification('Profile picture reset to default');
            picOptionButtons.style.display = 'none';
        } catch (error) {
            console.error('Error resetting profile picture:', error);
            showNotification('Failed to reset profile picture', 'error');
        }
    });

    // Handle file selection (both camera and gallery)
    async function handleFileSelect(file) {
        if (!file) return;

        // Remove any existing loading spinner first
        const existingSpinner = document.querySelector('.loading-spinner');
        if (existingSpinner) {
            existingSpinner.remove();
        }

        // Create and show loading spinner
        const loadingSpinner = document.createElement('div');
        loadingSpinner.className = 'loading-spinner';
        const profilePicWrapper = profilePicDisplay.parentElement;
        profilePicWrapper.appendChild(loadingSpinner);
        profilePicDisplay.style.opacity = '0.5';

        try {
            const user = window.auth.currentUser;
            if (!user) throw new Error('No user logged in');

            // Convert to base64
            const base64String = await fileToBase64(file);
            const compressedBase64 = await compressBase64Image(base64String);

            // Update profile picture in UI
            profilePicDisplay.src = compressedBase64;

            // Save base64 string to user profile
            await window.db.collection('users').doc(user.uid).update({
                profilePicBase64: compressedBase64
            });

            // Update navigation profile picture
            const navProfilePic = document.querySelector('.nav-profile-pic');
            if (navProfilePic) {
                navProfilePic.src = compressedBase64;
            }

            showNotification('Profile picture updated successfully!');
        } catch (error) {
            console.error('Error updating profile picture:', error);
            showNotification('Failed to update profile picture: ' + error.message, 'error');
            
            // Reset profile picture display if there was an error
            const user = window.auth?.currentUser;
            if (user) {
                const userDoc = await window.db.collection('users').doc(user.uid).get();
                if (userDoc.exists && userDoc.data().profilePicBase64) {
                    profilePicDisplay.src = userDoc.data().profilePicBase64;
            } else {
                    profilePicDisplay.src = 'images/default-avatar.png';
                }
            } else {
                profilePicDisplay.src = 'images/default-avatar.png';
            }
        } finally {
            // Always clean up loading state
            if (loadingSpinner && loadingSpinner.parentElement) {
                loadingSpinner.remove();
            }
            profilePicDisplay.style.opacity = '1';
        }
    }

    // Convert file to base64
    function fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    // Compress base64 image
    async function compressBase64Image(base64String) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const MAX_WIDTH = 400;
                const MAX_HEIGHT = 400;
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > MAX_WIDTH) {
                        height *= MAX_WIDTH / width;
                        width = MAX_WIDTH;
                    }
                } else {
                    if (height > MAX_HEIGHT) {
                        width *= MAX_HEIGHT / height;
                        height = MAX_HEIGHT;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                resolve(canvas.toDataURL('image/jpeg', 0.7));
            };
            img.src = base64String;
        });
    }

    // Handle camera input
    cameraInput.addEventListener('change', (e) => {
        handleFileSelect(e.target.files[0]);
    });

    // Handle gallery input
    galleryInput.addEventListener('change', (e) => {
        handleFileSelect(e.target.files[0]);
    });
}

// Profile form handling
if (profileForm) {
    profileForm.addEventListener('submit', async function(e) {
            e.preventDefault();

        const user = window.auth?.currentUser;
        if (!user) {
            showNotification('Please log in to update your profile', 'error');
            return;
        }

        const name = document.getElementById('profileName').value.trim();
        const bio = document.getElementById('profileBio').value.trim();
        const newPassword = document.getElementById('profilePassword').value;

        try {
            // Update user profile in Firestore
            const updates = {
                name: name,
                bio: bio,
                updatedAt: new Date().toISOString()
            };

            await window.db.collection('users').doc(user.uid).update(updates);

            // Update password if provided
            if (newPassword) {
                await user.updatePassword(newPassword);
            }

            // Update UI
            document.getElementById('loggedInUsername').textContent = name;
            
            showNotification('Profile updated successfully!');
            
            // Update navigation
            updateNavigation(true, name);

        } catch (error) {
            console.error('Error updating profile:', error);
            showNotification(error.message, 'error');
        }
    });
}

// Load profile data
async function loadProfileData() {
    const user = window.auth?.currentUser;
    if (!user) return;

    try {
        const doc = await window.db.collection('users').doc(user.uid).get();
        if (doc.exists) {
            const data = doc.data();
            document.getElementById('profileName').value = data.name || '';
            document.getElementById('profileEmail').value = data.email || user.email;
            document.getElementById('profileBio').value = data.bio || '';
            
            // Load profile picture if exists
            const profilePicDisplay = document.getElementById('profilePicDisplay');
            if (profilePicDisplay && data.profilePicBase64) {
                profilePicDisplay.src = data.profilePicBase64;
            }
        }
    } catch (error) {
        console.error('Error loading profile data:', error);
        showNotification('Failed to load profile data', 'error');
    }
}

// Profile link handling
document.getElementById('profileLink')?.addEventListener('click', function(e) {
    e.preventDefault();
    if (!window.auth?.currentUser) {
        showNotification('Please log in to view your profile', 'error');
        return;
    }
    openModal(profileModal);
    loadProfileData();
    initializeProfilePicture();
});

// Close profile modal
if (closeProfile) {
    closeProfile.addEventListener('click', () => closeModal(profileModal));
}

// My Courses functionality
async function showMyCourses() {
    const user = window.auth?.currentUser;
    if (!user) {
        showNotification('Please log in to view your courses', 'error');
        return;
    }

    try {
        const userDoc = await window.db.collection('users').doc(user.uid).get();
        if (!userDoc.exists) {
            showNotification('User data not found', 'error');
            return;
        }

        const userData = userDoc.data();
        const enrolledCourses = userData.enrolledCourses || [];

        // Create modal for enrolled courses
        const coursesModal = document.createElement('div');
        coursesModal.className = 'modal';
        coursesModal.innerHTML = `
            <div class="modal-content">
                <span class="close-button">&times;</span>
                <h2>My Enrolled Courses</h2>
                <div class="enrolled-courses-list">
                    ${enrolledCourses.length === 0 ? 
                        '<p>You haven\'t enrolled in any courses yet.</p>' :
                        enrolledCourses.map(courseId => `
                            <div class="enrolled-course-item" data-course-id="${courseId}">
                                <div class="course-info">
                                    <h3>${getCourseTitle(courseId)}</h3>
                                    <div class="progress-bar">
                                        <div class="progress" style="width: ${userData.progress?.[courseId] || 0}%"></div>
                                    </div>
                                    <span class="progress-text">${userData.progress?.[courseId] || 0}% Complete</span>
                                </div>
                                <div class="course-actions">
                                    <button class="view-course-btn" data-course-id="${courseId}">Continue Learning</button>
                                </div>
                            </div>
                        `).join('')
                    }
                </div>
            </div>
        `;

        document.body.appendChild(coursesModal);
        openModal(coursesModal);

        // Add event listeners for course actions
        coursesModal.querySelectorAll('.view-course-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const courseId = btn.dataset.courseId;
                const coursePage = coursePages[courseId];
                if (coursePage) {
                    window.location.href = coursePage;
                } else {
                    showNotification('Course content coming soon!');
                }
            });
        });

        // Close button functionality
        const closeButton = coursesModal.querySelector('.close-button');
        closeButton.addEventListener('click', () => closeModal(coursesModal));

    } catch (error) {
        console.error('Error loading enrolled courses:', error);
        showNotification('Failed to load enrolled courses', 'error');
    }
}

// Helper function to get course title from ID
function getCourseTitle(courseId) {
    const courseTitles = {
        'web-development': 'Web Development Fundamentals',
        'mobile-development': 'Mobile App Development',
        'data-science': 'Data Science & Machine Learning',
        'cloud-computing': 'Cloud Computing & DevOps',
        'ui-ux-design': 'UI/UX Design Essentials',
        'cybersecurity': 'Cybersecurity Fundamentals',
        'ai-deep-learning': 'AI & Deep Learning',
        'blockchain': 'Blockchain & Web3',
        'game-development': 'Game Development',
        'digital-marketing': 'Digital Marketing'
    };
    return courseTitles[courseId] || 'Unknown Course';
}

// My Courses link handler
document.querySelector('.dropdown-menu ul li:first-child a')?.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    showMyCourses();
});

// Initialize course filter dropdown
async function initializeCourseFilter() {
    const courseFilter = document.getElementById('courseFilter');
    if (!courseFilter) return;

    try {
        // Get all courses
        const coursesSnapshot = await window.db.collection('courses').get();
        let courseOptions = '<option value="">All Courses</option>';
        
        coursesSnapshot.forEach(doc => {
            const course = doc.data();
            courseOptions += `<option value="${doc.id}">${course.name}</option>`;
        });
        
        courseFilter.innerHTML = courseOptions;

        // Add change event listener
        courseFilter.addEventListener('change', (e) => {
            loadStudentData(e.target.value);
        });
    } catch (error) {
        console.error('Error initializing course filter:', error);
        showNotification('Error loading course filter: ' + error.message, 'error');
    }
}

// Call this function when instructor dashboard is opened
function openInstructorDashboard() {
    // ... existing code ...
    
    // Initialize course filter
    initializeCourseFilter();
    
    // Load initial student data
    loadStudentData();
    
    // ... existing code ...
}

// Show Edit Course Form
function showEditCourseForm(courseId, courseData) {
    const formModal = document.createElement('div');
    formModal.className = 'modal';
    formModal.innerHTML = `
        <div class="modal-content">
            <span class="close-button">&times;</span>
            <h2>Edit Course</h2>
            <form id="editCourseForm">
                <div class="form-group">
                    <input type="text" id="editCourseName" placeholder="Course Name" value="${courseData.name || ''}" required>
                </div>
                <div class="form-group">
                    <textarea id="editCourseDescription" placeholder="Course Description" required>${courseData.description || ''}</textarea>
                </div>
                <div class="form-group">
                    <input type="number" id="editCourseDuration" placeholder="Duration (weeks)" value="${courseData.duration || ''}" required>
                </div>
                <div class="form-group">
                    <input type="text" id="editCourseImage" placeholder="Image URL" value="${courseData.imageUrl || ''}" required>
                </div>
                <button type="submit" class="submit-btn">Save Changes</button>
            </form>
        </div>
    `;
    document.body.appendChild(formModal);
    openModal(formModal);

    // Handle form submission
    const form = formModal.querySelector('#editCourseForm');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const updatedCourseData = {
            name: form.querySelector('#editCourseName').value,
            description: form.querySelector('#editCourseDescription').value,
            duration: form.querySelector('#editCourseDuration').value,
            imageUrl: form.querySelector('#editCourseImage').value,
            updatedAt: new Date().toISOString()
        };

        try {
            await window.db.collection('courses').doc(courseId).update(updatedCourseData);
            showNotification('Course updated successfully!');
            closeModal(formModal);
            loadCourses(); // Refresh courses list
        } catch (error) {
            showNotification('Error updating course: ' + error.message, 'error');
        }
    });

    // Close button functionality
    const closeBtn = formModal.querySelector('.close-button');
    closeBtn.addEventListener('click', () => {
        closeModal(formModal);
    });
} 