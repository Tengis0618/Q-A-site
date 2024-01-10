// helper function for creating elements (usage optional)
function createElement(type, attrs, ...children) {
  const ele = document.createElement(type);

  // add element attributes
  for (const prop in attrs) {
    if (attrs.hasOwnProperty(prop)) {
      ele.setAttribute(prop, attrs[prop]);
    }
  }

  // add child nodes to element
  children.forEach(c => ele.appendChild(typeof c === 'string' ? document.createTextNode(c) : c));

  return ele;
}

function answerButtonListener () {
  const addAnswerButton = document.querySelectorAll('.answerbtn');
  addAnswerButton.forEach(button => {
    button.addEventListener('click', async (event) => {
      event.preventDefault();

      const modal = document.getElementById('modal-answer');
      modal.classList.add('open');
      modal.showModal();
      document.getElementById('question-id').value = button.id;

    })
  })
}

// TODO: finish client side javascript

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const response = await fetch('/questions/');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    data.forEach(question => {

      const questionDiv = createElement('div', { class: 'question', id:`${question._id}`});
      

      const questionHeading = createElement('h2', {}, question.question);
      

      const answerList = createElement('ul');
      

      question.answers.forEach(answer => {
        const answerItem = createElement('li', {}, answer);
        answerList.appendChild(answerItem);
      });

      const addButton = createElement('button', { type: 'button', class: 'answerbtn', id: `${question._id}`}, 'Add Answer');

      questionDiv.appendChild(questionHeading);
      questionDiv.appendChild(answerList);
      questionDiv.appendChild(addButton);
      
      const mainElement = document.querySelector('main');
      mainElement.appendChild(questionDiv);
    });

  document.getElementById('create-answer').addEventListener('click', () => {
    const answerText = document.getElementById('answer-text').value;
    const questionId = document.getElementById('question-id').value;

    fetch(`/questions/${questionId}/answers/`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({ answer: answerText }),
    })
    .then(response => response.json())
    .then(data => {
        if (!data.error && data.success) {
            // On success
            // Add user's answer beneath the question
            const answerItem = createElement('li', {}, answerText);
            const answerList = document.getElementById(questionId).getElementsByTagName('ul')[0];
            answerList.appendChild(answerItem);
    
            // Close the modal and clear all fields
            const modal = document.getElementById('modal-answer');
            modal.classList.remove('open');
            modal.close();
            document.getElementById('answer-text').value = '';
        } else {
            // On failure
            console.error('An error occurred:', data.error);
        }
    })
    .catch(error => {
        // On failure
        console.error('An error occurred:', error);
    });
    // Example: sendAnswerToServer(questionId.value, answerText.value);
    const modal = document.getElementById('modal-answer');
    modal.classList.remove('open');
    modal.close();
  });
  
  const questionButton = document.getElementById('btn-show-modal-question').addEventListener('click', async(event) => {
    event.preventDefault();
    const modal = document.getElementById('modal-question');
    modal.classList.add('open');
    modal.showModal();

    // Add click event listener to the "Cancel" button in the answer modal
    document.getElementById('modal-question').querySelector('.close').addEventListener('click', () => {
      const modal = document.getElementById('modal-question');
      modal.classList.remove('open');
      modal.close();
    });
  })

  document.getElementById('create-question').addEventListener('click', (event) => {
    event.preventDefault();
    const questionText = document.getElementById('question-text').value;
    let qid;
    fetch('/questions/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ _id: `${qid}`, question: questionText }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          console.log('An error occurred:', data.error);
        } else {

          const answerButton = createElement('button', { type: 'button', class: 'answerbtn', onClick: `answerButtonListener()`, id: `${data._id}`}, 'Add Answer');

          const questionDiv = createElement('div', { class: 'question', id: `${data._id}`});

          const questionHeading = createElement('h2', {}, questionText);

          const answerList = createElement('ul');
          questionDiv.appendChild(questionHeading);
          questionDiv.appendChild(answerList);
          questionDiv.appendChild(answerButton);

          const mainElement = document.querySelector('main');
          mainElement.appendChild(questionDiv);
          const modal = document.getElementById('modal-question');
          modal.close();
          modal.classList.remove('open');
          document.getElementById('question-text').value = '';
          mainElement.appendChild(addButton);
        }
      })

      .catch(error => {
        console.log('An error occurred:', error);
      });
    const modal = document.getElementById('modal-question');
    modal.classList.remove('open');
    modal.close();
  });
  answerButtonListener();
  document.getElementById('modal-answer').querySelector('.close').addEventListener('click', () => {
    const modal = document.getElementById('modal-answer');
    modal.classList.remove('open');
    document.getElementById('answer-text').value = '';
    modal.close();
  });
  } catch (error) {
    console.log('An error occurred:', error);
  }
});