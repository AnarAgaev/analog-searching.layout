// Deleting blocking of all animation for fix animation artefacts
const removeAnimationBlocker = () => {
    Array.from(document.querySelectorAll('.transition-blocker'))
        .forEach(el => el.classList.remove('transition-blocker'))
}
window.addEventListener('load', removeAnimationBlocker)

// Blocking all animation at the window resizing process
const addAnimationBlocker = () => {
    document.body.classList.add('transition-blocker')
}

let blockAnimationTimer

window.addEventListener("resize", () => {
    clearTimeout(blockAnimationTimer)
    addAnimationBlocker()

    blockAnimationTimer = setTimeout(() => {
        removeAnimationBlocker()
    }, 300)
})

// Handle link with smooth animation to anchor place on the page
const smoothLinks = document.querySelectorAll('a[href^="#"]')
for (let smoothLink of smoothLinks) {
    smoothLink.addEventListener('click', function (e) {
        e.preventDefault()
        e.stopPropagation()
        const id = smoothLink.getAttribute('href')

        try {
            const targetNode = document.querySelector(`${id}`)
            const targetOffset = targetNode.offsetTop
            const deviceOffset = window.outerWidth > 768 ? -100 : -20

            smoothScrollTo(targetOffset + deviceOffset, 700)
        } catch (error) {
            console.error("There's no target node for scrolling to place. The selector isn't correct!");
            console.error(error)
        }
    })
};

// Animation items when user has scrolled screen to place of item
const checkAnimationElms = () => {
    const animationElms = Array.from(document
        .querySelectorAll('.animation-element'))

    return animationElms.length > 0
}

const showAnimElements = () => {
    const elms = Array.from(document
        .querySelectorAll('.animation-element'))

    const scrollTop = window.pageYOffset
    const windowHeight = window.innerHeight
    // const pointOfDisplay = windowHeight / 1.2 // for show on the half of the screen
    const pointOfDisplay = windowHeight - 100 // 100px from bottom of the screen

    elms.forEach(function (el) {
        const offsetTopElement = el.offsetTop

        if (offsetTopElement - pointOfDisplay < scrollTop) {
            el.classList.remove('animation-element')
        }
    })

    if (!checkAnimationElms()) {
        window.removeEventListener('scroll', showAnimElements)
    }
}

const setAnimationElms = () => {
    if (checkAnimationElms()) {
        window.addEventListener('scroll', showAnimElements)
    }
}

window.addEventListener('load', () => {
    setTimeout(() => {
        showAnimElements()
        setAnimationElms()
    }, 100)
})

// Filters
const showNoFilterMsg = () => {
    const msg = document.querySelector('.cards-series-desc__msg')
    msg.classList.add('display')
    setTimeout(() => msg.classList.add('visible'), 100)
}

const hideNoFilterMsg = () => {
    const msg = document.querySelector('.cards-series-desc__msg')
    msg.classList.remove('visible')
    msg.classList.remove('display')
}

const checkNoFilterMsg = () => {
    const items = document
        .querySelectorAll('[data-filter]:not(.hide)')

    items.length === 0
        ? showNoFilterMsg()
        : hideNoFilterMsg()
}

const hideFilterlist = (filterList) => {
    filterList.forEach(filter => {
        filter.classList.remove('dropped')
        setTimeout(() => filter.classList.remove('active'), 300)
    })
}

const showFilterDrop = (node) => {
    node.classList.add('active')
    setTimeout(() => node.classList.add('dropped'), 10)
}

const hideFilterDrop = (node) => {
    const filters = Array.from(document.querySelectorAll('.filters__item'))

    if (!node) {
        hideFilterlist(filters)
        return
    }
    const cleanedFilters = filters.filter(filter => filter !== node);
    hideFilterlist(cleanedFilters)
}

const initFiltersDrop = () => {
    const fitlers = Array.from(document
        .querySelectorAll('.filters__list .filters__item'))

    fitlers.forEach(filter => {
        filter.addEventListener('click', function() {
            const isActive = this.classList.contains('active')

            if (isActive) {
                hideFilterDrop()
                return
            }

            hideFilterDrop(this)
            showFilterDrop(this)
        })
    })
}

const initFiltersReset = () => {
    const reset = document.querySelector('.filters__reset .filters__item')

    if (!reset) return

    const filteredSection = document
        .querySelectorAll('.section_filtered')

    reset.addEventListener('click', function() {
        const container = this.closest('.filters')

        const siblingFilters = container
            .querySelectorAll('.filters__list .filters__item')

        const options = Array.from(document
            .querySelectorAll('.filters__options'))

        const controllers = Array.from(document
            .querySelectorAll('.filters input[type="radio"]:not([value="reset"])'))

        const cards = Array.from(document.querySelectorAll('[data-filter]'))

        const deletedTypes = JSON.parse(document
            .querySelector('[data-deleted-types]')
            .dataset.deletedTypes)

        hideFilterlist(siblingFilters)
        spinner.show()
        filteredSection.forEach(el => el.classList.add('filtering'))
        options.forEach(el => el.classList.remove('checked')) // reset block options
        controllers.forEach(controller => controller.checked = false) // reset all input controllers
        resetAllControllersInItems()
        reset.closest('.filters__reset').classList.add('disabled')

        setTimeout(() => {
            // show hidden cards as delete data-display attributes
            cards.forEach(card => {
                for (const type of deletedTypes) {
                    card.removeAttribute(`data-display-${type}`)
                    card.classList.remove('hide')
                }
            })

            checkFilteredSection()
        }, 1000)
    })
}

