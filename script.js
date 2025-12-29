// 인트로 페이지 - 책장 넘기기
document.addEventListener('DOMContentLoaded', function() {
    const book = document.getElementById('book');
    
    if (book) {
        book.addEventListener('click', function() {
            book.classList.add('flip');
            
            // 2초 후 메인 페이지로 이동
            setTimeout(function() {
                window.location.href = 'home.html';
            }, 2000);
        });
    }

    // 학교 행사 페이지
    const schoolUpload = document.getElementById('schoolUpload');
    const schoolGallery = document.getElementById('schoolGallery');

    if (schoolUpload && schoolGallery) {
        // 로컬 스토리지에서 저장된 사진 불러오기
        loadPhotos('school', schoolGallery);

        schoolUpload.addEventListener('change', function(e) {
            handleFileUpload(e, 'school', schoolGallery);
        });
    }

    // 친구들과의 추억 페이지
    const friendsUpload = document.getElementById('friendsUpload');
    const friendsGallery = document.getElementById('friendsGallery');

    if (friendsUpload && friendsGallery) {
        // 로컬 스토리지에서 저장된 사진 불러오기
        loadPhotos('friends', friendsGallery);

        friendsUpload.addEventListener('change', function(e) {
            handleFileUpload(e, 'friends', friendsGallery);
        });
    }
});

// 파일 업로드 처리
function handleFileUpload(event, category, gallery) {
    const files = event.target.files;
    
    for (let file of files) {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            
            reader.onload = function(e) {
                const photoData = {
                    id: Date.now() + Math.random(),
                    src: e.target.result,
                    title: '',
                    description: '',
                    date: new Date().toLocaleDateString('ko-KR')
                };
                
                savePhoto(category, photoData);
                displayPhoto(photoData, category, gallery);
            };
            
            reader.readAsDataURL(file);
        }
    }
    
    event.target.value = '';
}

// 사진 표시
function displayPhoto(photoData, category, gallery) {
    const photoItem = document.createElement('div');
    photoItem.className = 'photo-item';
    photoItem.dataset.id = photoData.id;
    
    photoItem.innerHTML = `
        <button class="delete-btn" onclick="deletePhoto('${category}', ${photoData.id})">×</button>
        <img src="${photoData.src}" alt="추억 사진">
        <div class="photo-info">
            <input type="text" placeholder="제목" value="${photoData.title}" 
                   onchange="updatePhoto('${category}', ${photoData.id}, 'title', this.value)">
            <textarea placeholder="설명을 입력하세요..." 
                      onchange="updatePhoto('${category}', ${photoData.id}, 'description', this.value)">${photoData.description}</textarea>
            <small>📅 ${photoData.date}</small>
        </div>
    `;
    
    gallery.appendChild(photoItem);
}

// 로컬 스토리지에 사진 저장
function savePhoto(category, photoData) {
    let photos = JSON.parse(localStorage.getItem(category) || '[]');
    photos.push(photoData);
    localStorage.setItem(category, JSON.stringify(photos));
}

// 로컬 스토리지에서 사진 불러오기
function loadPhotos(category, gallery) {
    const photos = JSON.parse(localStorage.getItem(category) || '[]');
    photos.forEach(photo => displayPhoto(photo, category, gallery));
}

// 사진 정보 업데이트
function updatePhoto(category, id, field, value) {
    let photos = JSON.parse(localStorage.getItem(category) || '[]');
    const index = photos.findIndex(p => p.id === id);
    
    if (index !== -1) {
        photos[index][field] = value;
        localStorage.setItem(category, JSON.stringify(photos));
    }
}

// 사진 삭제
function deletePhoto(category, id) {
    if (confirm('이 사진을 삭제하시겠습니까?')) {
        let photos = JSON.parse(localStorage.getItem(category) || '[]');
        photos = photos.filter(p => p.id !== id);
        localStorage.setItem(category, JSON.stringify(photos));
        
        const photoItem = document.querySelector(`[data-id="${id}"]`);
        if (photoItem) {
            photoItem.remove();
        }
    }
}
