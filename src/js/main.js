function smoothScrollTo(position, duration = 500) {
    const startPosition = window.pageYOffset
    const distance = position - startPosition
    let startTimestamp = null

    function step(timestamp) {
        if (!startTimestamp) startTimestamp = timestamp

        const progress = timestamp - startTimestamp
        const scrollY = easeInOutCubic(progress, startPosition, distance, duration)

        window.scrollTo(0, scrollY)

        if (progress < duration) {
            window.requestAnimationFrame(step)
        }
    }

    function easeInOutCubic(t, b, c, d) {
        t /= d
        t--
        return c * (t * t * t + 1) + b
    }

    window.requestAnimationFrame(step)
}

const hideModal = (id) => {
    const modal = document.getElementById(id)
    modal.classList.remove('visible')

    setTimeout(() => {
        modal.classList.add('hidden')
    }, 100)
}

const showModal = (id, title, text) => {
    const modal = document.getElementById(id)
    const close = modal.querySelector('.close')

    if (title && text) {
        modal.querySelector('.modal__title').innerText = title
        modal.querySelector('.modal__text').innerText = text
    }

    modal.classList.remove('hidden')

    setTimeout(() => {
        modal.classList.add('visible')
    }, 100)

    close.addEventListener('click', () => hideModal(id))
}

const initTypeTubs = () => {
    const tabs = Array.from(document.querySelectorAll('.asd [data-type]'))
    const targets = Array.from(document.querySelectorAll('.asd [data-type-target]'))

    const resetTabs = () => {
        tabs.forEach(el => el.classList.remove('active'))
    }

    const resetTargets = () => {
        targets.forEach(el => el.classList.remove('visible'))
    }

    tabs.forEach(el => {
        el.addEventListener('click', handleTabClick)
    })

    function handleTabClick() {
        const codeBadge = document.querySelector('.asd__res-count')
        const target = this.dataset.type
        const targetNode = document
            .querySelector(`.asd [data-type-target="${target}"]`)

        target === 'image'
            ? codeBadge.classList.add('hidden')
            : codeBadge.classList.remove('hidden')

        resetTabs()
        resetTargets()

        this.classList.add('active')
        targetNode.classList.add('visible')
    }
}

const initDeleteCurrent = () => {
    const badge = document.querySelector('.asd .asd__res-count')
    const btn = badge.querySelector('span')

    btn.addEventListener('click',
        () => badge.classList.add('invisible'))
}

const initDroppingSelects = () => {
    const toggleSelectDrop = (_this, e) => {
        e.stopPropagation()

        if (_this.classList.contains('select-value')) e.preventDefault()

        const select = _this.closest('.asd__select')
        select.classList.toggle('dropped')

        const value = select.querySelector('.select-value span')
        const newValue = _this.innerText

        if (_this.classList.contains('value')) {
            value.innerText = newValue
        }
    }

    const initClickHandler = (elmsArr) => {
        elmsArr.forEach(el => {
            el.addEventListener('click', function(e) {
                toggleSelectDrop(this, e)
            })
        })
    }

    const btns = Array.from(document.querySelectorAll('.asd .select-value'))
    const values = Array.from(document.querySelectorAll('.asd .asd__select-item .value'))

    initClickHandler(btns)
    initClickHandler(values)
}

const initResetForms = () => {
    const resetBtns = Array.from(document.querySelectorAll('.asd [type="reset"]'))

    resetBtns.forEach(el => {
        el.addEventListener('click', function() {
            const form = this.closest('.asd .asd__form')
            const values = Array.from(form.querySelectorAll('.asd [data-default-value]'))
            values.forEach(el => {
                const defaultValue = el.dataset.defaultValue
                el.innerText = defaultValue
            })
        })
    })
}

const initCustomInputFile = () => {
    const fileInput = document.getElementById('asdInputfile')
    const fileName = document.querySelector('.asd .asd__file-input span')
    const reset = document.querySelector('.asd .asd__file-input button')

    fileInput.addEventListener('change', function() {
        const file = this.files[0]
        const allowedExtensions = /(\.jpg|\.jpeg|\.png|\.webp)$/i

        if (allowedExtensions.test(file.name)) {
            fileName.textContent = file.name
            reset.classList.remove('hidden')
        } else {
            fileName.textContent = 'Неверный формат файла'
        }
    })

    reset.addEventListener('click', () => {
        fileInput.value = ''
        fileName.textContent= ''
        reset.classList.add('hidden')
    })
}

