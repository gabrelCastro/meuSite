function deletePost(element,event) {
    const postId = element.getAttribute('data-id');

    event.preventDefault();

    fetch(`/post/${postId}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (response.ok) {
            alert('Post removido com sucesso!');
            window.location.href = '/postAdmin';
        } else {
            console.log(response);
        }
    })
    .catch(error => {
        console.error('Erro:', error);
        alert('Erro ao remover post.');
    });
}