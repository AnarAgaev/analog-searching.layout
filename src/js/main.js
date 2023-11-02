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
    const fileInput = document.getElementById('asd-custom-file-input')
    const fileName = document.querySelector('.asd__file-input span')

    fileInput.addEventListener('change', function() {
        const file = this.files[0]
        const allowedExtensions = /(\.jpg|\.jpeg|\.png|\.webp)$/i

        if (allowedExtensions.test(file.name)) {
            fileName.textContent = file.name
        } else {
            fileName.textContent = 'Неверный формат файла'
        }
    })
}

const initToggleUseFeed = () => {
    const button = document.querySelector('.asd__feed-selector .points')
    const selector = button.closest('.asd__feed-selector')
    const warning = document.querySelector('.warning')
    const uploading = document.querySelector('.uploading')

    button.addEventListener('click', function() {
        selector.classList.toggle('collapsed')
        warning.classList.toggle('hidden')
        uploading.classList.toggle('hidden')
    })
}

const initAddUserFeed = () => {
    const btn = document.getElementById('addUserFeedButton')
    const statuses = Array.from(document.querySelectorAll('.asd .uploading__item'))

    btn.addEventListener('click', () => {
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

window.addEventListener('load', () => {
    initTypeTubs()
    initDeleteCurrent()
    initDroppingSelects()
    initResetForms()
    initCustomInputFile()
    initToggleUseFeed()
    initAddUserFeed()
    initToggleColumns()
})