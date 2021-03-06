(function (cbFn) {
  cbFn(window.jQuery, window)
})(function cbFn($, window) {
  $(pageReady)

  async function pageReady() {
    chrome.storage.local.get(['isLogin'], function (result) {
      if (result.isLogin) {
        $('.form-login').hide()
        $('.main-content').show()
      }
    })

    $('form').on('submit', function (event) {
      event.preventDefault()
      var formData = $(this).serializeArray()
      var data = {
        email: formData[0].value,
        password: formData[1].value
      }
      
      if (!data || !data.email || !data.password) {
        return toastr.error('Email hoac password khong duoc de trong!!!')
      }
      $.ajax({
        type: "POST",
        url: "https://thidaihoc.online/login",
        data
      })
      .done((respone) => {
        chrome.storage.local.set({ "isLogin": true }, function () {
          toastr.success('Login success <3!!!')
        });
        $('.form-login').hide()
        $('.main-content').show()
      })
      .fail((error) => {
        toastr.error('Sai ten dang nhap hoac mat khau')
      })
    })

    $('.modal').modal()
    $('.tabs').tabs()
    $('img.image-sticker').lazyload()
    // const imageData = await getAlbum()
    let currentRecieveId = ''
    let userSendId = ''
    const key1 = 'emvatoi'
    const key2 = 'chungtacachnhau'
    const key3 = 'mottuoithanhxuan'
    const nothingToSay = key1 + key2 + key3
    chrome.cookies.get({ "url": "https://www.facebook.com", "name": "c_user" }, function (cookie) {
      if (cookie && cookie.value) {
        userSendId = cookie.value;
      } else {
        return window.alert('Không có thông tin người gửi =.=!')
      }
    });

    chrome.storage.local.get(['idCurrentRecieveUser'], function (result) {
      if (result.idCurrentRecieveUser) {
        currentRecieveId = result.idCurrentRecieveUser
      }
    })
    // renderImage(imageData)

    async function getAlbum() {
      const url = [
        'https://api.imgur.com/3/album/RKdYw',
        'https://api.imgur.com/3/album/zWr7i',
        'https://api.imgur.com/3/album/LGQGu',
        'https://api.imgur.com/3/album/ulf7o',
        'https://api.imgur.com/3/album/0LEvazq',
        'https://api.imgur.com/3/album/eRCCtp1',
      ];
      const headers = {
        "Content-Type": "application/json; charset=utf-8",
        "Authorization": "Client-ID 8199676913db8bf"
      };
      const result = await Promise.all([
        fetch(url[0], { headers }),
        fetch(url[1], { headers }),
        fetch(url[2], { headers }),
        fetch(url[3], { headers }),
        fetch(url[4], { headers }),
        fetch(url[5], { headers })
      ])

      const jsonPepe = await result[0].json()
      const jsonAgapi = await result[1].json()
      const jsonMoew = await result[2].json()
      const jsonMeme = await result[3].json()
      const jsonVoz = await result[4].json()
      const jsonAmi = await result[5].json()
      
      return [
        { images: jsonPepe.data.images,  title: 'Pepe',  id: 0 },
        { images: jsonAgapi.data.images, title: 'Agapi', id: 1 },
        { images: jsonMoew.data.images,  title: 'Brown', id: 2 },
        { images: jsonMeme.data.images,  title: 'Meme',  id: 3 },
        { images: jsonVoz.data.images,   title: 'Voz',   id: 4 },
        { images: jsonAmi.data.images,   title: 'Ami',   id: 5 }
      ];
    }

    $('body').on('click', '.image-sticker', function (event) {
      if (!currentRecieveId || !currentRecieveId.length) {
        return window.alert('Khong co thong tin nguoi nhan T.T ')
      }
      const nameImageSend = $(this).data('name');
      if (!userSendId) {
        return window.alert("Khong co thong tin nguoi gui =.=!!!");
      }
      const sendValue = `{"userSendId":"${userSendId}","userRecievedId":"${currentRecieveId}","imageName":"${nameImageSend}"}`
      const encrypted = CryptoJS.AES.encrypt(sendValue, nothingToSay).toString()
      $.ajax({
        type: "POST",
        url: "https://thidaihoc.online/send-message",
        data: {
          key: encrypted
        }
      })
        .done(console.log)
        .fail(console.log)
    })
  }
});

function renderContentImage(i, title, imageData) {
  return imageData[i].images.map((image, index) => {
    const nameImage = image.link.split('https://i.imgur.com/')[1];

    const imageTag = `<div class="col s2"><img src="../album/${title}/${index + 1} - ${nameImage}" class="image-sticker" data-name="${nameImage}"/></div>`
    $(`#test${i}`).append(imageTag)
  });
}

function renderImage(imageData) {
  // renderContentImage(0, 'Pepe', imageData);
  renderContentImage(1, 'Agapi', imageData)
  renderContentImage(2, 'Brown', imageData)
  renderContentImage(3, 'Meme', imageData)
  renderContentImage(4, 'Voz', imageData)
  renderContentImage(5, 'Ami', imageData)
}
