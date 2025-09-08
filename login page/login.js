document.addEventListener('DOMContentLoaded', function() {
    const checkbox = document.getElementById('enableNotifications');
    const phoneInput = document.getElementById('phone');
    checkbox.addEventListener('click', function() {
      console.log('Checkbox clicked. New state:', checkbox.checked);
    });
 //blurt effect
    const inputs = document.querySelectorAll('input:not([type="checkbox"]), select');
    inputs.forEach(input => {
      input.addEventListener('focus', function() {
        this.parentElement.querySelector('label').style.color = '#4361ee';
      });
      
      input.addEventListener('blur', function() {
        this.parentElement.querySelector('label').style.color = '';
      });
    });
  });

  document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const defaultStop = document.getElementById('defaultStop').value;
    const enableNotifications = document.getElementById('enableNotifications').checked;
    
    console.log('Form submitted with notifications:', enableNotifications);
    
    // phone no. check
    if (!phone.match(/^\+?[0-9]{10,15}$/)) {
      document.getElementById('phoneError').style.display = 'block';
      return;
    }
    
    // user data store
    const userData = {
      name,
      phone,
      defaultStop,
      enableNotifications
    };
    
    console.log('Saving user data:', userData);
    localStorage.setItem('busTrackerUser', JSON.stringify(userData));
    
    // not completed
    document.querySelector('.container').style.opacity = '0';
    document.querySelector('.container').style.transform = 'translateY(-20px)';
    
    //delay
    setTimeout(() => {
      window.location.href = '../main website/index.html';
    }, 300);
  });