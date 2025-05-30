document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value;
        
        // Show loading state
        const submitBtn = contactForm.querySelector('.submit-btn');
        const originalBtnText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        // Prepare template parameters
        const templateParams = {
            from_name: name,
            from_email: email,
            subject: subject,
            message: message,
            to_email: 'asadarmam100@gmail.com'
        };
        
        // Send email using EmailJS
        emailjs.send('service_mwkpo7h', 'template_ok6qxc1', templateParams)
            .then(function(response) {
                console.log('SUCCESS!', response.status, response.text);
                // Show success message
                showNotification('Message sent successfully!', 'success');
                // Reset form
                contactForm.reset();
            })
            .catch(function(error) {
                console.error('FAILED...', error);
                // Show error message
                showNotification('Failed to send message. Please try again.', 'error');
            })
            .finally(function() {
                // Reset button state
                submitBtn.textContent = originalBtnText;
                submitBtn.disabled = false;
            });
    });
    
    // Function to show notification
    function showNotification(message, type) {
        const notification = document.getElementById('customNotification');
        const notificationMessage = document.getElementById('notificationMessage');
        
        notificationMessage.textContent = message;
        notification.className = 'notification ' + type;
        notification.style.display = 'block';
        
        // Hide notification after 5 seconds
        setTimeout(() => {
            notification.style.display = 'none';
        }, 5000);
    }
}); 