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
        const target = this.dataset.type
        const targetNode = document
            .querySelector(`.asd [data-type-target="${target}"]`)

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

window.addEventListener('load', () => {
    initTypeTubs()
    initDeleteCurrent()
    initDroppingSelects()
    initResetForms()
})