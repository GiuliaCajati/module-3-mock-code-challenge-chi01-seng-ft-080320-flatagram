const imageContainer = document.querySelector('.image-container')

const main = () => {
  fetchImages()
  addClickListener()
}

const fetchImages = () => {
  fetch('http://localhost:3000/images/1')
    .then(res => res.json())
    .then(image => renderImages(image));
}

const renderImages = image => {
    let commentsLi = image.comments.map(comment => {
      return `<li><button class="delete-comment" data-id=${comment.id}>🗑</button>${comment.content}</li>`
    }).join('')

    const imageCardsHTML = `<div class="image-card">
    <h2 class="title">${image.title}</h2>
    <img src=${image.image} class="image" />
    <div class="likes-section">
      <span class="likes">${image.likes} likes</span>
      <button class="like-button" data-id=${image.id}>♥</button>
      <button class="dislike-button" data-id=${image.id}>✃</button>
    </div>
    <ul class="comments">
      ${commentsLi}
    </ul>
    <form class="comment-form" data-id=${image.id}>
      <input class="comment-input" type="text" name="comment" placeholder="Add a comment..."/>
      <button class="comment-button" type="submit">Post</button>
    </form>`
    // change to += and fetch url when more than one image
    imageContainer.innerHTML = imageCardsHTML
}

const addClickListener = () => {
  imageContainer.addEventListener('click', event => {
    if (event.target.className === 'like-button') {
      addLike(event)
    }
    else if (event.target.className === 'comment-button') {
      event.preventDefault()
      addComment(event)
    }
    else if (event.target.className === 'dislike-button') {
      removeLike(event)
    }
    else if (event.target.className === 'delete-comment') {
      deleteComment(event)
    }
  })
}

const addLike = event => {
  const imageId = event.target.dataset.id
  const currentLikes = parseInt(event.target.previousElementSibling.innerText.split(' ')[0])
  const newLikes = currentLikes + 1
  patchRequestForLikes(imageId, newLikes)
}

const removeLike = event => {
  const imageId = event.target.dataset.id
  const currentLikes = parseInt(event.target.parentNode.firstElementChild.innerText.split(' ')[0])
  const newLikes = currentLikes - 1
  patchRequestForLikes(imageId, newLikes)
}

const patchRequestForLikes = (imageId, newLikes) => {
  const reqObj = {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify( { 'likes': newLikes } )
  }
  
  fetch(`http://localhost:3000/images/${imageId}`, reqObj)
    .then(res => res.json())
    .then(updatedImage => {
      const likesSpan = document.querySelector('.likes')
      likesSpan.innerText = `${updatedImage.likes} likes`
    })
}

const addComment = event => {
  const form = document.querySelector('form')
  const commentContent = event.target.previousElementSibling.value
  form.reset()
  const comment = {
    "imageId": 1,
    "content": commentContent
  }

  const reqObj = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify( comment )
  }

  fetch('http://localhost:3000/comments', reqObj)
    .then(res => res.json())
    .then(newComment => renderComment(newComment)  );
}

const renderComment = newComment => {
  const commentUl = document.querySelector('.comments')
  const commentLi = `<li><button class="delete-comment" data-id=${newComment.id}>🗑️</button>${newComment.content}</li>`
  commentUl.innerHTML += commentLi
}

const deleteComment = event => {
  const commentId = event.target.dataset.id
  
  fetch(`http://localhost:3000/comments/${commentId}`, { method: 'DELETE'})
    .then(res => res.json())
    .then(data => { 
      event.target.parentNode.remove() 
    });
}


main()