const initToggleUseFeed = () => {
    const button = document.querySelector('.asd__feed-selector .toggler')
    const selector = button.closest('.asd__feed-selector')
    const warning = document.querySelector('.warning')
    const uploading = document.querySelector('.uploading')

    button.addEventListener('click', function() {
        selector.classList.toggle('collapsed')
        warning.classList.toggle('hidden')
        uploading.classList.toggle('hidden')
    })
}

const initUploadUserFid = () => {
    const btn = document.getElementById('addUserFeedButton')
    const statuses = Array.from(document.querySelectorAll('.asd .uploading__item'))
    const input = document.querySelector('.asd__feed-selector input')
    const modalTitle = btn.dataset.modalTitle
    const modalText = btn.dataset.modalText

    btn.addEventListener('click', (e) => {
        if (input.value === '') {
            e.stopPropagation()
            e.preventDefault()
            showModal('asdModal', modalTitle, modalText)
            return
        }

        console.log('Ajax запрос загрузка пользовательского фида');
        const targetPlace = document.querySelector('.warning')

        setTimeout(() => {
            const rect = targetPlace.getBoundingClientRect();
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const targetPlaceTop = rect.top + scrollTop;
            smoothScrollTo(targetPlaceTop)
        }, 100)

        // Демострация вью асинхоронного обновления статуса проверки Фида
        // Нужно переписать на WebSocets после добавления API загрузки
        statuses.forEach((el, idx) => {
            setInterval(() => {
                el.classList.remove('hidden')
            }, idx * 1000)
        })

        statuses.forEach((el, idx) => {
            setInterval(() => {
                const check = el.querySelector('.uploading__check')
                check.classList.remove('uploading__check_loading')
                check.classList.add('uploading__check_checked')
            }, idx * 1000 + 700)
        })
    })
}

const initToggleColumns = () => {
    const btns = Array.from(document.querySelectorAll('.asd [data-target-selector]'))
    const drops = Array.from(document.querySelectorAll('.asd .asd__column_toggle'))
    const tabs = document.querySelector('.asd__tubs-types')

    btns.forEach(el => {
        el.addEventListener('click', function() {
            const targetSelector = this.dataset.targetSelector
            const target = document.querySelector(targetSelector)

            btns.forEach(el => el.classList.remove('active'))
            drops.forEach(el => el.classList.remove('active'))

            tabs.classList.toggle('hidden')

            el.classList.add('active')
            target.classList.add('active')
        })
    })
}

const asdShowResults = () => {
    const results = document.getElementById('results');
    results.classList.remove('hidden')

    setTimeout(() => {
        const rect = results.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const resultsTop = rect.top + scrollTop;
        smoothScrollTo(resultsTop)
    }, 100)
}

const initSearchAnalogButton = () => {
    const btn = document.getElementById('searchAnalogButton')

    const checkCode = () => {
        const input = document.getElementById('asdInputCode')
        if (input.value === '') {
            showModal('asdModal', 'Ошибка', 'Вы не указали Артикул товара')
            return
        }
        console.log('Ajax запрос товаров по Артикулу');
        return true
    }

    const checkUrl = () => {
        const input = document.getElementById('asdInputUrl')
        if (input.value === '') {
            showModal('asdModal', 'Ошибка', 'Вы не указали URL товара')
            return
        }
        console.log('Ajax запрос товаров по URL');
        return true
    }

    const checkiImage = () => {
        const input = document.getElementById('asdInputfile')

        if(input.files.length === 0) {
            showModal('asdModal', 'Ошибка', 'Вы не добавили изображение для поиска')
            return
        }
        console.log('Ajax запрос товаров по картинке');
        return true
    }

    btn.addEventListener('click', () => {
        const activeSearch = document.querySelector('.asd [data-type].active')
        const activeSearchId = activeSearch.dataset.type
        let cehckingResult = false

        switch (activeSearchId) {
            case 'code':
                cehckingResult = checkCode()
                break
            case 'url':
                cehckingResult = checkUrl()
                break
            case 'image':
                cehckingResult = checkiImage()
                break
        }

        if (cehckingResult) {
            asdShowResults()
        }
    })
}

const initShowExamples = () => {
    const btns = Array.from(document.querySelectorAll('.asd .examples__link'))

    btns.forEach(el => el.addEventListener('click', function() {
        const src = this.dataset.src
        const modal = document.getElementById('asdModalExample')
        const img = modal.querySelector('.modal__pic')
        img.src = src

        showModal('asdModalExample')
    }))
}

window.addEventListener('load', () => {
    initTypeTubs()
    initDeleteCurrent()
    initDroppingSelects()
    initResetForms()
    initCustomInputFile()
    initToggleUseFeed()
    initUploadUserFid()
    initToggleColumns()
    initSearchAnalogButton()
    initShowExamples()
})