const checkFilteredSection = () => {
    const sections = Array.from(document.querySelectorAll('.section_filtered'))

    sections.forEach(section => {
        const filteredItems = Array.from(section.querySelectorAll('[data-filter]'))
        const shownItems = filteredItems.filter(i => !i.classList.contains('hide'))

        if (shownItems.length === 0) {
            section.classList.add('hide')
        } else {
            section.classList.remove('hide')
        }
    })

    spinner.hide()
    sections.forEach(el => el.classList.remove('filtering'))

    showAnimElements()
    setAnimationElms()
    checkNoFilterMsg()
}

const hasDataDisplayAttribute = (node) => {
    const attributes = node.attributes

    let hasDataDisplayAttribute = false

    for (let i = 0; i < attributes.length; i++) {
        const attributeName = attributes[i].name

        if (attributeName.startsWith('data-display')) {
            hasDataDisplayAttribute = true
            break
        }
    }

    return hasDataDisplayAttribute
}

const checkFilteredItem = (prop, val) => {
    const items = Array.from(document.querySelectorAll('[data-filter]'))

    setTimeout(() => {
        items.forEach(i => {
            const data = JSON.parse(i.dataset.filter)
            const isArray = Array.isArray(data[prop])

            const isMatched = isArray
                ? data[prop].includes(val)
                : data[prop] === val


            if (isMatched) {
                i.removeAttribute(`data-display-${prop}`)
                if (!hasDataDisplayAttribute(i)) i.classList.remove('hide')
            } else {
                i.classList.add('hide')
                i.setAttribute(`data-display-${prop}`, false)
            }

            checkFilteredSection()
        })
    }, 1000)
}

const activeColorInItem = (val) => {
    const items = Array.from(document
        .querySelectorAll(`[data-target-type="${val}"]`))

    items.forEach(i => i.click())
}

const initFilterSelect = () => {
    const controllers = Array.from(document
        .querySelectorAll('.filters input[type="radio"]:not([value="reset"])'))

    const filteredSection = document.querySelectorAll('.section_filtered')

    const resetBtn = document.querySelector('.filters__reset')

    controllers.forEach(el => el.addEventListener('change', function(e) {
        e.preventDefault()
        e.stopPropagation()

        filteredSection.forEach(el => el.classList.add('filtering'))
        spinner.show()
        checkFilteredItem(this.name, this.value)
        activeColorInItem(this.value)
        this.closest('.filters__options').classList.add('checked')
        resetBtn.classList.remove('disabled')
    }))
}

const removeDataFitlerAtribute = (prop) => {
    const items = Array.from(document
        .querySelectorAll(`[data-display-${prop}]`))

    items.forEach(i => {
        i.removeAttribute(`data-display-${prop}`)
    })
}

const checkAllItemsHasDisplayAtributes = () => {
    const items = Array.from(document
        .querySelectorAll('[data-filter]'))

    items.forEach(i => {
        if (!hasDataDisplayAttribute(i)) {
            i.classList.remove('hide')
        }
    })
}

const resetAllControllersByName = (name) => {
    const items = Array.from(document.querySelectorAll(`[name=${name}]`))
    items.forEach(i => i.checked = false)
}

const resetAllControllersInItems = () => {
    const tabLists = Array.from(document
        .querySelectorAll('.cards-series__controls'))

    tabLists.forEach(list => {
        const firstTab = list.querySelector('.cards-series__tab')

        firstTab.click()
    })
}

const checkAllFitlerResetBtn = () => {
    const isCheckedFilter = document
        .querySelectorAll('.filters__list input:checked')

    const reset = document.querySelector('.filters__reset')

    isCheckedFilter.length === 0
        ? reset.classList.add('disabled')
        : reset.classList.remove('disabled')
}

const initResetFilterProp = () => {
    const controllers = Array.from(document
        .querySelectorAll('.filters input[value="reset"]'))
    const sections = document.querySelectorAll('.section_filtered')

    controllers.forEach(el => el.addEventListener('change', function(e) {
        e.preventDefault()
        e.stopPropagation()

        sections.forEach(el => el.classList.add('filtering'))
        spinner.show()
        this.closest('.filters__options').classList.remove('checked')

        setTimeout(() => {
            removeDataFitlerAtribute(this.name)
            checkAllItemsHasDisplayAtributes()
            checkFilteredSection()
            resetAllControllersByName(this.name)
            resetAllControllersInItems()
            checkAllFitlerResetBtn()
        }, 1000)
    }))
}

window.addEventListener('load', () => {
    initFiltersDrop()
    initFiltersReset()
    initFilterSelect()
    initResetFilterProp()
})
