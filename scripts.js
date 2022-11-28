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
    const search = `${env.apiURL}/search?api_key=${env.apikey}&q=${params}&limit=5&offset=0&rating=g&lang=es?`
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

  //TODO no tener que hacer focus off para disparar la acción
  handlechange = () => {
    this.searchParam.addEventListener("change", ({ target }) => {
      console.log(target.value)
      this.getData(target.value)
    })
  }

  //TODO descarga de sticker
  async downloadImage(imageSrc) {
    const urlImg = `https://i.giphy.com/media/${imageSrc?.images?.original?.hash}/giphy.webp`
    // const image = await fetch(imageSrc?.images?.original.url)
    const image = await fetch(urlImg)
    const imageBlog = await image.blob()
    const imageURL = URL.createObjectURL(imageBlog)

    const link = document.createElement("a")
    link.href = imageURL
    link.download = imageSrc.title
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  render() {
    console.log(this.state)
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
        listItem.innerHTML = `<img style='width: 100%; cursor: pointer' src="${item.images.original.url}" />`
        listItem.addEventListener("click", () => this.downloadImage(listItem))
        results.appendChild(listItem)
      })
    } else {
      this.shadow.innerHTML = `<h3>nada que ver</h3>`
    }
  }
}

customElements.define("app-list", List)
