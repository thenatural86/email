document.addEventListener('DOMContentLoaded', () => {
    
    const form = document.querySelector('#compose-form');
    form.addEventListener('submit', e => {
        e.preventDefault();
        const recipients = document.querySelector('#compose-recipients').value;
        const subject = document.querySelector('#compose-subject').value;
        const body = document.querySelector('#compose-body').value;
  
        fetch("/emails", {
            method: 'POST',
            body: JSON.stringify({
                recipients: recipients,
                subject: subject,
                body: body
            }),
        })
        .then(response => response.json())
        .then(result => {
            console.log(result);
            load_mailbox('sent')
        });
    })
})
