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
  document.querySelector('#email-view').style.display = 'none';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#email-view').style.display = 'none';
  

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  // request to the mailbox that is passed in as arg
  fetch(`/emails/${mailbox}`)
  .then(response => response.json())
  .then(data => {
    data.forEach(email => render_emails(email, mailbox))
  })
}

const render_emails = (email, mailbox) => {
  document.querySelector('#email-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';
  const mail = document.createElement('div');
  const sender = document.createElement('h5');
  const subject = document.createElement('p');
  const time = document.createElement('p');
  const id = document.createElement('p');
  const archive = document.createElement('button');

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
    mail.style.backgroundColor = 'lightgray'
  }

  mail.classList.add('container');
  mail.classList.add('mail');

  const email_view = document.querySelector('#emails-view');

  email_view.appendChild(mail);
  mail.appendChild(sender).addEventListener('click', () => load_email(email.id));
  mail.appendChild(subject).addEventListener('click', () => load_email(email.id));
  mail.appendChild(time).addEventListener('click', () => load_email(email.id));



  if(mailbox === 'inbox'){
    if(email.archived === false){
      mail.appendChild(archive).addEventListener('click', () => archive_email(email));
      archive.innerHTML = 'Archive';
    } 
  }

  if(mailbox === 'archive'){
    mail.appendChild(archive).addEventListener('click', () => archive_email(email));
    archive.innerHTML = 'Unarchive';
  }
}

const archive_email = (email) => {
  if(email.archived === false){
    fetch(`/emails/${email.id}`, {
      method: 'PUT',
      body: JSON.stringify({
        archived: true
      })
    })
    .then(load_mailbox('inbox'))
  }
  else if(email.archived === true){
    fetch(`/emails/${email.id}`, {
      method: 'PUT',
      body: JSON.stringify({
        archived: false
      })
    })
    .then(load_mailbox('inbox'))
  }
}


const load_email = (id) => {
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#email-view').style.display = 'none';

  fetch(`/emails/${id}`)
  .then(response => response.json())
  .then(data => {
    render_email(data)
  })
}

const render_email = (email) => {
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#email-view').style.display = 'block';

  const mail = document.createElement('div');
  const sender = document.createElement('h5');
  const recipients = document.createElement('h5');
  const subject = document.createElement('p');
  const body = document.createElement('p');
  const time = document.createElement('p');
  const id = document.createElement('p');
  const reply = document.createElement('button');
   
  id.innerHTML = email.id;
  sender.innerHTML = `From: ${email.sender}`;
  recipients.innerHTML= `To: ${email.recipients[0]}`;
  subject.innerHTML = `Subject: ${email.subject}`;
  body.innerHTML = email.body;
  time.innerHTML = email.timestamp;
  reply.innerHTML = 'Reply';


  mail.style.display = 'block';
  mail.style.borderStyle = 'solid';
  mail.style.borderColor = 'black';
  mail.style.borderWidth = '2px';
  mail.style.borderRadius = '5px';

  const email_view = document.querySelector('#email-view');

  email_view.appendChild(mail);
  mail.appendChild(sender);
  mail.appendChild(recipients);
  mail.appendChild(subject);
  mail.appendChild(body);
  mail.append(time);
  fetch(`/emails/${email.id}`, {
    method: 'PUT',
    body:JSON.stringify({
      read: true
    })
  })
  
  mail.appendChild(reply).addEventListener('click', () => {
    console.log(email);
    compose_email();
    document.querySelector('#compose-recipients').value = email.sender;
    document.querySelector('#compose-body').value = `YOLO ${email.timestamp}`;

    if(email.subject.search('Re: ')){
      document.querySelector('#compose-subject').value = `Re: ${email.subject}`;
    } else {
      document.querySelector('#compose-subject').value = email.subject;
    }
  });
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
