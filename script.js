document.addEventListener('DOMContentLoaded', function() {
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
            hero.style.backgroundPositionY = scrolled * 0.5 + 'px';
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

    // Get the modals
    const loginModal = document.getElementById('loginModal');
    const signupModal = document.getElementById('signupModal');
    const forgotPasswordModal = document.getElementById('forgotPasswordModal');

    // Get the links that open the modals
    const loginBtnNav = document.querySelector('.login-btn');
    const signupBtnNav = document.querySelector('.signup-btn');
    const showForgotPasswordLink = document.getElementById('showForgotPassword');

    // Get the <span> element that closes the modal
    const closeButtons = document.querySelectorAll('.close-button');
    const closeForgotPasswordBtn = document.getElementById('closeForgotPassword');

    // Get the links to switch between modals
    const showSignupLink = document.getElementById('showSignup');
    const showLoginLink = document.getElementById('showLogin');
    const showLoginFromForgotLink = document.getElementById('showLoginFromForgot');

    // Function to open a modal
    function openModal(modal) {
        modal.style.display = 'block';
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);
    }

    // Function to close a modal
    function closeModal(modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300); // Match CSS transition duration
    }

    // When the user clicks on a navigation button, open the corresponding modal
    if (loginBtnNav) {
        loginBtnNav.addEventListener('click', function(event) {
            event.preventDefault(); // Prevent default link behavior
            openModal(loginModal);
        });
    }

    if (signupBtnNav) {
        signupBtnNav.addEventListener('click', function(event) {
            event.preventDefault(); // Prevent default link behavior
            openModal(signupModal);
        });
    }

    // When the user clicks on <span> (x), close the modal
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            closeModal(modal);
        });
    });

    // When the user clicks the close button on the forgot password modal, close it
    if (closeForgotPasswordBtn) {
        closeForgotPasswordBtn.addEventListener('click', function() {
            closeModal(forgotPasswordModal);
        });
    }

    // When the user clicks anywhere outside of the modal, close it
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            closeModal(event.target);
        }
    });

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
        isLoggedIn = isLoggedInStatus; // Update state variable
        if (isLoggedIn) {
            loggedOutNavItems.forEach(item => item.style.display = 'none');
            // Use flex for user menu container to allow dropdown
            if (userMenuContainer) {
                userMenuContainer.style.display = 'flex'; // Use flex to align items and position dropdown
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
            loggedOutNavItems.forEach(item => item.style.display = 'list-item'); // Or appropriate display type
            if (userMenuContainer) {
                userMenuContainer.style.display = 'none'; // Hide user menu container
            }
            loggedInNavItems.forEach(item => {
                if (!item.classList.contains('user-menu-container')) {
                    item.style.display = 'none';
                }
            });
            if (loggedInUsernameSpan) {
                loggedInUsernameSpan.textContent = 'User'; // Reset username on logout
            }
            // Hide profile section on logout
            if (userProfileSection) {
                userProfileSection.style.display = 'none';
            }
            // Show other sections again (optional, depends on desired behavior)
            const sections = document.querySelectorAll('section');
            sections.forEach(section => {
                if (section.id !== 'user-profile') {
                    section.style.display = 'block';
                }
            });
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

    if (loginForm) {
        loginForm.addEventListener('submit', async function(event) {
            event.preventDefault();
            const email = document.getElementById('modal-email').value;
            const password = document.getElementById('modal-password').value;

            try {
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;
                showNotification('Login successful!');
                closeModal(loginModal);
                updateNavigation(true, user.email);
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            } catch (error) {
                showNotification(error.message, 'error');
            }
        });
    }

    if (signupForm) {
        signupForm.addEventListener('submit', async function(event) {
            event.preventDefault();
            const email = document.getElementById('modal-signup-email').value;
            const password = document.getElementById('modal-signup-password').value;
            const confirmPassword = document.getElementById('modal-confirm-password').value;

            // Validate passwords match before proceeding
            if (password !== confirmPassword) {
                showNotification('Passwords do not match', 'error');
                return; // Stop execution here if passwords don't match
            }

            // Validate password length
            if (password.length < 6) {
                showNotification('Password must be at least 6 characters long', 'error');
                return;
            }

            try {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;
                showNotification('Signup successful!');
                closeModal(signupModal);
                updateNavigation(true, user.email);
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            } catch (error) {
                showNotification(error.message, 'error');
            }
        });
    }

    // Handle logout with Firebase
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async function(event) {
            event.preventDefault();
            try {
                await signOut(auth);
                showNotification('Logged out successfully!');
                updateNavigation(false);
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            } catch (error) {
                showNotification(error.message, 'error');
            }
        });
    }

    // Handle Forgot Password Form Submission with Firebase
    if (forgotPasswordForm) {
        forgotPasswordForm.addEventListener('submit', async function(event) {
            event.preventDefault();
            const email = document.getElementById('forgot-email').value;

            try {
                await sendPasswordResetEmail(auth, email);
                showNotification('Password reset email sent successfully. Please check your inbox.');
                closeModal(forgotPasswordModal);
            } catch (error) {
                showNotification(error.message, 'error');
            }
        });
    }

    // Function to handle course enrollment/viewing
    async function handleCourseAction(courseId, isLoggedIn, button) {
        if (!isLoggedIn) {
            showNotification('Please log in to access courses');
            openModal(loginModal);
            return;
        }

        const user = auth.currentUser;
        if (!user) return;

        const userDocRef = doc(db, 'users', user.uid);

        try {
            const userDocSnap = await getDoc(userDocRef);
            let enrolledCourses = [];

            if (userDocSnap.exists()) {
                const userData = userDocSnap.data();
                if (userData && userData.enrolledCourses) {
                    enrolledCourses = userData.enrolledCourses;
                }
            } else {
                // Create the user document if it doesn't exist
                await setDoc(userDocRef, { enrolledCourses: [] });
            }

            // If button text is "Enroll Now", change it to "View Course"
            if (button.textContent === 'Enroll Now') {
                // Add course to enrolled courses using arrayUnion to avoid duplicates and race conditions
                if (!enrolledCourses.includes(courseId)) {
                    await updateDoc(userDocRef, {
                        enrolledCourses: arrayUnion(courseId)
                    });
                    showNotification('Successfully enrolled in the course!');
                    // Update local state immediately for responsiveness
                    enrolledCourses.push(courseId);
                    button.textContent = 'View Course';
                    button.setAttribute('data-viewing', 'true');
                } else {
                     showNotification('You are already enrolled in this course!');
                     button.textContent = 'View Course'; // Ensure button is updated even if already enrolled
                     button.setAttribute('data-viewing', 'true');
                }

            } else if (button.textContent === 'View Course') {
                 // If button text is "View Course", navigate to the course page
                 const coursePage = coursePages[courseId];
                 if (coursePage) {
                     window.location.href = coursePage;
                 } else {
                     showNotification('Course page not found');
                 }
            }
             // After any action that might change enrollment status, update buttons
             updateCourseButtons();

        } catch (error) {
            console.error('Error handling course action:', error);
            showNotification('Error performing course action.', 'error');
        }
    }


    // Function to update course buttons based on enrollment status from Firestore
    async function updateCourseButtons() {
        const user = auth.currentUser;
        if (!user) {
            // If no user is logged in, ensure all buttons show "Enroll Now"
            document.querySelectorAll('.enroll-btn').forEach(button => {
                button.textContent = 'Enroll Now';
                button.removeAttribute('data-viewing');
            });
            return;
        }

        const userDocRef = doc(db, 'users', user.uid);

        try {
            const userDocSnap = await getDoc(userDocRef);
            let enrolledCourses = [];

            if (userDocSnap.exists()) {
                const userData = userDocSnap.data();
                if (userData && userData.enrolledCourses) {
                    enrolledCourses = userData.enrolledCourses;
                }
            }

            document.querySelectorAll('.enroll-btn').forEach(button => {
                const courseId = button.getAttribute('data-course-id');
                if (enrolledCourses.includes(courseId)) {
                    button.textContent = 'View Course';
                    button.setAttribute('data-viewing', 'true');
                } else {
                    button.textContent = 'Enroll Now';
                    button.removeAttribute('data-viewing');
                }
            });
        } catch (error) {
            console.error('Error updating course buttons:', error);
            // Optionally show an error notification, but might be disruptive on page load
        }
    }

    // Add click handlers for enroll buttons
    document.querySelectorAll('.enroll-btn').forEach(button => {
        button.addEventListener('click', function(event) {
            event.preventDefault();
            const courseId = this.getAttribute('data-course-id');
            const user = auth.currentUser; // Get current user here
            // Pass whether the user is logged in directly
            handleCourseAction(courseId, !!user, this);
        });
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
            const user = auth.currentUser;
            if (!user) {
                showNotification('Please log in to view your courses');
                openModal(loginModal);
                return;
            }

            const userDocRef = doc(db, 'users', user.uid);

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

    // Check login status on page load and update buttons
    onAuthStateChanged(auth, (user) => {
        if (user) {
            updateNavigation(true, user.email);
            updateCourseButtons(); // Update buttons on login
        } else {
            updateNavigation(false);
             updateCourseButtons(); // Update buttons on logout
        }
    });

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

    // *** New Profile Modal JavaScript ***
    const profileModal = document.getElementById('profileModal');
    const closeProfile = document.getElementById('closeProfile');
    const profileForm = document.getElementById('profileForm');
    const profileSaveMessage = document.getElementById('profileSaveMessage');

    // Hide Modal (using the close button)
    if (closeProfile) {
        closeProfile.addEventListener('click', function () {
            profileModal.classList.remove('show');
            setTimeout(() => {
                profileModal.style.display = 'none';
            }, 300);
        });
    }

    // Click outside to close modal
    window.addEventListener('click', function (e) {
        if (e.target === profileModal) {
            profileModal.classList.remove('show');
            setTimeout(() => {
                profileModal.style.display = 'none';
            }, 300);
        }
    });

    // Save Profile (simulate saving) - For the modal form
    if (profileForm) {
        profileForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const name = document.getElementById('profileName').value.trim();
            const email = document.getElementById('profileEmail').value.trim();
            const bio = document.getElementById('profileBio').value.trim();
            const password = document.getElementById('profilePassword').value;

            if (name === '' || email === '') {
                showNotification('Name and Email are required.', 'error');
                return;
            }

            // Simulate saving data
            console.log('Saved Profile:', { name, email, bio, password });

            // Show success message
            showNotification('Profile saved successfully!');
            profileForm.reset();

            // Close modal after 2 seconds
            setTimeout(() => {
                profileModal.classList.remove('show');
                setTimeout(() => {
                    profileModal.style.display = 'none';
                }, 300);
            }, 2000);
        });
    }
    // *** End New Profile Modal JavaScript ***
}); 