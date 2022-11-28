const env = {
  apikey: "mdRUpiSAOfkwq6Yy5TZjbcjWS2hFtl6I",
  apiURL: "https://api.giphy.com/v1/stickers",
}

class List extends HTMLElement {
  constructor() {
    super()
    this.shadow = this.attachShadow({ mode: "open" })
    this.divheader = document.createElement("h1")
    this.searchParam = document.getElementById("search-param")
    this.state = {}
    this.render()
  }

  getData = async (params) => {
    const trend = `${env.apiURL}/trending?api_key=${env.apikey}&limit=25&rating=g`
    const search = `${env.apiURL}/search?api_key=${env.apikey}&q=${params}&limit=25&offset=0&rating=g&lang=es?`
    fetch(params ? search : trend, {
      headers: { "Content-Type": "application/json" },
    })
      .then((resp) => resp.json())
      .then((resp) => {
        this.state = { data: resp.data }
        this.render()
      })
      .catch((err) => {
        console.log(err)
        return false
      })
  }

  connectedCallback() {
    const title = this.getAttribute("title")
    this.divheader.innerHTML = `hola ${title}`
    this.shadow.prepend(this.divheader)
    this.getData()
    this.handlechange()
  }

  handlechange = () => {
    this.searchParam.addEventListener("input", ({ target }) => {
      document.getElementById("search-param").textContent = target.value
      this.getData(target.value)
    })
  }

  render() {
    this.shadow.replaceChildren()
    if (this.state?.data?.length >= 1) {
      const { data } = this.state
      let results = document.createElement("ul")
      results.style.display = "grid"
      results.style.margin = "0 auto"
      results.style.paddingLeft = "0"
      results.style.width = "100%"
      results.style.listStyle = "none"
      results.style.gap = "10px"
      results.style.gridTemplateColumns =
        "repeat(auto-fill, minmax(100px, 1fr))"
      results.id = "resultsList"
      results.classList.add("resultsList")
      this.shadow.appendChild(results)
      data.map((item) => {
        let listItem = document.createElement("li")
        listItem.innerHTML = `<a href='${item.images.original.url}'><img style='width: 100%; cursor: pointer' src="${item.images.original.url}" /></a>`
        results.appendChild(listItem)
      })
    } else {
      this.shadow.innerHTML = `<h3>nada que ver</h3>`
    }
  }
}

customElements.define("app-list", List)
