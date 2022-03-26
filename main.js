'use strict'

const zona = document.getElementById('zona')
const divResultado = document.getElementById('resultado')
const barraLoading = document.getElementById('barraLoading')


zona.addEventListener('dragover', e => {
    e.preventDefault()
    changeStyle(e.target, '#000')
})
zona.addEventListener('dragleave', e => {
    e.preventDefault()
    changeStyle(e.target, '#555')
})
zona.addEventListener('drop', e => {
    e.preventDefault()
    changeStyle(e.target, 'green')
    cargarArchivo(e.dataTransfer.files[0])
})


const changeStyle = (objeto, color) => {
    objeto.style.color = `${color}`
    objeto.style.border = `4px dashed ${color}`
}

const cargarArchivo = archivo => {
    divResultado.innerHTML = ""
    const reader = new FileReader()
    reader.addEventListener('progress', e => {
        let carga = Math.round((e.loaded / archivo.size) * 100)
        barraLoading.setAttribute('value', carga)
    })
    if (archivo.type === 'image/jpeg' || archivo.type === 'image/jpg' || archivo.type === 'image/png') {
        reader.readAsDataURL(archivo)
        reader.addEventListener('load', () => {
            let url = URL.createObjectURL(archivo)
            let img = document.createElement('img')
            img.classList.add('imagen')
            img.setAttribute('src', url)
            divResultado.appendChild(img)
        })
    }
    else if (archivo.type === 'text/plain') {
        reader.readAsText(archivo)
        reader.addEventListener('load', e => {
            let textoElement = document.createElement('p')
            textoElement.classList.add('texto')
            textoElement.innerHTML = e.currentTarget.result
            divResultado.appendChild(textoElement)
        })
    }
    else if (archivo.type === 'video/mp4') {
        reader.readAsArrayBuffer(archivo)
        reader.addEventListener('load', e => {
            let video = new Blob([new Uint8Array(e.currentTarget.result)], { type: `${archivo.type}` })
            let url = URL.createObjectURL(video)
            let videoElement = document.createElement('video')
            videoElement.setAttribute('src', url)
            videoElement.classList.add('video')
            let btnPlay = document.createElement('button')
            btnPlay.classList.add('btnPlay')
            btnPlay.innerHTML = '&#9658'
            divResultado.appendChild(btnPlay)
            divResultado.appendChild(videoElement)

            btnPlay.addEventListener('click', () => {
                if (btnPlay.classList.contains('none')) btnPlay.classList.remove('none')
                else {
                    videoElement.play()
                    btnPlay.classList.add('none')
                }
            })
        })
    }
    else {
        let textoError = document.createElement('p')
        textoError.classList.add('texto', 'error')
        textoError.innerHTML = "Insertaste un archivo que contiene una extension que no soportamos. Recuerda que solo soportamos extensiones: .jpg, .jpeg, .png, .txt y .mp4 "
        divResultado.appendChild(textoError)
    }
}