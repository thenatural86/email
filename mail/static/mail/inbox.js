document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  document.querySelector('#compose-form').onsubmit = send_mail;

  // By default, load the inbox
  load_mailbox('inbox');
 
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  // console.log(mailbox)

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  // request to the mailbox that is passed in as arg
  fetch(`/emails/${mailbox}`)
  .then(response => response.json())
  .then(data => {
    data.forEach(email => render_emails(email))
  })
}

const render_emails = (email) => {
  const mail = document.createElement('div');
      const sender = document.createElement('h5');
      const subject = document.createElement('p');
      const time = document.createElement('p');
      const id = document.createElement('p');

      id.innerHTML = email.id;
      sender.innerHTML = `From: ${email.sender}`;
      subject.innerHTML = `Subject: ${email.subject}`;
      time.innerHTML = email.timestamp;

      mail.style.borderStyle = 'solid';
      mail.style.borderColor = 'black';
      mail.style.borderWidth = '2px';
      mail.style.borderRadius = '5px';
      mail.style.margin = '2rem';
      if(email.read === true){
        mail.style.backgroundColor = 'red'
      }

      mail.classList.add('container');
      mail.classList.add('mail');

      const email_view = document.querySelector('#emails-view');

      email_view.appendChild(mail);
      mail.appendChild(sender);
      mail.appendChild(subject);
      mail.append(time);
      mail.addEventListener('click', () => load_email()) 
}

const load_email = () => {
  console.log('yolo')

  document.querySelector('#emails-view').style.display = 'none';
  // fetch(`/emails/${id}`)
}


function send_mail(){
  const recipients = document.querySelector('#compose-recipients').value;
  const subject = document.querySelector('#compose-subject').value;
  const body = document.querySelector('#compose-body').value;

  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
      recipients: recipients,
      subject: subject,
      body: body
    })
  })
  .then(response => response.json())
  .then(result => {
    console.log(result)
    localStorage.clear()
    load_mailbox('sent');
  })
  return false
}
